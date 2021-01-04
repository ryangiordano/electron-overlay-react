import React from 'react';
import { RouteComponentProps } from 'react-router';
import Page from './Page';
import { ipcRenderer } from 'electron';

type SplashPageProps = RouteComponentProps;

/**
 * Initial loading page of the application.  Handles checking for valid registered
 * tokens.
 */
class SplashPage extends React.Component<SplashPageProps> {
  constructor(props: SplashPageProps) {
    super(props);
  }

  async componentDidMount() {
    const { history } = this.props;
    // Abstract this away into its own component
    ipcRenderer.on('navigate', (_event, { route, id }) => {
      history.push(`/${route}/${id}`);
    });
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
