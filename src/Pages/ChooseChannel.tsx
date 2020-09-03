import React from "react";
import { NavLink } from "react-router-dom";
import { debounce } from "lodash";
import axios from "axios";

const Input = ({
  onChange,
  value,
  placeholder,
}: {
  onChange: any;
  value: string;
  placeholder?: string;
}) => {
  return (
    <input
      type="text"
      className="form-control"
      name="channel-name"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default class ChooseChannel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      channelName: "",
      validChannel: false,
      loading: false,
    };
  }

  get_channel = debounce(async () => {
    if (!this.state.channelName.length) {
      return this.setState({ validChannel: false, loading: false });
    }
    const response = await axios.get(
      `${process.env.REACT_APP_ENDPOINT}/api/channel/${this.state.channelName}`
    );
    const valid = Boolean(response?.data?.channel);
    this.setState({
      validChannel: valid,
      loading: false,
    });
  }, 300);

  private isValid() {
    return (
      !this.state.loading &&
      this.state.channelName.length &&
      this.state.validChannel
    );
  }

  render() {
    console.log("Working")
    return (
      <>
        <div
          className="container"
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50vw",
            }}
          >
            <div style={{ display: "flex" }}>
              <Input
                value={this.state.channelName}
                onChange={(e: any) => {
                  this.setState(
                    { channelName: e.target.value, loading: true },
                    () => {
                      this.get_channel();
                    }
                  );
                }}
                placeholder="Enter a channel name or ID"
              />
              <NavLink
                to={`/channel/${this.state.channelName}`}
                className={`btn btn-primary ${
                  this.state.validChannel ? "" : "disabled"
                }`}
                activeClassName="active"
                style={{
                  whiteSpace: "nowrap",
                  marginLeft: "1rem",
                }}
              >
                {this.state.validChannel
                  ? `Stream from ${this.state.channelName}`
                  : `Awaiting Channel Name`}
              </NavLink>
            </div>
            <div
              className={`validation ${
                this.state.validChannel ? "valid" : "invalid"
              }`}
              role="alert"
              style={{
                height: "1rem",
                marginTop: "1rem",
              }}
            >
              {this.isValid() ? (
                <p>We're good to use this channel 👍</p>
              ) : !this.state.loading && this.state.channelName.length ? (
                <p>Sorry, we can't find this channel... 😢</p>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}
