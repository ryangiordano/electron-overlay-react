import React from "react";
import { Link } from "react-router-dom";
import routes from "../constants/routes.json";
import styles from "./Home.css";
import { StreamingReactionOverlay } from "./StreamingReactionOverlay/StreamingReactionOverlay";

export default function Home(): JSX.Element {
  return (
    <div className="container">
      <StreamingReactionOverlay />
    </div>
  );
}
