"use client";
import React from "react";

import CreateFormPage from "./createForm/page";

import { UserProvider } from "./context/UserContext";
import { AgentProvider } from "./context/AgentContext";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify  } from "aws-amplify";
import awsconfig from "../aws-exports";



Amplify.configure(awsconfig);


function App({ signOut, user }) {
  return (
    <AgentProvider>
      <UserProvider user={user}>
      
          <CreateFormPage />
        
      </UserProvider>
    </AgentProvider>
  );
}

export default withAuthenticator(App);
