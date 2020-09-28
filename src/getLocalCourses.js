const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const cheerio = require("cheerio");
const Db = require("./db");
const db = new Db("golf-scrape.db");

router.use("/", async (req, res) => {
  //   console.log(req.query);

  let { locationData } = await (await axios.get(`${process.env.URL}/api/v1/zip?zip=${req.query.zip}`)).data;

  db.getByZip(locationData.zip_code, async (err, rows) => {
    if (err) {
      return console.error(err);
    }

    let courses = [];

    if (rows.length > 0) {
      console.log("No need to hit golflink");
      //   console.log(rows);
      return res.json({
        message: "Get courses",
        courses: rows,
        locationData,
      });
    } else {
      console.log("Need to hit golflink");
      let { data } = await axios({
        method: "GET",
        url: "https://www.golflink.com/golf-courses/course-directory.aspx",
        params: {
          t: `${locationData.city}, ${locationData.state}`,
          lat: locationData.lat,
          lon: locationData.lng,
          within: "50",
        },
      });

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
          };
          axios.post(`${process.env.URL}/api/v1/course`, {
            slug: urlName,
            zip: locationData.zip_code,
          });
          courses.push(course);
        });

      return res.json({
        message: "Get courses",
        courses: courses,
        locationData,
      });
    }
  });
});

module.exports = router;
