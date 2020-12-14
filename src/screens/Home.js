import React, { useState } from "react";
import { ExpandInput } from "../component/Input";
import { Card, Button, CardTitle } from "reactstrap";
import axios from "axios";

const ManualPrint = () => {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrint = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
      axios.post("/api/print", { name, barcode }).then(() => {
        setName("");
        setBarcode("");
      });
    }
  };

  return (
    <Card body inverse color="info">
      <CardTitle tag="h5">Manual printing form</CardTitle>

      <div className="row">
        <div className="col">
          <ExpandInput
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Enter Name..."
          />
        </div>
        <div className="col">
          <ExpandInput
            type="text"
            value={barcode}
            onChange={(ev) => setBarcode(ev.target.value)}
            placeholder="Enter barcode..."
          />
        </div>
        <div className="col-auto text-right">
          <Button
            onClick={sendPrint}
            style={{ width: "95px", height: "35px" }}
            color="secondary"
          >
            {loading ? (
              <div
                style={{ width: "15px", height: "15px" }}
                className="spinner-border"
                role="status"
              />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default () => {
  return (
    <div className="container">
      <h1>Separtech Printer page</h1>
      <ManualPrint />
    </div>
  );
};
