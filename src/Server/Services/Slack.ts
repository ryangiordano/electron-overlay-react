import { createEventAdapter } from "@slack/events-api";
import SlackEventAdapter from "@slack/events-api/dist/adapter";

export class Slack {
  private slackEvents: SlackEventAdapter;
  constructor(token: string) {
    this.slackEvents = createEventAdapter(token);
  }
  public async initialize() {
    this.slackEvents.on("reaction_added", (d) => this.handleReactionAdded(d));

    this.slackEvents.on("message", (d) => this.handleMessage(d));

    this.slackEvents.on("user_change", (d) => this.handleUserChange(d));
    await this.slackEvents.start(5001);
    console.log(`Listening for events on ${5001}`);
  }

  private handleReactionAdded(data: any) {
    console.log(data);
  }

  private handleMessage(data: any) {
    console.log(data);
  }

  private handleUserChange(data: any) {
    console.log(data);
  }

  public getRequestListener() {
    return this.slackEvents.requestListener();
  }
}
