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
}
