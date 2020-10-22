import { Col, Row, Table } from "react-bootstrap";
import Course from "../../pages/api/Types/Course";

export default function CourseInfo(props: { style: {}; course: Course; scorecardError: boolean }) {
  return (
    <Col sm={12} style={props.style}>
      <Row id="courseInfo">
        <Col sm={12} style={{ width: window.innerWidth, overflow: "hidden", textOverflow: "ellipsis" }}>
          <h2>{props.course.name}</h2>
          <a target="_blank" rel="noopener noreferrer" href={props.course.url}>
            {props.course.url}
          </a>
        </Col>
      </Row>
      <div className="divider"></div>
      <Row id="scorecardDiv">
        <Col sm={12}>
          {props.scorecardError ? (
            <h4>There was an error reading the scorecard.</h4>
          ) : (
            <>
              <h4>Scorecard</h4>
              <Table
                striped
                responsive
                id="scorecard"
                dangerouslySetInnerHTML={{
                  __html: props.course.scorecardhtml !== undefined ? props.course.scorecardhtml : "",
                }}
              />
              <span>* The data in the scorecard above may be out of date.</span>
            </>
          )}
        </Col>
      </Row>
    </Col>
  );
}
