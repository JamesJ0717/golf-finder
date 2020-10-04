import express from "express";
import axios from "axios";
import Db from "./db";
import Area from "./Types/Area";

const router = express.Router();
const db = new Db();

router.get("/", (req, res) => {
  // console.log(req.query);
  let zip: Number = Number(req.query.zip);
  db.getZip(zip, async (err, data) => {
    if (err) {
      console.error(err.message);
      return res.json({ error: err });
    }

    // console.log(data);

    if (data.rowCount === 0) {
      // console.log(zip);
      try {
        let response = await axios(`https://www.zipcodeapi.com/rest/${process.env.ZIP_API_KEY}/info.json/${zip}`);
        let area: Area = {
          zip: Number(response.data.zip_code),
          lat: response.data.lat,
          lng: response.data.lng,
          city: response.data.city.toLowerCase(),
          state: response.data.state.toLowerCase(),
        };
        db.insertZip(area, (err) => {
          if (err) return console.error(err.message);
        });
        return res.json({ area });
      } catch (err) {
        console.error(err.message);
        return res.json({ error: err });
      }
    } else {
      // console.log(data.rows);
      let locationData = data.rows;
      return res.json({ locationData });
    }
  });
});

module.exports = router;
