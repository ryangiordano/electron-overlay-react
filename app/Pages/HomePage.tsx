import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { ipcRenderer } from 'electron';

import Home from '../Components/Home';

interface HomePageProps {
  history: any;
}

const HomePage = (props: HomePageProps) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Home {...props} />;
};

export default HomePage;
