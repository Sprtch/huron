import React, { useEffect } from "react";
import { PrinterContext } from "../models/Printer";
import { Loading } from "../component/Spinner";
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Button,
} from "reactstrap";

const PrinterCard = ({
  id,
  name,
  redis,
  type,
  width,
  height,
  dialect,
  inUse,
  setAsDefault,
}) => {
  const typeName = (x) => {
    switch (x) {
      case 0:
        return "Undefined";
      case 1:
        return "STDOUT";
      case 2:
        return "'Testing'";
      case 3:
        return "'Static Address'";
    }
  };
  const dialectName = (x) => {
    switch (x) {
      case 0:
        return "Undefined";
      case 1:
        return "ZPL";
      case 2:
        return "JSON";
    }
  };
  return (
    <Col>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            <Row>
              <Col>{`${name}`}</Col>
              <Col className="text-muted text-right">{`(#${id})`}</Col>
            </Row>
          </CardTitle>
          <CardSubtitle style={{ color: "grey" }} tag="h6">
            {`A ${typeName(type)} printer`}
          </CardSubtitle>
          <hr />
          <CardText>{`Listening to the '${redis}' redis channel`}</CardText>
          <CardText>{`Printing format '${width}x${height}'`}</CardText>
          <CardText>{`Dialect '${dialectName(dialect)}'`}</CardText>
          {inUse ? (
            <Button disabled>{`This printer is already in use`}</Button>
          ) : (
            <Button onClick={setAsDefault}>{`Use this printer`}</Button>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

const ScannerCard = ({ id, name, redis, type }) => {
  const typeName = (x) => {
    switch (x) {
      case 0:
        return "Undefined";
      case 1:
        return "debug";
      case 2:
        return "'testing'";
      case 3:
        return "'Serial'";
      case 4:
        return "'USB'";
    }
  };
  return (
    <Col>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            <Row>
              <Col>{`${name}`}</Col>
              <Col className="text-muted text-right">{`(#${id})`}</Col>
            </Row>
          </CardTitle>
          <CardSubtitle style={{ color: "grey" }} tag="h6">
            {`A ${typeName(type)} scanner`}
          </CardSubtitle>
          <hr />
          <CardText>{`Sending to the '${redis}' redis channel`}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

const AsideLabel = ({ children }) => (
  <Col
    style={{
      color: "grey",
      borderRight: "3px solid lightgrey",
      alignItems: "stretch",
      justifyContent: "center",
      margin: "15px 0px",
    }}
    md="1"
  >
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  </Col>
);

export default ({ printer, scanner }) => {
  useEffect(() => printer.fetch(), []);

  return (
    <Container>
      {printer.loadingPrinter ? (
        <Loading />
      ) : (
        <>
          <Row>
            <AsideLabel>Printers</AsideLabel>
            <Col>
              <Row md="3">
                {printer.printer.map((x) => (
                  <PrinterCard
                    {...x}
                    inUse={printer.destination === x.redis}
                    setAsDefault={() => printer.setAsDefault(x)}
                    key={x.id}
                  />
                ))}
              </Row>
            </Col>
          </Row>
          <Row>
            <AsideLabel>Scanners</AsideLabel>
            <Col>
              <Row md="3">
                {scanner.scanner.map((x) => (
                  <ScannerCard {...x} key={x.id} />
                ))}
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};
