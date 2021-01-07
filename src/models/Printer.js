import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const PrinterType = {
  Undefined: 0,
  Stdout: 1,
  Testing: 2,
  Static: 3,
};

export const DialectType = {
  Undefined: 0,
  Zpl: 1,
  Json: 2,
};

export const PrinterContext = createContext();

export const PrinterProvider = (props) => {
  const [printer, setPrinter] = useState([]);
  const [redis, setRedis] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrinter = () => {
    setLoading(true);
    axios
      .get("/api/printer/")
      .then((response) => {
        setLoading(false);
        setPrinter(response.data);
        if (response.data.length) {
          setRedis(response.data[0].redis);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setPrinter([]);
      });
  };

  const updatePrinter = (id, value) =>
    setPrinter(printer.map((x) => (x.id === id ? Object.assign(x, value) : x)));

  const fetchPrinterDetail = (id) => {
    axios
      .get(`/api/printer/${id}`)
      .then((response) => {
        updatePrinter(id, response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const setAsDefaultPrinter = ({ redis }) => setRedis(redis);

  useEffect(() => fetchPrinter(), []);

  return (
    <PrinterContext.Provider
      value={{
        printer: printer,
        loading: loading,
        fetch: fetchPrinter,
        fetchDetail: fetchPrinterDetail,
        destination: redis,
        setAsDefault: setAsDefaultPrinter,
        fetch: fetchPrinter,
      }}
    >
      {props.children}
    </PrinterContext.Provider>
  );
};
