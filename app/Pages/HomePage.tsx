import React from "react";
import Home from "../Components/Home";

interface HomePageProps {
  history: any;
}

const HomePage = (props: HomePageProps) => {
  return <Home {...props} />;
};

export default HomePage;
