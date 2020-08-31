import React, { Component } from "react";
import { PlainInput, ExpandInput } from "../component/Input";
import axios from "axios";

const PartImportModal = () => (
  <span>
    <div className="modal" id="addModal" tabindex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add part</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              enctype="multipart/form-data"
              action="/api/parts"
              className="form-inline"
              method="post"
            >
              <div className="form-group mb-2">
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
              <div className="form-group mb-2">
                <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      className="btn btn-light mr-2"
      data-toggle="modal"
      data-target="#addModal"
    >
      Add part
    </button>
  </span>
);

const BulkImportModal = () => (
  <span>
    <div className="modal" id="csvModal" tabindex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{"Bulk part import"}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              enctype="multipart/form-data"
              action="/api/parts"
              className="form-inline"
              method="post"
            >
              <input type="hidden" name="barcode" />
              <input type="hidden" name="name" />
              <div className="form-group mb-2">
                <input type="file" name="file" />
              </div>
              <div className="form-group mb-2">
                <button type="submit" className="btn btn-primary mb-2">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      className="btn btn-light mr-2"
      data-toggle="modal"
      data-target="#csvModal"
    >
      Add part from CSV
    </button>
  </span>
);

const PartLine = ({ id, counter, barcode, name }) => {
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
  const handlePrint = () => {
    setPrinting(true);
    axios
      .post("/api/print", { barcode, name, number })
      .then((response) => {
        setPrinting(false);
      })
      .catch((err) => {
        setPrinting(false);
      });
  };

  return (
    <tr>
      <td>{barcode}</td>
      <td>{name}</td>
      <td>
        <button type="button" className="btn btn-primary" onClick={handlePrint}>
          {printing ? (
            <div className="spinner-border" role="status" />
          ) : (
            "Print"
          )}
        </button>
      </td>
      <td>
        <div className="btn-group mr-2" role="group" aria-label="First group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={decrease}
          >
            -
          </button>
          <PlainInput type="number" value={number} onChange={handleNumber} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={increase}
          >
            +
          </button>
        </div>
      </td>
    </tr>
  );
};

export default class Parts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parts: [],
      showed: [],
    };

    this.handleFiltering = this.handleFiltering.bind(this);
  }

  componentWillMount() {
    axios.get("/api/parts").then((response) =>
      this.setState({
        filter: "",
        parts: response.data,
        showed: response.data,
      })
    );
  }

  handleFiltering(ev) {
    this.setState({
      filter: ev.target.value,
      showed: this.state.filter
        .split(" ")
        .reduce(
          (acc, current) =>
            acc.filter(
              (x) =>
                (x.barcode &&
                  x.barcode.toLowerCase().includes(current.toLowerCase())) ||
                (x.name && x.name.toLowerCase().includes(current.toLowerCase()))
            ),
          this.state.parts
        ),
    });
  }

  render() {
    return (
      <div className="container">
        <div className="card bg-primary">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <ExpandInput
                  type="text"
                  value={this.state.filter}
                  onChange={this.handleFiltering}
                  placeholder="Filter..."
                />
              </div>
              <div className="col-auto text-right">
                <PartImportModal />
                <BulkImportModal />
              </div>
            </div>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Barcode</th>
              <th scope="col">Name</th>
              <th scope="col">Print</th>
              <th scope="col">Number</th>
            </tr>
          </thead>
          <tbody>
            {this.state.showed.map((x) => (
              <PartLine {...x} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
