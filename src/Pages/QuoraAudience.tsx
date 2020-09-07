import React from "react";
import debounce from "lodash/debounce";
import EmojiImage from "../Components/EmojiImage";
import { EmojiShortnameDict } from "../Shared/Emojis";
import AudienceStage from "../Components/AudienceStage";

import parse from "html-react-parser";
import { RouteComponentProps } from "react-router-dom";
import QuoraAudienceContext from "../Shared/QuoraAudienceContext";
import { FullScreenContext } from "../Components/FullScreenContext/FullScreenContext";
import SlackService from "../Services/SlackService";

export interface QuoraAudienceState {
  reactions: any[];
  messages: any[];
  reactionCount: number;
  fullScreenMode: boolean;
}

interface QuoraAudienceProps {
  channelId: string;
}

export const emojiFromUnicodeReaction = (reaction: string) => {
  let el = [
    <React.Fragment key={Math.random() * 1000}>
      {parse(EmojiShortnameDict[reaction] || "")}
    </React.Fragment>,
  ];
  if (reaction.indexOf("::") > -1) {
    el = reaction
      .split("::")
      .map((r) => (
        <React.Fragment key={Math.random() * 1000}>
          {parse(EmojiShortnameDict[r] || "")}
        </React.Fragment>
      ));
  }
  return <div style={{ height: "15px", width: "15px" }}>{el}</div>;
};

export default class QuoraAudience extends React.Component<
  RouteComponentProps<QuoraAudienceProps>,
  QuoraAudienceState
> {
  private emojis: any;
  private users: any;
  private slackService: SlackService;
  constructor(props: any) {
    super(props);
    this.state = {
      reactions: [],
      messages: [],
      fullScreenMode: false,
      reactionCount: 0,
    };
    this.slackService = new SlackService();
  }

  async componentDidMount() {
    // const response = await axios.get(
    //   `${process.env.REACT_APP_ENDPOINT}/api/register_channel/${this.props.match.params.channelId}`
    // );
    // const socket = io();
    // socket.on("message", (message: string) => {
    //   console.log(`message event: ${message}`);
    // });
    // socket.on("slack event", (data: any) => {
    //   console.log(`slack event: ${JSON.stringify(data)}`);
    //   switch (data.type) {
    //     case "reaction_added":
    //       data.reaction && this.addReaction(data.reaction);
    //       break;
    //     case "message":
    //       data.text && data.user && this.addMessage(data.text, data.user);
    //       break;
    //   }
    // });
    // socket.emit("join", window.slack_channel || response.data);\

    const ws = new WebSocket("ws://localhost:5003/", "echo-protocol");

    ws.onerror = function () {
      console.log("Connection Error");
    };

    ws.onopen = function () {
      console.log("WebSocket Client Connected");
    };

    ws.onclose = function () {
      console.log("echo-protocol Client Closed");
    };

    ws.onmessage = (e) => {
      if (typeof e.data === "string") {
        const d = JSON.parse(e.data);
        if (d?.type === "reaction_added") {
          this.addReaction(JSON.parse(e.data)?.reaction);
        } else if (d?.type === "message") {
          d.text && d.user && this.addMessage(d.text, d.user);
        }
      }
    };

    // TODO(rgiordano): Cache this
    const emojis = await this.slackService.getEmojis();
    this.emojis = emojis;
    // TODO(rgiordano): Cache this
    const users = await this.slackService.getUsers();
    this.users = users;
  }

  private isSlackEmoji(key: string) {
    const k = key.split("::")[0];
    return Boolean(EmojiShortnameDict[k]);
  }

  private addReaction(reaction: string) {
    const key = reaction;
    console.log(key)
    console.log(this.emojis)
    const emoji =
      this.emojis && this.emojis[key] ? (
        <EmojiImage src={this.emojis[key]} />
      ) : this.isSlackEmoji(key) ? (
        emojiFromUnicodeReaction(reaction)
      ) : (
        <EmojiImage src={this.emojis["slowpoke"]} />
      );
    this.setState((prevState) => {
      const count = prevState.reactionCount + 1;
      return {
        reactionCount: count,
        reactions: [
          ...prevState.reactions,
          {
            emoji,
            key: count,
          },
        ],
      };
    });
  }

  private replaceSlackContent(text: string): string {
    const re = /<([#@]|!(subteam\^)?)?(.+?)(?:\|(.+?))?>/g;
    return text.replace(re, (match, formatType, _subteam, content, label) => {
      // Using rules as described in https://api.slack.com/reference/surfaces/formatting#retrieving-messages
      if (label) {
        // Slack-provided labels tell us how to display some content without having to do a lookup.
        // Most special Slack mentions will start with an "@".
        let prefix = "@";
        if (formatType === undefined) {
          // Links will not have a special starting character.
          prefix = "";
        } else if (formatType === "#") {
          // Channel mentions will start with "#".
          prefix = "#";
        }
        return `${
          formatType === "#" ? "#" : formatType === undefined ? "" : "@"
        }${label}`;
      }
      switch (formatType) {
        case "@": {
          // Format user @mentions if the user exists in our cache.
          return this.users[content] ? `@${this.users[content].name}` : match;
        }
        case "!": {
          // Format special mentions like @here.
          return `@${content}`;
        }
        case undefined: {
          // Links are presented as is.
          return content;
        }
      }
      // Currently not supporting unlabeled subteams or channels.
      return match;
    });
  }

  private addMessage(content: string, uid: string) {
    const n = this.replaceSlackContent(content);
    const userName = this.users ? this.users[uid]?.name : null;
    const prevState = this.state;

    prevState.messages.unshift({
      key: `${Date.now() / 100}`,
      content: userName ? `${userName}: ${n}` : n,
    });
    if (prevState.messages.length > 6) {
      prevState.messages.splice(6);
    }

    this.setState({
      messages: [...prevState.messages],
    });
  }

  private clearReactions = debounce(() => {
    this.setState({ reactions: [] });
  }, 5000);

  render() {
    return (
      <FullScreenContext.Consumer>
        {({ toggleFullScreen, fullScreenMode }) => (
          <QuoraAudienceContext.Provider
            value={{ emojis: EmojiShortnameDict, quoraEmojis: this.emojis }}
          >
            {!fullScreenMode ? (
              <button
                onClick={() => {
                  toggleFullScreen();
                  // this.toggleFullScreenMode(!this.state.fullScreenMode);
                }}
              >
                Click me
              </button>
            ) : null}
            <AudienceStage
              reactions={this.state.reactions}
              onRemove={() => {
                this.clearReactions();
              }}
              messages={this.state.messages}
            />
          </QuoraAudienceContext.Provider>
        )}
      </FullScreenContext.Consumer>
    );
  }
}
