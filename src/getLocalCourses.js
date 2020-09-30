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
  console.log(locationData);

  db.getByZip(locationData.zip_code, async (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.json({ error: err });
    }

    let courses = [];
    console.log(rows.rows);

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

    console.log(data.rows);
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
      let tees = [];
      if ($$("#body").children().length > 0) {
        let table = $$(".scorecardtable");
        table.find("tr[id*=uxParRow]").each((j, col) => {
          const $col = $$(col);
          par = $col.find("span[id*=uxParTotal]").text();
        });
        table.find("tr[id*=uxTeeRow]").each((j, col) => {
          let tee = { name: "", rating: 0, slope: 0, yardage: 0 };
          const $col = $$(col);
          tee.name = $col.find("span[id*=uxTeeName]").text();
          tee.rating =
            $col.find("span[id*=uxRating]").text() === "N/A" ? "N/A" : Number($col.find("span[id*=uxRating]").text());
          tee.slope = Number($col.find("span[id*=uxSlope]").text());
          tee.yardage = Number($col.find("span[id*=uxTotal]").text());
          tees.push(tee);
        });
      } else {
        par = 0;
        tees = "Error retrieving scorecard";
      }

      let info = {
        name: name,
        slug: req.body.slug,
        url: url,
        par: par,
        tees: JSON.stringify(tees),
        zip: Number(req.body.zip),
        dbID: dbID,
        scorecardUrl: scorecardUrl,
      };
      // console.log(info);
      db.insertCourse(info, (err, rows) => {
        if (err) {
          console.error(err);
          return err;
        }
        console.log(rows.rows);
      });
      return res.json({
        message: "Get course info from golflink",
        course: info,
      });
    }
  });
});

module.exports = router;
