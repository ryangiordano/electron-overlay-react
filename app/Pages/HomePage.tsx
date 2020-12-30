import React from 'react';

import Home from '../Components/Home';

interface HomePageProps {
  history: any;
}

const HomePage = (props: HomePageProps) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Home {...props} />;
};

export default HomePage;
