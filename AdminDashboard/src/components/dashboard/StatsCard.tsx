import React from 'react';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color
}) => {
  return <div className="bg-white rounded-lg shadow p-5 border-l-4" style={{
    borderLeftColor: color
  }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && <p className={`text-xs flex items-center mt-1 ${trend.isPositive ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{trend.value}% from last month</span>
            </p>}
        </div>
        <div className="p-3 rounded-full" style={{
        backgroundColor: `${color}15`
      }}>
          <div style={{
          color
        }}>
            {icon}
          </div>
        </div>
      </div>
    </div>;
};