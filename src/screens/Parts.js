import React, { useState } from "react";
import { PrinterContext } from "../models/Printer";
import { PlainInput } from "../component/Input";
import { Loading } from "../component/Spinner";
import { TableWrapper } from "../component/Table";
import { CardHeaderSearch } from "../component/Card";
import { Column } from "react-virtualized";
import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

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
        ➕
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
        📂
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {"Bulk part import from .csv file"}
        </ModalHeader>
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
  const handlePrint = (destination) => {
    setPrinting(true);
    print(id, number, destination)
      .then((_) => {
        setNumber(1);
        setTimeout(() => setPrinting(false), 1000);
      })
      .catch((_) => {
        setPrinting(false);
      });
  };

  return (
    <PrinterContext.Consumer>
      {(ctx) => (
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
            style={{ width: "55px" }}
            type="button"
            className="btn btn-primary"
            onClick={() => handlePrint(ctx.destination)}
          >
            {printing ? (
              <div
                style={{ width: "15px", height: "15px" }}
                className="spinner-border"
                role="status"
              />
            ) : (
              "Print"
            )}
          </button>
        </div>
      )}
    </PrinterContext.Consumer>
  );
};

export default ({ parts }) => {
  const [filter, setFilter] = useState("");

  const helpRowRenderer = () => {
    return (
      <Container style={{ padding: "15px", textAlign: "center" }}>
        {"There is no 'Parts' in the database."}
        <br />
        {"Click on the "}
        <Button disabled color="light" className="mr-2">
          📂
        </Button>
        {" button to import a '.csv'."}
      </Container>
    );
  };

  const filtered = parts.filter(filter);

  return (
    <div>
      <CardHeaderSearch
        value={filter}
        onChange={(ev) => setFilter(ev.target.value)}
      >
        <PartImportModal add={parts.add} />
        <BulkImportModal importCSV={parts.importCSV} />
        <Button color="secondary" onClick={parts.fetch}>
          ↻
        </Button>
      </CardHeaderSearch>

      {parts.loadingParts ? (
        <Loading />
      ) : (
        <TableWrapper
          size="84vh"
          rows={filtered}
          rowCount={filtered.length}
          rowGetter={({ index }) => filtered[index]}
          noRowsRenderer={helpRowRenderer}
        >
          <Column label="#" dataKey="id" width={50} />
          <Column
            width={200}
            label="Barcode"
            dataKey="barcode"
            style={{ display: "flex", alignItems: "center" }}
          />
          <Column width={600} label="Name" dataKey="name" />
          <Column
            width={200}
            label="Print"
            dataKey="id"
            cellRenderer={({ cellData }) => (
              <PrintCell print={parts.print} id={cellData} />
            )}
          />
        </TableWrapper>
      )}
    </div>
  );
};
