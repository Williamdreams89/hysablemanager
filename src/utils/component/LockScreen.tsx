import React, { useRef, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { MantineProvider, PinInput } from "@mantine/core";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import axiosInstance from '../axiosInstance'
import { InputText } from "primereact/inputtext";


interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const toast = React.useRef<Toast>(null);
  const [school_name, setSchool_name] = React.useState<string>("");
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState(false);

  React.useEffect(()=>{
      const fetchSchName = async () =>{
        const {data} = await axiosInstance.get("/api/system-settings/");
        setSchool_name(data[0].school_name);
      } 
      fetchSchName();
    
  },[])
  const navigate = useNavigate();

  const correctPin = "2021";

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handlePinChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);

      // Move to next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // On complete
      if (updatedPin.every((digit) => digit !== '')) {
        handleComplete(updatedPin.join(''));
      }
    }
  };

  const handleComplete = (enteredPin: string) => {
    console.log("Entered PIN:", enteredPin);

    // Simulate PIN check
    if (enteredPin === correctPin) {
      setPinError(false);
      onUnlock();
    } else {
      setPinError(true);
    }
  };

  const isSmallDevice = useMediaQuery("(max-width:1045px)");


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      // marginTop="4rem"
      sx={{backgroundSize: "cover", // or 'contain', 'auto'
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        backgroundImage: `url('/images/formbg3.jpg')`,
        backgroundPositionY: 'fixed',
        backgroundPositionX: 'fixed',
        top: 0, 
        left: 0
      }}
      
    >
      <Toast ref={toast} />
      <Box sx={{ display: "flex", flexDirection: "column-reverse", justifyContent: "center", alignItems: "center" // Use a relative path or full URL
     }}

      >
        <Typography variant="h6" mb={1}>
          {school_name}
        </Typography>
        <img src="images/logo.png" width={40} alt="Logo" />
      </Box>
      <Box
        padding="50px"
        boxShadow={!isSmallDevice ? 3 : 0}
        borderRadius={isSmallDevice ? 0 : "8px"}
        bgcolor="white"
      >
        <Avatar
          sx={{ width: 80, height: 80, margin: "0 auto", bgcolor: "primary.main" }}
        />
        <Typography variant="h6" mt={2} fontWeight="bold">
          {localStorage.getItem("username")?.toUpperCase()}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {localStorage.getItem("user_role")?.toUpperCase()==="ADMIN" ? "Administrator": ""}
            {localStorage.getItem("user_role")?.toUpperCase()==="PARENT" ? "Parent": ""}
            {localStorage.getItem("user_role")?.toUpperCase()==="STUDENT" ? "Student": ""}
            {localStorage.getItem("user_role")?.toUpperCase()==="TEACHER" ? "Teacher": ""}
        </Typography>
        <Typography mt={2} mb={3} color="text.secondary">
          Welcome back. Provide your PIN to continue.
        </Typography>
      <MantineProvider>

        
      </MantineProvider>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {pin.map((digit: any, index:any) => (
          <InputText
            key={index}
            ref={(el:any) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handlePinChange(e.target.value, index)}
            maxLength={1}
            className={pinError ? "p-invalid" : ""}
            style={{
              width: "3rem",
              height: "3.5rem",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          />
        ))}
      </div>

        {pinError && (
          <Typography color="error" mt={1}>
            Incorrect PIN. Please try again.
          </Typography>
        )}

        <Typography mt={2} color="text.secondary">
          <a href="#" style={{ textDecoration: "none" }}>
            Forgot PIN
          </a>
        </Typography>
        <Typography mt={1} color="text.secondary" onClick={()=>{localStorage.removeItem("access_token");localStorage.removeItem("isLocked") ;navigate('/')}}>
          <a href="" style={{ textDecoration: "none" }}>
            Log out instead
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LockScreen;
