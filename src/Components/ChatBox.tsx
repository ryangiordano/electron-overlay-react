import React from "react";
import anime from "animejs";
import { withQuoraAudienceContext } from "../Shared/QuoraAudienceContext";
import parse from "html-react-parser";

interface ChatboxProps {
  messages: any[];
  context?: any;
}

interface ChatboxState {
  visible: boolean;
  timeout: number | null;
}

class ChatBox extends React.Component<ChatboxProps, ChatboxState> {
  private chatBoxRef: any;

  constructor(props: ChatboxProps) {
    super(props);
    this.state = {
      visible: true,
      timeout: null,
    };
    this.chatBoxRef = React.createRef();
  }

  private fadeIn() {
    return anime({
      targets: this.chatBoxRef.current,
      easing: "easeInBack",
      duration: 1000,
      opacity: 1,
    });
  }

  private fadeOut() {
    return anime({
      targets: this.chatBoxRef.current,
      easing: "easeInBack",
      duration: 10000,
      opacity: 0,
    });
  }

  async componentDidUpdate(prevProps: ChatboxProps) {
    if (
      !prevProps.messages.every((m) =>
        Boolean(this.props.messages.find((p) => p.key === m.key))
      ) ||
      prevProps.messages.length < this.props.messages.length
    ) {
      await this.fadeIn().finished;
      this.fadeOut();
    }
  }

  private emojifyMessage(message: string): JSX.Element {
    const { emojis, quoraEmojis } = this.props.context;
    let tempMessage = message;
    while (tempMessage.match(/(:[^\s:]+:)/)) {
      const match: any = tempMessage.match(/(:[^\s:]+:)/);
      const token = match[0];
      const key = token.split(":").join("");
      const toRender = emojis[key]
        ? emojis[key]
        : quoraEmojis[key]
        ? `<img
                style="height: 35px; width: 35px; border-radius: 15px;"
                src="${quoraEmojis[key]}"
                alt="emoji"
             />`
        : key;
      tempMessage = tempMessage.replace(token, toRender);
    }
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {parse(tempMessage)}
      </div>
    );
  }

  render() {
    const { messages } = this.props;
    const m = messages.reduce((acc: any, message: any, i: number) => {
      if (i < 6) {
        acc.unshift(
          <div
            key={message.key}
            style={{
              color: "white",
              paddingBottom: "10px",
              fontSize: "30px",
              opacity: 1 / (i + 1),
              transition: "all .5s ",
              wordWrap: "break-word",
            }}
          >
            {this.emojifyMessage(message.content)}
          </div>
        );
      }
      return acc;
    }, []);

    return messages.length ? (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: "50vh",
          width: "70vw",
          overflowY: "hidden",
        }}
      >
        <div
          ref={this.chatBoxRef}
          style={{
            padding: "15px",
            paddingRight: "30px",
            paddingLeft: "30px",
            flexDirection: "column",
            maxWidth: "70vw",
            backgroundColor: "rgba(0,0,0,.8)",
            borderTopRightRadius: "15px",
            transition: "opcity 5s",
            opacity: 1,
            position: "absolute",
            bottom: 0,
          }}
        >
          {m}
        </div>
      </div>
    ) : null;
  }
}

export default withQuoraAudienceContext(ChatBox);
