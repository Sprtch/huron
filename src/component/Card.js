import React from "react";
import { ExpandInput } from "../component/Input";
import { Row, Col, Card, CardBody } from "reactstrap";

export const CardHeader = (props) => (
  <div className="py-1 px-3">
    <Card color="primary">
      <CardBody style={props.style}>
        <Row>{props.children}</Row>
      </CardBody>
    </Card>
  </div>
);

export const CardHeaderSearch = (props) => (
  <CardHeader style={props.style}>
    <Col>
      <ExpandInput
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Filter..."
      />
    </Col>
    <Col md="auto" className="text-center">
      {props.children}
    </Col>
  </CardHeader>
);
