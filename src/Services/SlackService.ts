import axios from "axios";
export default class SlackService {
  private endPoint = `${process?.env?.REACT_APP_ENDPOINT}/api`;
  async getChannels() {
    const channels = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/channels`)
      : null;
    return channels;
  }

  async getUsers() {
    const response = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/users`)
      : null;
    return response?.data?.members;
  }

  async getEmojis() {
    const response = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/emoji`)
      : null;
    return response?.data?.emoji;
  }

  async getChannel(channelName: string) {
    const channel = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/channels/${channelName}`)
      : null;
    return channel?.data?.channel;
  }

  async getTeamInfo(): Promise<SlackInfo> {
    const channel = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/channels/data`)
      : null;
    return channel?.data;
  }

  /**
   * Confirms whether the user has registered valid
   * tokens with the application yet
   */
  async hasValidTokens() {
    const valid = this.endPoint
      ? await axios.get(`${this.endPoint}/slack/has-valid-tokens`)
      : null;
    return Boolean(valid?.data);
  }

  async setTokens(botToken: string | null, userToken: string | null) {
    const response = this.endPoint
      ? await axios.post(`${this.endPoint}/slack/local-credentials`, {
          slackUserToken: userToken,
          slackbotToken: botToken,
        })
      : null;
    return Boolean(response?.data?.success);
  }
}
