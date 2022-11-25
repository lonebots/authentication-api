require("dotenv").config();
import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const app = express();

app.use(express.json()); // the order of the middleware matters.
app.use(deserializeUser);// deserialize the users before using the routes.
app.use(router);


const port = config.get("port");

app.listen(port, async () => {
  logger.info(`App started at port:https://localhost:${port}`);
  await connect();
});
