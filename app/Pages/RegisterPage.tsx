import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Card from '../Patterns/Card';
import Registration, {
  registerTokens,
} from '../Components/Registration/Registration';
import Navbar from '../Components/Navbar';
import Page from './Page';

const RegisterPage = ({ history }: RouteComponentProps) => {
  return (
    <Page>
      <>
        <Navbar />
        <div className="container">
          <Card header="Register">
            <Registration
              onClickRegister={async ({ userAuthToken, botAuthToken }) => {
                const success = await registerTokens(
                  botAuthToken,
                  userAuthToken
                );
                if (success) {
                  history.push('/home');
                }
              }}
            />
          </Card>
        </div>
      </>
    </Page>
  );
};

export default RegisterPage;
