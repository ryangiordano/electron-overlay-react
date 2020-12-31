import React from 'react';

const Navbar = () => {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <nav
        className="navbar navbar-light bg-light"
        style={{
          position: 'fixed',
          top: 0,
          display: 'flex',
          flexWrap: 'nowrap',
          width: '100%',
          zIndex: 1000,
        }}
      >
        <h1 style={{ whiteSpace: 'nowrap' }} className="mr-3">
          Slack Overlay
        </h1>
      </nav>
    </div>
  );
};

export default Navbar;
