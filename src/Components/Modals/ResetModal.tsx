import { ModalLayout, useModal } from "../../Patterns/Modal";
import React from "react";
import ResetTokens, { resetTokens } from "../Registration/ResetTokens";

const ResetModal = ({ onReset }: { onReset: () => void }) => {
  const { closeModal } = useModal();
  return (
    <ModalLayout
      styles={{ width: "50vw" }}
      header={<h1 style={{ fontSize: "1.5rem" }}>Slack Tokens</h1>}
    >
      <ResetTokens
        onClickReset={async () => {
          const success = await resetTokens();
          if (success) {
            closeModal();
            onReset();
          }
        }}
      />
    </ModalLayout>
  );
};

export default ResetModal;
