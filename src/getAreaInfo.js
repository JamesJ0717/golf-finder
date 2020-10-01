const express = require("express");
const router = express.Router();
const axios = require("axios");

const Db = require("./db");
const db = new Db("golf-scrape.db");

router.get("/", (req, res) => {
  // console.log(req.query);
  let zip = req.query.zip;
  db.getZip(zip, async (err, data) => {
    if (err) {
      console.error(err.message);
      return res.json({ error: err });
    }

    // console.log(data);

    if (data.rowCount === 0) {
      // console.log(zip);
      let response = await axios(`https://www.zipcodeapi.com/rest/${process.env.ZIP_API_KEY}/info.json/${zip}`);
      let area = {
        zip: Number(response.data.zip_code),
        lat: response.data.lat,
        lng: response.data.lng,
        city: response.data.city.toLowerCase(),
        state: response.data.state.toLowerCase(),
      };
      db.insertZip(area, (err) => {
        if (err) return console.error(err);
      });
      let locationData = response.data.locationData;
      return res.json({ locationData });
    } else {
      // console.log(data.rows);
      let locationData = data.rows;
      return res.json({ locationData });
    }
  });
});

module.exports = router;
