import React, { useState, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Card from "./Card";

export interface ModalContextProps {
  openModal: (Component: JSX.Element) => void;
  closeModal: () => void;
}

const ModalContext = React.createContext({
  openModal: (_modalComponent: any) => {},
  closeModal: () => {},
});

export const Modal = (props: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTransitionOpen, setModalTransitionOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState(null);
  const closeModal = () => {
    setModalTransitionOpen(false);
  };
  return (
    <>
      <ModalContext.Provider
        value={{
          openModal: (modalComponent) => {
            setModalTransitionOpen(true);
            setModalComponent(modalComponent);
          },
          closeModal,
        }}
      >
        <div
          style={{
            zIndex: 1000,
            position: "fixed",
            height: modalOpen ? "100vh" : 0,
            width: "100%",
            backgroundColor: "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <CSSTransition
              timeout={300}
              unmountOnExit
              exit
              in={modalTransitionOpen}
              classNames="scale"
              onEnter={() => setModalOpen(true)}
              onExited={() => {
                setModalComponent(null);
                setModalOpen(false);
              }}
            >
              {modalComponent || <></>}
            </CSSTransition>
          </div>
        </div>
        {props.children}
      </ModalContext.Provider>
    </>
  );
};

export const ModalConsumer = (props: any) => {
  return (
    <ModalContext.Consumer>
      {(context) => {
        return props.children(context);
      }}
    </ModalContext.Consumer>
  );
};

interface ModalLayoutProps {
  header: JSX.Element;
  children: JSX.Element;
  styles?: any;
}

export const ModalLayout = ({ header, children, styles }: ModalLayoutProps) => {
  const { closeModal } = useModal();
  return (
    <Card
      style={{ margin: "1rem", paddingBottom: "1rem", ...styles }}
      header={
        <div
          className="d-flex"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {header}
          <div className="d-flex" style={{ justifyContent: "flex-end" }}>
            <button
              className="btn btn-info btn-outline"
              onClick={() => {
                closeModal();
              }}
            >
              X
            </button>
          </div>
        </div>
      }
    >
      {children}
    </Card>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};

export const withModal = (Component: any) => (props: any) => (
  <ModalContext.Consumer>
    {(context) => (
      <Component {...props} {...context} context={{ ...props.context }} />
    )}
  </ModalContext.Consumer>
);
