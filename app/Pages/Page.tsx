import React from 'react';

const Page = ({ children }: { children: JSX.Element }) => {
  return (
    <div style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
      {children}
    </div>
  );
};

export default Page;
