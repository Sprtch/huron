import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Button,
} from "reactstrap";

export const ScannerCard = ({ id, name, redis, type }) => {
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
