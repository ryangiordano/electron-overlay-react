import * as express from "express";
import SlackContext from "../Contexts/SlackContext";

/**
 * For authenticating with slack, getting values such as users and custom emojis from slack.
 */
export default class SlackController {
  public path = "/slack";
  public router = express.Router();
  private slackContext: SlackContext;

  constructor() {
    this.intializeRoutes();
    this.slackContext = new SlackContext();
  }

  public intializeRoutes() {
    this.router.post(`${this.path}/`, (request, response) => {
      return response.send(request.body.challenge);
    });
  }
}
