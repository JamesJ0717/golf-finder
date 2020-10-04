import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export const HandicapCalculator = () => {
  const pad = { padding: "1em" };

  const [playerIndex, setPlayerIndex] = useState(0);
  const [courseSlope, setCourseSlope] = useState(0);
  const [courseHandicap, setCourseHandicap] = useState(0);

  let calcHandicap = () => {
    //Course Handicap = (Handicap Index) X (Slope Rating**) ÷ 113
    setCourseHandicap(((playerIndex * courseSlope) / 113).toFixed(1));
  };
  return (
    <div style={pad}>
      <h4>Calculate Course Handicap</h4>
      <Row className="justify-content-center">
        <Col sm={12} lg={2} style={pad}>
          <Form.Label>Your Index</Form.Label>
          <Form.Control
            type="number"
            id="playerIndex"
            style={{ textAlign: "center" }}
            onKeyUp={(e) => {
              setPlayerIndex(e.target.value);
            }}
          />
          {/* <span className="helper-text">Your Index</span> */}
        </Col>
        <Col sm={12} lg={2} style={pad}>
          <Form.Label>Course Slope</Form.Label>
          <Form.Control
            type="number"
            name="courseSlope"
            id="courseSlope"
            style={{ textAlign: "center" }}
            onKeyUp={(e) => {
              setCourseSlope(e.target.value);
            }}
          />
          {/* <span className="helper-text">Slope</span> */}
        </Col>
        <Col sm={12} lg={6} style={pad}>
          <Button onClick={() => calcHandicap()} block>
            Calculate Handicap
          </Button>
        </Col>
        <Col sm={12} lg={2} style={pad}>
          <Form.Label>Course Index</Form.Label>
          <p id="courseHandicap" style={{ textAlign: "center" }}>
            {courseHandicap}
          </p>
        </Col>
      </Row>
    </div>
  );
};
