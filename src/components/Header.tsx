import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';
import SettingsIcon from '@mui/icons-material/Settings';
import Search from './Search';
import NavLogoDisplay from './NavLogoDisplay';
import { NavLink } from 'react-router-dom';
import { Props } from './people/students/types';



const Header: React.FC<Props> = ({SystemSettingData, academicSessionSettingsData, academicSettingsData}) => {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      {/* <NavbarBreadcrumbs /> */}
      <NavLogoDisplay academicSessionSettingsData={academicSessionSettingsData} SystemSettingData = {SystemSettingData} academicSettingsData = {academicSettingsData}  />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        
        <NavLink to="/system-settings">
        <MenuButton aria-label="Open System Settings">
          <SettingsIcon />
        </MenuButton>
        </NavLink>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}

export default Header