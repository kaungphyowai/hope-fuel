"use client";

import React, { useEffect, useState } from "react";
import { Typography, Stack } from "@mui/material";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const CreatorInfo = ({ creator }) => {
  const [creatorEmail, setCreatorEmail] = useState("");

  // Function to fetch email from Cognito using AWS SDK v3
  const fetchCreatorEmail = async (AwsId) => {
    if (!AwsId) return;

    // AWS Cognito client configuration
    const client = new CognitoIdentityProviderClient({
      region: "us-east-1",
    });

    // Command to get user info
    const command = new AdminGetUserCommand({
      UserPoolId: "us-east-1_se1yJeLv6",
      Username: AwsId,
    });

    try {
      const response = await client.send(command);
      console.log("Response from cognito:", response);
      const email = response.UserAttributes?.find(
        (attr) => attr.Name === "email"
      )?.Value;
      setCreatorEmail(email || "Email not found");
    } catch (error) {
      console.error("Error fetching creator email:", error);
      setCreatorEmail("Error fetching email");
    }
  };

  // Fetch email when component mounts or when creator.AwsId changes
  useEffect(() => {
    if (creator?.AwsId) {
      fetchCreatorEmail(creator.AwsId);
    }
  }, [creator?.AwsId]);

  if (!creator) return <p>No data available in CreatorInfo</p>;

  return (
    <Stack spacing={1}>
      <Typography>Created by {creatorEmail}</Typography>
      <Typography>HOPEID: {creator.HopeFuelID}</Typography>
      <Typography>Manychat ID: {creator.ManyChatId}</Typography>
    </Stack>
  );
};

export default CreatorInfo;
