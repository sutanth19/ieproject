// tokenUtils.js
import { jwtDecode } from 'jwt-decode';


export const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('token=')) {
      return cookie.substring('token='.length);
    }
    if (cookie.startsWith('authToken=')) {
      return cookie.substring('authToken='.length);
    }
    if (cookie.startsWith('jwt=')) {
      return cookie.substring('jwt='.length);
    }
    if (cookie.startsWith('_userSession=')) {
      return cookie.substring('_userSession='.length);
    }
  }
  return null;
};


export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime > expirationTime;
};


export const getUserInfoFromToken = (token) => {
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