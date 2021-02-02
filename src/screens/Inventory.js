import React, { useEffect, useState } from "react";
import { PartContext } from "../models/Parts";
import { ScannerContext } from "../models/Scanner";
import { EyeSlash, ZoomIcon } from "../component/Icon";
import { Loading } from "../component/Spinner";
import { CardHeaderSearch } from "../component/Card";
import { PlainInput } from "../component/Input";
import { TableWrapper } from "../component/Table";
import { RefreshButton } from "../component/Button";
import { AvailableContent } from "../component/Field";
import axios from "axios";
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

const AddPartModal = ({ inventory, create }) => {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  const toggle = () => setModal(!modal);

  const AddCell = ({ create }) => {
    const [added, setAdded] = useState(false);
    const startCreation = () => {
      setAdded(true);
      setTimeout(create, 1000);
    };
    if (added) {
      return (
        <Button style={{ width: "55px" }} color="success" disabled>
          {" ✅ "}
        </Button>
      );
    } else {
      return (
        <Button style={{ width: "55px" }} onClick={startCreation}>
          Add
        </Button>
      );
    }
  };

  const exclude = (parts, ids) => parts.filter((x) => !ids.includes(x.id));

  return (
    <span>
      <Button color="light" className="mr-2" onClick={toggle} id="Tooltip-add">
        {"➕"}
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-add"
        toggle={toggleTooltip}
      >
        Select parts to add to the inventory
      </Tooltip>
      <Modal size="xl" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {"Create inventory entry for an existing part"}
        </ModalHeader>
        <ModalBody style={{ padding: "0" }}>
          <PartContext.Consumer>
            {(ctx) => (
              <>
                <CardHeaderSearch
                  value={filter}
                  onChange={(ev) => setFilter(ev.target.value)}
                />
                <TableWrapper
                  size="40vh"
                  rows={exclude(
                    ctx.filter(filter),
                    inventory.map((x) => x.part.id)
                  )}
                  rowCount={
                    exclude(
                      ctx.filter(filter),
                      inventory.map((x) => x.part.id)
                    ).length
                  }
                  rowGetter={({ index }) =>
                    exclude(
                      ctx.filter(filter),
                      inventory.map((x) => x.part.id)
                    )[index]
                  }
                >
                  <Column label="Barcode" dataKey="barcode" width={250} />
                  <Column width={500} label="Name" dataKey="name" />
                  <Column
                    width={100}
                    label="Print"
                    dataKey="id"
                    cellRenderer={({ cellData }) => (
                      <AddCell create={() => create(cellData)} id={cellData} />
                    )}
                  />
                </TableWrapper>
              </>
            )}
          </PartContext.Consumer>
        </ModalBody>
        <ModalFooter>
          <Button className="mt-3" color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

const DownloadButton = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <a href="/api/inventory/export.csv">
      <Button color="light" className="mr-2" id="Tooltip-download">
        {"📩"}
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-download"
        toggle={toggleTooltip}
      >
        Export inventory to .csv
      </Tooltip>
    </a>
  );
};

const TransactionDetailModal = ({ id }) => {
  const [modal, setModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const toggle = () => {
    if (!modal)
      axios
        .get(`/api/inventory/${id}/transactions`)
        .then((res) => setTransactions(res.data));

    setModal(!modal);
  };

  useEffect(() => {
    axios
      .get(`/api/inventory/${id}/transactions`)
      .then((res) => setTransactions(res.data));
  }, []);

  const OriginRenderer = ({ id, get, fetch }) => {
    const scanner = get(id);
    useEffect(() => (scanner ? null : fetch(id)), []);
    return (
      <span>
        {scanner ? (
          <span>
            {scanner.name}{" "}
            {scanner.hidden ? (
              <EyeSlash />
            ) : (
              <AvailableContent available={scanner.available} />
            )}
          </span>
        ) : (
          <Loading />
        )}
      </span>
    );
  };

  return (
    <span>
      <Button color="primary" className="mr-2" onClick={toggle}>
        <ZoomIcon />
      </Button>
      <Modal size="lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`Inventory transaction detail: ${id}`}
        </ModalHeader>
        <ModalBody style={{ padding: "0" }}>
          <ScannerContext.Consumer>
            {(scanner) => (
              <TableWrapper
                size="40vh"
                rows={transactions}
                rowCount={transactions.length}
                rowGetter={({ index }) => transactions[index]}
                rowHeight={50}
              >
                <Column
                  width={200}
                  label="Origin"
                  dataKey="scanner"
                  cellRenderer={({ cellData }) => (
                    <OriginRenderer
                      id={cellData}
                      get={scanner.getId}
                      fetch={scanner.fetchDetail}
                    />
                  )}
                />
                <Column label="Quantity" dataKey="quantity" width={100} />
                <Column label="Created At" dataKey="created_at" width={250} />
              </TableWrapper>
            )}
          </ScannerContext.Consumer>
        </ModalBody>
        <ModalFooter>
          <Button className="mt-3" color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

export default ({ inventory }) => {
  const [filter, setFilter] = useState("");

  const QuantityCell = ({ quantity, edit }) => {
    const Quantity = ({ quantity }) => {
      const [editing, setEditing] = useState(false);
      const [qquantity, setQuantity] = useState(quantity);

      if (editing) {
        return (
          <div className="btn-group mr-2" role="group" aria-label="invquantity">
            <PlainInput
              type="number"
              value={qquantity}
              onChange={(ev) => setQuantity(ev.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => edit(qquantity).then(() => setEditing(false))}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setEditing(false)}
            >
              X
            </button>
          </div>
        );
      } else {
        return (
          <span>
            {qquantity}{" "}
            <button className="btn btn-link" onClick={() => setEditing(true)}>
              edit
            </button>
          </span>
        );
      }
    };

    return <Quantity quantity={quantity} />;
  };

  const helpRowRenderer = () => {
    return (
      <Container style={{ padding: "15px", textAlign: "center" }}>
        {"There is no 'Parts' currently in the inventory."}
        <br />
        {"Click on the "}
        <Button disabled color="light" className="mr-2">
          {"➕"}
        </Button>
        {
          " button located on the header to create an inventory entry for the selected 'Part'."
        }
        <br />
        {"Export the inventory to '.csv' by clicking on the "}
        <Button disabled color="light" className="mr-2">
          {"📩"}
        </Button>
        {" button."}
      </Container>
    );
  };

  const filtered = inventory.filter(filter);

  return (
    <div>
      <CardHeaderSearch
        value={filter}
        onChange={(ev) => setFilter(ev.target.value)}
      >
        <DownloadButton />
        <AddPartModal
          inventory={inventory.inventory}
          create={inventory.create}
        />
        <RefreshButton refresh={inventory.fetch}>
          Reload the inventory data
        </RefreshButton>
      </CardHeaderSearch>
      {inventory.loadingInventory ? (
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
            cellDataGetter={({ rowData }) => rowData.part.barcode}
            style={{ display: "flex", alignItems: "center" }}
          />
          <Column
            cellDataGetter={({ rowData }) => rowData.part.name}
            width={400}
            label="Name"
          />
          <Column
            width={200}
            label="Print"
            dataKey="quantity"
            cellRenderer={({ cellData, rowData }) => (
              <QuantityCell
                edit={(quantity) =>
                  inventory.edit({ id: rowData.id, quantity })
                }
                quantity={cellData}
              />
            )}
          />
          <Column
            width={200}
            label="Detail"
            dataKey="id"
            cellRenderer={({ cellData }) => (
              <TransactionDetailModal id={cellData} />
            )}
          />
        </TableWrapper>
      )}
    </div>
  );
};
