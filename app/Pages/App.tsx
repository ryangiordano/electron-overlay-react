import React, { ReactNode } from 'react';
import { FullScreenProvider } from '../Components/FullScreenContext/FullScreenContext';
import { Modal } from '../Patterns/Modal';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  alert('Hello');
  const { children } = props;
  return (
    <Modal>
      <FullScreenProvider>{children}</FullScreenProvider>
    </Modal>
  );
}
