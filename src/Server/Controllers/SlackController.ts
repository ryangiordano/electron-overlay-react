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
        const channelIdentifier = request.params.channelId;
        const responseObject = await this.getChannel(channelIdentifier);
        response.send(responseObject);
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

    this.router.get(
      `${this.path}/local-credentials`,
      async (_request, response) => {
        const credentials = this.getLocalCredentials();
        response.send(credentials);
      }
    );

    this.router.post(
      `${this.path}/local-credentials`,
      async (request, response) =>
        await this.setLocalCredentials(request, response)
    );

    this.router.get(
      `${this.path}/has-valid-tokens`,
      async (_request, response) => {
        const hasValidTokens = await this.hasValidTokens();
        response.send(hasValidTokens);
      }
    );

    this.router.get(`${this.path}/data`, async (_request, response) => {
      const data = await this.getSlackTeamData();
      response.send(data);
    });
  }

  private async getChannel(channelIdentifier: string) {
    const r: any = await this.slackContext.getChannels();
    const channel = r?.channels.find(
      (c: any) => c.id === channelIdentifier || c.name === channelIdentifier
    );
    if (channel) {
      return {
        success: true,
        channel,
      };
    } else {
      return {
        error: "This channel does not exist.",
        success: false,
      };
    }
  }

  private async getSlackTeamData() {
    const data: any = await this.slackContext.getSlackTeamData();
    const i = await data.info();
    return i;
  }

  private async getLocalCredentials() {
    const slackbotToken = await this.slackContext.getSlackBotUserOauthToken();
    const slackUserToken = await this.slackContext.getSlackUserOauthToken();
    const credentials = { slackbotToken, slackUserToken };
    return credentials;
  }

  private async setLocalCredentials(request: any, response: any) {
    try {
      await this.slackContext.setSlackUserOauthToken(
        request.body.slackUserToken
      );
      await this.slackContext.setSlackBotUserOauthToken(
        request.body.slackbotToken
      );
    } catch (err) {
      return response.send({ error: err, success: false });
    }
    return response.send({ success: true });
  }

  private async hasValidTokens() {
    return await this.slackContext.hasValidTokens();
  }
}
