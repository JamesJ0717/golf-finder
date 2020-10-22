import { useState } from "react";
import { Button, Col, FormControl, ProgressBar, Row, Toast } from "react-bootstrap";
import Select from "react-select";
import Course from "../../pages/api/Types/Course";
import { OptionType } from "../../pages/api/Types/OptionType";
import CourseInfo from "./CourseInfo";

export default function Home() {
  const [done, setDone] = useState(true);
  const [zip, setZip] = useState<Number>(0);
  const [course, setCourse] = useState<Course | null>();
  const [courses, setCourses] = useState<Course[] | null>();
  const [courseList, setCourseList] = useState<{ value: string; label: string }[]>([{ value: "", label: "" }]);
  const [scorecardError, setScorecardError] = useState(false);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");

  const [showA, setShowA] = useState(false);
  const toggleShowA = () => {
    setShowA(false);
    setError("");
  };

  const pad = { padding: "1em" };

  let getCourses = async (zip: Number) => {
    console.log(zip);
    setDone(false);
    setCourse(null);
    setCourses(null);
    setError("");
    setShowA(false);
    // console.log(this.zip);
    try {
      let res = await fetch(`/api/v1/courses?zip=${zip}`);
      let body = await res.json();
      console.log(body);
      if (body.courses === undefined) {
        if (body.error.error.code === "53300") {
          setError("Too many connections to DB");
        }
        setError(body.error.error.error_msg);
        setShowA(true);
        throw new Error(body);
      } else {
        setCourses(body.courses);
      }

      const funcCourseList: { value: string; label: string }[] = [];
      for (let i = funcCourseList.length - 1; i >= 0; i--) {
        funcCourseList.pop();
      }

      body.courses.forEach((course: Course) => {
        funcCourseList.push({ value: course.slug, label: course.name });
      });
      setCourseList(funcCourseList);

      setDone(true);
      setError("");
    } catch (error) {
      console.error(error);
      setDone(true);
      setShowA(true);
    }
  };

  let chooseCourse = async (slug: string) => {
    if (slug !== null && slug !== undefined) {
      console.log(slug);
      let res = await fetch(`/api/v1/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: slug }),
      });
      let body = await res.json();
      console.log(body);

      setCourse(body.course[0]);
      let scorecardhtml = "" + body.course[0].scorecardhtml;
      setScorecardError(scorecardhtml.includes("Error"));
    }
  };
  // console.log(error);
  return (
    <Row>
      <Col sm={12} style={pad}>
        <Row>
          <Col sm={12} lg={4} style={pad}>
            <FormControl
              isValid={valid}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                var key = e.which ? e.which : e.keyCode;
                if (
                  ((e.target as HTMLInputElement).value.length >= 5 &&
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
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                setZip(Number((e.target as HTMLInputElement).value));
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
                onChange={(selectedOption: OptionType) => {
                  if (selectedOption) chooseCourse((selectedOption as OptionType).value);
                }}
              ></Select>
            </Col>
          </Row>
        </Col>
      ) : (
        <Col sm={12}> </Col>
      )}

      {course ? (
        <>
          <Col sm={12}>
            <CourseInfo style={pad} course={course} scorecardError={scorecardError} />
          </Col>
        </>
      ) : (
        <Col sm={12}> </Col>
      )}

      <Toast show={showA} onClose={toggleShowA} style={{ position: "absolute", bottom: 25, right: 25 }}>
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast>
    </Row>
  );
}
