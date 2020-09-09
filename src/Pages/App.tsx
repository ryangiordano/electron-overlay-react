import React, { ReactNode } from "react";
import { FullScreenProvider } from "../Components/FullScreenContext/FullScreenContext";
import { Navbar } from "../Components/Navbar";

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;

  return (
    <FullScreenProvider>
      {children}
    </FullScreenProvider>
  );
}
