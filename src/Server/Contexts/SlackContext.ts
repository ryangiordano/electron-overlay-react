import { WebClient } from "@slack/web-api";

export default class SlackContext {
  private webClient: WebClient;
  constructor() {
    const token = process?.env?.SLACK_USER_OAUTH_TOKEN;
    this.webClient = new WebClient(token);
  }

  async getUsers() {
    const users = await this.webClient.users.list();
    return users;
  }
  async getChannels() {
    const channels = await this.webClient.conversations.list();
    return channels;
  }
  async getCustomEmojis() {
    const emojis = await this.webClient.emoji.list();
    return emojis;
  }
}
