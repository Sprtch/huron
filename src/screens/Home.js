import React, { useState } from "react";
import { ExpandInput } from "../component/Input";
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
import { Barcode } from "../component/Barcode";

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
        <CardBody top width="100%">
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
      <h3>Commands to change mode</h3>
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
      <hr />
      <h3>Multiplier command</h3>
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
    </Container>
  );
};
