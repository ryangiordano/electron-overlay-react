import React from "react";
import ChooseChannel from "../ChooseChannel";

export const StreamingReactionOverlay = () => {
  return (
    <div className="card bg-secondary my-3">
      <div className="card-header">Header</div>
      <div className="card-body">
        <h4 className="card-title">Light card title</h4>
        <ChooseChannel />
      </div>
    </div>
  );
};
