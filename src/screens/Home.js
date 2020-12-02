import React, { Component } from "react";

const ManualPrint = () => {
  return (
    <div className="card-body">
      <form action="/api/print" className="form-inline" method="post">
        <div className="form-group mb-2">
          <label htmlFor="barcodeInput">Barcode Input</label>
          <input
            type="text"
            name="barcode"
            className="form-control"
            id="barcodeInput"
            aria-describedby="barcodeHelp"
            placeholder="Enter barcode"
          />
        </div>
        <div className="form-group mb-2">
          <input
            type="text"
            name="name"
            className="form-control"
            id="nameInput"
            placeholder="Enter part name"
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            name="number"
            className="form-control"
            step="1"
            defaultValue="1"
            placeholder="Number"
          />
        </div>
        <button type="submit" className="btn btn-primary mb-2">
          Print
        </button>
      </form>
    </div>
  );
};

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <h1>Separtech Printer page</h1>
        <div className="card manual-input-card">
          <div className="card-header">Manual printing form</div>
          <ManualPrint />
        </div>
      </div>
    );
  }
}
