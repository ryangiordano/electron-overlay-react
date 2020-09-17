import React from "react";
import { FullScreenContext } from "./FullScreenContext/FullScreenContext";
import { NavLink, useLocation } from "react-router-dom";
import routes from "../constants/routes.json";

export const Navbar = () => {
  const location = useLocation();
  return (
    <FullScreenContext.Consumer>
      {({ toggleFullScreen, fullScreenMode }) => (
        <>
          {fullScreenMode ? null : (
            <nav
              className="navbar navbar-light bg-light"
              style={{
                position: "fixed",
                top: 0,
                display: "flex",
                flexWrap: "nowrap",
                width: "100%",
                zIndex: 1000,
              }}
            >
              <h1 style={{ whiteSpace: "nowrap" }} className="mr-3">
                Slack Overlay
              </h1>
              <ul
                className="navbar-nav mr-auto w-100"
                style={{
                  flexDirection: "row",
                  display: "flex",
                  minHeight: "2rem",
                }}
              >
                {location.pathname.includes("/channel/") ? (
                  <li className="nav-item active">
                    <NavLink to={"/home"} className="btn btn-info">
                      Home
                    </NavLink>
                  </li>
                ) : null}

                {location.pathname.includes("/channel/") ? (
                  <li
                    className="nav-item active"
                    style={{ marginLeft: "auto" }}
                  >
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
                ) : null}
              </ul>
            </nav>
          )}
        </>
      )}
    </FullScreenContext.Consumer>
  );
};
