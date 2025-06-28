import React from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

const ForgotPassword = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        position: 'absolute'
      }}
    >
      {/* Header Section */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          🔑 Recover Password
        </span>
      </Typography>

      {/* Logo */}
      <Box
        component="img"
        src="/images/logo.png" // Replace with your logo path
        alt="Logo"
        sx={{
          width: 100,
          height: 100,
          objectFit: "contain",
          marginBottom: 3,
        }}
      />

      {/* Input Field */}
      <Typography
        variant="body1"
        sx={{
          marginBottom: 1,
          color: "#666",
          fontWeight: "bold",
        }}
      >
        Account Email Address
      </Typography>
      <TextField
        variant="standard"
        fullWidth
        placeholder="Enter your email"
        sx={{
          marginBottom: 3,
          maxWidth: 400,
        }}
      />

      {/* Proceed Button */}
      <Button
        variant="contained"
        size="large"

      >
        &raquo; PROCEED
      </Button>

      {/* Back to Login */}
      <Link
        href="/auth/login" // Replace with the correct route
        underline="none"
        sx={{
          marginTop: 3,
          fontSize: "14px",
          color: "#1976D2",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        &lt; Back to Login
      </Link>
    </Box>
  );
};

export default ForgotPassword;
