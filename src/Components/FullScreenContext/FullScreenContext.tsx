import React, { useState, ReactNode, useEffect } from "react";
import electron from "electron";

type FullScreenContextType = {
  fullScreenMode: boolean;
  toggleFullScreen: () => void;
};
/**
 * Context for managing setting the app to full screen mode and back.
 */
export const FullScreenContext = React.createContext<FullScreenContextType>({
  fullScreenMode: false,
  toggleFullScreen: () => {},
});

interface FullScreenProviderProps {
  children: ReactNode;
}

/**
 * If in full screen mode, Electron will stop recording mouse events
 * and the window will be set to the top of the stack.
 * @param fullScreenMode
 */
const fullScreenModeSetter = (fullScreenMode: boolean) => {
  const w = electron.remote.getCurrentWindow();
  w.setFullScreen(!fullScreenMode);
  w.setIgnoreMouseEvents(!fullScreenMode);
  setAlwaysOnTop(!fullScreenMode);
};

const setAlwaysOnTop = (fullScreenMode: boolean) => {
  const w = electron.remote.getCurrentWindow();
  setTimeout(() => {
    w.setAlwaysOnTop(fullScreenMode, "screen-saver");
  }, 100);
};

/**
 * Provider for managing setting the app to full screen mode and back.
 */
export const FullScreenProvider = ({ children }: FullScreenProviderProps) => {
  const w = electron.remote.getCurrentWindow();
  const [fullScreenMode, setFullScreenMode] = useState(w.isFullScreen());
  /**
   * Listen for Electron's enter and leave full screen events,
   * in case the user triggers them by keystroke.
   */
  useEffect(() => {
    w.on("leave-full-screen", () => {
      setAlwaysOnTop(false);
      setFullScreenMode(false);
    });
    w.on("enter-full-screen", () => {
      setAlwaysOnTop(true);
      setFullScreenMode(true);
    });
    return () => {
      w.off("leave-full-screen", () => {});
      w.off("enter-full-screen", () => {});
    };
  }, []);
  return (
    <FullScreenContext.Provider
      value={{
        fullScreenMode: fullScreenMode,
        toggleFullScreen: () => {
          fullScreenModeSetter(fullScreenMode);
          setFullScreenMode(!fullScreenMode);
        },
      }}
    >
      {children}
    </FullScreenContext.Provider>
  );
};
