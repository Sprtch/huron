import React, { useState, useEffect } from "react";
import { InventoryContext } from "../models/Inventory";
import { PartContext } from "../models/Parts";
import { Loading } from "../component/Spinner";
import { CardHeaderSearch } from "../component/Card";
import { PlainInput } from "../component/Input";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

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
        <ModalBody>
          <PartContext.Consumer>
            {(ctx) => (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Barcode</th>
                    <th scope="col">Name</th>
                    <th scope="col">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {ctx.parts.map((x) => (
                    <tr>
                      <td>{x.barcode}</td>
                      <td>{x.name}</td>
                      <td>
                        <button type="button" className="btn btn-primary">
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </PartContext.Consumer>
        </ModalBody>
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
          <PlainInput type="number" value={qquantity} onChange={handleNumber} />
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
  const [filter, setFilter] = useState("");

  return (
    <InventoryContext.Consumer>
      {(ctx) => (
        <div className="container">
          <h1>
            Inventory{" "}
            <button onClick={ctx.fetch} className="btn btn-link">
              ↻
            </button>
          </h1>

          <CardHeaderSearch
            value={filter}
            onChange={(ev) => setFilter(ev.target.value)}
          >
            <DownloadButton />
            <AddPartModal />
          </CardHeaderSearch>
          {ctx.loadingInventory ? (
            <Loading />
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Barcode</th>
                  <th scope="col">Name</th>
                  <th style={{ width: "220px" }} scope="col">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {ctx.filter(filter).map((x) => (
                  <InventoryLine {...x} key={x.id} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </InventoryContext.Consumer>
  );
};
