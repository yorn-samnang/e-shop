
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
  signInWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; first_name?: string; last_name?: string; profile_image?: string }) => Promise<void>;
}

type GoogleCredentialResponse = {
  credential?: string;
};

export type GoogleIdentityService = {
  accounts: {
    id: {
      initialize: (configuration: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: 'standard' | 'icon';
          theme?: 'outline' | 'filled_blue' | 'filled_black';
          size?: 'large' | 'medium' | 'small';
          text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
          shape?: 'rectangular' | 'pill' | 'circle' | 'square';
          logo_alignment?: 'left' | 'center';
          width?: number;
        },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityService;
  }
}

let googleIdentityScript: Promise<GoogleIdentityService> | undefined;

export const loadGoogleIdentityService = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google sign-in is only available in a browser.'));
  }

  if (window.google) {
    return Promise.resolve(window.google);
  }

  if (!googleIdentityScript) {
    googleIdentityScript = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => window.google ? resolve(window.google) : reject(new Error('Google sign-in could not be initialized.'));
      script.onerror = () => {
        googleIdentityScript = undefined;
        reject(new Error('Google sign-in could not be loaded. Check your internet connection and try again.'));
      };
      document.head.appendChild(script);
    });
  }

  return googleIdentityScript;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  signInWithGoogle: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const startNavigationLoading = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('route-navigation-start'));
  };

  const stopNavigationLoading = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('route-navigation-end'));
  };
  

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
    startNavigationLoading();
    try {
      const response = await authAPI.login(credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);

      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);
      router.push('/');
    } catch (error: unknown) {
      stopNavigationLoading();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    startNavigationLoading();
    try {
      const response = await authAPI.register(userData);
      const { token } = response.data;
      localStorage.setItem('token', token);

      if (response.data.user) {
        setUser(response.data.user);
      } else {
        try {
          const profileResponse = await authAPI.getProfile();
          setUser(profileResponse.data);
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
        }
      }

      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      stopNavigationLoading();
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

  const updateProfile = async (data: { username?: string; first_name?: string; last_name?: string; profile_image?: string }) => {
    const response = await authAPI.updateProfile(data);
    setUser(response.data);
  };

  const signInWithGoogle = async (credential: string) => {
    setIsLoading(true);
    startNavigationLoading();
    try {
      const response = await authAPI.googleLogin(credential);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      router.push('/');
    } catch (error) {
      stopNavigationLoading();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        signInWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
