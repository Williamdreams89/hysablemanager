import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';


const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/' },

  // 📦 Products
  { text: 'Products', icon: <Inventory2RoundedIcon />, path: '/products' },

  // 🏷 Categories
  { text: 'Categories', icon: <CategoryRoundedIcon />, path: '/categories' },

  // 🛒 Orders
  { text: 'Orders', icon: <ShoppingCartRoundedIcon />, path: '/orders' },

  // 🚚 Deliveries
  { text: 'Deliveries', icon: <LocalShippingRoundedIcon />, path: '/deliveries' },

  // 💳 Payments
  { text: 'Payments', icon: <PaymentsRoundedIcon />, path: '/payments' },

  // ⚙️ Settings
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

const mainListItems1 = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/' },
  { text: 'People', icon: <AnalyticsRoundedIcon />, path: '/people' },
  { text: 'Academics', icon: <AnalyticsRoundedIcon />, path: '/academics' },
  { text: 'Results', icon: <AssignmentRoundedIcon />, path: '/exams-report' },
  { text: 'Finances', icon: <AnalyticsRoundedIcon />, path: '/finance' },
  { text: 'Attendance', icon: <AnalyticsRoundedIcon />, path: '/attendance' },
  { text: 'MIS', icon: <AnalyticsRoundedIcon />, path: '/mis' },
  { text: 'My Bills', icon: <AnalyticsRoundedIcon />, path: '/subscriptions' },
];


export default function MenuContent() {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleClick = (item:any) => {
    localStorage.setItem('breadcrumb_value', item.text)
    setSelectedItem(item.text);
    navigate(item.path);
  };

  return (
    <Stack sx={{  p: 1, justifyContent: 'space-between', mb:'4rem' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedItem === item.text}
              onClick={() => handleClick(item)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
