import Card from "../Patterns/Card";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Registration, {
  registerTokens,
} from "../Components/Registration/Registration";

const RegisterPage = ({ history }: RouteComponentProps<{}>) => {
  return (
    <div className="container">
      <Card header={"Register"}>
        <Registration
          onClickRegister={async ({ userAuthToken, botAuthToken }) => {
            const success = await registerTokens(botAuthToken, userAuthToken);
            if (success) {
              history.push("/home");
            }
          }}
        />
      </Card>
    </div>
  );
};

export default RegisterPage;
