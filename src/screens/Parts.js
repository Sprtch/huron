import React, { useState } from "react";
import { PrinterContext } from "../models/Printer";
import { PlainInput } from "../component/Input";
import { Loading } from "../component/Spinner";
import { TableWrapper } from "../component/Table";
import { CardHeaderSearch } from "../component/Card";
import { RefreshButton } from "../component/Button";
import { Column } from "react-virtualized";
import {
  Button,
  Container,
  Collapse,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Row,
  Col,
} from "reactstrap";
import { Form, FormGroup, Label, Input, FormText } from "reactstrap";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

const PartImportModal = ({ add }) => {
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
          <div className="input-group">
            <input
              value={barcode}
              className="form-control"
              placeholder="Enter barcode"
              onChange={(ev) => setBarcode(ev.target.value)}
            />
            <input
              value={name}
              className="form-control"
              placeholder="Enter part name"
              onChange={(ev) => setName(ev.target.value)}
            />
            <Button color="primary" onClick={send}>
              Submit
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

const BulkImportModal = ({ importCSV }) => {
  const DEFAULT_HEADER_BARCODE = "Code Barre";
  const DEFAULT_HEADER_NAME = "Référence interne";

  // File
  const [fileInput, setFileInput] = useState(null);
  const [headersName, setHeadersName] = useState([]);

  // UI
  const [modal, setModal] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [showOption, setShowOption] = useState(false);

  // Options
  const [csvEncoding, setCsvEncoding] = useState("UTF-8");
  const [withHeader, setWithHeader] = useState(true);
  const [usedHeader, setUsedHeader] = useState({
    barcode: DEFAULT_HEADER_BARCODE,
    name: DEFAULT_HEADER_NAME,
  });

  const send = (_) => {
    importCSV(fileInput, usedHeader.name, usedHeader.barcode, csvEncoding)
      .then((_) => {
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFileInput = (e) => {
    const parseCSV = (csv) => {
      const arrayCSV = csv.split("\r\n");
      if (withHeader) {
        const headers = arrayCSV[0].split(",").map((x) => x.replace(/\"/g, ""));
        if (headers.length < 2) {
          console.error(
            "Imported CSV has less than two column this error is not yet handled for the user"
          );
          return;
        }

        setUsedHeader({
          barcode: headers.includes(DEFAULT_HEADER_BARCODE)
            ? DEFAULT_HEADER_BARCODE
            : headers[0],
          name: headers.includes(DEFAULT_HEADER_NAME)
            ? DEFAULT_HEADER_NAME
            : headers[1],
        });
        setHeadersName(headers);
      }
    };

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        parseCSV(evt.target.result);
      };
      setFileInput(file);
    }
  };

  const toggleModal = () => setModal(!modal);

  const MatchComponent = ({ match }) => (
    <span style={{ color: match ? "green" : "red" }}>{"•"}</span>
  );

  return (
    <span>
      <Button
        color="light"
        className="mr-2"
        onClick={toggleModal}
        id="Tooltip-import"
      >
        📂
      </Button>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target="Tooltip-import"
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        Import part from .csv file
      </Tooltip>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {"Bulk part import from .csv file"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <input type="hidden" name="barcode" />
            <input type="hidden" name="name" />
            <FormGroup row>
              <Col>
                <Input
                  id="file"
                  type="file"
                  name="file"
                  onChange={onFileInput}
                />
                <FormText color="muted">Add you part .csv here</FormText>
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalBody>
          <Button color="link" onClick={() => setShowOption(!showOption)}>
            {showOption ? "▼" : "►"} Options
          </Button>
          <Collapse isOpen={showOption}>
            <hr />
            <legend>Header Setting</legend>
            <div className="text-muted">
              If your .csv file input contains the header information as the
              first file this box should be checked
            </div>
            <FormGroup check inline className="m-3">
              <Label check>
                <Input
                  type="checkbox"
                  checked={withHeader}
                  onChange={() => setWithHeader(!withHeader)}
                />
                Your .csv file contain an header line
              </Label>
            </FormGroup>
            <legend>Encoding Setting</legend>
            <div className="text-muted"></div>
            <FormGroup>
              <Label>
                <Input
                  type="select"
                  value={csvEncoding}
                  onChange={(e) => setCsvEncoding(e.target.value)}
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="latin1">latin1</option>
                </Input>
                .csv encoding selection
              </Label>
            </FormGroup>
            {fileInput && withHeader ? (
              <div>
                <legend>CSV column matching</legend>
                <div className="text-muted">
                  The .csv file you are sending should contain two information
                  stored in two different columns: part name and part barcode.
                  Here you can set which column of the .csv file you added
                  contain those informations. If the column of your csv match
                  the default column a green indicator will be put next to his
                  name.
                </div>
                <Row
                  className="m-3"
                  style={{
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "lightgray",
                  }}
                >
                  <Col style={{ borderRight: "1px" }}>
                    <div>Barcode column name</div>
                    <hr />
                    <div>
                      <UncontrolledButtonDropdown>
                        <DropdownToggle color="link" caret>
                          <MatchComponent
                            match={
                              usedHeader.barcode === DEFAULT_HEADER_BARCODE
                            }
                          />{" "}
                          {usedHeader.barcode}
                        </DropdownToggle>
                        <DropdownMenu>
                          {headersName.map((x) => (
                            <DropdownItem
                              onClick={() =>
                                setUsedHeader((prevState) => ({
                                  ...prevState,
                                  barcode: x,
                                }))
                              }
                              key={x}
                            >
                              {x}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </Col>
                  <Col>
                    <div>Part name column name</div>
                    <hr />
                    <div>
                      <UncontrolledButtonDropdown>
                        <DropdownToggle color="link" caret>
                          <MatchComponent
                            match={usedHeader.name === DEFAULT_HEADER_NAME}
                          />{" "}
                          {usedHeader.name}
                        </DropdownToggle>
                        <DropdownMenu>
                          {headersName.map((x) => (
                            <DropdownItem
                              onClick={() =>
                                setUsedHeader((prevState) => ({
                                  ...prevState,
                                  name: x,
                                }))
                              }
                              key={x}
                            >
                              {x}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : null}
          </Collapse>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleModal}>
            Close
          </Button>
          <Button
            color="primary"
            className="mb-2"
            disabled={fileInput === null}
            onClick={send}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </span>
  );
};

const PrintCell = ({ print, id }) => {
  const [number, setNumber] = React.useState(1);
  const [printing, setPrinting] = React.useState(false);

  const increase = () => {
    setNumber(number + 1);
  };
  const decrease = () => {
    if (number > 1) {
      setNumber(number - 1);
    }
  };
  const handleNumber = (ev) => {
    setNumber(ev.target.value);
  };
  const handlePrint = (destination) => {
    setPrinting(true);
    print(id, number, destination)
      .then((_) => {
        setNumber(1);
        setTimeout(() => setPrinting(false), 1000);
      })
      .catch((_) => {
        setPrinting(false);
      });
  };

  return (
    <PrinterContext.Consumer>
      {(ctx) => (
        <div className="btn-group mr-2" role="group" aria-label="First group">
          <Button color="secondary" onClick={decrease}>
            -
          </Button>
          <PlainInput type="number" value={number} onChange={handleNumber} />
          <Button color="secondary" onClick={increase}>
            +
          </Button>
          <Button
            style={{ width: "55px" }}
            color="primary"
            onClick={() => handlePrint(ctx.destination)}
          >
            {printing ? (
              <div
                style={{ width: "15px", height: "15px" }}
                className="spinner-border"
                role="status"
              />
            ) : (
              "Print"
            )}
          </Button>
        </div>
      )}
    </PrinterContext.Consumer>
  );
};

export default ({ parts }) => {
  const [filter, setFilter] = useState("");

  const helpRowRenderer = () => {
    return (
      <Container
        style={{ padding: "15px", textAlign: "center", color: "grey" }}
      >
        {"There is no 'Parts' in the database."}
        <br />
        {"Click on the "}
        <Button disabled color="light" className="mr-2">
          📂
        </Button>
        {" button to import a '.csv'."}
      </Container>
    );
  };

  const filtered = parts.filter(filter);

  return (
    <div>
      <CardHeaderSearch value={filter} onChange={(x) => setFilter(x)}>
        <PartImportModal add={parts.add} />
        <BulkImportModal importCSV={parts.importCSV} />
        <RefreshButton refresh={parts.fetch}>
          Reload the part data
        </RefreshButton>
      </CardHeaderSearch>

      {parts.loadingParts ? (
        <Loading />
      ) : (
        <TableWrapper
          size="84vh"
          rows={filtered}
          rowCount={filtered.length}
          rowGetter={({ index }) => filtered[index]}
          noRowsRenderer={helpRowRenderer}
        >
          <Column label="#" dataKey="id" width={50} />
          <Column
            width={200}
            label="Barcode"
            dataKey="barcode"
            style={{ display: "flex", alignItems: "center" }}
          />
          <Column width={600} label="Name" dataKey="name" />
          <Column
            width={200}
            label="Print"
            dataKey="id"
            cellRenderer={({ cellData }) => (
              <PrintCell print={parts.print} id={cellData} />
            )}
          />
        </TableWrapper>
      )}
    </div>
  );
};
