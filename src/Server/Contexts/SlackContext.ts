import { WebClient } from "@slack/web-api";
import fs from "fs";
import * as path from "path";

interface LocalSlackTokens {
  SLACK_BOT_USER_OAUTH_TOKEN?: string;
  SLACK_USER_OAUTH_TOKEN?: string;
}
export default class SlackContext {
  async buildWebClient() {
    const d = await this.getLocalSlackData();
    if (d?.SLACK_USER_OAUTH_TOKEN) {
      const webClient = new WebClient(d?.SLACK_USER_OAUTH_TOKEN);
      return webClient;
    }
    return null;
  }

  async getLocalSlackData(): Promise<LocalSlackTokens> {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "../Data/local-slack-data.json"),
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            const d = JSON.parse(data);
            resolve(d);
          }
        }
      );
    });
  }

  async getUsers() {
    const webClient = await this.buildWebClient();
    const users = await webClient?.users?.list();
    return users;
  }
  async getChannels() {
    const webClient = await this.buildWebClient();

    const channels = await webClient?.conversations?.list();
    return channels;
  }
  async getCustomEmojis() {
    const webClient = await this.buildWebClient();
    const emojis = await webClient?.emoji?.list();
    return emojis;
  }

  private async setLocalData(value: string, property: string) {
    return new Promise(async (resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "../Data/local-slack-data.json"),
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            const jsonData = JSON.parse(data);
            jsonData[property] = value;
            fs.writeFile(
              path.join(__dirname, "../Data/local-slack-data.json"),
              JSON.stringify(jsonData),
              null,
              () => {
                resolve();
              }
            );
          }
        }
      );
    });
  }

  registerWebClient() {}

  async getSlackBotUserOauthToken() {
    const localData = await this.getLocalSlackData();
    return localData?.SLACK_BOT_USER_OAUTH_TOKEN;
  }

  async setSlackBotUserOauthToken(value: string) {
    return this.setLocalData(value, "SLACK_BOT_USER_OAUTH_TOKEN");
  }

  async getSlackUserOauthToken() {
    const localData = await this.getLocalSlackData();
    return localData?.SLACK_USER_OAUTH_TOKEN;
  }

  async setSlackUserOauthToken(value: string) {
    return this.setLocalData(value, "SLACK_USER_OAUTH_TOKEN");
  }

  async hasValidTokens() {
    const webClient = await this.buildWebClient();
    if (webClient) {
      const results = await webClient?.auth.test();
      return Boolean(results?.ok);
    } else {
      return false;
    }
  }
}
