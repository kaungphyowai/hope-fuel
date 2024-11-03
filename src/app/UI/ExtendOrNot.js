import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';

export const ExtendOrNot = ({ userInfo, sethasContinue }) => {
  return (
    <>
      <Box component="section" sx={{ mt: 1 }}>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          UserExist — <strong>Do you still want to continue?</strong>
        </Alert>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">ID No</TableCell>
                <TableCell align="left">Expire Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {userInfo.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {userInfo.email}
                </TableCell>
                <TableCell component="th" scope="row">
                  {userInfo['prf_no']}
                </TableCell>
                <TableCell component="th" scope="row">
                  {userInfo['expire_date']}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Stack
          spacing={2}
          direction="row"
          justifyContent={'flex-end'}
          sx={{ mt: 3, mb: 2 }}
        >
          <Button variant="contained" onClick={() => sethasContinue(true)}>
            Continue
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              sethasContinue(false);
              location.reload(); // reload the page
            }}
          >
            Decline
          </Button>
        </Stack>
      </Box>
    </>
  );
};
