import React from "react";
import { ScannerMode } from "models/Scanner";
import { modeName } from "./common";
import { Column } from "react-virtualized";
import { TableWrapper } from "component/Table";
import { CardHeaderSearch } from "component/Card";
import { Button, Container } from "reactstrap";

const helpRowRenderer = () => {
  return (
    <Container style={{ padding: "15px", textAlign: "center", color: "grey" }}>
      {"There is no transaction with this scanner device yet"}
    </Container>
  );
};

const ScannerTransactionDetailTable = ({ transactions }) => (
  <TableWrapper
    size="40vh"
    rows={transactions}
    rowCount={transactions.length}
    rowGetter={({ index }) => transactions[index]}
    noRowsRenderer={helpRowRenderer}
  >
    <Column label="#" dataKey="id" width={50} />
    <Column
      width="200"
      label="Value"
      dataKey="value"
      style={{ display: "flex", alignItems: "center" }}
    />
    <Column
      width="100"
      label="Mode"
      dataKey="mode"
      cellRenderer={({ cellData }) => modeName(cellData)}
    />
    <Column
      width="200"
      label="Moment"
      dataKey="created_at"
      cellRenderer={({ cellData }) => cellData}
    />
  </TableWrapper>
);

export const ScannerTransactionDetail = ({ fetch, transactions }) => {
  const [filter, setFilter] = React.useState("");
  const [inventoryFilter, setInventoryFilter] = React.useState(true);
  const toggleInventory = () => setInventoryFilter(!inventoryFilter);
  const [printingFilter, setPrintingFilter] = React.useState(true);
  const togglePrinting = () => setPrintingFilter(!printingFilter);

  React.useEffect(() => fetch(), []);

  if (!Array.isArray(transactions)) {
    return null;
  }

  const filteredTransaction = transactions
    .filter((x) =>
      filter ? x.value.toLowerCase().includes(filter.toLowerCase()) : x
    )
    .filter(
      (x) =>
        (x.mode === ScannerMode.Print) === printingFilter ||
        (x.mode === ScannerMode.Inventory) === inventoryFilter
    );

  return (
    <>
      <CardHeaderSearch
        value={filter}
        onChange={(ev) => setFilter(ev.target.value)}
      >
        <Button
          className="mt-2 ml-2"
          onClick={toggleInventory}
          color={inventoryFilter ? "light" : "secondary"}
        >
          {inventoryFilter
            ? "Hide Inventory Transaction"
            : "Show Inventory Transaction"}
        </Button>
        <Button
          className="mt-2 ml-2"
          onClick={togglePrinting}
          color={printingFilter ? "light" : "secondary"}
        >
          {printingFilter
            ? "Hide Printing Transaction"
            : "Show Printing Transaction"}
        </Button>
      </CardHeaderSearch>
      <ScannerTransactionDetailTable
        fetch={fetch}
        transactions={filteredTransaction}
      />
    </>
  );
};
