import React from 'react';
type StatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'active' | 'inactive' | 'low' | 'in-stock';
interface StatusPillProps {
  status: StatusType;
}
export const StatusPill: React.FC<StatusPillProps> = ({
  status
}) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>;
};