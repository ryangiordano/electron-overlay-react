/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import SlackContext from '../Contexts/SlackContext';
import Slack from '../Services/Slack';

/**
 * For authenticating with slack, getting values such as users and custom emojis from slack.
 */
export default class SlackController {
  public path = '/slack';

  public router = express.Router();

  private slack: Slack | undefined;

  private slackContext: SlackContext | undefined;

  constructor() {
    this.intializeRoutes();
  }

  private async getChannels() {
    const channels: any[] =
      (await this.slackContext?.getCachedChannels()) ?? [];
    return {
      success: true,
      channels: channels || [],
    };
  }

  public async initializeContext() {
    this.slackContext = new SlackContext();
    await this.slackContext.initialize();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/channels`, async (_request, response) => {
      const channels = await this.getChannels();
      return response.send(channels);
    });

    /** Search through the cached channels for channels that contain the search parameter */
    this.router.get(
      `${this.path}/channels/:searchString`,
      async (request, response) => {
        const { searchString } = request.params;

        const { channels } = await this.getChannels();
        const r = channels?.filter((c) => c.name.includes(searchString));
        return response.send({
          success: true,
          channels: r,
        });
      }
    );

    /** Get a single channel by the channel name/id */
    this.router.get(
      `${this.path}/channels/channel/:channelId`,
      async (request, response) => {
        const channelIdentifier = request.params.channelId;
        const responseObject = await this.getChannel(channelIdentifier);
        response.send(responseObject);
      }
    );

    this.router.get(`${this.path}/users`, async (_request, response) => {
      const users = await this.slackContext?.getUsers();
      return response.send(users);
    });

    this.router.get(`${this.path}/emoji`, async (_request, response) => {
      const emoji = await this.slackContext?.getCustomEmojis();
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
      async (request, response) => {
        await this.setLocalCredentials(request, response);
        await this.createSlackWebsocketConnection();
      }
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

  private async getChannel(channelIdentifier: string): any {
    const { channels } = await this.getChannels();
    const channel = channels.find(
      (c) => c.name === channelIdentifier || c.id === channelIdentifier
    );
    if (channel) {
      return {
        success: true,
        channel,
      };
    }
    return {
      success: false,
      message: `Channel: ${channelIdentifier} not found`,
    };
  }

  private async getSlackTeamData() {
    const data: any = await this.slackContext?.getSlackTeamData();
    const i = await data.info();
    return i;
  }

  public async getLocalCredentials() {
    const slackbotToken = await this.slackContext?.getSlackBotUserOauthToken();
    const slackUserToken = await this.slackContext?.getSlackUserOauthToken();
    const credentials = { slackbotToken, slackUserToken };
    return credentials;
  }

  private async setLocalCredentials(request: any, response: any) {
    try {
      await this.slackContext?.setSlackUserOauthToken(
        request.body.slackUserToken
      );
      await this.slackContext?.setSlackBotUserOauthToken(
        request.body.slackbotToken
      );
    } catch (err) {
      return response.send({ error: err, success: false });
    }
    return response.send({ success: true });
  }

  public async hasValidTokens() {
    return await this.slackContext?.hasValidTokens();
  }

  public async createSlackWebsocketConnection() {
    const credentials = await this.getLocalCredentials();
    if (credentials?.slackbotToken) {
      this.slack = new Slack(credentials?.slackbotToken);
      this.slack.initialize();
    }
  }
}
