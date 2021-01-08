import React from "react";
import { Row, Col, ListGroupItem } from "reactstrap";

export const AvailableField = ({ available }) => (
  <Col style={{ color: available ? "green" : "red" }}>
    {`• ${available ? "connected" : "not connected"}`}
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
