import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "reactstrap";
import { FormGroup, Label, Input } from "reactstrap";

export default ({ add }) => {
  const [modal, setModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const toggle = () => setModal(!modal);

  const send = (_) => {
    add({ barcode, name }).then(() => {
      setBarcode("");
      setName("");
      setModal(false);
    });
  };

  return (
    <span>
      <Button
        color="light"
        className="mr-2"
        onClick={toggle}
        id="Tooltip-add-part"
      >
        ➕
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-add-part"
        toggle={toggleTooltip}
      >
        Add part manually to the database
      </Tooltip>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{"Create new single part"}</ModalHeader>
        <ModalBody>
          <FormGroup className="m-3">
            <Label>
              <Input onChange={(ev) => setBarcode(ev.target.value)} />
              Enter the barcode
            </Label>
          </FormGroup>
          <FormGroup className="m-3">
            <Label>
              <Input onChange={(ev) => setName(ev.target.value)} />
              Enter the part name
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={toggle}>
            Close
          </Button>
          <Button
            color="primary"
            disabled={!(name.length || barcode.length)}
            onClick={send}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};
