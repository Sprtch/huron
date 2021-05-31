import React, { useState } from "react";
import { PrinterContext } from "models/Printer";
import { PlainInput } from "component/Input";
import { Loading } from "component/Spinner";
import { TableWrapper } from "component/Table";
import { CardHeaderSearch } from "component/Card";
import { RefreshButton } from "component/Button";
import BulkImportModal from "./BulkImportModal";
import ImportModal from "./ImportModal";
import { Column } from "react-virtualized";
import { Button, Container } from "reactstrap";

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

const helpRowRenderer = () => {
  return (
    <Container style={{ padding: "15px", textAlign: "center", color: "grey" }}>
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

export default ({ parts }) => {
  const [filter, setFilter] = useState("");
  const filtered = parts.filter(filter);

  return (
    <div>
      <CardHeaderSearch value={filter} onChange={(x) => setFilter(x)}>
        <ImportModal add={parts.add} />
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
