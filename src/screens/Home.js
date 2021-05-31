import React, { useState } from "react";
import { ExpandInput, PlainInput } from "component/Input";
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  Button,
} from "reactstrap";
import axios from "axios";
import { Barcode } from "component/Barcode";

const ManualPrint = () => {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = React.useState(1);

  const increase = () => {
    setNumber(number + 1);
  };
  const decrease = () => {
    if (number > 1) {
      setNumber(number - 1);
    }
  };
  const handleNumber = (ev) => {
    setNumber(ev.target.value);
  };

  const sendPrint = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
      axios.post("/api/print", { name, barcode, number }).then(() => {
        setName("");
        setBarcode("");
        setNumber(1);
      });
    }
  };

  return (
    <Card body inverse color="secondary">
      <CardTitle tag="h5">Manual printing form</CardTitle>

      <Row>
        <Col>
          <ExpandInput
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Enter Name..."
          />
        </Col>
        <Col>
          <ExpandInput
            type="text"
            value={barcode}
            onChange={(ev) => setBarcode(ev.target.value)}
            placeholder="Enter barcode..."
          />
        </Col>
        <div className="col-auto text-right">
          <div className="btn-group mr-2" role="group">
            <Button color="info" onClick={decrease}>
              -
            </Button>
            <PlainInput type="number" value={number} onChange={handleNumber} />
            <Button color="info" onClick={increase}>
              +
            </Button>
            <Button
              onClick={sendPrint}
              style={{ width: "95px", height: "35px" }}
              color="primary"
            >
              {loading ? (
                <div
                  style={{ width: "15px", height: "15px" }}
                  className="spinner-border"
                  role="status"
                />
              ) : (
                "Print"
              )}
            </Button>
          </div>
        </div>
      </Row>
    </Card>
  );
};

const CommandCard = ({ name, barcode }) => {
  const [loading, setLoading] = useState(false);

  const sendPrint = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
      axios.post("/api/print", { name, barcode });
    }
  };

  return (
    <Col>
      <Card>
        <CardBody width="100%">
          <h5 className="text-center">{name}</h5>
          <Barcode className="text-center">{barcode}</Barcode>
          <p className="text-center">{barcode}</p>
        </CardBody>
        <hr />
        <CardBody>
          <CardTitle tag="h5">{`${name}`}</CardTitle>
          <CardSubtitle style={{ color: "grey" }} tag="h6">
            {`${barcode}`}
          </CardSubtitle>
          <hr />
          <Button style={{ width: "95px", height: "35px" }} onClick={sendPrint}>
            {loading ? (
              <div
                style={{ width: "15px", height: "15px" }}
                className="spinner-border"
                role="status"
              />
            ) : (
              "Print"
            )}
          </Button>
        </CardBody>
      </Card>
    </Col>
  );
};

export default () => {
  return (
    <Container>
      <h1>Separtech Printer page</h1>
      <hr />
      <ManualPrint />
      <h1>Commands Print</h1>
      <hr />
      <details>
        <summary>Commands to change mode</summary>
        <hr />
        <Row xs="3">
          <CommandCard
            name="Switch to Inventory Mode"
            barcode="sprtchcmd:mode:inventory"
          />
          <CommandCard
            name="Switch to Print Mode"
            barcode="sprtchcmd:mode:print"
          />
          <CommandCard name="Clear Command" barcode="sprtchcmd:clear:0" />
        </Row>
      </details>
      <hr />
      <details>
        <summary>Multiplier command</summary>
        <hr />
        <Row xs="3">
          <CommandCard name="Multiplier x(-1)" barcode="sprtchcmd:negative:0" />
        </Row>
        <Row xs="3">
          <CommandCard name="Multiplier x2" barcode="sprtchcmd:multiplier:2" />
          <CommandCard name="Multiplier x3" barcode="sprtchcmd:multiplier:3" />
          <CommandCard name="Multiplier x4" barcode="sprtchcmd:multiplier:4" />
          <CommandCard name="Multiplier x5" barcode="sprtchcmd:multiplier:5" />
        </Row>
      </details>
      <hr />
    </Container>
  );
};
