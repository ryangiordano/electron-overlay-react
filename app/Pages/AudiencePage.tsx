/* eslint-disable no-nested-ternary */
import React from 'react';
import debounce from 'lodash/debounce';
import parse from 'html-react-parser';
import { RouteComponentProps } from 'react-router-dom';
import EmojiImage from '../Components/EmojiImage';
import { EmojiShortnameDict } from '../Shared/Emojis';
import AudienceStage from '../Components/AudienceStage';

import SlackService from '../Services/SlackService';
import WebSocketComponent from '../Features/WebSocket';
import AudienceContext from '../Shared/AudienceContext';

export interface AudiencePageState {
  reactions: { emoji: JSX.Element; key: number }[];
  messages: { key: string; content: string }[];
  reactionCount: number;
  focusChannel: SlackChannel | null;
}

interface AudiencePageProps {
  channelId: string;
}

const isSlackEmoji = (key: string) => {
  const k = key.split('::')[0];
  return Boolean(EmojiShortnameDict[k]);
};

export const emojiFromUnicodeReaction = (reaction: string) => {
  let el = [
    <React.Fragment key={Math.random() * 1000}>
      {parse(EmojiShortnameDict[reaction] || '')}
    </React.Fragment>,
  ];
  if (reaction.indexOf('::') > -1) {
    el = reaction
      .split('::')
      .map((r) => (
        <React.Fragment key={Math.random() * 1000}>
          {parse(EmojiShortnameDict[r] || '')}
        </React.Fragment>
      ));
  }
  return <div style={{ height: '15px', width: '15px' }}>{el}</div>;
};

export default class AudiencePage extends React.Component<
  RouteComponentProps<AudiencePageProps>,
  AudiencePageState
> {
  private emojis: any;

  private users: any;

  private slackService: SlackService;

  private clearReactions = debounce(() => {
    this.setState({ reactions: [] });
  }, 15000);

  constructor(props: any) {
    super(props);
    this.state = {
      reactions: [],
      messages: [],
      reactionCount: 0,
      focusChannel: null,
    };
    this.slackService = new SlackService();
  }

  async componentDidMount() {
    // TODO(rgiordano): Cache this
    const emojis = await this.slackService.getEmojis();
    this.emojis = emojis;
    // TODO(rgiordano): Cache this
    await this.fetchUsers();
    const { match } = this.props;
    const channel = await this.slackService.getChannel(match.params.channelId);
    this.setState({ focusChannel: channel });
  }

  private async fetchUsers() {
    const users = await this.slackService.getUsers();
    this.users = users;
  }

  private addReaction(reaction: string) {
    const key = reaction;
    const emoji =
      this.emojis && this.emojis[key] ? (
        <EmojiImage src={this.emojis[key]} />
      ) : isSlackEmoji(key) ? (
        emojiFromUnicodeReaction(reaction)
      ) : (
        <EmojiImage src={this.emojis.slowpoke} />
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
        let prefix = '@';
        if (formatType === undefined) {
          // Links will not have a special starting character.
          prefix = '';
        } else if (formatType === '#') {
          // Channel mentions will start with "#".
          prefix = '#';
        }
        return `${
          formatType === '#' ? '#' : formatType === undefined ? '' : '@'
        }${label}`;
      }
      switch (formatType) {
        case '@': {
          // Format user @mentions if the user exists in our cache.
          return this.users[content] ? `@${this.users[content].name}` : match;
        }
        case '!': {
          // Format special mentions like @here.
          return `@${content}`;
        }
        // Links are returned as is
        case undefined:
        default: {
          return content;
        }
      }
      // Currently not supporting unlabeled subteams or channels.
      return match;
    });
  }

  private addMessage(content: string, uid: string) {
    const n = this.replaceSlackContent(content);
    const userName = this.users
      ? this.users.find((u: any) => u.id === uid)?.name
      : null;

    this.setState((prevState) => {
      prevState.messages.unshift({
        key: `${Date.now() / 100}`,
        content: userName ? `${userName}: ${n}` : n,
      });
      if (prevState.messages.length > 6) {
        prevState.messages.splice(6);
      }
      return {
        messages: [...prevState.messages],
      };
    });
  }

  private handleWebsocketMessage(event: SlackEvent) {
    const { focusChannel } = this.state;
    if (event?.type === 'reaction_added') {
      const channelId = event.item.channel;
      if (focusChannel?.id === channelId) {
        this.addReaction(event?.reaction);
      }
    }

    if (event?.type === 'message') {
      const channelId = event.channel;
      if (focusChannel?.id === channelId && event.text && event.user) {
        this.addMessage(event.text, event.user);
      }
    }
  }

  render() {
    const { reactions, messages } = this.state;
    const { match } = this.props;

    return (
      <WebSocketComponent
        url="localhost:5003"
        onMessage={(e) => {
          if (typeof e.data === 'string') {
            const event: SlackEvent = JSON.parse(e.data);
            this.handleWebsocketMessage(event);
          }
        }}
      >
        {() => (
          <AudienceContext.Provider
            value={{ emojis: EmojiShortnameDict, quoraEmojis: this.emojis }}
          >
            <h1
              className="fade-out"
              style={{
                position: 'absolute',
                top: '50%',
                left: '40%',
                fontWeight: 'bold',
              }}
            >
              Now Streaming {match.params.channelId}
            </h1>
            <AudienceStage
              reactions={reactions}
              onRemove={() => this.clearReactions()}
              messages={messages}
            />
          </AudienceContext.Provider>
        )}
      </WebSocketComponent>
    );
  }
}
