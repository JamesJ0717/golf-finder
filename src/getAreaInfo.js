const express = require("express");
const router = express.Router();
const axios = require("axios");

const Db = require("./db");
const db = new Db("golf-scrape.db");

router.use("/", (req, res) => {
  // console.log(req.query);
  let zip = req.query.zip;
  db.getZip(zip, async (err, data) => {
    if (err) console.error(err.message);

    // console.log(data);

    if (data === undefined) {
      // console.log(zip);
      let response = await axios(`https://www.zipcodeapi.com/rest/${process.env.ZIP_API_KEY}/info.json/${zip}`);
      db.insertZip(
        [
          Number(response.data.zip_code),
          response.data.lat,
          response.data.lng,
          response.data.city.toLowerCase(),
          response.data.state.toLowerCase(),
        ],
        (err) => {
          if (err) return console.error(err);
        }
      );
      let locationData = response.data;
      return res.json({ locationData });
    } else {
      let locationData = data;
      return res.json({ locationData });
    }
  });
});

module.exports = router;
