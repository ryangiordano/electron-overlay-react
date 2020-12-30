import React from 'react';

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
    this.ws = new WebSocket(`ws://${props.url}/`, 'echo-protocol');
  }

  componentDidMount() {
    const { onError, onClose, onOpen, onMessage } = this.props;
    this.ws.onerror = () => {
      onError?.();
    };

    this.ws.onopen = () => {
      onOpen?.();
    };

    this.ws.onclose = () => {
      onClose?.();
    };

    this.ws.onmessage = (e) => {
      onMessage?.(e);
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const { children } = this.props;
    return <>{children({ send: (data: string) => this.ws.send(data) })}</>;
  }
}
