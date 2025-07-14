import { jwtDecode } from 'jwt-decode';

// Define token payload structure (customize as needed)
interface TokenPayload {
  nameid?: string;
  unique_name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

// Get token from cookies
export const getTokenFromCookies = (): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookieRaw of cookies) {
    const cookie = cookieRaw.trim();
    if (cookie.startsWith('token=')) return cookie.substring('token='.length);
    if (cookie.startsWith('authToken=')) return cookie.substring('authToken='.length);
    if (cookie.startsWith('jwt=')) return cookie.substring('jwt='.length);
    if (cookie.startsWith('_userSession=')) return cookie.substring('_userSession='.length);
  }
  return null;
};

// Decode token safely
export const decodeToken = (token: string): TokenPayload | null => {
  if (!token) return null;
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000;
  return Date.now() > expirationTime;
};

// Get useful info from token
export const getUserInfoFromToken = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.nameid || '',
    name: decoded.unique_name || '',
    email: decoded.email || '',
    role: decoded.role || '',
    exp: decoded.exp ? new Date(decoded.exp * 1000) : null,
    iat: decoded.iat ? new Date(decoded.iat * 1000) : null,
  };
};

export default {
  getTokenFromCookies,
  decodeToken,
  isTokenExpired,
  getUserInfoFromToken
};
