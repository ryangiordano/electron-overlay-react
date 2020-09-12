import React from "react";
import axios from "axios";

export default class LoginPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            console.log(`${process.env.REACT_APP_ENDPOINT}api/slack`);
            axios
              .get(`${process.env.REACT_APP_ENDPOINT}api/slack`)
              .then((d) => {});
          }}
        >
          Great
        </button>
      </div>
    );
  }
}
