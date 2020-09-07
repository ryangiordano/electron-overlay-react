import React, { ReactNode } from "react";
import { FullScreenProvider } from "../Components/FullScreenContext/FullScreenContext";

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;

  return <FullScreenProvider>{children}</FullScreenProvider>;
}
