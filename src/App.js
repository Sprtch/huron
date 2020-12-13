import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/Navbar.js";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import Inventory from "./screens/Inventory";
import Parts from "./screens/Parts";
import { PartProvider } from "./models/Parts";
import { InventoryProvider } from "./models/Inventory";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <PartProvider>
          <InventoryProvider>
            <div>
              <Navbar />

              <div>
                <Switch>
                  <Route exact path="/parts" component={Parts} />
                  <Route exact path="/inventory" component={Inventory} />
                  <Route exact path="/" component={Home} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
          </InventoryProvider>
        </PartProvider>
      </Router>
    );
  }
}

export default App;
