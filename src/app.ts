require("dotenv").config;
import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import router from "./routes";

const app = express();
app.use(router);

const port = config.get("port");

app.listen(port, async () => {
  logger.info(`App started at port:https://localhost:${port}`);
  await connect();
});
