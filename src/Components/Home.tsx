import React from "react";
import ChooseChannel from "./ChooseChannel";
import Card from "../Patterns/Card";
import ChatQueue from "./ChatQueue";
import SlackService from "../Services/SlackService";

interface HomeProps {}

interface HomeState {
  users: any[];
}

export class Home extends React.Component<HomeProps, HomeState> {
  private slackService: SlackService;
  constructor(props: HomeProps) {
    super(props);
    this.slackService = new SlackService();
    this.state = {
      users: [],
    };
  }
  componentDidMount() {
    this.slackService.getUsers().then((u) => {
      if (u) {
        this.setState({
          users: u,
        });
      }
    });
  }
  render() {
    console.log(this.state.users);
    return (
      <div className="container">
        <Card header={"Streaming Reaction Overlay"} className="mt-3">
          <ChooseChannel />
        </Card>
        <Card
          header={
            "Find others in the company who are looking for conversation partners"
          }
          className="my-3"
        >
          <ChatQueue users={this.state.users} />
        </Card>
      </div>
    );
  }
}
