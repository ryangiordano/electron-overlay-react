/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import TextInput from '../Patterns/Forms/TextInput';
import { serverUrl } from '../Constants';

const ChannelNavButton = ({
  validChannel,
  channelName,
}: {
  validChannel: boolean;
  channelName?: string;
}) => {
  // This needs to go in a much better place than a button component.
  const history = useHistory();
  useEffect(() => {
    ipcRenderer.on(
      'navigate',
      (_event, { route, id }: { route: string; id: string }) => {
        history.push(`/${route}/${id}`);
      }
    );
    return () => {
      ipcRenderer.off('navigate', () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <button
      type="button"
      className={`btn btn-info ${validChannel ? '' : 'disabled'}`}
      style={{
        whiteSpace: 'nowrap',
        marginLeft: '1rem',
      }}
      onClick={() => {
        ipcRenderer.send('open-overlay', { id: channelName });
      }}
    >
      {validChannel ? `Stream from ${channelName}` : `Enter channel`}
    </button>
  );
};

export default class ChooseChannel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      channelName: '',
      validChannel: false,
      loading: false,
    };
  }

  getChannel = debounce(async () => {
    const { channelName } = this.state;

    if (!channelName.length) {
      return this.setState({ validChannel: false, loading: false });
    }
    const response = await axios.get(
      `${serverUrl}/api/slack/channels/${channelName}`
    );
    const data = await response?.data;
    const valid = Boolean(data?.success);
    return this.setState({
      validChannel: valid,
      loading: false,
    });
  }, 300);

  private isValid() {
    const { validChannel, channelName, loading } = this.state;

    return !loading && channelName.length && validChannel;
  }

  render() {
    const { validChannel, channelName, loading } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <label
          className="card-title"
          htmlFor="channel-id"
          style={{ fontSize: '1.5rem' }}
        >
          Channel to stream
        </label>
        <div style={{ display: 'flex' }}>
          <TextInput
            id="channel-id"
            value={channelName}
            onChange={(e: any) => {
              this.setState(
                { channelName: e.target.value, loading: true },
                () => {
                  this.getChannel();
                }
              );
            }}
            placeholder="Enter a channel name or ID"
          />
          <ChannelNavButton
            validChannel={validChannel}
            channelName={channelName}
          />
        </div>

        <div
          className={`validation ${validChannel ? 'valid' : 'invalid'}`}
          role="alert"
          style={{
            height: '1rem',
            marginTop: '1rem',
          }}
        >
          {this.isValid() ? (
            <p className="text-success">
              We&apos;re good to use this channel
              <span aria-label="thumbs-up" role="img">
                👍
              </span>
            </p>
          ) : null}
          {!this.isValid() && !loading && channelName.length ? (
            <p className="text-primary">
              Sorry, we can&apos;t find this channel...
              <span aria-label="sad-face" role="img">
                😢
              </span>
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}
