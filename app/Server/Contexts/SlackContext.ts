import { WebClient } from '@slack/web-api';
import { app } from 'electron';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { localSlackURL } from '../../Constants';

interface LocalSlackTokens {
  SLACK_BOT_USER_OAUTH_TOKEN?: string;
  SLACK_USER_OAUTH_TOKEN?: string;
}

export const fileExists = (url: string) => {
  return new Promise((resolve) => {
    fs.readFile(url, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const createSlackDataFile = (): Promise<LocalSlackTokens> => {
  return new Promise(async (resolve, reject) => {
    const data = {
      SLACK_BOT_USER_OAUTH_TOKEN: undefined,
      SLACK_USER_OAUTH_TOKEN: undefined,
    };
    await mkdirp(app?.getPath('userData'));
    fs.writeFile(localSlackURL(), JSON.stringify(data), function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const getLocalSlackData = (): Promise<LocalSlackTokens> => {
  return new Promise((resolve, reject) => {
    fs.readFile(localSlackURL(), 'utf8', async (err, data) => {
      if (err) {
        let credentials;
        try {
          credentials = await createSlackDataFile();
        } catch (err) {
          reject(err);
        }
        resolve(credentials);
      } else {
        const d = JSON.parse(data);
        resolve(d);
      }
    });
  });
};

export default class SlackContext {
  private channels = [];

  public getCachedChannels(): any[] {
    return this.channels;
  }

  async initialize() {
    const localDataExists = await fileExists(localSlackURL());
    if (!localDataExists) {
      await createSlackDataFile();
    }
    this.getChannels().then((channels) => {
      this.channels = channels;
    });
  }

  async buildWebClient() {
    const d = await getLocalSlackData();
    if (d?.SLACK_USER_OAUTH_TOKEN) {
      const webClient = new WebClient(d?.SLACK_USER_OAUTH_TOKEN);
      return webClient;
    }
    return null;
  }

  async getSlackTeamData() {
    const webClient = await this.buildWebClient();
    return webClient?.team;
  }

  async getUsers() {
    const webClient = await this.buildWebClient();
    const users = await webClient?.users?.list();
    return users;
  }

  private async getChannels(channels: any[] = [], nextCursor?: string): any {
    const r: any = await this.getChannelsInner(nextCursor);
    if (r?.channels?.length) {
      channels.push(...r?.channels);
    }
    if (r?.response_metadata?.next_cursor) {
      return this.getChannels(channels, r?.response_metadata?.next_cursor);
    }
    return channels;
  }

  async getChannelsInner(nextCursor?: string) {
    const webClient = await this.buildWebClient();
    const channels = await webClient?.conversations?.list({
      limit: 400,
      cursor: nextCursor || undefined,
    });
    return channels;
  }

  async getCustomEmojis() {
    const webClient = await this.buildWebClient();
    const emojis = await webClient?.emoji?.list();
    return emojis;
  }

  private async setLocalData(value: string, property: string) {
    return new Promise(async (resolve, _reject) => {
      fs.readFile(localSlackURL(), 'utf8', async (err, data) => {
        if (err) {
          await createSlackDataFile();
          this.setLocalData(value, property);
        } else {
          const jsonData = JSON.parse(data);
          jsonData[property] = value;
          fs.writeFile(localSlackURL(), JSON.stringify(jsonData), null, () => {
            resolve();
          });
        }
      });
    });
  }

  async getSlackBotUserOauthToken() {
    const localData = await getLocalSlackData();
    return localData?.SLACK_BOT_USER_OAUTH_TOKEN;
  }

  async setSlackBotUserOauthToken(value: string) {
    return this.setLocalData(value, 'SLACK_BOT_USER_OAUTH_TOKEN');
  }

  async getSlackUserOauthToken() {
    const localData = await getLocalSlackData();
    return localData?.SLACK_USER_OAUTH_TOKEN;
  }

  async setSlackUserOauthToken(value: string) {
    return this.setLocalData(value, 'SLACK_USER_OAUTH_TOKEN');
  }

  async hasValidTokens() {
    const webClient = await this.buildWebClient();
    if (webClient) {
      const results = await webClient?.auth.test();
      return Boolean(results?.ok);
    }
    return false;
  }
}
