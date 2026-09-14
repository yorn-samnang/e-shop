'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGoogleIdentityService } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiErrors';

type Props = {
  intent: 'signin' | 'signup';
  onError: (message: string) => void;
};

export default function GoogleSignInButton({ intent, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle } = useAuth();
  const onErrorRef = useRef(onError);
  const signInRef = useRef(signInWithGoogle);

  useEffect(() => {
    onErrorRef.current = onError;
    signInRef.current = signInWithGoogle;
  }, [onError, signInWithGoogle]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    let cancelled = false;

    if (!clientId) {
      setIsPreparing(false);
      onErrorRef.current('Google sign-in is not configured. Add a Google Web client ID to Ecommerce/.env.');
      return;
    }

    loadGoogleIdentityService()
      .then((google) => {
        if (cancelled || !containerRef.current) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            if (!credential) {
              onErrorRef.current('Google did not return a sign-in credential. Please try again.');
              return;
            }

            setIsSubmitting(true);
            onErrorRef.current('');
            try {
              await signInRef.current(credential);
            } catch (error) {
              onErrorRef.current(getApiErrorMessage(error, 'Google sign-in failed. Please try again.'));
            } finally {
              setIsSubmitting(false);
            }
          },
        });

        const width = Math.min(400, Math.max(240, containerRef.current.clientWidth));
        containerRef.current.replaceChildren();
        google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: intent === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width,
        });
        setIsPreparing(false);
      })
      .catch((error) => {
        if (cancelled) return;
        setIsPreparing(false);
        onErrorRef.current(getApiErrorMessage(error, 'Google sign-in could not be loaded.'));
      });

    return () => {
      cancelled = true;
    };
  }, [intent]);

  return (
    <div className="relative flex min-h-11 w-full justify-center">
      {isPreparing && (
        <div className="flex h-11 w-full items-center justify-center rounded-lg border border-divider text-sm text-text-secondary">
          Loading Google sign-in…
        </div>
      )}
      <div
        ref={containerRef}
        className={`${isPreparing ? 'absolute inset-0 opacity-0' : 'w-full'} ${isSubmitting ? 'pointer-events-none opacity-40' : ''}`}
      />
      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 text-sm font-medium text-text-primary dark:bg-slate-900/80">
          Signing you in…
        </div>
      )}
    </div>
  );
}
