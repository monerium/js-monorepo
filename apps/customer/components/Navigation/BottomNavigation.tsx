'use client';
import { usePathname, useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GridViewIcon from '@mui/icons-material/GridView';
import MUIBottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';

const routes = ['/dashboard', '/receive', '/send', '/bridge'];

const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const value = pathname ? Math.max(routes.indexOf(pathname), 0) : 0;

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <MUIBottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          const route = routes[newValue];
          if (route) router.push(route);
        }}
      >
        <BottomNavigationAction label="Accounts" icon={<GridViewIcon />} />
        <BottomNavigationAction label="Receive" icon={<AddIcon />} />
        <BottomNavigationAction label="Send" icon={<ArrowForwardIcon />} />
        <BottomNavigationAction label="Bridge" icon={<CompareArrowsIcon />} />
      </MUIBottomNavigation>
    </Paper>
  );
};
export default BottomNavigation;
