import "bootstrap/dist/css/bootstrap.css";

import { Container, Row, Col } from "react-bootstrap";
import Header from "./layouts/Header";

export default function index({ Component, props }) {
  const pad = { padding: "1em" };

  return (
    <>
      <Header></Header>
      <Container fluid>
        <Row className="justify-content-center">
          <Col sm={12} md={6} lg={10} style={pad}>
            <Component {...props} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
