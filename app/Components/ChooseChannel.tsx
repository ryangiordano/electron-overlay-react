/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { serverUrl } from '../Constants';
import Select from 'react-select';
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
      disabled={!validChannel}
      onClick={() => {
        validChannel && ipcRenderer.send('open-overlay', { id: channelName });
      }}
    >
      {validChannel ? (
        <>
          Stream from {channelName}{' '}
          <span aria-label="thumbs-up" role="img">
            👍
          </span>
        </>
      ) : (
        `Enter channel`
      )}
    </button>
  );
};

interface ChooseChannelState {
  channelName: string;
  validChannel: boolean;
  loading: boolean;
  channels: any[];
}
interface ChooseChannelProps {}
export default class ChooseChannel extends React.Component<
  ChooseChannelProps,
  ChooseChannelState
> {
  constructor(props: ChooseChannelProps) {
    super(props);
    this.state = {
      channelName: '',
      validChannel: false,
      loading: false,
      channels: [],
    };
  }

  searchChannels = debounce(async () => {
    const { channelName } = this.state;

    if (!channelName.length) {
      return this.setState({ validChannel: false, loading: false });
    }
    const response = await axios.get(
      `${serverUrl}/api/slack/channels/${channelName}`
    );
    const data = await response?.data;
    this.setChannelValidity();
    return this.setState({
      loading: false,
      channels: data.channels,
    });
  }, 300);

  private async setChannelValidity() {
    const { channelName } = this.state;
    const response = await axios.get(
      `${serverUrl}/api/slack/channels/${channelName}`
    );
    return this.setState({
      validChannel: !!response?.data?.channels?.find(
        (c: any) => c.name === channelName
      ),
    });
  }

  render() {
    const { validChannel, channelName, channels } = this.state;
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
          style={{ fontSize: '1.2rem' }}
        >
          Channel to stream
        </label>
        <div style={{ display: 'flex', position: 'relative' }}>
          <Select
            styles={{
              container: (base) => ({
                ...base,
                display: 'flex',
                width: '100%',
              }),
              control: (base) => ({ ...base, display: 'flex', width: '100%' }),
            }}
            onChange={(selected, actionMeta) => {
              if (actionMeta.action === 'select-option') {
                this.setState(
                  {
                    loading: false,
                    channelName: selected?.value,
                  },
                  () => {
                    this.setChannelValidity();
                  }
                );
              }
            }}
            onBlur={() => {
              return;
            }}
            onInputChange={(value, actionMeta) => {
              if (actionMeta.action === 'input-change') {
                this.setState(
                  (prevState) => {
                    return {
                      ...prevState,
                      selectedChannelObject: null,
                      channelName: value,
                      loading: true,
                    };
                  },
                  () => {
                    this.setChannelValidity();
                    this.searchChannels();
                  }
                );
              }
              // conditionally set state if value is not the same as prev state's channelName
            }}
            options={channels.map((c) => ({ value: c.name, label: c.name }))}
          />
          <div>
            <ChannelNavButton
              validChannel={validChannel}
              channelName={channelName}
            />
          </div>
        </div>
      </div>
    );
  }
}
