const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const getLocalCourses = require("./src/getLocalCourses");
const getCourseInfo = require("./src/getCourseInfo");
const getAreaInfo = require("./src/getAreaInfo");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/api/v1/zip", getAreaInfo);
app.get("/api/v1/courses", getLocalCourses);
app.post("/api/v1/course", getCourseInfo);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
