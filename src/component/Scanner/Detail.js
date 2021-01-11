import React from "react";
import { modeName } from "./common";
import { Table } from "reactstrap";

export const ScannerTransactionDetailTable = ({ fetch, transactions }) => {
  React.useEffect(() => fetch(), []);

  if (!Array.isArray(transactions)) {
    return null;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Value</th>
          <th>Mode</th>
          <th>quantity</th>
          <th>Moment</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((x) => (
          <tr>
            <th>{x.id}</th>
            <th>{x.value}</th>
            <th>{modeName(x.mode)}</th>
            <th>{x.quantity}</th>
            <th>{x.created_at}</th>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
