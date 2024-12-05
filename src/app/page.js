"use client";

import React from "react";
import awsconfig from "../aws-exports";
import App from "./App";
import { Amplify } from "aws-amplify";
Amplify.configure(awsconfig);
export default function Page() {
  return <App />;
}
