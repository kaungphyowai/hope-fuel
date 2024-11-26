"use client";

import React from "react";
import { UserProvider , useUser } from "../context/UserContext";
import { AgentProvider } from "../context/AgentContext";
import ExtendUserForm from "./ExtendUserForm";
import { Box, Typography, Avatar } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const ExtendUserPage = () => {
  const user = useUser();
   const userRole = user?.userRole ;
   console.log("User",user);

  return (
    <UserProvider>
      <AgentProvider>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: 15,
            marginRight: 15,
          }}
        >
          <Avatar sx={{ bgcolor: "secondary.main", mb: 2 }}>
            <CalendarMonthIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Extend User Membership
          </Typography>
          <ExtendUserForm userRole={userRole} />
        </Box>
      </AgentProvider>
    </UserProvider>
  );
};

export default ExtendUserPage;
