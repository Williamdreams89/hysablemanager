import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { SimpleGrid } from '@mantine/core';
import { Box, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "left",
  },
}));

interface AcademicTerm{
  id: any;
  _session: string;
  start_year: string;
  end_year : string;
  is_active: any;
  session_?: any
}

interface AcademicSession{
  id: any;
  _session: string;
  start_year: string;
  end_year : string;
  academic_year: string;
  is_active: boolean
}

interface NavBreadCrumbsProps {
  items: { label: string; href?: string }[];
  academicSessionSettingsData: AcademicSession;
  academicSettingsData: AcademicTerm;
  
}

const NavBreadCrumbs: React.FC<NavBreadCrumbsProps> = ({ items, academicSessionSettingsData, academicSettingsData }) => {
  const [activeAcademicData, setActiveAcademic] = React.useState<any>()
  React.useEffect(() => {
    if (academicSettingsData && Array.isArray(academicSettingsData)) {
      const activeTerm = academicSettingsData.find((term: AcademicTerm) => term.is_active === true);
      console.log("mappppa=", activeTerm);
      setActiveAcademic(activeTerm)
    } else {
      console.log("academicSettingsData is not an array:", academicSettingsData);
    }
  }, [academicSettingsData]);
  return (
    <Box sx={{display :'flex', width:'98%', justifyContent:'space-between', alignItems:'center'}}>
      <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {items.map((item, index) =>
        item.href ? (
          <Link key={index} to={item.href}>
            {item.label}
          </Link>
        ) : (
          <Typography
            key={index}
            variant="body1"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {item.label}
          </Typography>
        )
      )}
    </StyledBreadcrumbs>
    <Link to={"/system-settings"}>
      <Box className='session_switcher' sx={{width:'300px', height:'1rem', display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Divider className='divider' sx={{color:'1px solid #eaeaea'}} />
        <Divider className='divider-two' orientation='vertical' sx={{color:'1px solid #eaeaea'}} />
        <SimpleGrid  cols={2}>
          <small style={{fontWeight:400}}>Academic session</small>
          <small style={{fontWeight:400}}>{activeAcademicData?.session_}</small>
          <small style={{fontWeight:400}}>Active Term</small>
          <small style={{fontWeight:400}}>{activeAcademicData?.term_name}</small>
        </SimpleGrid>
      </Box>
    </Link>
    </Box>
  );
}

export default NavBreadCrumbs

