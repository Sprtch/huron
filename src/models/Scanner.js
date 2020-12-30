import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const ScannerContext = createContext();

export const ScannerProvider = (props) => {
  const [scanner, setScanner] = useState([]);
  const [redis, setRedis] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchScanner = () => {
    setLoading(true);
    axios
      .get("/api/scanner/")
      .then((response) => {
        setLoading(false);
        setScanner(response.data);
        if (response.data.length) {
          setRedis(response.data[0].redis);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setScanner([]);
      });
  };

  const setAsDefaultScanner = ({ redis }) => setRedis(redis);

  useEffect(() => fetchScanner(), []);

  return (
    <ScannerContext.Provider
      value={{
        scanner: scanner,
        loading: loading,
        fetch: fetchScanner,
        destination: redis,
        setAsDefault: setAsDefaultScanner,
        fetch: fetchScanner,
      }}
    >
      {props.children}
    </ScannerContext.Provider>
  );
};
