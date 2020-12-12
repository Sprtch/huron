import React, { useState, useEffect } from "react";
import { PartContext } from "../models/Parts";
import { PlainInput, ExpandInput } from "../component/Input";
import { Loading } from "../component/Spinner";
import { CardHeaderSearch } from "../component/Card";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

const PartImportModal = ({ add }) => {
  const [modal, setModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");

  const toggle = () => setModal(!modal);

  const send = (_) => {
    add({ barcode, name }).then(() => {
      setBarcode("");
      setName("");
      setModal(false);
    });
  };

  return (
    <span>
      <Button color="light" className="mr-2" onClick={toggle}>
        Add part
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{"Create new single part"}</ModalHeader>
        <ModalBody>
          <div className="input-group">
            <input
              value={barcode}
              className="form-control"
              placeholder="Enter barcode"
              onChange={(ev) => setBarcode(ev.target.value)}
            />
            <input
              value={name}
              className="form-control"
              placeholder="Enter part name"
              onChange={(ev) => setName(ev.target.value)}
            />
            <button className="btn btn-primary " onClick={send}>
              Submit
            </button>
          </div>
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

const BulkImportModal = () => {
  const [modal, setModal] = useState(false);

  const send = (_) => {
    const formData = new FormData();
    const imagefile = document.querySelector("#file");
    formData.append("file", imagefile.files[0]);
    axios
      .post("/api/parts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((_) => {
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggle = () => setModal(!modal);

  return (
    <span>
      <Button color="light" className="mr-2" onClick={toggle}>
        Add part from CSV
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{"Bulk part import"}</ModalHeader>
        <ModalBody>
          <div className="form-inline">
            <input type="hidden" name="barcode" />
            <input type="hidden" name="name" />
            <div className="form-group mb-2">
              <input id="file" type="file" name="file" />
            </div>
            <div className="form-group mb-2">
              <button className="btn btn-primary mb-2" onClick={send}>
                Submit
              </button>
            </div>
          </div>
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

const PartLine = ({ barcode, name }) => {
  const [number, setNumber] = React.useState(1);
  const [printing, setPrinting] = React.useState(false);

  const increase = () => {
    setNumber(number + 1);
  };
  const decrease = () => {
    if (number > 1) {
      setNumber(number - 1);
    }
  };
  const handleNumber = (ev) => {
    setNumber(ev.target.value);
  };
  const handlePrint = () => {
    setPrinting(true);
    axios
      .post("/api/print", { barcode, name, number })
      .then((_) => {
        setPrinting(false);
      })
      .catch((_) => {
        setPrinting(false);
      });
  };

  return (
    <tr>
      <td>{barcode}</td>
      <td>{name}</td>
      <td>
        <div className="btn-group mr-2" role="group" aria-label="First group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={decrease}
          >
            -
          </button>
          <PlainInput type="number" value={number} onChange={handleNumber} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={increase}
          >
            +
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            {printing ? (
              <div className="spinner-border" role="status" />
            ) : (
              "Print"
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default () => {
  const [filter, setFilter] = useState("");

  return (
    <PartContext.Consumer>
      {(ctx) => (
        <div className="container">
          <h1>
            Parts{" "}
            <button onClick={ctx.fetch} className="btn btn-link">
              ↻
            </button>
          </h1>

          <CardHeaderSearch
            value={filter}
            onChange={(ev) => setFilter(ev.target.value)}
          >
            <PartImportModal add={ctx.add} />
            <BulkImportModal />
          </CardHeaderSearch>

          {ctx.loadingParts ? (
            <Loading />
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Barcode</th>
                  <th scope="col">Name</th>
                  <th scope="col">Print</th>
                </tr>
              </thead>
              <tbody>
                {ctx.filter(filter).map((x) => (
                  <PartLine {...x} key={x.barcode} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </PartContext.Consumer>
  );
};
