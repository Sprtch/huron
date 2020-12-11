import React, { useState, useEffect } from "react";
import { Loading } from "../component/Spinner";
import { PlainInput, ExpandInput } from "../component/Input";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const AddPartModal = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <span>
      <Button color="light" className="mr-2" onClick={toggle}>
        Import Part
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {"Create inventory entry for an existing part"}
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

const DownloadButton = () => {
  return (
    <a href="/api/inventory/export.csv">
      <button type="button" className="btn btn-light mr-2">
        Export to CSV
      </button>
    </a>
  );
};

const InventoryLine = ({ id, part, quantity }) => {
  const Quantity = ({ quantity }) => {
    const [edit, setEdit] = useState(false);
    const [qquantity, setQuantity] = useState(quantity);

    const handleNumber = (ev) => {
      setQuantity(ev.target.value);
    };

    const handleSave = () => {
      axios
        .post(`/api/inventory/${id}`, { quantity: parseInt(qquantity) })
        .then((_) => {
          setEdit(false);
        })
        .catch((_) => {
          setEdit(false);
        });
    };

    if (edit) {
      return (
        <div className="btn-group mr-2" role="group" aria-label="invquantity">
          <PlainInput
            type="number"
            style={{ width: "60px" }}
            value={qquantity}
            onChange={handleNumber}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => setEdit(false)}
          >
            X
          </button>
        </div>
      );
    } else {
      return (
        <span>
          {qquantity}{" "}
          <button className="btn btn-link" onClick={() => setEdit(true)}>
            edit
          </button>
        </span>
      );
    }
  };

  return (
    <tr>
      <td>{part.barcode}</td>
      <td>{part.name}</td>
      <td>
        <Quantity quantity={quantity} />
      </td>
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
      .get("/api/inventory/")
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
                <AddPartModal />
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
              <th style={{ width: "200px" }} scope="col">
                Quantity
              </th>
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
