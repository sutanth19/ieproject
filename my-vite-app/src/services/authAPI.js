import api from './api';

const API_KEY = import.meta.env.VITE_AUTH_API_KEY;

export const authAPI = {
  login: (userNtId, password) => {
    console.log('Attempting login for user:', userNtId);
    
    const payload = {
      ntid: userNtId,     
      password: password    
    };
    
    return api.post('/api/auth/login', payload, {
      headers: {
        'X-App-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
  },
  
  register: (userNtid, userRole) => {
    console.log('Attempting registration for user:', userNtid, 'with role:', userRole);
    
    // Log API key details 
    const keyLength = API_KEY ? API_KEY.length : 0;
    const maskedKey = API_KEY ? 
      `${API_KEY.substring(0, 4)}...${API_KEY.substring(keyLength - 4)}` : 
      'undefined';
    console.log('Using API Key (masked):', maskedKey);
    
    const payload = {
      userNtid: userNtid,   
      userRole: userRole    
    };
    
    return api.post('/api/auth/register', payload, {
      headers: {
        'X-App-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
  },
  
  logout: () => {
    console.log('Attempting logout');
    return api.get('/api/auth/logout', {
      headers: {
        'X-App-Key': API_KEY
      }
    });
  }
};