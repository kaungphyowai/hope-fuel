import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import getAuthCurrentUser from '../../utilites/getAuthCurrentUser';

// const pages = ["Products", "Pricing", "Blog"];
//const settings = ['Profile','Account', 'Dashboard', 'Logout'];
const settings = [
  { icon: <PersonOutlineIcon />, label: 'Account' },
  { icon: <SignalCellularAltIcon />, label: 'Dashboard' },
  { icon: <LogoutIcon />, label: 'Logout' },
];

function ResponsiveAppBar({ setPage, signOut, userRole }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const router = useRouter();

  let navItems = [];

  if (userRole == 'admin') {
    navItems = [
      'အသစ်သွင်းခြင်း',
      'သက်တမ်းတိုးခြင်း',
      'ဖောင်အဖွင့်အပိတ်',
      'ငွေစစ်ဆေးခြင်း',
      'ရှာဖွေခြင်း',
    ];
  } else if (userRole == 'Support Agent') {
    navItems = ['အသစ်သွင်းခြင်း', 'သက်တမ်းတိုးခြင်း', 'ရှာဖွေခြင်း'];
  } else {
    navItems = [
      'အသစ်သွင်းခြင်း',
      'သက်တမ်းတိုးခြင်း',
      'ငွေစစ်ဆေးခြင်း',
      'ရှာဖွေခြင်း',
    ];
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    console.log('opennev');
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    console.log('openuser');
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setPage();
  };

  const handleCloseUserMenu = (event, setting) => {
    setAnchorElUser(null);
    switch (setting.label) {
      case 'Account':
        router.push('/');
        break;
      case 'Dashboard':
        router.push('/');
        break;
      case 'Logout':
        signOut();
        break;
      default:
        // Handle any other case if necessary
        break;
    }
  };

  const handleClick = (page) => {
    console.log(page);
    if (page == 'အသစ်သွင်းခြင်း') {
      console.log(page);
      setPage(1);
    } else if (page == 'ဖောင်အဖွင့်အပိတ်') {
      console.log(page);
      setPage(3);
    } else if (page == 'သက်တမ်းတိုးခြင်း') {
      setPage(2);
    } else if (page == 'ငွေစစ်ဆေးခြင်း') {
      setPage(4);
    } else if (page == 'ရှာဖွေခြင်း') {
      setPage(5);
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Hope
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: '#fff',
                  ':hover': {
                    cursor: 'pointer',
                    color: 'secondary.yellow400',
                    textDecoration: 'none',
                  },
                }}
                onClick={() => handleClick(item)}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => [
                index === 2 && <Divider />,
                <MenuItem
                  sx={{ color: index === 2 ? 'primary.red700' : 'black' }}
                  onClick={(event) => handleCloseUserMenu(event, setting)}
                >
                  {setting.icon}
                  <Typography textAlign="center" sx={{ ml: 1.5 }}>
                    {setting.label}
                  </Typography>
                </MenuItem>,
              ])}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
