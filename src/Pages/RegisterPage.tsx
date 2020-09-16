import Card from "../Patterns/Card";
import React, { useState } from "react";
import TextInput from "../Patterns/Forms/TextInput";
import SlackService from "../Services/SlackService";
import { RouteComponentProps } from "react-router-dom";

const registerTokens = async (botToken: string, userToken: string) => {
  const ss = new SlackService();
  const successful = await ss.registerTokens(botToken, userToken);
  return successful;
};

const RegisterPage = ({ history }: RouteComponentProps<{}>) => {
  const userAuthTokenId = "user-auth-token";
  const botAuthTokenId = "bot-auth-token";
  const [uat, setUserAuthToken] = useState("");
  const [bat, setBotAuthToken] = useState("");
  return (
    <div className="container">
      <Card header={"Register"}>
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
            const success = await registerTokens(bat, uat);
            if (success) {
              history.push("/home");
            }
          }}
        >
          Register
        </button>
      </Card>
    </div>
  );
};

export default RegisterPage;
