import React, { ReactNode } from 'react';
import { Modal } from '../Patterns/Modal';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return <Modal>{children}</Modal>;
}
