import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface SalesData {
  name: string;
  value: number;
}
interface SalesChartProps {
  dailyData: SalesData[];
  weeklyData: SalesData[];
  monthlyData: SalesData[];
}
type TimeRange = 'daily' | 'weekly' | 'monthly';
export const SalesChart: React.FC<SalesChartProps> = ({
  dailyData,
  weeklyData,
  monthlyData
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const data = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData
  };
  return <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Sales Overview</h3>
        <div className="flex space-x-2">
          <button onClick={() => setTimeRange('daily')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'daily' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Daily
          </button>
          <button onClick={() => setTimeRange('weekly')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'weekly' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Weekly
          </button>
          <button onClick={() => setTimeRange('monthly')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'monthly' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Monthly
          </button>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data[timeRange]} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#C2410C" fill="#C2410C" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>;
};
