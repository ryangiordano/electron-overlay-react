import React from "react";

interface WebSocketProps {
  url: string;
  children: ({ send }: { send: (data: string) => void }) => JSX.Element;
  onError?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (e: MessageEvent) => void;
}

export default class WebSocketComponent extends React.Component<
  WebSocketProps
> {
  private ws: WebSocket;
  constructor(props: any) {
    super(props);
    this.ws = new WebSocket(`ws://${props.url}/`, "echo-protocol");
  }

  componentDidMount() {
    this.ws.onerror = () => {
      this.props.onError?.();
    };

    this.ws.onopen = () => {
      this.props.onOpen?.();
    };

    this.ws.onclose = () => {
      this.props.onClose?.();
    };

    this.ws.onmessage = (e) => {
      this.props.onMessage?.(e);
    };
  }

  render() {
    const { children } = this.props;
    return <>{children({ send: (data: string) => this.ws.send(data) })}</>;
  }
}
