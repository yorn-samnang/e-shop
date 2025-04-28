
'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Authentication failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with credentials:', { email: credentials.email, password: '[REDACTED]' });
      const response = await authAPI.login(credentials);
      console.log('Login successful, response:', response.data);
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage');
      
      // Get user profile after successful login
      console.log('Fetching user profile...');
      const profileResponse = await authAPI.getProfile();
      console.log('Profile response:', profileResponse.data);
      setUser(profileResponse.data);
      
      console.log('Redirecting to home page...');
      router.push('/');
    } catch (error: any) {
      console.error('Full login error details:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      console.log('Starting registration with data:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration successful, response:', response.data);
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage');
      
      // Set user from response or fetch profile
      if (response.data.user) {
        console.log('Using user data from response:', response.data.user);
        setUser(response.data.user);
      } else {
        console.log('Fetching user profile via API call...');
        try {
          const profileResponse = await authAPI.getProfile();
          console.log('Profile fetched successfully:', profileResponse.data);
          setUser(profileResponse.data);
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          // Continue with redirection even if profile fetch fails
        }
      }
      
      console.log('Redirecting to home page...');
      // Use window.location for a full page refresh if router doesn't work
      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

