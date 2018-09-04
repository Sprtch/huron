import React from 'react';

export default () => (
  <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a className="navbar-brand" href="/">Separtech Printing Page</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
          <a className="nav-link" href="/">Home</a>
        </li>
        <li className="nav-item active">
          <a className="nav-link" href="/part">Part</a>
        </li>
      </ul>
    </div>
  </nav>
);
