import { RTMClient } from '@slack/rtm-api';
import { Server } from 'ws';

export class Slack {
  private slackEvents: RTMClient;

  private wss: Server;

  private clientSockets: Map<string, WebSocket> = new Map([]);

  constructor(token: string) {
    this.slackEvents = new RTMClient(token);
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
    this.wss.on('connection', (ws: any) => {
      const uid = new Date().toString();

      this.clientSockets.set(uid, ws);

      ws.on('close', () => {
        this.clientSockets.delete(uid);
      });
    });
  }

  public async initialize() {
    this.slackEvents.on('reaction_added', (d) => this.handleReactionAdded(d));

    this.slackEvents.on('message', (d) => this.handleMessage(d));

    this.slackEvents.on('user_change', (d) => this.handleUserChange(d));
    await this.slackEvents.start();
  }

  private handleReactionAdded(data: any) {
    console.log(data);
    if (this.clientSockets.size) {
      this.clientSockets?.forEach((ws) => {
        ws.send(JSON.stringify(data));
      });
    }
  }

  private handleMessage(data: any) {
    if (this.clientSockets.size) {
      this.clientSockets?.forEach((ws) => {
        ws.send(JSON.stringify(data));
      });
    }
  }

  private handleUserChange(data: any) {
    if (this.clientSockets.size) {
      this.clientSockets?.forEach((ws) => {
        ws.send(JSON.stringify(data));
      });
    }
  }
}
