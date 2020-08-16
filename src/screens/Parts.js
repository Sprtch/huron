import React, { Component } from "react";
import axios from "axios";

const PartImportModal = () => (
  <span>
    <div class="modal" id="addModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add part</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form
              enctype="multipart/form-data"
              action="/api/parts"
              className="form-inline"
              method="post"
            >
              <div className="form-group mb-2">
                <label for="barcodeInput">Barcode</label>
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
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#addModal"
    >
      Add part
    </button>
  </span>
);

const BulkImportModal = () => (
  <span>
    <div class="modal" id="csvModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{"Bulk part import"}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#csvModal"
    >
      Add part from CSV
    </button>
  </span>
);

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
    const filter = ev.target.value;
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
        <h1>Separtech Parts page</h1>
        <hr />
        <div className="row">
          <div className="col">
            <input
              type="text"
              value={this.state.filter}
              onChange={this.handleFiltering}
              placeholder="Filter"
            />
          </div>
          <div className="col">
            <PartImportModal />
            <BulkImportModal />
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Barcode</th>
              <th scope="col">Name</th>
              <th scope="col">Print</th>
            </tr>
          </thead>
          <tbody>
            {this.state.showed.map((x) => (
              <tr>
                <td>{x.barcode}</td>
                <td>{x.name}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() =>
                      axios.post("/print", { barcode: x.barcode, name: x.name })
                    }
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
