import React, { useState } from "react";
import { InventoryContext } from "../models/Inventory";
import { PartContext } from "../models/Parts";
import { Loading } from "../component/Spinner";
import { CardHeaderSearch } from "../component/Card";
import { PlainInput } from "../component/Input";
import { Column, Table, AutoSizer } from "react-virtualized";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const AddPartModal = ({ create }) => {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("");

  const toggle = () => setModal(!modal);

  const AddCell = ({ create }) => {
    return <Button onClick={create}>Add</Button>;
  };

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
              <span>
                <CardHeaderSearch
                  value={filter}
                  onChange={(ev) => setFilter(ev.target.value)}
                />

                <div style={{ height: 400 }}>
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
                        <Column label="Barcode" dataKey="barcode" width={250} />
                        <Column width={500} label="Name" dataKey="name" />
                        <Column
                          width={100}
                          label="Print"
                          dataKey="id"
                          cellRenderer={({ cellData }) => (
                            <AddCell
                              create={() => create(cellData)}
                              id={cellData}
                            />
                          )}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                </div>
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
        Export to CSV
      </button>
    </a>
  );
};

const InventoryLine = ({ id, part, quantity, edit }) => {
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
            onClick={() =>
              edit({ id, quantity: qquantity }).then(() => setEditing(false))
            }
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
            <AddPartModal create={ctx.create} />
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
                  <InventoryLine {...x} edit={ctx.edit} key={x.id} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </InventoryContext.Consumer>
  );
};
