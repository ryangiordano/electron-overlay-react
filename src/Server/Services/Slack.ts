import { createEventAdapter } from "@slack/events-api";
import SlackEventAdapter from "@slack/events-api/dist/adapter";
import { Server } from "ws";

export class Slack {
  private slackEvents: SlackEventAdapter;
  private wss: Server;
  private clientSocket: any;
  constructor(token: string) {
    this.slackEvents = createEventAdapter(token);
    this.wss = new Server({
      port: 5003,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024, // Size (in bytes) below which messages
        // should not be compressed.
      },
    });
    this.wss.on("connection", (ws) => {
      this.clientSocket = ws;
      ws.on("message", function incoming(message) {
        console.log("received: %s", message);
      });
      ws.on("close", () => {
        console.log("ws closed");
      });
    });
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
    if (this.clientSocket) {
      this.clientSocket.send(data);
    }
  }

  private handleMessage(data: any) {
    console.log(data);
    if (this.clientSocket) {
      this.clientSocket.send(data);
    }
  }

  private handleUserChange(data: any) {
    console.log(data);
    if (this.clientSocket) {
      this.clientSocket.send(data);
    }
  }

  public getRequestListener() {
    return this.slackEvents.requestListener();
  }
}
