'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { FcGoogle } from 'react-icons/fc'; // Make sure to install react-icons

export default function RegisterPage() {
  const { register: registerUser, signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string; termsAccepted: boolean }>();

  const password = watch('password', '');

  const onSubmit = async (data: RegisterData & { confirmPassword: string; termsAccepted: boolean }) => {
    const { confirmPassword, termsAccepted, ...registerData } = data;

    if (!termsAccepted) {
      setError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await registerUser(registerData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-500">Start your journey with us today</p>
        </div>

        <Card variant="elevated" className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              fullWidth
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least.3 characters',
                },
              })}
            />

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

            <Input
              label="Confirm Password"
              type="password"
              fullWidth
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
            />

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  {...register('termsAccepted', {
                    required: 'You must accept the Terms of Service and Privacy Policy',
                  })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-800 font-medium transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-800 font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-xs text-red-600">{errors.termsAccepted.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="mt-4"
            >
              Register
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-800 font-medium transition-colors">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}