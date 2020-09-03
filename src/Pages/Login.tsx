import React from "react";
import axios from "axios";
import io from "socket.io-client";

export default class LoginPage extends React.Component<any, any> {
  private socket: any;
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on("message", (message: string) => {
      console.log(`message event: ${message}`);
    });
    this.socket.on("slack event", (data: any) => {
      console.log(`slack event: ${JSON.stringify(data)}`);
      switch (data.type) {
        case "reaction_added":
          console.log("Hello");
          break;
        case "message":
          console.log("Great");
          break;
      }
    });
    // this.socket.emit("join", window.slack_channel || response.data);
  }

  slackConnect() {
    this.socket.emit("join", window.slack_channel);
  }

  render() {
    return (
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
            <button
              onClick={() => {
                console.log(`${process.env.REACT_APP_ENDPOINT}api/slack`);
                axios
                  .get(`${process.env.REACT_APP_ENDPOINT}api/slack`)
                  .then((d) => {
                    console.log(d);
                  });
              }}
            >
              Great
            </button>
          </div>
        </div>
      </div>
    );
  }
}
