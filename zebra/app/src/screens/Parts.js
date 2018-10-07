import React, { Component } from 'react';
import axios from 'axios';

class PartImportModel extends Component {
  render() {
    return (
      <span>
        <div class="modal" id="addModal" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add part</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form action="/api/parts" className="form-inline" method="post">
                <div className="form-group mb-2">
                  <label for="barcodeInput">Barcode</label>
                  <input type="text" name="barcode" className="form-control" id="barcodeInput" aria-describedby="barcodeHelp" placeholder="Enter barcode"/>
                </div>
                <div className="form-group mb-2">
                  <input type="text" name="name" className="form-control" id="nameInput" placeholder="Enter part name"/>
                </div>
                <button type="submit" className="btn btn-primary mb-2">Submit</button>
              </form>
            </div>
          </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addModal">
          Add part
        </button>
      </span>
    );
  }
}

export default class Parts extends Component {
  constructor(props) {
    super(props);
    this.state = { parts: [], };
  }

  componentWillMount() {
    axios.get('/api/parts')
      .then(response => this.setState({parts: response.data}););
  }

  render() {
    return (
      <div className="container">
        <h1>Separtech Parts page</h1>
        <hr/>
        <PartImportModel/>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Barcode</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.parts.map(x =>
              (
                <tr>
                  <td>{x.barcode}</td>
                  <td>{x.name}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
