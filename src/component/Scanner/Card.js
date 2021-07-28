import React from "react";
import { ScannerMode } from "models/Scanner";
import { Field, AvailableField } from "component/Field";
import { MoreIcon, ExpandIcon } from "component/Icon";
import { TooltipButton } from "component/Button";
import { timeSince } from "utils/datetime";
import { ScannerTransactionDetail } from "./Detail";
import { modeName, typeName } from "./common";
import {
  Button,
  Row,
  Col,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
  ListGroup,
} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const TransactionModal = ({ fetch, transactions }) => {
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);

  return (
    <>
      <TooltipButton
        color="link"
        onClick={toggle}
        id="add-part"
        tooltip="Show the transactions history for this scanner"
      >
        <ExpandIcon />
      </TooltipButton>

      <Modal size="xl" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {"Scanner transactions detail list"}
        </ModalHeader>
        <ModalBody style={{ padding: "0" }}>
          <ScannerTransactionDetail fetch={fetch} transactions={transactions} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const ScannerCard = ({
  id,
  mode,
  name,
  redis,
  available,
  type,
  settings,
  created_at,
  updated_at,
  transactions,
  fetchDetail,
}) => {
  const [detail, setDetail] = React.useState(false);
  const toggleDetail = () => setDetail(!detail);
  const typeSettings = (x, settings) => {
    switch (x) {
      case ScannerMode.Serial:
      case ScannerMode.USB:
        return <Field title="Device" content={settings.path} />;
      default:
        return;
    }
  };

  return (
    <Col>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            <Row>
              <Col>{`${name}`}</Col>
              <Col className="text-right">
                <Button
                  outline={detail}
                  style={{ marginRight: "-10px" }}
                  color="link"
                  onClick={toggleDetail}
                >
                  <MoreIcon />
                </Button>
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
            <Field title="Destination" content={redis} />
            <Field title="Mode" content={modeName(mode)} />
            <Field
              title="Last update"
              content={`${timeSince(Date.parse(updated_at))} ago`}
            />
            {detail ? (
              <>
                <Field title="Scanner type" content={typeName(type)} />
                <Field
                  title="Created at"
                  content={new Date(created_at).toLocaleString()}
                />
                {typeSettings(type, settings)}
              </>
            ) : null}
          </ListGroup>
        </CardBody>
        <CardFooter>
          <Row>
            <Col></Col>
            <Col className="text-right">
              <TransactionModal
                fetch={() => fetchDetail(id)}
                transactions={transactions}
              />
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </Col>
  );
};
