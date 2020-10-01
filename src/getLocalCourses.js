const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const cheerio = require("cheerio");
const Db = require("./db");
const db = new Db("golf-scrape.db");

router.get("/", async (req, res) => {
  //   console.log(req.query);

  let resp = await (await axios.get(`${process.env.URL}/api/v1/zip?zip=${req.query.zip}`)).data;
  console.log(resp);
  let locationData = resp.locationData[0];
  // console.log(locationData);

  db.getByZip(locationData.zip_code, async (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.json({ error: err });
    }

    let courses = [];
    // console.log(rows.rows);

    if (rows.rowCount > 0) {
      console.log("No need to hit golflink");
      //   console.log(rows);
      return res.json({
        message: "Get courses",
        courses: rows.rows,
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
          axios.post(`${process.env.URL}/api/v1/courses`, {
            slug: urlName,
            zip: locationData.zip_code,
          });
          courses.push(course);
        });
      // console.log(courses);

      return res.json({
        message: "Get courses",
        courses: courses,
        locationData,
      });
    }
  });
});

router.post("/", (req, res) => {
  //   console.log(req.body);

  db.getByCourse(req.body.slug, async (err, data) => {
    if (err) {
      console.error(err.message);
      return res.json({ error: err });
    }

    // console.log(data.rows);
    if (data.rowCount > 0) {
      return res.json({ message: "Get course info from db", course: data.rows });
    } else {
      let { data } = await axios.get(`https://www.golflink.com${req.body.slug}`);
      //   console.log(data);

      const $ = cheerio.load(data);
      let og = $("head > meta[property='og:url']").attr("content");
      let dbID = Number(og.split("=")[1]);
      //   console.log(dbID);
      let name = $(".courseDetailH1").text().trim();
      let url = $(".popup.web-url").text().trim();

      let scorecardUrl = `https://www.golflink.com/golf-courses/popups/scorecard.aspx?c=${dbID}`;
      let scorecard = await (await axios.get(scorecardUrl)).data;
      //   console.log(scorecard);
      const $$ = cheerio.load(scorecard);
      let par;
      let table;
      if ($$("#body").children().length > 0) {
        table = $$(".scorecardtable").html().trim();
        console.log(table);
      } else {
        par = 0;
        table = "Error reading scorecard";
      }

      let info = {
        name: name,
        slug: req.body.slug,
        url: url,
        zip: Number(req.body.zip),
        dbID: dbID,
        scorecardUrl: scorecardUrl,
        scorecardHtml: table.trim(),
      };
      // console.log(info);
      db.insertCourse(info, (err, rows) => {
        if (err) {
          console.error(err);
          return err;
        }
        // console.log(rows.rows);
      });
      return res.json({
        message: "Get course info from golflink",
        course: info,
      });
    }
  });
});

module.exports = router;
