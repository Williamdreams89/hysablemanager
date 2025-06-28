import React from 'react';
import { Group, Text, Input } from '@mantine/core';
import { IconSearch, IconChevronDown, IconLogout, IconSettings } from '@tabler/icons-react';
import { Box, Typography, Menu, MenuItem, IconButton, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';


const SelectContentTwo: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
const initials = username
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase();
  return (
    <div style={{ display: 'flex',  backgroundColor: '#f8f9fa', width:'100%' }}>
      {/* Profile Section */}
      <div style={{display:'flex', width:'100%', justifyContent:'space-between', gap:'.5rem', alignItems:'center'}}>
        <Avatar size="normal" shape="circle" style={{ backgroundColor: "#1E88E5", color: "#fff" }}>
  {initials}
</Avatar>
        <div style={{flex:3}}>
          <Text style={{fontWeight:500}} size="sm">
            {localStorage.getItem("username")?.toUpperCase()}
          </Text>
          <Text size="xs" color="dimmed">
            {localStorage.getItem("user_role")?.toUpperCase()==="ADMIN" ? "Administrator": ""}
            {localStorage.getItem("user_role")?.toUpperCase()==="PARENT" ? "Parent": ""}
            {localStorage.getItem("user_role")?.toUpperCase()==="STUDENT" ? "Student": ""}
            {localStorage.getItem("user_role")?.toUpperCase()==="TEACHER" ? "Teacher": ""}
          </Text>
        </div>
        <IconChevronDown style={{cursor:'pointer'}} onClick={(event:any)=>setAnchorEl(event.currentTarget)} />
        <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  PaperProps={{
    style: { zIndex: 1500 }, // Ensure the menu is displayed above all other elements
  }}
>
  <MenuItem onClick={()=>navigate("/my-profile")}>Profile</MenuItem>
  <MenuItem onClick={()=>{localStorage.setItem("isLocked", `${true}`); window.location.href = "/"}}>Lock Screen</MenuItem>
  <MenuItem onClick={()=>{localStorage.removeItem("access_token");localStorage.removeItem("username"); localStorage.removeItem("user_profile_pic"); window.location.href = "/"}}>Logout</MenuItem>
</Menu>
      </div>

      {/* Search Input */}
    </div>
  );
};

export default SelectContentTwo;
