import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/Navbar.js";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import Inventory from "./screens/Inventory";
import Fleet from "./screens/Fleet";
import Parts from "./screens/Parts";
import { PartProvider, PartContext } from "./models/Parts";
import { InventoryProvider, InventoryContext } from "./models/Inventory";
import { PrinterProvider, PrinterContext } from "./models/Printer";
import { ScannerProvider, ScannerContext } from "./models/Scanner";
import "./App.css";

const PartsWrapper = () => (
  <PartContext.Consumer>{(ctx) => <Parts parts={ctx} />}</PartContext.Consumer>
);

const InventoryWrapper = () => (
  <InventoryContext>{(ctx) => <Inventory inventory={ctx} />}</InventoryContext>
);

const FleetWrapper = () => (
  <PrinterContext>
    {(printer) => (
      <ScannerContext>
        {(scanner) => <Fleet printer={printer} scanner={scanner} />}
      </ScannerContext>
    )}
  </PrinterContext>
);

class App extends Component {
  render() {
    return (
      <Router>
        <PartProvider>
          <InventoryProvider>
            <PrinterProvider>
              <ScannerProvider>
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
                      <Route exact path="/fleet" component={FleetWrapper} />
                      <Route exact path="/" component={Home} />
                      <Route component={NotFound} />
                    </Switch>
                  </div>
                </div>
              </ScannerProvider>
            </PrinterProvider>
          </InventoryProvider>
        </PartProvider>
      </Router>
    );
  }
}

export default App;
