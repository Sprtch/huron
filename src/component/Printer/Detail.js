import React from "react";
import { Column } from "react-virtualized";
import { TableWrapper } from "component/Table";
import { CardHeaderSearch } from "component/Card";
import { Button, Container } from "reactstrap";

const helpRowRenderer = () => {
  return (
    <Container style={{ padding: "15px", textAlign: "center", color: "grey" }}>
      {"There is no transaction with this printer device yet"}
    </Container>
  );
};

const PrinterTransactionDetailTable = ({ transactions }) => (
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
      dataKey="barcode"
      style={{ display: "flex", alignItems: "center" }}
    />
    <Column
      width="100"
      label="Mode"
      dataKey="name"
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

export const PrinterTransactionDetail = ({ fetch, transactions }) => {
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => fetch(), []);

  if (!Array.isArray(transactions)) {
    return null;
  }

  const filteredTransaction = transactions.filter((x) =>
    filter ? x.value.toLowerCase().includes(filter.toLowerCase()) : x
  );

  return (
    <>
      <CardHeaderSearch
        value={filter}
        onChange={(ev) => setFilter(ev.target.value)}
      />
      <PrinterTransactionDetailTable transactions={filteredTransaction} />
    </>
  );
};
