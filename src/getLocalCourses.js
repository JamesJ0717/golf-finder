const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const cheerio = require("cheerio");

router.use("/", async (req, res) => {
  //   console.log(req.query);

  let locationData = await (await axios.get(`http://localhost:3000/api/v1/zip?zip=${req.query.zip}`)).data;
  let courses = await getLocalCourses(locationData);
  res.json({
    message: "Get courses",
    courses: courses,
    area: locationData,
  });
});

async function getLocalCourses(area) {
  //   console.log(area);
  let { data } = await axios({
    method: "GET",
    url: "https://www.golflink.com/golf-courses/course-directory.aspx",
    params: {
      t: `${area.locationData.city}, ${area.locationData.state}`,
      lat: area.locationData.lat,
      lon: area.locationData.lng,
      within: "50",
    },
  });

  let courses = [];

  const $ = cheerio.load(data);
  let elements = $("#search_result_container");
  elements
    .find("#search_result > div > div.course-heading > div > span.courseTitleKey > span:nth-child(1) > a")
    .each((i, element) => {
      const $element = $(element);
      let urlName = $element.attr("href").trim();
      let courseName = $element.text().trim();
      let course = {
        name: courseName,
        slug: urlName,
        par: undefined,
        yardage: undefined,
        slope: undefined,
        zip: undefined,
      };
      axios.post(`http://localhost:3000/api/v1/course`, {
        slug: urlName,
      });
      courses.push(course);
    });

  console.log(courses);
  return courses;
}

module.exports = router;
