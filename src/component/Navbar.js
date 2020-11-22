import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <Link className="navbar-brand" to="/">
      Separtech Printing Page
    </Link>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarsExampleDefault"
      aria-controls="navbarsExampleDefault"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item active">
          <Link className="nav-link" to="/parts">
            Parts
          </Link>
        </li>
        <li className="nav-item active">
          <Link className="nav-link" to="/inventory">
            Inventory
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);
