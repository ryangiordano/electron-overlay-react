import express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import cors from "cors";
import { Slack } from "./Services/Slack";
import SlackController from "./Controllers/SlackController";
const port = 5000;
export const createServer = () => {
  const expressApp = express();
  const secret = process?.env?.SLACK_BOT_USER_OAUTH_TOKEN;

  const slack = secret ? new Slack(secret) : null;
  if (slack) {
    slack.initialize();
  }

  expressApp.use(bodyParser.json());
  expressApp.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  // Serve the static files from the React expressApp
  expressApp.use(express.static(path.join(__dirname, "client/")));

  // // ===================================
  // // CORS
  // // ===================================
  if (process.env.NODE_ENV === "production") {
    expressApp.use(cors());
  } else {
    expressApp.use(
      cors({
        origin: "*",
      })
    );
  }

  expressApp.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, authorization, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    next();
  });

  const slackController = new SlackController();
  expressApp.use("/api", slackController.router);

  expressApp.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};
