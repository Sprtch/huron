import React from "react";
import { modeName } from "./common";
import { Column } from "react-virtualized";
import { TableWrapper } from "../Table";

export const ScannerTransactionDetailTable = ({ fetch, transactions }) => {
  React.useEffect(() => fetch(), []);

  if (!Array.isArray(transactions)) {
    return null;
  }

  return (
    <TableWrapper
      size="40vh"
      rows={transactions}
      rowCount={transactions.length}
      rowGetter={({ index }) => transactions[index]}
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
};
