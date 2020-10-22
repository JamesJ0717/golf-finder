import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Db from "../db";
import Area from "../Types/Area";

const db = new Db();
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query);
  let zip: Number = Number(req.query.zip);
  if (zip === 0) return res.json({ error: { message: "ZIP Code cannot be empty" } });
  db.getZip(zip, async (err, data) => {
    if (err) {
      console.error(err.message);
      // db.close();
      return res.json({ error: err });
    }

    // console.log(data);

    if (data.rowCount === 0) {
      // console.log(zip);
      try {
        let response = await axios(`https://www.zipcodeapi.com/rest/${process.env.ZIP_API_KEY}/info.json/${zip}`);
        console.log(response);
        let area: Area = {
          zip: Number(response.data.zip_code),
          lat: response.data.lat,
          lng: response.data.lng,
          city: response.data.city.toLowerCase(),
          state: response.data.state.toLowerCase(),
        };
        db.insertZip(area, (err) => {
          if (err) {
            console.error(err);
            // db.close();
            return res.json({ error: err });
          }
        });

        return res.json({ area });
      } catch (err) {
        console.error(err.response.data);

        // db.close();
        return res.json({ error: err.response.data });
      }
    } else {
      // console.log(data.rows);
      let locationData = data.rows;

      // db.close();
      return res.json({ locationData });
    }
  });
};

export default handler;
