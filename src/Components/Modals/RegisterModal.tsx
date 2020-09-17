import { ModalLayout, useModal } from "../../Patterns/Modal";
import React from "react";
import Registration, { registerTokens } from "../Registration/Registration";

const RegisterModal = () => {
  const { closeModal } = useModal();
  return (
    <ModalLayout
      styles={{ width: "50vw" }}
      header={<h1 style={{ fontSize: "1.5rem" }}>Slack Tokens</h1>}
    >
      <Registration
        onClickRegister={async ({ userAuthToken, botAuthToken }) => {
          const success = await registerTokens(botAuthToken, userAuthToken);
          if (success) {
            closeModal();
          }
        }}
      />
    </ModalLayout>
  );
};

export default RegisterModal;
