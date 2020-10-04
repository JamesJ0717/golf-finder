import React, { useState } from "react";
import { Button, Col, FormControl, ProgressBar, Row, Table, Toast } from "react-bootstrap";
import Select from "react-select";

export const Home = () => {
  const [done, setDone] = useState(true);
  const [zip, setZip] = useState(null);
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [scorecardError, setScorecardError] = useState(false);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);

  const [showA, setShowA] = useState(true);
  const toggleShowA = () => {
    setShowA(!showA);
    setError(null);
  };

  const pad = { padding: "1em" };

  let getCourses = async (zip) => {
    console.log(zip);
    setDone(false);
    setCourse(null);
    setCourses(null);
    setCourseList(null);
    setError(null);
    setShowA(true);
    // console.log(this.zip);
    try {
      let res = await fetch(`/api/v1/courses?zip=${zip}`);
      let body = await res.json();
      console.log(body);
      if (body.courses === undefined) {
        setError(body.error.error);
        throw new Error(body.error.error.message);
      } else {
        setCourses(body.courses);
      }

      const funcCourseList = [];
      for (let i = funcCourseList.length - 1; i >= 0; i--) {
        funcCourseList.pop();
      }

      body.courses.forEach((course) => {
        funcCourseList.push({ value: course.slug, label: course.name });
      });
      setCourseList(funcCourseList);

      setDone(true);
      setError(false);
      setZip(null);
    } catch (error) {
      console.error(error);
      setDone(true);
    }
  };

  let chooseCourse = async (slug) => {
    console.log(slug);
    let res = await fetch(`/api/v1/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: slug.value }),
    });
    let body = await res.json();
    console.log(body);

    setCourse(body.course[0]);
    let scorecardhtml = "" + body.course[0].scorecardhtml;
    setScorecardError(scorecardhtml.includes("Error"));
  };

  return (
    <div style={pad}>
      {error ? (
        <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{error.message}</Toast.Body>
        </Toast>
      ) : (
        <Row className="justify-content-center">
          <Col sm={12} style={pad}>
            <Row>
              <Col sm={12} lg={4} style={pad}>
                <FormControl
                  isValid={valid}
                  onKeyDown={(e) => {
                    var key = e.which ? e.which : e.keyCode;
                    if (
                      (e.target.value.length >= 5 &&
                        key !== 8 &&
                        key !== 37 &&
                        key !== 38 &&
                        key !== 39 &&
                        key !== 40) ||
                      key === 18 ||
                      key === 189 ||
                      key === 229
                    ) {
                      e.preventDefault();
                      setValid(false);
                    }
                  }}
                  onKeyUp={(e) => {
                    setZip(e.target.value);
                    setValid(true);
                  }}
                  required
                  type="number"
                  placeholder="ZIP"
                  style={{ textAlign: "center" }}
                />
              </Col>
              <Col sm={12} lg={8} style={pad}>
                <Button block type="submit" onClick={() => getCourses(zip)}>
                  Find Courses
                </Button>
              </Col>
            </Row>
          </Col>

          {done ? (
            <> </>
          ) : (
            <Col sm={12} style={pad}>
              <ProgressBar animated now={100} />
            </Col>
          )}

          {courses ? (
            <Col sm={12} style={pad}>
              <Row id="courseSelect">
                <Col sm={12}>
                  <Select
                    id="courses"
                    style={{ width: "100%" }}
                    options={courseList}
                    onChange={(value) => chooseCourse(value)}
                  ></Select>
                </Col>
              </Row>
            </Col>
          ) : (
            <Col sm={12}> </Col>
          )}

          {course ? (
            <Col sm={12} style={pad}>
              <Row id="courseInfo">
                <Col sm={12} style={{ width: window.innerWidth, overflow: "hidden", textOverflow: "ellipsis" }}>
                  <h2>{course.name}</h2>
                  <a target="_blank" rel="noopener noreferrer" href={course.url}>
                    {course.url}
                  </a>
                </Col>
              </Row>
              <div className="divider"></div>
              <Row id="scorecardDiv">
                <Col sm={12}>
                  {scorecardError ? (
                    <h4>There was an error reading the scorecard.</h4>
                  ) : (
                    <>
                      <h4>Scorecard</h4>
                      <Table
                        striped
                        responsive
                        id="scorecard"
                        dangerouslySetInnerHTML={{ __html: course.scorecardhtml }}
                      ></Table>
                      <span>* The data in the scorecard above may be out of date.</span>
                    </>
                  )}
                </Col>
              </Row>
            </Col>
          ) : (
            <Col sm={12}> </Col>
          )}
        </Row>
      )}
    </div>
  );
};
