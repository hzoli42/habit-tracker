import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from '../styles/Appbar.module.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';

export default function SimpleAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    loginWithRedirect()
  }

  const handleLogoutClick = () => {
    logout({ logoutParams: { returnTo: 'http://localhost:3000/dashboard' } })
  }

  return (
      <AppBar position="static">
        <Toolbar>
          <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
            <AccessTimeIcon />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                ml: 2,
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Habit Tracker
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
            { isAuthenticated
              ? <MenuItem onClick={handleLogoutClick}>Log out</MenuItem>
              : <MenuItem onClick={handleLoginClick}>Log in</MenuItem>
            }
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
  );
}