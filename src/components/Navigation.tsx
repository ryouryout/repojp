import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import EventIcon from '@mui/icons-material/Event';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

const Navigation: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // 現在のパスに基づいて選択されたタブを決定
  let value = 0;
  if (pathname === '/') value = 0;
  else if (pathname.startsWith('/messages')) value = 1;
  else if (pathname.startsWith('/events')) value = 2;
  else if (pathname.startsWith('/matches')) value = 3;
  else if (pathname.startsWith('/profile')) value = 4;

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0, zIndex: 1000 }}>
      <Paper elevation={3} sx={{ borderRadius: '16px 16px 0 0' }}>
        <BottomNavigation
          showLabels
          value={value}
          sx={{
            height: 70,
            borderRadius: '16px 16px 0 0',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              color: '#888',
            },
            '& .Mui-selected': {
              color: '#ff4b91',
            },
          }}
        >
          <BottomNavigationAction
            component={Link}
            to="/"
            label="ホーム"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/messages"
            label="メッセージ"
            icon={<ChatIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/events"
            label="イベント"
            icon={<EventIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/matches"
            label="マッチング"
            icon={<FavoriteIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/profile"
            label="プロフィール"
            icon={<PersonIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Navigation; 