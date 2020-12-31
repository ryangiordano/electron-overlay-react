import React from 'react';
import { RouteComponentProps } from 'react-router';
import SlackService from '../Services/SlackService';
import Page from './Page';

type SplashPageProps = RouteComponentProps;

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
    const { history } = this.props;
    const hasValidTokens = await this.slackService.hasValidTokens();
    if (hasValidTokens) {
      history.push('/home');
    } else {
      history.push('/register');
    }
  }

  render() {
    return (
      <Page>
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
      </Page>
    );
  }
}

export default SplashPage;
