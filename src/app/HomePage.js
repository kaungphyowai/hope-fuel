'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

import {
  Autocomplete,
  CircularProgress,
  FormLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from '@mui/material';
import CreateOrExtend from './UI/CreateOrExtend/CreateOrExtend';
import ResponsiveAppBar from './UI/AppBar/AppBar';
import ExtendUser from './UI/ExtendUser/ExtendUser';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import {
  fetchAuthSession,
  FetchUserAttributesOutput,
  getCurrentUser,
} from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from '../amplifyconfiguration.json';
import { generateClient } from 'aws-amplify/api';
import { createApp, updateApp, deleteApp } from '../graphql/mutations';
import { listApps } from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import getAuthCurrentUser from './utilites/getAuthCurrentUser';
import getScreenShotUrl from './utilites/getScreenShotUrl';

import OpenCloseForm from './UI/OpenCloseForm.js';
import PaymentTeam from './UI/PaymentTeam/PaymentTeam';
import SearchPage from './UI/SearchForm/searchPage';
Amplify.configure(config);

const client = generateClient();

export const UserContext = React.createContext();
export const AgentContext = React.createContext();

function HomePage({ signOut, user }) {
  const [page, setPage] = React.useState(1);
  //It can be loading, enable, disable
  const [status, setStatus] = React.useState('loading');
  //User Role = admin | user
  const [userRole, setUserRole] = React.useState('pending');
  const [agentId, setAgentId] = React.useState(null);
  // let agentId = null;
  const [isCreatingAgent, setIsCreatingAgent] = React.useState(false);
  const [isSettingUpDone, setisSettingUpDone] = React.useState(false);
  const currentUser = React.useRef(null);

  //getting current AgentId
  const checkAgentStatus = async () => {
    // check if there is already an id
    currentUser.current = await getAuthCurrentUser();

    let tmp = currentUser.current.userId;
    // setAgentId(currentUser.current.userId)
    //  console.log("AgentId:", agentId);
    const response = await fetch(`/api/checkAgent?awsId=${tmp}`);

    const data = await response.json();
    console.log('Response: ', data.code);

    if (data.code === 1) {
      // agentId = ({ id: data.user.AgentID });
      setAgentId({ id: data.user.AgentID });
      // console.log('success', agentId);
    } else if (data.code === 0 && !isCreatingAgent) {
      // setIsCreatingAgent(true); // set the createAgent flag
      try {
        let response = await fetch(`/api/createAgent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ awsId: tmp }),
        });
        response = await response.json();
        // agentId = ({ id: response.id });
        setAgentId({ id: response.id });
        setUserRole('user');
      } catch (error) {
        console.error('Error creating agent:', error);
      } finally {
        setIsCreatingAgent(false); // reset the createAgent flag
      }
    }
  };

  // check if this is payment team user

  const getAgentRole = async () => {
    let currentAWSID = currentUser.current.userId;
    const response = await fetch(`/api/checkAgent?awsId=${currentAWSID}`);
    const data = await response.json();

    let userRole = data.user['UserRole'];

    if (data.code == 1) {
      console.log(userRole);
      setUserRole(userRole);
    }
  };

  // Note Developer: this is the only to make sure useEffect run only one time
  const hasChecked = React.useRef(false);

  React.useEffect(() => {
    // Note: this happens because of cleanup function.
    // reference: https://ultimatecourses.com/blog/using-async-await-inside-react-use-effect-hook
    (async () => {
      if (!hasChecked.current) {
        await checkAgentStatus();
        await getAgentRole();

        // check if this is
      }
    })();
    hasChecked.current = true; // Mark as true after first execution
  }, []);

  React.useEffect(() => {
    if (userRole !== 'pending') {
      setisSettingUpDone(true);
    }
  }, [userRole]);
  //Get the page is unable or not
  // React.useEffect(() => {
  // checkAgentStatus();

  // get the user Role

  //   client.graphql({ query: listApps }).then((result) => {
  //     let enable = result.data.listApps.items[0].status ? "enable" : "disable";
  //     setStatus(enable);
  //   });

  //  // always listen for changes in status
  //   const updateSub = client
  //     .graphql({ query: subscriptions.onUpdateApp })
  //     .subscribe({
  //       next: ({ data }) => {
  //         let enable = data["onUpdateApp"]["status"] ? "enable" : "disable";
  //         setStatus(enable);
  //       },
  //       error: (error) => console.warn(error),
  //     });
  //}, []);

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

  if (isSettingUpDone) {
    return (
      <AgentContext.Provider value={agentId}>
        <UserContext.Provider value={user}>
          <Container component="main" maxWidth="xl" disableGutters>
            <ResponsiveAppBar
              setPage={setPage}
              signOut={signOut}
              userRole={userRole}
            />
            <CssBaseline />

            <Container component="section" maxWidth="xs">
              {'enable' === 'loading' && <CircularProgress />}
              {(userRole == 'admin' || 'enable' === 'enable') && page == 1 && (
                <CreateOrExtend userRole={userRole} />
              )}
              {(userRole == 'admin' || 'enable' === 'enable') && page == 2 && (
                <ExtendUser userRole={userRole} />
              )}
              {userRole == 'admin' && page == 3 && (
                <OpenCloseForm status={'enable'} />
              )}
              {'enable' === 'disable' && userRole == 'user' && (
                <Box
                  sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Alert severity="warning">
                    Form ခဏပိတ်ထားပါတယ်။ တခုခု လိုချင်ပါက admin ကို ဆက်သွယ်ပါ။
                  </Alert>
                </Box>
              )}
            </Container>
            {page == 4 && <PaymentTeam />}
            {page == 5 && <SearchPage />}
          </Container>
        </UserContext.Provider>
      </AgentContext.Provider>
    );
  } else {
    return <h>The agent ID is still loading. Please wait a moments</h>;
  }
}

export default withAuthenticator(HomePage);
