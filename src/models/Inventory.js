import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const InventoryContext = createContext();

export const InventoryProvider = (props) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = () => {
    setLoading(true);
    axios
      .get("/api/inventory/")
      .then((response) => {
        setLoading(false);
        setInventory(response.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setInventory([]);
      });
  };

  const filterInventory = (argument) => {
    if (!argument) {
      return inventory;
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
        inventory
      );
  };

  const editInventory = ({ id, quantity }) =>
    axios
      .post(`/api/inventory/${id}`, { quantity: parseInt(quantity) })
      .then((_) => {
        setInventory(
          inventory.map((x) =>
            x.id === id ? Object.assign(x, { quantity }) : x
          )
        );
      });

  useEffect(() => fetchInventory(), []);

  return (
    <InventoryContext.Provider
      value={{
        inventory: inventory,
        loadingInventory: loading,
        fetch: fetchInventory,
        filter: filterInventory,
        update: null,
        edit: editInventory,
      }}
    >
      {props.children}
    </InventoryContext.Provider>
  );
};
