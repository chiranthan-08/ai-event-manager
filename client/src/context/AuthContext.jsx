import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decoded);
        }
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      toast.success('Login successful!');
      return decoded;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      toast.success('Registration successful!');
      return decoded;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await authService.googleLogin(credential);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      toast.success('Google login successful!');
      return decoded;
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    isClient: user?.role === 'client',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
