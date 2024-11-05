'use client';

import { Box, Button, CircularProgress, TextField } from '@mui/material';
import checkUserSubmit from '../../utilites/checkUserSubmit';
import React, { useState } from 'react';

import { ExtendOrNot } from '../ExtendOrNot';
import CreateForm from '../CreateForm';
import ExtendForm from '../ExtendForm';
import { useSearchParams } from 'next/navigation';

export default function CheckUser({ userRole }) {
  const [userExistState, setUserExistState] = useState(false);
  const [finishCheck, setFinishCheck] = useState(false);
  const [createFormShow, setCreateFormShow] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [hasContinue, sethasContinue] = useState(false);
  const [loading, setloading] = useState(false);
  const [hasPermissonThisMonth, setHasPermissonThisMonth] = useState(true);

  const searchParams = useSearchParams();
  const user = searchParams.get('user');

  return loading ? (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  ) : (
    <div>
      <Box
        component="form"
        onSubmit={(event) =>
          checkUserSubmit(
            event,
            setUserExistState,
            setFinishCheck,
            setCreateFormShow,
            setUserInfo,
            setHasPermissonThisMonth,
            userRole,
          )
        }
        sx={{ mt: 1 }}
      >
        <TextField
          autoFocus
          margin="normal"
          required
          fullWidth
          name="name"
          label="Name"
          type="text"
          id="name"
          disabled={finishCheck}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          type="email"
          disabled={finishCheck}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={finishCheck}
        >
          Check
        </Button>

        {/* If user doesn't have permission */}
        {!hasPermissonThisMonth && userRole !== 'admin' && (
          <h1>
            ယခုလအတွင်း ဖော်ပြပါထောက်ပို့တပ်သားအတွက် စာရင်းသွင်းထားပြီးပါပြီ။
            ထူးခြားဖြစ်စဥ် ဖြစ်ပါက Admin ကိုဆက်သွယ်ပါ
          </h1>
        )}
        {!hasPermissonThisMonth && userRole === 'admin' && (
          <>
            <h1>
              ဒီ user က ဒီလအတွက် သွင်းပြီးသွားပါပြီ။ Admin
              အနေနဲ့ဆက်ဖြည့်ချင်ပါသလား။
            </h1>
            <ExtendOrNot userInfo={userInfo} sethasContinue={sethasContinue} />
          </>
        )}

        {/* Ask if they want to extend or not */}
        {userExistState && hasPermissonThisMonth && (
          <ExtendOrNot
            userInfo={userInfo}
            sethasContinue={sethasContinue}
            formFillingPerson={user}
          />
        )}
      </Box>

      {hasContinue && (
        <ExtendForm
          userInfo={userInfo}
          setloading={setloading}
          formFillingPerson={user}
        />
      )}

      {createFormShow && hasPermissonThisMonth && (
        <CreateForm
          userInfo={userInfo}
          setloading={setloading}
          formFillingPerson={user}
        />
      )}
    </div>
  );
}
