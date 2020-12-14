import React, { useState } from "react";
import { ExpandInput } from "../component/Input";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardTitle,
  CardSubtitle,
  CardBody,
  Button,
} from "reactstrap";
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

const CommandCard = ({ name, barcode, img }) => {
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
        <CardImg top width="100%" src={img.default} alt={barcode} />
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
          img={require("../static/barcode/inventory.png")}
        />
        <CommandCard
          name="Switch to Print Mode"
          barcode="sprtchcmd:mode:print"
          img={require("../static/barcode/print.png")}
        />
        <CommandCard
          name="Clear Command"
          barcode="sprtchcmd:clear:0"
          img={require("../static/barcode/clear.png")}
        />
      </Row>
      <hr />
      <h3>Multiplier command</h3>
      <hr />
      <Row xs="3">
        <CommandCard
          name="Multiplier x(-1)"
          barcode="sprtchcmd:negative:0"
          img={require("../static/barcode/negative.png")}
        />
      </Row>
      <Row xs="3">
        <CommandCard
          name="Multiplier x2"
          barcode="sprtchcmd:multiplier:2"
          img={require("../static/barcode/multiplier2.png")}
        />
        <CommandCard
          name="Multiplier x3"
          barcode="sprtchcmd:multiplier:3"
          img={require("../static/barcode/multiplier3.png")}
        />
        <CommandCard
          name="Multiplier x4"
          barcode="sprtchcmd:multiplier:4"
          img={require("../static/barcode/multiplier4.png")}
        />
        <CommandCard
          name="Multiplier x5"
          barcode="sprtchcmd:multiplier:5"
          img={require("../static/barcode/multiplier5.png")}
        />
      </Row>
    </Container>
  );
};
