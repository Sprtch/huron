import React from "react";
import { PrinterType, DialectType } from "../../models/Printer";
import {
  Button,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const AvailableField = ({ available }) => (
  <Col style={{ color: available ? "green" : "red" }}>
    {`• ${available ? "connected" : "not connected"}`}
  </Col>
);

const Field = ({ title, content }) => (
  <ListGroupItem>
    <Row>
      <Col>{title}</Col>
      <Col className="text-right">{content}</Col>
    </Row>
  </ListGroupItem>
);

const timeSince = (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const PrinterCard = ({
  id,
  name,
  redis,
  type,
  width,
  height,
  dialect,
  available,
  inUse,
  settings,
  updated_at,
  created_at,
  setAsDefault,
}) => {
  const [detail, setDetail] = React.useState(false);
  const toggleDetail = () => setDetail(!detail);

  const typeName = (x) => {
    switch (x) {
      case PrinterType.Undefined:
        return "Undefined";
      case PrinterType.Stdout:
        return "STDOUT";
      case PrinterType.Testing:
        return "'Testing'";
      case PrinterType.Static:
        return "'Static Address'";
    }
  };
  const dialectName = (x) => {
    switch (x) {
      case DialectType.Undefined:
        return "Undefined";
      case DialectType.Zpl:
        return "ZPL";
      case DialectType.Json:
        return "JSON";
    }
  };
  const typeSettings = (x, settings) => {
    switch (x) {
      case PrinterType.Static:
        return (
          <>
            <Field title="Address" content={settings.address} />
            <Field title="Port" content={settings.port} />
          </>
        );
      default:
        return;
    }
  };

  return (
    <Col>
      <Card
        style={{
          borderWidth: inUse ? "3px" : "1px",
          boxShadow: inUse ? "2px 4px lightgrey" : null,
        }}
      >
        <CardBody>
          <CardTitle tag="h5">
            <Row>
              <Col>{`${name}`}</Col>
              <Col className="text-right">
                <Button color="link" onClick={toggleDetail}>{`🔍`}</Button>
              </Col>
            </Row>
          </CardTitle>
          <CardSubtitle style={{ color: "grey" }} tag="h6">
            <Row>
              <AvailableField available={available} />
              <Col
                style={{ fontSize: "small" }}
                className="text-muted text-right"
              >{`#${id}`}</Col>
            </Row>
          </CardSubtitle>
          <hr />
          <ListGroup>
            <Field title="Listening to" content={redis} />
            <Field
              title="Last update"
              content={`${timeSince(Date.parse(updated_at))} ago`}
            />
            {detail ? (
              <>
                <Field title="Printer type" content={typeName(type)} />
                <Field title="Printer dialect" content={dialectName(dialect)} />
                <Field title="Format" content={`${width}x${height}`} />
                <Field
                  title="Created at"
                  content={new Date(created_at).toLocaleString()}
                />
                {typeSettings(type, settings)}
              </>
            ) : null}
          </ListGroup>
          <hr />
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
