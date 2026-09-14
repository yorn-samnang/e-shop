'use client';

import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import Input from './Input';

type PasswordInputProps = Omit<ComponentPropsWithoutRef<typeof Input>, 'type' | 'endAdornment'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="rounded p-1 text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
