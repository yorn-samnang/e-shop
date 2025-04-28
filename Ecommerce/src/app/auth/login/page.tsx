'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { login, signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError('');

    try {
      // Log the data being sent to help with debugging
      console.log('Login attempt with:', data);
      
      // Call the login function from useAuth
      const result = await login(data);
      console.log('Login result:', result);
      
      // If login is successful but doesn't redirect, you might need to handle that here
      // For example: router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      // Specific handling for 500 server errors
      if (err.response?.status === 500) {
        setError('Server error occurred. Please try again later or contact support.');
        console.error('Server error details:', err.response?.data);
      } 
      // More detailed error handling for other cases
      else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      console.log('Google sign-in result:', result);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Please enter your credentials to continue</p>
        </div>

        <Card variant="elevated" className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              fullWidth
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              fullWidth
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-800 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Login
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleSignIn} 
            isLoading={googleLoading}
            fullWidth 
            variant="outline" 
            size="lg" 
            className="flex items-center justify-center gap-2"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </Button>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-800 font-medium transition-colors">
              Register
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}


