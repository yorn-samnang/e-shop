'use client';

import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
  };

  return (
    <div 
      className={`rounded-lg ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;