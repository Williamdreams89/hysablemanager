import { Box, Typography } from '@mui/material'
import React from 'react'
import { Props } from './people/students/types'

const NavLogoDisplay:React.FC<Props> = ({SystemSettingData = [], academicSessionSettingsData, academicSettingsData}) => { 
  return (
    <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', height:'100%'}}>
        <img src="/images/logo.png" width={60} />
        <Typography component={'h1'} variant='h4' sx={{fontWeight:700}} >{SystemSettingData[0]?.school_name || ''}</Typography>
    </Box>
  )
}

export default NavLogoDisplay