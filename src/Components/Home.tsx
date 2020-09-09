import React from "react";
import ChooseChannel from "./ChooseChannel";
import Card from "../Patterns/Card";

export default function Home(): JSX.Element {
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
        {/* todo */}
      </Card>
    </div>
  );
}
