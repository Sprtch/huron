import React, { useState, useEffect } from "react";
import { PartContext } from "../models/Parts";
import { PlainInput, ExpandInput } from "../component/Input";
import { Loading } from "../component/Spinner";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

const PartImportModal = () => (
  <span>
    <div className="modal" id="addModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add part</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              encType="multipart/form-data"
              action="/api/parts/"
              className="form-inline"
              method="post"
            >
              <div className="form-group mb-2">
                <input
                  type="text"
                  name="barcode"
                  className="form-control"
                  id="barcodeInput"
                  aria-describedby="barcodeHelp"
                  placeholder="Enter barcode"
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="nameInput"
                  placeholder="Enter part name"
                />
              </div>
              <div className="form-group mb-2">
                <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      className="btn btn-light mr-2"
      data-toggle="modal"
      data-target="#addModal"
    >
      Add part
    </button>
  </span>
);

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
        <button type="button" className="btn btn-primary" onClick={handlePrint}>
          {printing ? (
            <div className="spinner-border" role="status" />
          ) : (
            "Print"
          )}
        </button>
      </td>
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
          <div className="py-1">
            <div className="card bg-primary">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <ExpandInput
                      type="text"
                      value={filter}
                      onChange={(ev) => setFilter(ev.target.value)}
                      placeholder="Filter..."
                    />
                  </div>
                  <div className="col-auto text-right">
                    <PartImportModal />
                    <BulkImportModal />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {ctx.loadingParts ? (
            <Loading />
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Barcode</th>
                  <th scope="col">Name</th>
                  <th scope="col">Print</th>
                  <th scope="col">Number</th>
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
