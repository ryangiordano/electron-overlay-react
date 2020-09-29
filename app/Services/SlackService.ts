import axios from 'axios';
import { serverUrl } from '../Constants';

axios.defaults.adapter = require('axios/lib/adapters/http');

export default class SlackService {
  private endPoint = `${serverUrl}/api`;
  async getChannels() {
    const channels = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/channels`)
      : null;
    return channels?.data;
  }

  async getUsers() {
    const response = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/users`)
      : null;
    const data = await response?.data;
    return data?.members;
  }

  async getEmojis() {
    const response = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/emoji`)
      : null;
    const data = await response?.data;
    return data?.emoji;
  }

  async getChannel(channelName: string) {
    const channel = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/channels/${channelName}`)
      : null;
    const data = await channel?.data;

    return data?.channel;
  }

  async getTeamInfo(): Promise<SlackInfo> {
    const channel = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/channels/data`)
      : null;
    const data = await channel?.data;
    return data;
  }

  /**
   * Confirms whether the user has registered valid
   * tokens with the application yet
   */
  async hasValidTokens() {
    const valid = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/has-valid-tokens`)
      : null;
    const data = await valid?.data;

    return Boolean(data);
  }

  async setTokens(botToken: string | null, userToken: string | null) {
    const response = this.endPoint
      ? await axios.post(`${this.endPoint}/slack/local-credentials`, {
          slackUserToken: userToken,
          slackbotToken: botToken,
        })
      : null;
    const data = await response?.data;
    return Boolean(data?.success);
  }
}
