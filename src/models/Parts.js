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

  const filterPart = (argument) =>
    argument
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

  useEffect(() => fetchPart(), []);

  return (
    <PartContext.Provider
      value={{
        parts: parts,
        loadingParts: loading,
        fetch: fetchPart,
        filter: filterPart,
        update: null,
      }}
    >
      {props.children}
    </PartContext.Provider>
  );
};
