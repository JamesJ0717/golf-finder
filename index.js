import express from "express";
import next from "next";
import cors from "cors";
import { json, text, urlencoded } from "body-parser";

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(json());
  server.use(text());
  server.use(
    urlencoded({
      extended: false,
    })
  );
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
});
