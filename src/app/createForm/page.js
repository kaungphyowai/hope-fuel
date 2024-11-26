"use client";

import React, { useState, useEffect } from "react";
import CheckUser from "./checkUser";
import CreateForm from "./createForm";
import ExtendForm from "./extendForm";
import ExtendOrNot from "./extendOrNot";
import { UserProvider } from "../context/UserContext";
import { AgentProvider } from "../context/AgentContext";
import { Avatar, Typography, Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import getAuthCurrentUser from "../utilites/getAuthCurrentUser";
import { withAuthenticator } from "@aws-amplify/ui-react";

function CreateOrExtendPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExtendOrNot, setShowExtendOrNot] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch the current authenticated user and their role
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const userRole = currentUser?.role || "user";

  // Handle showing the form based on user check
  const handleUserCheck = (user, isExistingUser) => {
    setUserInfo(user);
    if (isExistingUser) {
      setShowExtendOrNot(true); // Show the confirmation step
    } else {
      setShowCreateForm(true);
    }
  };

  const handleExtendOrNot = (proceed) => {
    setShowExtendOrNot(false);
    if (proceed) {
      setShowExtendForm(true);
    }
  };

  return (
    <AgentProvider>
      <UserProvider user={currentUser}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Hope Member Registration Form
          </Typography>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : showExtendOrNot ? (
            <ExtendOrNot userInfo={userInfo} onConfirm={handleExtendOrNot} />
          ) : !showCreateForm && !showExtendForm ? (
            <CheckUser onUserCheck={handleUserCheck} userRole={userRole} />
          ) : showCreateForm ? (
            <CreateForm userInfo={userInfo} setloading={setLoading} />
          ) : (
            <ExtendForm userInfo={userInfo} setloading={setLoading} />
          )}
        </Box>
      </UserProvider>
    </AgentProvider>
  );
}

export default withAuthenticator(CreateOrExtendPage);
