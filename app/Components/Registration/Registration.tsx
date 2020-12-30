import React, { useState } from 'react';

import TextInput from '../../Patterns/Forms/TextInput';
import SlackService from '../../Services/SlackService';

export const registerTokens = async (botToken: string, userToken: string) => {
  const ss = new SlackService();
  const successful = await ss.setTokens(botToken, userToken);
  return successful;
};

const Registration = ({
  onClickRegister,
}: {
  onClickRegister: ({
    userAuthToken,
    botAuthToken,
  }: {
    userAuthToken: string;
    botAuthToken: string;
  }) => void;
}) => {
  const userAuthTokenId = 'user-auth-token';
  const botAuthTokenId = 'bot-auth-token';
  const [uat, setUserAuthToken] = useState('');
  const [bat, setBotAuthToken] = useState('');
  return (
    <>
      <form>
        <label htmlFor={userAuthTokenId}>User Auth Token</label>
        <TextInput
          value={uat}
          id={userAuthTokenId}
          onChange={(e) => {
            setUserAuthToken(e.target.value);
          }}
        />
        <label htmlFor={botAuthTokenId}>Bot User Auth Token</label>
        <TextInput
          value={bat}
          id={botAuthTokenId}
          onChange={(e) => {
            setBotAuthToken(e.target.value);
          }}
        />
      </form>
      <button
        type="submit"
        className="btn btn-primary mt-2"
        onClick={async () => {
          onClickRegister({ userAuthToken: uat, botAuthToken: bat });
        }}
      >
        Register
      </button>
    </>
  );
};
export default Registration;
