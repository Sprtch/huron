import React, { useEffect } from "react";
import { PrinterCard } from "component/Printer";
import { ScannerCard } from "component/Scanner";
import { Loading } from "component/Spinner";
import { Row, Col, Container } from "reactstrap";

const AsideLabel = ({ children }) => (
  <Col
    style={{
      color: "grey",
      borderRight: "3px solid lightgrey",
      alignItems: "stretch",
      justifyContent: "center",
      margin: "15px 0px",
    }}
    md="1"
  >
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  </Col>
);

export default ({ printer, scanner }) => {
  useEffect(() => printer.fetch(), []);
  useEffect(() => scanner.fetch(), []);

  return (
    <Container>
      {printer.loadingPrinter ? (
        <Loading />
      ) : (
        <>
          <Row>
            <AsideLabel>Printers</AsideLabel>
            <Col>
              <Row md="3">
                {printer.length ? (
                  printer.printer.map((x) => (
                    <PrinterCard
                      {...x}
                      inUse={printer.destination === x.redis}
                      setAsDefault={() => printer.setAsDefault(x)}
                      key={x.id}
                    />
                  ))
                ) : (
                  <Col className="text-center">
                    <h3 className="text-secondary mt-3">
                      No printer connected
                    </h3>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
          <Row>
            <AsideLabel>Scanners</AsideLabel>
            <Col>
              <Row md="3">
                {scanner.length ? (
                  scanner.scanner.map((x) => (
                    <ScannerCard
                      {...x}
                      fetchDetail={scanner.fetchDetail}
                      key={x.id}
                    />
                  ))
                ) : (
                  <Col className="text-center">
                    <h3 className="text-secondary mt-3">
                      No scanner connected
                    </h3>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};
