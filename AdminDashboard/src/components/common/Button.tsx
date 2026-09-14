import React from 'react';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  onClick,
  type = 'button',
  disabled = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark text-white';
      case 'secondary':
        return 'bg-primary-light hover:bg-primary text-white';
      case 'success':
        return 'bg-[#10B981] hover:bg-[#059669] text-white';
      case 'danger':
        return 'bg-[#DC2626] hover:bg-[#b91c1c] text-white';
      case 'warning':
        return 'bg-[#F59E0B] hover:bg-[#d97706] text-white';
      case 'outline':
        return 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700';
      default:
        return 'bg-primary hover:bg-primary-dark text-white';
    }
  };
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1.5 px-3';
      case 'md':
        return 'text-sm py-2 px-4';
      case 'lg':
        return 'text-base py-2.5 px-5';
      default:
        return 'text-sm py-2 px-4';
    }
  };
  return <button type={type} className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        flex items-center justify-center transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `} onClick={onClick} disabled={disabled}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>;
};
