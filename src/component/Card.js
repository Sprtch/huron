import React from "react";
import { ExpandInput } from "../component/Input";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Button } from "reactstrap";
import { CloseIcon } from "../component/Icon";

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
        onChange={(ev) => props.onChange(ev.target.value)}
        placeholder="Filter..."
      />
      {props.value.length ? (
        <Button
          style={{ color: "white", position: "absolute", right: "10px" }}
          color="link"
          onClick={() => props.onChange("")}
        >
          <CloseIcon />
        </Button>
      ) : null}
    </Col>
    <Col md="auto" className="text-center">
      {props.children}
    </Col>
  </CardHeader>
);
