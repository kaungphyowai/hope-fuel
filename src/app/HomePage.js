"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody, { tableBodyClasses } from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import {
  Autocomplete,
  CircularProgress,
  FormLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import CreateOrExtend from "./UI/CreateOrExtend/CreateOrExtend";
import ResponsiveAppBar from "./UI/AppBar/AppBar";
import ExtendUser from "./UI/ExtendUser/ExtendUser";
import { Amplify, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import {
  fetchAuthSession,
  FetchUserAttributesOutput,
  getCurrentUser,
} from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import config from "../amplifyconfiguration.json";
import { generateClient } from "aws-amplify/api";
import { createApp, updateApp, deleteApp } from "../graphql/mutations";
import { listApps } from "../graphql/queries";
import * as subscriptions from "../graphql/subscriptions";
import getAuthCurrentUser from "./utilites/getAuthCurrentUser";

import OpenCloseForm from "./UI/OpenCloseForm.js";
Amplify.configure(config);

const client = generateClient();
let isCreatingAgent = false;
export const UserContext = React.createContext();

function HomePage({ signOut, user }) {
  const [page, setPage] = React.useState(1);
  //It can be loading, enable, disable
  const [status, setStatus] = React.useState("loading");
  //User Role = admin | user
  const [userRole, setUserRole] = React.useState("admin");

  //getting current AgentId
  const checkAgentStatus = async () => {
    const agentId = await getAuthCurrentUser();
    console.log("AgentId:", agentId);
    const response = await fetch(`/api/checkAgent?awsId=${agentId}`);
    const data = await response.json();
    console.log("Response: ", data.code);

    if (data.code === 0 && !isCreatingAgent) {
      isCreatingAgent = true;
      setTimeout(async () => {
        await fetch(`/api/createAgent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ awsId: agentId }),
        });
      }, 3000);
    }
  };
  isCreatingAgent = false;

  //Get the page is unable or not
  React.useEffect(() => {

    
    checkAgentStatus();

    client.graphql({ query: listApps }).then((result) => {
      let enable = result.data.listApps.items[0].status ? "enable" : "disable";
      setStatus(enable);
    });

    //always listen for changes in status
    const updateSub = client
      .graphql({ query: subscriptions.onUpdateApp })
      .subscribe({
        next: ({ data }) => {
          let enable = data["onUpdateApp"]["status"] ? "enable" : "disable";
          setStatus(enable);
        },
        error: (error) => console.warn(error),
      });
  }, []);

  //Get user role
  // React.useEffect(
  // () => {
  //   fetchAuthSession().then(
  //     session =>
  //     {
  //       let accesstoken = session.tokens.accessToken;
  //       let scope = accesstoken.payload['cognito:groups']
  //       if(scope === undefined)
  //       {
  //         return;
  //       }
  //       if(scope.find(ele => ele === 'Admin'))
  //       {
  //         setUserRole('admin')
  //       }
  //     }
  //   )
  // }
  // ,[])

  return (
    <UserContext.Provider value={user}>
      <Container component="main" maxWidth="xl" disableGutters>
        <ResponsiveAppBar
          setPage={setPage}
          signOut={signOut}
          userRole={userRole}
        />
        <CssBaseline />

        <Container component="section" maxWidth="xs">
          {"enable" === "loading" && <CircularProgress />}
          {(userRole == "admin" || "enable" === "enable") && page == 1 && (
            <CreateOrExtend userRole={userRole} />
          )}
          {(userRole == "admin" || "enable" === "enable") && page == 2 && (
            <ExtendUser userRole={userRole} />
          )}
          {userRole == "admin" && page == 3 && (
            <OpenCloseForm status={"enable"} />
          )}
          {"enable" === "disable" && userRole == "user" && (
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Alert severity="warning">
                Form ခဏပိတ်ထားပါတယ်။ တခုခု လိုချင်ပါက admin ကို ဆက်သွယ်ပါ။
              </Alert>
            </Box>
          )}
        </Container>
      </Container>
    </UserContext.Provider>
  );
}

export default withAuthenticator(HomePage);
