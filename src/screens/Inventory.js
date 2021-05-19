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
        <ModalBody style={{ padding: "0", marginBottom: "12px" }}>
          <PartContext.Consumer>
            {(ctx) => (
              <>
                <CardHeaderSearch
                  value={filter}
                  onChange={(x) => setFilter(x)}
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
          <Button color="warning" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

const DownloadButton = ({ disabled }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return disabled ? (
    <Button disabled color="light" className="mr-2">
      {"📩"}
    </Button>
  ) : (
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

  const noRowRenderer = () => {
    return (
      <Container
        style={{ padding: "15px", textAlign: "center", color: "grey" }}
      >
        {"Still no inventory transaction for this part"}
      </Container>
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
                noRowsRenderer={noRowRenderer}
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
          <Button color="warning" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

export default ({ inventory }) => {
  const [filter, setFilter] = useState("");
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [editingUnit, setEditingUnit] = useState(false);

  const QuantityCell = ({ quantity, edit }) => {
    const [qquantity, setQuantity] = useState(quantity);

    if (editingQuantity) {
      return (
        <div className="btn-group mr-2" role="group" aria-label="invquantity">
          <PlainInput
            type="number"
            value={qquantity}
            onChange={(ev) => setQuantity(ev.target.value)}
          />
          <Button
            color="secondary"
            onClick={() =>
              edit(qquantity).then(() => setEditingQuantity(false))
            }
          >
            {"Save"}
          </Button>
          <Button color="light" onClick={() => setEditingQuantity(false)}>
            {"X"}
          </Button>
        </div>
      );
    } else {
      return (
        <span onClick={() => setEditingQuantity(true)}>
          {qquantity} <Button color="link">{"edit"}</Button>
        </span>
      );
    }
  };

  const UnitCell = ({ unit, edit }) => {
    const [uunit, setUnit] = useState(unit);

    const uTranslate = (x) => {
      switch (x) {
        case "m":
          return 2;
        case "m³":
          return 3;
        default:
        case "u":
          return 1;
      }
    };

    if (editingUnit) {
      return (
        <div className="btn-group mr-2" role="group" aria-label="invunit">
          <select value={uunit} onChange={(ev) => setUnit(ev.target.value)}>
            <option value="pcs">{"pcs"}</option>
            <option value="m">{"m"}</option>
            <option value="m³">{"m³"}</option>
          </select>
          <Button
            color="secondary"
            onClick={() =>
              edit(uTranslate(uunit)).then(() => setEditingUnit(false))
            }
          >
            {"Save"}
          </Button>
          <Button color="light" onClick={() => setEditingUnit(false)}>
            {"X"}
          </Button>
        </div>
      );
    } else {
      return (
        <span onClick={() => setEditingUnit(true)}>
          {uunit} <Button color="link">{"edit"}</Button>
        </span>
      );
    }
  };

  const helpRowRenderer = () => {
    return (
      <Container
        style={{ padding: "15px", textAlign: "center", color: "grey" }}
      >
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
      <CardHeaderSearch value={filter} onChange={(x) => setFilter(x)}>
        <DownloadButton disabled={inventory.inventory.length === 0} />
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
            dataKey="part"
            cellDataGetter={({ rowData }) => rowData.part.barcode}
            style={{ display: "flex", alignItems: "center" }}
          />
          <Column
            dataKey="part"
            cellDataGetter={({ rowData }) => rowData.part.name}
            width={400}
            label="Name"
          />
          <Column
            width={200}
            label="Quantity"
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
            width={150}
            label="Unit"
            dataKey="unit"
            cellRenderer={({ cellData, rowData }) => (
              <UnitCell
                edit={(unit) => inventory.edit({ id: rowData.id, unit })}
                unit={cellData}
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
