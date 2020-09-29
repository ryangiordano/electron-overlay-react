import React from "react";
import SlackService from "../../Services/SlackService";

export const resetTokens = async () => {
  const ss = new SlackService();
  const successful = await ss.setTokens(null, null);
  return successful;
};

const ResetTokens = ({ onClickReset }: { onClickReset: () => void }) => {
  return (
    <>
      <p>Reset the auth tokens registered with the app.</p>
      <button
        type="submit"
        className="btn btn-primary mt-2"
        onClick={async () => {
          onClickReset();
        }}
      >
        Reset
      </button>
    </>
  );
};
export default ResetTokens;
