import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

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

  const setAsDefaultPrinter = ({ redis }) => setRedis(redis);

  useEffect(() => fetchPrinter(), []);

  return (
    <PrinterContext.Provider
      value={{
        printer: printer,
        redis: redis,
        loadingPrinter: loading,
        setAsDefault: setAsDefaultPrinter,
        fetch: fetchPrinter,
      }}
    >
      {props.children}
    </PrinterContext.Provider>
  );
};
