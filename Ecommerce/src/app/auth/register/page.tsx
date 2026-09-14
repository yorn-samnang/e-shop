'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Card from '@/components/ui/Card';
import { getApiErrorMessage } from '@/lib/apiErrors';
import { Check } from 'lucide-react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginLink, setShowLoginLink] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string; termsAccepted: boolean }>();

  const password = watch('password', '');

  const onSubmit = async (data: RegisterData & { confirmPassword: string; termsAccepted: boolean }) => {
    if (!data.termsAccepted) {
      setError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }

    const registerData: RegisterData = {
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    setIsLoading(true);
    setError('');
    setShowLoginLink(false);

    try {
      await registerUser(registerData);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Registration failed. Please try again.');
      const emailAlreadyExists = message.toLowerCase().includes('email already exists');
      setError(message);
      setShowLoginLink(emailAlreadyExists);
      if (emailAlreadyExists) {
        window.sessionStorage.setItem('login-email', registerData.email);
      }
    } finally {
      setIsLoading(false);
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
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700 text-sm" role="alert">
              <p>{error}</p>
              {showLoginLink && (
                <Link href="/auth/login" className="mt-2 inline-block font-semibold text-primary underline underline-offset-2">
                  Go to login
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              autoComplete="username"
              fullWidth
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
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

            <PasswordInput
              label="Password"
              autoComplete="new-password"
              fullWidth
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />

            <PasswordInput
              label="Confirm Password"
              autoComplete="new-password"
              fullWidth
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
            />

            <div className="flex items-start">
              <div className="relative mt-0.5 flex h-5 w-5 shrink-0">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  aria-invalid={Boolean(errors.termsAccepted)}
                  aria-describedby={errors.termsAccepted ? 'termsAccepted-error' : undefined}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-white transition-colors hover:border-primary checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:checked:border-primary-light dark:checked:bg-primary"
                  {...register('termsAccepted', {
                    required: 'You must accept the Terms of Service and Privacy Policy',
                  })}
                />
                <Check
                  aria-hidden="true"
                  strokeWidth={3}
                  className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="cursor-pointer text-gray-600 dark:text-slate-300">
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-primary transition-colors hover:text-primary-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-primary transition-colors hover:text-primary-dark">
                    Privacy Policy
                  </Link>
                </label>
                {errors.termsAccepted && (
                  <p id="termsAccepted-error" className="mt-1 text-xs text-red-600">{errors.termsAccepted.message}</p>
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
          
          <GoogleSignInButton
            intent="signup"
            onError={(message) => {
              setError(message);
              setShowLoginLink(false);
            }}
          />

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary transition-colors hover:text-primary-dark">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
