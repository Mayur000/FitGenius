import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const weeklyData = [
  { day: 'Mon', calories: 2100, steps: 8500 },
  { day: 'Tue', calories: 2300, steps: 10200 },
  { day: 'Wed', calories: 1900, steps: 7800 },
  { day: 'Thu', calories: 2200, steps: 9100 },
  { day: 'Fri', calories: 2400, steps: 11000 },
  { day: 'Sat', calories: 2600, steps: 6500 },
  { day: 'Sun', calories: 2000, steps: 5000 }
];

export const WeeklyTrends: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Calories Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Daily Calories</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="calories" 
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Steps Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Daily Steps</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="steps" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">8,543</div>
          <div className="text-sm text-gray-600">Avg Steps</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">2,214</div>
          <div className="text-sm text-gray-600">Avg Calories</div>
        </div>
      </div>
    </div>
  );
};
