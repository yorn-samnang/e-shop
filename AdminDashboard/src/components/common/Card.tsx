import React from 'react';
interface CardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}
export const Card: React.FC<CardProps> = ({
  children,
  title,
  actions,
  className = ''
}) => {
  return <div className={`bg-white rounded-lg shadow ${className}`}>
      {(title || actions) && <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>}
      <div className="p-5">{children}</div>
    </div>;
};