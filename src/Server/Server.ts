import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as cors from "cors";
import SlackController from "./Controllers/SlackController";

export const createServer = () => {
  const expressApp = express();
  expressApp.use(bodyParser.json());
  expressApp.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  // Serve the static files from the React expressApp
  expressApp.use(express.static(path.join(__dirname, "client/")));

  // ===================================
  // CORS
  // ===================================
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

  expressApp.listen(5000, () => {
    console.log("Listening on 5000");
  });
};
