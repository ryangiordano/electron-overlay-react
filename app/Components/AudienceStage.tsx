import React from "react";
import ChatBox from "./ChatBox";
import { StreamingComponent } from "./StreamingComponent";

const AudienceStage = ({
  onRemove,
  reactions,
  messages,
}: {
  onRemove: (e: any) => void;
  reactions: any[];
  messages: any[];
}) => {
  console.log(reactions, messages)
  return (
    <div
      style={{
        display: "flex",
        height: "96vh",
        width: "99vw",
        alignContent: "center",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
        }}
      >
        {reactions.map((e: any) => {
          return (
            <StreamingComponent key={e.key} onRemove={() => onRemove(e)}>
              {e.emoji}
            </StreamingComponent>
          );
        })}
        <ChatBox messages={[...messages]} />
      </div>
    </div>
  );
};

export default AudienceStage;
