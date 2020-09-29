import React from 'react';
import SlackService from '../Services/SlackService';
import { RouteComponentProps } from 'react-router';

interface SplashPageProps extends RouteComponentProps {}

/**
 * Initial loading page of the application.  Handles checking for valid registered
 * tokens.
 */
class SplashPage extends React.Component<SplashPageProps> {
  private slackService: SlackService;
  constructor(props: SplashPageProps) {
    super(props);
    this.slackService = new SlackService();
  }
  async componentDidMount() {
    const hasValidTokens = await this.slackService.hasValidTokens();
    if (hasValidTokens) {
      this.props.history.push('/home');
    } else {
      this.props.history.push('/register');
    }
  }
  render() {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Slack Reaction Overlay
      </div>
    );
  }
}

export default SplashPage;
