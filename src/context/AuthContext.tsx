import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, LoginCredentials, RegisterData, APIResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios.get<APIResponse<User>>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        localStorage.removeItem('token');
        console.error('Auth check error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<APIResponse<{ user: User; token: string }>>('/api/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        setUser(user);
        return true;
      } else {
        setError(response.data.error || 'Login failed');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred during login';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<APIResponse<{ user: User; token: string }>>('/api/auth/register', data);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        setUser(user);
        return true;
      } else {
        setError(response.data.error || 'Registration failed');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred during registration';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        error, 
        login, 
        register, 
        logout, 
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};