// // src/contexts/AuthContext.tsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react'; // Using type-only import for ReactNode
// import { Toast } from 'primereact/toast';
// import { useRef } from 'react';

// // Define the shape of your authentication context
// interface AuthContextType {
//   accessToken: string | null; // Renamed from 'token'
//   refreshToken: string | null; // New field for refresh token
//   isAuthenticated: boolean;
//   login: (accessToken: string, refreshToken: string, expiresIn?: number) => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// // Create the context with a default undefined value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define props for the AuthProvider
// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [accessToken, setAccessToken] = useState<string | null>(null); // State for access token
//   const [refreshToken, setRefreshToken] = useState<string | null>(null); // State for refresh token
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const toast = useRef<Toast>(null);
//   let logoutTimer: NodeJS.Timeout | null = null;

//   useEffect(() => {
//     const storedAccessToken = localStorage.getItem('accessToken');
//     const storedRefreshToken = localStorage.getItem('refreshToken');
//     const storedExpirationDate = localStorage.getItem('accessTokenExpiration');

//     if (storedAccessToken && storedRefreshToken && storedExpirationDate) {
//       // const remainingTime = new Date(storedExpirationDate).getTime() - new Date().getTime();
//       const remainingTime = 30 * 60 * 1000
//       if (remainingTime > 0) {
//         setAccessToken(storedAccessToken);
//         setRefreshToken(storedRefreshToken);
//         setIsAuthenticated(true);
//         logoutTimer = setTimeout(logout, remainingTime);
//       } else {
//         // Access token expired on load, try to refresh or clear
//         // For simplicity, we'll clear both for now, but a refresh logic would go here
//         console.log('Stored access token expired. Please log in again.');
//         toast.current?.show({ severity: 'info', summary: 'Session Expired', detail: 'Your session has expired. Please log in again.', life: 5000 });
//         logout(); // Clear all tokens
//       }
//     }
//     setIsLoading(false);
    
//     return () => {
//       if (logoutTimer) {
//         clearTimeout(logoutTimer);
//       }
//     };
//   }, []);

//   const login = (jwtAccessToken: string, jwtRefreshToken: string, expiresIn: number = 3600) => { // Default 1 hour for access token
//     const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
//     localStorage.setItem('accessToken', jwtAccessToken);
//     localStorage.setItem('refreshToken', jwtRefreshToken);
//     localStorage.setItem('accessTokenExpiration', expirationDate.toISOString());

//     setAccessToken(jwtAccessToken);
//     setRefreshToken(jwtRefreshToken);
//     setIsAuthenticated(true);
//     toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Logged in successfully!', life: 3000 });

//     if (logoutTimer) {
//       clearTimeout(logoutTimer);
//     }
//     logoutTimer = setTimeout(logout, expiresIn * 1000);
//   };

//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('accessTokenExpiration');
//     setAccessToken(null);
//     setRefreshToken(null);
//     setIsAuthenticated(false);
//     toast.current?.show({ severity: 'info', summary: 'Logged Out', detail: 'You have been logged out.', life: 3000 });
    
//     if (logoutTimer) {
//       clearTimeout(logoutTimer);
//       logoutTimer = null;
//     }
//   };

//   const contextValue = {
//     accessToken,
//     refreshToken,
//     isAuthenticated,
//     login,
//     logout,
//     isLoading,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>
//         <Toast ref={toast} />
//         {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };