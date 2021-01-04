import React from 'react';
import anime from 'animejs';

export class StreamingComponent extends React.Component<any, any> {
  private mounted = false;
  private duration = Math.round(Math.random() * (7000 - 4000 + 1) + 4000);
  private emoteRef: React.RefObject<any>;
  private anime: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isVisible: true,
      offsetX: `${Math.round(Math.random() * (90 - 10 + 1) + 10)}%`,
    };
    this.emoteRef = React.createRef();
    this.anime = anime;
  }

  private hide = () => {
    this.mounted && this.setState({ isVisible: false });
  };

  async componentDidMount() {
    this.mounted = true;
    const initial = () => {
      return this.anime({
        targets: this.emoteRef.current,
        scale: 6.5,
        easing: 'easeOutElastic',
        duration: 1000,
        opacity: 1,
      });
    };

    const float = () => {
      return this.anime({
        targets: this.emoteRef.current,
        translateY: '-100vh',
        opacity: 0,
        duration: this.duration,
        scale: 8,
        easing: 'easeInOutExpo',
      });
    };

    await initial().finished;
    await float().finished;
    const { onRemove } = this.props;
    this.hide();
    onRemove && onRemove();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { children } = this.props;

    return (
      <div
        ref={this.emoteRef}
        style={{
          bottom: '100px',
          left: this.state.offsetX,
          position: 'absolute',
        }}
      >
        {children}
      </div>
    );
  }
}
