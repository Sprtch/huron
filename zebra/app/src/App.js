import React, { Component } from 'react';
import Navbar from './component/Navbar.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <span>
        <Navbar/>

        <div className="container">
          <h1>Separtech Printer page</h1>
          <div className="card manual-input-card">
            <div className="card-header">
              Manual printing form
            </div>
            <div className="card-body">
              <form action="/print" className="form-inline" method="post">
                <div className="form-group mb-2">
                  <label for="barcodeInput">Barcode Input</label>
                  <input type="text" name="barcode" className="form-control" id="barcodeInput" aria-describedby="barcodeHelp" placeholder="Enter barcode"/>
                </div>
                <div className="form-group mb-2">
                  <input type="text" name="name" className="form-control" id="nameInput" placeholder="Enter part name"/>
                </div>
                <div className="mb-2">
                  <input type="number" name="number" className="form-control" step="1" placeholder="Number"/>
                </div>
                <button type="submit" className="btn btn-primary mb-2">Print</button>
              </form>
            </div>
          </div>
          <div className="card code-update-card">
            <div className="card-header">
              In case of fire
            </div>
            <div className="card-body">
              <form action="/update" className="form-inline" method="post">
                <button type="submit" className="btn btn-primary mb-2">Update Code</button>
              </form>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

export default App;
