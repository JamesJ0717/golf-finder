const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const getLocalCourses = require("./src/getLocalCourses");
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

app.use("/api/v1/zip", getAreaInfo);
app.use("/api/v1/courses", getLocalCourses);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at ${process.env.URL}!`);
});
