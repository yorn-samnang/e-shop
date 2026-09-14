// 'use client';

// import React, { ButtonHTMLAttributes } from 'react';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'primary' | 'secondary' | 'outline' | 'danger';
//   size?: 'sm' | 'md' | 'lg';
//   isLoading?: boolean;
//   fullWidth?: boolean;
//   children: React.ReactNode;
// }

// const Button: React.FC<ButtonProps> = ({
//   variant = 'primary',
//   size = 'md',
//   isLoading = false,
//   fullWidth = false,
//   children,
//   className = '',
//   disabled,
//   ...props
// }) => {
//   const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

//   const variants = {
//     primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
//     secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus-visible:ring-secondary-500',
//     outline: 'border border-secondary-300 bg-transparent hover:bg-secondary-100 focus-visible:ring-secondary-500',
//     danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
//   };

//   const sizes = {
//     sm: 'h-8 px-3 text-xs',
//     md: 'h-10 px-4 py-2',
//     lg: 'h-12 px-6 py-3 text-lg',
//   };

//   const widthClass = fullWidth ? 'w-full' : '';

//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
//       disabled={disabled || isLoading}
//       {...props}
//     >
//       {isLoading ? (
//         <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-current" />
//       ) : null}
//       {children}
//     </button>
//   );
// };

// export default Button;

'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark focus-visible:ring-primary-light',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-400',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-current" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
