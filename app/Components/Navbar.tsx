import React from 'react';

const Navbar = () => {
  return (
    <div style={{ paddingBottom: '3rem' }}>
      <nav
        className="navbar navbar-light bg-light"
        style={{
          position: 'fixed',
          top: 0,
          display: 'flex',
          flexWrap: 'nowrap',
          width: '100%',
          zIndex: 1000,
          alignItems: "center"
        }}
      >
        <h1
          style={{
            whiteSpace: 'nowrap',
            fontSize: '1.5rem',
            margin: 0,
            padding: 0,
          }}
          className="mr-3"
        >
          Slack Overlay
        </h1>
      </nav>
    </div>
  );
};

export default Navbar;
