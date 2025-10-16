import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUserActivityData } from '../hooks/useUserActivityData';
import Spinner from './Spinner';

const UserActivityChart: React.FC = () => {
  const { data, loading, error } = useUserActivityData();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: 300 }}>
        <Spinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: 300 }}>
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-sm">
            خطأ في تحميل بيانات المستخدمين
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: 300 }}>
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            لا توجد بيانات متاحة
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#fff'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="إجمالي المستخدمين" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="مستخدمين جدد" stroke="#c084fc" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;