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
    this.slackContext = new SlackContext();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/channels`, async (_request, response) => {
      const channels = await this.slackContext.getChannels();
      return response.send(channels);
    });

    this.router.get(
      `${this.path}/channels/:channelId`,
      async (request, response) => {
        const r: any = await this.slackContext.getChannels();
        const identifier = request.params.channelId;
        const channel = r.channels.find(
          (c: any) => c.id === identifier || c.name === identifier
        );
        if (channel) {
          return response.send({
            success: true,
            channel,
          });
        } else {
          return response.send({
            error: "This channel does not exist.",
            success: false,
          });
        }
      }
    );

    this.router.get(`${this.path}/users`, async (_request, response) => {
      const users = await this.slackContext.getUsers();
      return response.send(users);
    });

    this.router.get(`${this.path}/emoji`, async (_request, response) => {
      const emoji = await this.slackContext.getCustomEmojis();
      return response.send(emoji);
    });
  }
}
