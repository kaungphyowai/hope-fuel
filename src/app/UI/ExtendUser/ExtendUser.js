import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExtendUserForm from './ExtendUserForm';

const ExtendUser = ({ userRole }) => {
  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <CalendarMonthIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Hope Member Extend Form
      </Typography>
      <ExtendUserForm userRole={userRole} />
    </Box>
  );
};

export default ExtendUser;
