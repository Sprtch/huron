import React, { useState } from "react";
import { PartContext } from "../models/Parts";
import { PlainInput } from "../component/Input";
import { Loading } from "../component/Spinner";
import { CardHeaderSearch } from "../component/Card";
import { Column, Table, AutoSizer } from "react-virtualized";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import "react-virtualized/styles.css";

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

const BulkImportModal = ({ importCSV }) => {
  const [modal, setModal] = useState(false);

  const send = (_) => {
    importCSV(document.querySelector("#file").files[0])
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

const PrintCell = ({ print, id }) => {
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
    print(id, number)
      .then((_) => {
        setNumber(1);
        setPrinting(false);
      })
      .catch((_) => {
        setPrinting(false);
      });
  };

  return (
    <div className="btn-group mr-2" role="group" aria-label="First group">
      <button type="button" className="btn btn-secondary" onClick={decrease}>
        -
      </button>
      <PlainInput type="number" value={number} onChange={handleNumber} />
      <button type="button" className="btn btn-secondary" onClick={increase}>
        +
      </button>
      <button type="button" className="btn btn-primary" onClick={handlePrint}>
        {printing ? <div className="spinner-border" role="status" /> : "Print"}
      </button>
    </div>
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
            <BulkImportModal importCSV={ctx.importCSV} />
          </CardHeaderSearch>

          {ctx.loadingParts ? (
            <Loading />
          ) : (
            <div style={{ height: 600 }}>
              <AutoSizer>
                {({ height, width }) => (
                  <Table
                    width={width}
                    height={height}
                    headerHeight={20}
                    rowHeight={50}
                    rowCount={ctx.filter(filter).length}
                    rowGetter={({ index }) => ctx.filter(filter)[index]}
                  >
                    <Column label="#" dataKey="id" width={50} />
                    <Column label="Barcode" dataKey="barcode" width={250} />
                    <Column width={600} label="Name" dataKey="name" />
                    <Column
                      width={300}
                      label="Print"
                      dataKey="id"
                      cellRenderer={({ cellData }) => (
                        <PrintCell print={ctx.print} id={cellData} />
                      )}
                    />
                  </Table>
                )}
              </AutoSizer>
            </div>
          )}
        </div>
      )}
    </PartContext.Consumer>
  );
};
