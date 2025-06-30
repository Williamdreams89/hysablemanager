import React, { useState } from "react";
import LockScreen from "./utils/component/LockScreen";
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/home/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme'; 
import { dataGridCustomizations } from './theme/customizations/dataGrid';
import { treeViewCustomizations } from './theme/customizations/treeView';
import { chartsCustomizations } from './theme/customizations/charts';
import { datePickersCustomizations } from './theme/customizations/datePickers';
import {Routes, Route} from "react-router-dom"
import MenuContent from './components/MenuContent';
import StudentAddForm from './components/StudentAddForm';
import { Typography, useColorScheme } from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery"
import useInactivityTracker from "./utils/useInactivityTracker";
import { useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { APIContext } from "./utils/contexts/ReactContext";
import LoadingScreen from "./utils/component/LoadingScreen";
import SystemSettings from "./components/settings/SystemSettings";
import axios from "axios";
import NavBreadCrumbs from "./components/NavbarBreadcrumbs";
import { getCachedData, saveDataToCache } from "./utils/indexedDB";
import { Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process"
import { invoke } from "@tauri-apps/api/core";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // ✅ choose your theme
import 'primereact/resources/primereact.min.css';                 // ✅ core styles
import 'primeicons/primeicons.css';                               // ✅ icons
import 'primeflex/primeflex.css';   
import axiosInstance from './utils/axiosInstance'
import { AdminUserProfilePage } from "./components/profile/UserProfile";
import Product from "./components/products/Product";
import Category from "./components/categories/Category";
import Orders from "./components/orders/Orders";
import Deliveries from "./components/deliveries/Deliveries";
import Payments from "./components/payments/Payments";
import Settings from "./components/settings/Settings";

const App: React.FC = (props: { disableCustomTheme?: boolean }) => {

  // Check for tauri app updates 
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [updateInfo, setUpdateInfo] = React.useState<any>(null);

  React.useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await invoke("plugin:updater|check"); // ✅ Correct way to check updates
        if (update && (update as any).available) {
          setUpdateAvailable(true);
          setUpdateInfo(update);
        }
      } catch (error) {
        console.error("Update check failed:", error);
      }
    }

    checkForUpdates();
  }, []);

  const handleUpdate = async () => {
    try {
      await invoke("plugin:updater|install"); // ✅ Correct way to install update
      await relaunch(); // ✅ Restart app after update
    } catch (error) {
      console.error("Update installation failed:", error);
    }
  };

  const location = useLocation()
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // Read the initial lock state from localStorage
    return localStorage.getItem("isLocked") === "true";
  });
  const navigate = useNavigate();

  const { mode, setMode } = useColorScheme();
  React.useEffect(() => {
        setMode('light');
        console.log(`The mode is ${mode}`)
    });

  const handleUnlock = () => {
    setIsLocked(false); // Unlock logic
    localStorage.setItem("isLocked", "false");
    console.log("System unlocked");

    // Restore URL and scroll position
    const savedURL = localStorage.getItem("savedURL");
    const savedScrollPosition = localStorage.getItem("savedScrollPosition");

    if (savedURL) {
      navigate(savedURL);
      localStorage.removeItem("savedURL");
    }

    if (savedScrollPosition) {
      const [x, y] = savedScrollPosition.split(",").map(Number);
      window.scrollTo(x, y);
      localStorage.removeItem("savedScrollPosition");
    }
  };

  // const handleInactive = () => {
  //   if (!isLocked) { // Prevent re-triggering if already locked
  //     setIsLocked(true);
  //     localStorage.setItem("isLocked", "true"); // Persist the locked state
  //     navigate("/lock-screen"); // Redirect to lock screen
  //   }
  // };

  const handleInactive = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("No access token found. Inactivity lock is disabled.");
      return; // Exit if no token is found
    }
  
    if (!isLocked) { // Prevent re-triggering if already locked

       // Save current URL and scroll position
       localStorage.setItem("savedURL", location.pathname);
       localStorage.setItem(
         "savedScrollPosition",
         `${window.scrollX},${window.scrollY}`
       );
      setIsLocked(true);
      localStorage.setItem("isLocked", "true"); // Persist the locked state
      navigate("/lock-screen"); // Redirect to lock screen
    }
  };
  
  const isAuthPage =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/forgot-password";
  // Track user inactivity (30 seconds)
  useInactivityTracker(500, handleInactive, isLocked ||isAuthPage);

  

  React.useEffect(()=>{
    console.log(`Current page is ${window.location.href}`)
  })


  const isSmallScreen = useMediaQuery("(max-width: 1045px)")
  const [showPreloader, setShowPreloader] = React.useState<boolean>(false)
  React.useEffect(()=>{
    setTimeout(()=>{
      setShowPreloader(false)
    }, 3000)
  }, [])

  const context = React.useContext(APIContext)
  if(!context){
    throw new Error("A context was not found!")
  }

  const {studentsManagementDetails, setStudentsManagementDetails} = context;

  // System Settings Fetcher
  const [systemSettingsData, setSystemSettingsData] = React.useState<any>()
  const [AcademicSessionTermSettingsData, setAcademicSessionTermSettingsData] = React.useState<any>()
  const [AcademicSessionSettingsData, setAcademicSessionSettingsData] = React.useState<any>()
  React.useEffect(() => {
    const fetchSystemSettingsData = async () => {
      const url = "/api/system-settings/";
  
      try {
        setStudentsManagementDetails((prev) => ({ ...prev, isLoading: true }));
  
        // Check cache first if offline
        const cachedData = await getCachedData(url);
        if (!navigator.onLine && cachedData) {
          console.log("Using cached system settings data");
          setSystemSettingsData(cachedData);
          setStudentsManagementDetails((prev) => ({ ...prev, isLoading: false }));
          return;
        }
  
        // Fetch from API if online
        const { data } = await axiosInstance.get(url);
        setSystemSettingsData(data);
        console.log("System settings=",data)
  
        // Save to cache
        await saveDataToCache(url, data);

        setStudentsManagementDetails((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setStudentsManagementDetails((prev) => ({ ...prev, isLoading: false }));
  
        if (!navigator.onLine) {
          alert("No internet. Using cached data if available.");
        } else {
          alert(`Error fetching system settings: ${error}`);
        }
      }
    };
  
    fetchSystemSettingsData();
  }, []);

  React.useEffect(() => {
    const fetchAcademicSessionTerm = async () => {
      const termUrl = "/api/academic-term/";
      const sessionUrl = "/api/academic-sessions/";
  
      try {
        setStudentsManagementDetails((prev) => ({ ...prev, isLoading: true }));
  
        // Check cache for academic term
        const cachedTermData = await getCachedData(termUrl);
        const cachedSessionData = await getCachedData(sessionUrl);
  
        if (!navigator.onLine) {
          console.log("Offline: Using cached data");
          if (cachedTermData) setAcademicSessionTermSettingsData(cachedTermData);
          if (cachedSessionData) setAcademicSessionSettingsData(cachedSessionData);
          setStudentsManagementDetails((prev) => ({ ...prev, isLoading: false }));
          return;
        }
  
        // Fetch data from API if online
        const { data: termData } = await axiosInstance.get(termUrl);
        const { data: sessionData } = await axiosInstance.get(sessionUrl);
  
        setAcademicSessionTermSettingsData(termData);
        setAcademicSessionSettingsData(sessionData);
        console.log("academic session=", sessionData);
  
        // Save fetched data to cache
        await saveDataToCache(termUrl, termData);
        await saveDataToCache(sessionUrl, sessionData);
  
        setStudentsManagementDetails((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setStudentsManagementDetails((prev) => ({ ...prev, isLoading: false }));
  
        if (!navigator.onLine) {
          alert("No internet. Showing cached data if available.");
        } else {
          alert("Error fetching academic session data");
        }
      }
    };
  
    fetchAcademicSessionTerm();
  }, []);
  
    
  return (
    <div>
      

      {isLocked ? (
        <LockScreen  onUnlock={handleUnlock} />
      ) : (
        <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        {showPreloader ? <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100vw', height:'100vh'}}>
          <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center', alignItems:'center', width:!isSmallScreen ?'80%':'90%', height:!isSmallScreen ?'80%':null}}>
            <img src="/images/preloaderlogo.jpg" style={{width: !isSmallScreen ?'250px':'150px'}} />
            <Typography variant='h1' component={'h1'} sx={{fontWeight:!isSmallScreen?900:700, color:'#03045E', letterSpacing:!isSmallScreen?'15px':'5px'}}>SUKUUNI</Typography>
            <Typography variant='subtitle1' component={'p'} sx={{fontWeight:700, color:'#03045E', letterSpacing:'3px', textAlign:'center'}}>School Management App</Typography>
            <img src="/images/loading.gif" style={{marginTop:'1rem'}} />
          </Box>
        </Box>:<Box sx={{ display: 'flex', position:'relative' }}>
          {studentsManagementDetails.isLoading && <LoadingScreen />}
        {!isAuthPage &&
                (
                <>
                  <SideMenu />
                  <AppNavbar />
                </>
              )}
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(255, 87, 51, 1)',
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              {!isAuthPage &&
                   (
                    <Header />
                  )}
                <Routes>
                  <Route path='/auth/login' element = {<LoginPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route element={<ProtectedRoute />}>
                      <Route path='/' element = {<MainGrid  />} />
                      <Route path="/my-profile" element={<AdminUserProfilePage />} />
                      <Route path="/products" element={<Product />} />
                      <Route path="/categories" element={<Category />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/deliveries" element={<Deliveries />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>
            </Stack>
          </Box>
        </Box>}
      </AppTheme>
      )}
    </div>
  );
};

export default App;



