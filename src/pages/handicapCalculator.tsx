import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function HandicapCalculator() {
  const pad = { padding: "1em" };

  const [playerIndex, setPlayerIndex] = useState(0);
  const [courseSlope, setCourseSlope] = useState(0);
  const [courseHandicap, setCourseHandicap] = useState(0);

  let calcHandicap = () => {
    //Course Handicap = (Handicap Index) X (Slope Rating**) ÷ 113
    setCourseHandicap(Number(((playerIndex * courseSlope) / 113).toFixed(1)));
  };
  return (
    <>
      <h4>Calculate Course Handicap</h4>
      <Row>
        <Col sm={12} lg={2} style={pad}>
          <Form.Control
            type="number"
            id="playerIndex"
            style={{ textAlign: "center" }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              setPlayerIndex(Number((e.target as HTMLInputElement).value));
            }}
          />
          <Form.Label>Your Index</Form.Label>
          {/* <span className="helper-text">Your Index</span> */}
        </Col>
        <Col sm={12} lg={2} style={pad}>
          <Form.Control
            type="number"
            name="courseSlope"
            id="courseSlope"
            style={{ textAlign: "center" }}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              setCourseSlope(Number((e.target as HTMLInputElement).value));
            }}
          />
          <Form.Label>Course Slope</Form.Label>
          {/* <span className="helper-text">Slope</span> */}
        </Col>
        <Col sm={12} lg={6} style={pad}>
          <Button onClick={() => calcHandicap()} block>
            Calculate Handicap
          </Button>
        </Col>
        <Col sm={12} lg={2} style={pad}>
          <p id="courseHandicap" style={{ textAlign: "center" }}>
            {courseHandicap}
          </p>
          <Form.Label>Course Index</Form.Label>
        </Col>
      </Row>
    </>
  );
}
