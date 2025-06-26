import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (token) {
      // Set token in axios headers for all subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user data if we have a token but no user object
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        setUser(JSON.parse(userFromStorage));
      }
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const loginUrl = config.getApiUrl(config.API_ENDPOINTS.AUTH.LOGIN);
    if (!loginUrl) {
      throw new Error('Backend URL not configured. Please check your environment variables.');
    }
    
    const response = await axios.post(loginUrl, { email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return response;
  };

  const signup = async (name, email, password) => {
    const registerUrl = config.getApiUrl(config.API_ENDPOINTS.AUTH.REGISTER);
    if (!registerUrl) {
      throw new Error('Backend URL not configured. Please check your environment variables.');
    }
    
    const response = await axios.post(registerUrl, { name, email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 