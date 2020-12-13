import React, { useState } from "react";
import { InventoryContext } from "../models/Inventory";
import { PartContext } from "../models/Parts";
import { Loading } from "../component/Spinner";
import { CardHeaderSearch } from "../component/Card";
import { PlainInput } from "../component/Input";
import { Column, Table, AutoSizer } from "react-virtualized";
import { TableWrapper } from "../component/Table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const AddPartModal = ({ inventory, create }) => {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("");

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
      <Button color="light" className="mr-2" onClick={toggle}>
        {"➕"}
      </Button>
      <Modal size="lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {"Create inventory entry for an existing part"}
        </ModalHeader>
        <ModalBody>
          <PartContext.Consumer>
            {(ctx) => (
              <span>
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
              </span>
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
        {"📩"}
      </button>
    </a>
  );
};

export default () => {
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

  return (
    <InventoryContext.Consumer>
      {(ctx) => (
        <div>
          <CardHeaderSearch
            value={filter}
            onChange={(ev) => setFilter(ev.target.value)}
          >
            <DownloadButton />
            <AddPartModal inventory={ctx.inventory} create={ctx.create} />
            <Button color="secondary" onClick={ctx.fetch}>
              ↻
            </Button>
          </CardHeaderSearch>
          {ctx.loadingInventory ? (
            <Loading />
          ) : (
            <TableWrapper
              size="84vh"
              rows={ctx.filter(filter)}
              rowCount={ctx.filter(filter).length}
              rowGetter={({ index }) => ctx.filter(filter)[index]}
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
                    edit={(quantity) => ctx.edit({ id: rowData.id, quantity })}
                    quantity={cellData}
                  />
                )}
              />
            </TableWrapper>
          )}
        </div>
      )}
    </InventoryContext.Consumer>
  );
};
