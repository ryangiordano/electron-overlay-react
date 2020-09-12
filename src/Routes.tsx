/* eslint react/jsx-props-no-spreading: off */
import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import routes from "./constants/routes.json";
import App from "./Pages/App";
import HomePage from "./Pages/HomePage";
import QuoraAudience from "./Pages/QuoraAudience";
import { Navbar } from "./Components/Navbar";
import { FullScreenContext } from "./Components/FullScreenContext/FullScreenContext";
import LoginPage from "./Pages/Login";

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(
  () => import(/* webpackChunkName: "CounterPage" */ "./Pages/CounterPage")
);

// const CounterPage = (props: Record<string, any>) => (
//   <React.Suspense fallback={<h1>Loading...</h1>}>
//     <LazyCounterPage {...props} />
//   </React.Suspense>
// );

export default function Routes() {
  return (
    <App>
      <FullScreenContext.Consumer>
        {({ fullScreenMode }) => (
          <div
            style={{
              backgroundColor: fullScreenMode ? "rgba(0,0,0,0)" : "#fff",
              height: "100vh",
            }}
          >
            <Router>
              <div style={{ marginBottom: "4rem" }}>
                <Navbar />
              </div>
              <Switch>
                <Route path={routes.LOGIN} component={LoginPage} />
                <Route path={routes.CHANNEL} component={QuoraAudience} />
                <Route path={routes.HOME} component={HomePage} />
              </Switch>
            </Router>
          </div>
        )}
      </FullScreenContext.Consumer>
    </App>
  );
}
