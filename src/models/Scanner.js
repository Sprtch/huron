import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const ScannerType = {
  Undefined: 0,
  Debug: 1,
  Testing: 2,
  Serial: 3,
  USB: 4,
};

export const ScannerMode = {
  Undefined: 0,
  Print: 1,
  Inventory: 2,
};

export const ScannerContext = createContext();

export const ScannerProvider = (props) => {
  const [scanner, setScanner] = useState([]);
  const [loading, setLoading] = useState(false);

  const getScanner = (id) => scanner.find((x) => x.id === id);

  const fetchScanner = () => {
    setLoading(true);
    axios
      .get("/api/scanner/")
      .then((response) => {
        setLoading(false);
        setScanner(response.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setScanner([]);
      });
  };

  const updateScanner = (id, value) =>
    setScanner((prevState) =>
      getScanner(id)
        ? prevState.map((x) => (x.id === id ? Object.assign(x, value) : x))
        : prevState.concat(value)
    );

  const fetchScannerDetail = (id) => {
    axios
      .get(`/api/scanner/${id}`)
      .then((response) => {
        updateScanner(id, response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => fetchScanner(), []);

  return (
    <ScannerContext.Provider
      value={{
        scanner: scanner.filter((x) => !x.hidden),
        getId: getScanner,
        loading: loading,
        fetch: fetchScanner,
        fetchDetail: fetchScannerDetail,
        fetch: fetchScanner,
      }}
    >
      {props.children}
    </ScannerContext.Provider>
  );
};
