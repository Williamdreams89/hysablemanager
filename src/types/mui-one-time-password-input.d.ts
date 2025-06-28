declare module "mui-one-time-password-input" {
    import React from "react";
  
    interface MuiOtpInputProps {
      length?: number;
      value: string;
      onChange: (value: string) => void;
      onComplete?: (value: string) => void;
      autoFocus?: boolean;
      type?: "text" | "number" | "password";
      sx?: object;
    }
  
    export const MuiOtpInput: React.FC<MuiOtpInputProps>;
    export default MuiOtpInput;
  }
  