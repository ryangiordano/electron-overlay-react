import React from "react";
import { FullScreenContext } from "./FullScreenContext/FullScreenContext";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <FullScreenContext.Consumer>
      {({ toggleFullScreen, fullScreenMode }) => (
        <>
          {fullScreenMode ? null : (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <ul
                className="navbar-nav mr-auto w-100"
                style={{ flexDirection: "row", display: "flex" }}
              >
                <li className="nav-item active">
                  <NavLink to={"/"} className="btn btn-info">
                    Home
                  </NavLink>
                </li>

                <li className="nav-item active" style={{ marginLeft: "auto" }}>
                  <button
                    className="btn btn-info p-0"
                    onClick={() => {
                      toggleFullScreen();
                    }}
                  >
                    <svg
                      height="2rem"
                      version="1.1"
                      viewBox="0 0 36 36"
                      width="2rem"
                      fill="white"
                    >
                      <path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>
                      <path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>
                      <path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>
                      <path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </FullScreenContext.Consumer>
  );
};
