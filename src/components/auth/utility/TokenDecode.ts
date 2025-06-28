import * as jwtDecode from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode.default(token);
    const now = Date.now() / 1000; // Convert milliseconds to seconds
    return decoded.exp < now;
  } catch (error) {
    return true; // Treat invalid tokens as expired
  }
};
