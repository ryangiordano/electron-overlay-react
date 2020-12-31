/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Home from '../Components/Home';
import Navbar from '../Components/Navbar';
import Page from './Page';

interface HomePageProps {
  history: any;
}

const HomePage = (props: HomePageProps) => {
  return (
    <Page>
      <>
        <Navbar />
        <Home {...props} />
      </>
    </Page>
  );
};

export default HomePage;
