import * as express from "express";
import SlackContext from "../Contexts/SlackContext";

export default class SlackController {
  public path = "/slack";
  public router = express.Router();
  private slackContext: SlackContext;

  constructor() {
    this.intializeRoutes();
    this.slackContext = new SlackContext();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/`, (request, response) => {
      return response.send("Great");
    });
  }
}
