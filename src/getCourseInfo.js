const express = require("express");
const router = express.Router();

const axios = require("axios").default;
const cheerio = require("cheerio");
const Db = require("./db");
const db = new Db("golf-scrape.db");

router.use("/", (req, res) => {
  //   console.log(req.body);

  db.getByCourse(req.body.slug, async (err, data) => {
    if (err) console.error(err.message);
    // console.log(data);

    if (data) {
      //   console.log(data);
      res.json({ message: "Get course info", course: data });
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
      let table = $$(".scorecardtable");
      let par;
      let tees = [];
      table.find("tr[id*=uxParRow]").each((j, col) => {
        const $col = $$(col);
        par = $col.find("span[id*=uxParTotal]").text();
      });
      table.find("tr[id*=uxTeeRow]").each((j, col) => {
        let tee = { rating: 0, slope: 0 };
        const $col = $$(col);
        tee.name = $col.find("span[id*=uxTeeName]").text();
        tee.rating =
          $col.find("span[id*=uxRating]").text() === "N/A" ? "N/A" : Number($col.find("span[id*=uxRating]").text());
        tee.slope = Number($col.find("span[id*=uxSlope]").text());
        tee.yardage = Number($col.find("span[id*=uxTotal]").text());
        tees.push(tee);
      });

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
      //   console.log(info);
      db.insertCourse(
        [info.name, info.slug, info.url, info.par, info.tees, info.zip, info.dbID, info.scorecardUrl],
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
