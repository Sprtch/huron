import React, { useState } from "react";
import { PrinterContext } from "../models/Printer";
import { PlainInput } from "../component/Input";
import { Loading } from "../component/Spinner";
import { TableWrapper } from "../component/Table";
import { CardHeaderSearch } from "../component/Card";
import { RefreshButton } from "../component/Button";
import { Column } from "react-virtualized";
import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "reactstrap";

const PartImportModal = ({ add }) => {
  const [modal, setModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
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
      <Button
        color="light"
        className="mr-2"
        onClick={toggle}
        id="Tooltip-add-part"
      >
        ➕
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-add-part"
        toggle={toggleTooltip}
      >
        Add part manually to the database
      </Tooltip>

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
            <Button color="primary" onClick={send}>
              Submit
            </Button>
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
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

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
      <Button
        color="light"
        className="mr-2"
        onClick={toggle}
        id="Tooltip-import"
      >
        📂
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-import"
        toggle={toggleTooltip}
      >
        Import part from .csv file
      </Tooltip>
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
              <Button color="primary" className="mb-2" onClick={send}>
                Submit
              </Button>
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
          <Button color="secondary" onClick={decrease}>
            -
          </Button>
          <PlainInput type="number" value={number} onChange={handleNumber} />
          <Button color="secondary" onClick={increase}>
            +
          </Button>
          <Button
            style={{ width: "55px" }}
            color="primary"
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
          </Button>
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
        <RefreshButton refresh={parts.fetch}>
          Reload the part data
        </RefreshButton>
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
