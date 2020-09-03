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
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignContent: "center",
        flexDirection: "column",
        backgroundColor: "rgba(0,0,0,0)",
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
