import React from "react";
import { PrinterType, DialectType } from "models/Printer";
import { PrinterTransactionDetail } from "./Detail";
import { Field, AvailableField } from "component/Field";
import { CloseIcon, MoreIcon, ExpandIcon, PrintIcon } from "component/Icon";
import { TooltipButton } from "component/Button";
import { timeSince } from "utils/datetime";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

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
        <ModalHeader toggle={toggle}>{"Create new single part"}</ModalHeader>
        <ModalBody style={{ padding: "0" }}>
          <PrinterTransactionDetail fetch={fetch} transactions={transactions} />
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
  transactions,
  setAsDefault,
  fetchDetail,
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
        </CardBody>
        <CardFooter>
          <Row>
            <Col>
              {inUse ? (
                <TooltipButton
                  disabled
                  tooltip="Currently sending the print jobs to this printer"
                >
                  <>
                    <CloseIcon />
                    {` In use`}
                  </>
                </TooltipButton>
              ) : (
                <TooltipButton
                  color="primary"
                  onClick={setAsDefault}
                  tooltip="Click to start sending your next print job to this printer"
                >
                  <>
                    <PrintIcon />
                    {` Print here`}
                  </>
                </TooltipButton>
              )}
            </Col>
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
