import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from '../styles/Appbar.module.css';

export default function SimpleAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1}}>
            <Button color="inherit" href='/session'>Record a session</Button>
            <Button color="inherit" href='/dashboard'>Dashboard</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}