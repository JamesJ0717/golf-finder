const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const cheerio = require("cheerio");
const Db = require("./db");
const db = new Db("golf-scrape.db");

router.use("/", (req, res) => {
  console.log(req.body.slug);

  db.getByCourse(req.body.slug, async (err, data) => {
    if (err) console.error(err.message);
    // console.log(data);
    if (data) {
      console.log(data);
      res.json({ message: "Get course info", course: data });
    } else {
      let { data } = await axios.get(`https://www.golflink.com${req.body.slug}`);
      //   console.log(data);
      const $ = cheerio.load(data);
      let og = $("head > meta[property='og:url']").attr("content");
      let dbID = Number(og.split("=")[1]);
      //   console.log(dbID);
      let name = $("#aspnetForm > div.MainDiv > div.column_1 > div > div.coursedetail > h2").text().trim();

      let scorecardUrl = `https://www.golflink.com/golf-courses/popups/scorecard.aspx?c=${dbID}`;
      let scorecard = await (await axios.get(scorecardUrl)).data;
      //   console.log(scorecard);
      const $$ = cheerio.load(scorecard);
      let par = Number($$("span[id*='ParTotal']").text());
      //   console.log(par);
      let slope = Number($$("#uxScorecard18Hole_ctl01_uxSlope").text());
      //   console.log(slope);
      let yardage = Number($$("#uxScorecard18Hole_ctl01_uxTotal").text());
      //   console.log(yardage);

      let info = {
        name: name,
        slug: req.body.slug,
        par: par,
        yardage: yardage,
        slope: slope,
        dbID: dbID,
        scorecardUrl: scorecardUrl,
      };
      //   console.log(info);
      db.insertCourse(
        [info.name, info.slug, info.par, info.yardage, info.slope, , info.dbID, info.scorecardUrl],
        (err) => {
          if (err) console.error(err);
        }
      );
      res.json({
        message: "Get course info",
        course: info,
      });
    }
  });
});
module.exports = router;
