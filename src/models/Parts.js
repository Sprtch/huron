import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const PartContext = createContext();

export const PartProvider = (props) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPart = () => {
    setLoading(true);
    axios
      .get("/api/parts/")
      .then((response) => {
        setLoading(false);
        setParts(response.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setParts([]);
      });
  };

  const filterPart = (argument) => {
    if (!argument) {
      return parts;
    }

    return argument
      .split(" ")
      .reduce(
        (acc, current) =>
          acc.filter(
            (x) =>
              (x.barcode &&
                x.barcode.toLowerCase().includes(current.toLowerCase())) ||
              (x.name && x.name.toLowerCase().includes(current.toLowerCase()))
          ),
        parts
      );
  };

  const addPart = ({ barcode, name }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("barcode", barcode);
    return axios
      .post("/api/parts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setParts((x) => x.concat(res.data));
      });
  };

  const importPart = (file, column_name, column_barcode, encoding) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("csv_column_name", column_name);
    formData.append("csv_column_barcode", column_barcode);
    formData.append("csv_encoding", encoding);

    return axios
      .post("/api/parts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setLoading(true);
        setTimeout(fetchPart, 3000);
      });
  };

  const printPart = (id, number, destination) =>
    axios.post(`/api/parts/${id}/print`, { number, destination });

  useEffect(() => fetchPart(), []);

  return (
    <PartContext.Provider
      value={{
        parts: parts,
        loadingParts: loading,
        fetch: fetchPart,
        filter: filterPart,
        importCSV: importPart,
        print: printPart,
        add: addPart,
      }}
    >
      {props.children}
    </PartContext.Provider>
  );
};
