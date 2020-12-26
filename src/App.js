import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/Navbar.js";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import Inventory from "./screens/Inventory";
import Printer from "./screens/Printer";
import Parts from "./screens/Parts";
import { PartProvider, PartContext } from "./models/Parts";
import { InventoryProvider, InventoryContext } from "./models/Inventory";
import { PrinterProvider, PrinterContext } from "./models/Printer";
import "./App.css";

const PartsWrapper = () => (
  <PartContext.Consumer>{(ctx) => <Parts parts={ctx} />}</PartContext.Consumer>
);

const InventoryWrapper = () => (
  <InventoryContext>{(ctx) => <Inventory inventory={ctx} />}</InventoryContext>
);

const PrinterWrapper = () => (
  <PrinterContext>{(ctx) => <Printer printer={ctx} />}</PrinterContext>
);

class App extends Component {
  render() {
    return (
      <Router>
        <PartProvider>
          <InventoryProvider>
            <PrinterProvider>
              <div>
                <Navbar />

                <div>
                  <Switch>
                    <Route exact path="/parts" component={PartsWrapper} />
                    <Route
                      exact
                      path="/inventory"
                      component={InventoryWrapper}
                    />
                    <Route exact path="/printer" component={PrinterWrapper} />
                    <Route exact path="/" component={Home} />
                    <Route component={NotFound} />
                  </Switch>
                </div>
              </div>
            </PrinterProvider>
          </InventoryProvider>
        </PartProvider>
      </Router>
    );
  }
}

export default App;
