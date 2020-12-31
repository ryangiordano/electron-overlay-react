/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import routes from './Constants/routes.json';
import App from './Pages/App';
import HomePage from './Pages/HomePage';
import AudiencePage from './Pages/AudiencePage';
import RegisterPage from './Pages/RegisterPage';
import SplashPage from './Pages/SplashPage';

export default function Routes() {
  return (
    <App>
      <Router>
        <Switch>
          <Route path={routes.REGISTER} component={RegisterPage} />
          <Route path={routes.CHANNEL} component={AudiencePage} />
          <Route path={routes.HOME} component={HomePage} />
          <Route path="/" component={SplashPage} />
        </Switch>
      </Router>
    </App>
  );
}
