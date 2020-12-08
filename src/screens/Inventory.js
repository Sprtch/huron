import React, { useState, useEffect } from "react";
import { Loading } from "../component/Spinner";
import { ExpandInput } from "../component/Input";
import axios from "axios";

const DownloadButton = () => {
  return (
    <a href="/api/inventory/export.csv">
      <button type="button" className="btn btn-light mr-2">
        Export to CSV
      </button>
    </a>
  );
};

const InventoryLine = ({ part, quantity }) => {
  return (
    <tr>
      <td>{part.barcode}</td>
      <td>{part.name}</td>
      <td>{quantity}</td>
    </tr>
  );
};

export default () => {
  const [inventory, setInventory] = useState([]);
  const [showed, setShowed] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/inventory")
      .then((response) => {
        setLoading(false);
        setFilter("");
        setInventory(response.data);
        setShowed(response.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setFilter("");
        setInventory([]);
        setShowed([]);
      });
  }, []);

  const handleFiltering = (ev) => {
    const newFilter = ev.target.value;
    setFilter(newFilter);
    if (newFilter === "") {
      setShowed(inventory);
      return;
    }
    setShowed(
      filter
        .split(" ")
        .reduce(
          (acc, current) =>
            acc.filter(
              (x) =>
                (x.part.barcode &&
                  x.part.barcode
                    .toLowerCase()
                    .includes(current.toLowerCase())) ||
                (x.part.name &&
                  x.part.name.toLowerCase().includes(current.toLowerCase()))
            ),
          inventory
        )
    );
  };

  return (
    <div className="container">
      <h1>Inventory</h1>

      <div className="py-1">
        <div className="card bg-primary">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <ExpandInput
                  type="text"
                  value={filter}
                  onChange={handleFiltering}
                  placeholder="Filter..."
                />
              </div>
              <div className="col-auto text-right">
                <DownloadButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Barcode</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {showed.map((x) => (
              <InventoryLine {...x} key={x.barcode} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
