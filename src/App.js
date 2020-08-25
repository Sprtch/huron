import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "./component/Navbar.js";
import Home from "./screens/Home";
import Parts from "./screens/Parts";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />

          <div style={{ marginTop: "55px" }}>
            <Route exact path="/" component={Home} />
            <Route path="/parts" component={Parts} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
