import React from "react";
import { Row, Col, ListGroupItem } from "reactstrap";

export const AvailableContent = ({ available }) => (
  <span style={{ color: available ? "green" : "red" }}>
    {`• ${available ? "connected" : "not connected"}`}
  </span>
);

export const AvailableField = ({ available }) => (
  <Col>
    <AvailableContent available={available} />
  </Col>
);

export const Field = ({ title, content }) => (
  <ListGroupItem>
    <Row>
      <Col>{title}</Col>
      <Col className="text-right">{content}</Col>
    </Row>
  </ListGroupItem>
);
