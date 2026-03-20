import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

interface BMIData {
  date: string;
  actual: number;
  predicted?: number;
  upperBound?: number;
  lowerBound?: number;
}


export const BMITrendForecast: React.FC = () => {
  // Historical data (last 30 days)
  const historicalData: BMIData[] = [
    { date: 'Day 1', actual: 75.2 },
    { date: 'Day 5', actual: 74.8 },
    { date: 'Day 10', actual: 74.5 },
    { date: 'Day 15', actual: 74.3 },
    { date: 'Day 20', actual: 73.9 },
    { date: 'Day 25', actual: 73.7 },
    { date: 'Day 30', actual: 73.5 }
  ];

  // Forecast data with confidence intervals
  const forecastData = [
    { 
      date: 'Day 30', 
      actual: 73.5,
      predicted: 73.5,
      upperBound: 73.8,
      lowerBound: 73.2
    },
    { 
      date: 'Day 45', 
      predicted: 72.8,
      upperBound: 73.5,
      lowerBound: 72.1
    },
    { 
      date: 'Day 60', 
      predicted: 72.1,
      upperBound: 73.0,
      lowerBound: 71.2
    },
    { 
      date: 'Day 75', 
      predicted: 71.4,
      upperBound: 72.5,
      lowerBound: 70.3
    },
    { 
      date: 'Day 90', 
      predicted: 70.7,
      upperBound: 72.0,
      lowerBound: 69.4
    }
  ];

  const combinedData = [
  ...historicalData, 
  ...forecastData.slice(1).map(item => ({ ...item, target: 72.0 }))
];

  // Forecast summary
  const forecastSummary = [
    {
      period: '30 Days',
      predictedWeight: 72.8,
      confidenceInterval: { min: 72.1, max: 73.5 },
      targetWeight: 72.0,
      trend: 'down'
    },
    {
      period: '60 Days',
      predictedWeight: 72.1,
      confidenceInterval: { min: 71.2, max: 73.0 },
      targetWeight: 72.0,
      trend: 'stable'
    },
    {
      period: '90 Days',
      predictedWeight: 70.7,
      confidenceInterval: { min: 69.4, max: 72.0 },
      targetWeight: 72.0,
      trend: 'down'
    }
  ];

  const currentBMI = 24.1;
  const targetBMI = 23.5;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {data.actual && (
            <p className="text-sm text-gray-600">Actual: {data.actual} kg</p>
          )}
          {data.predicted && (
            <p className="text-sm text-blue-600">Predicted: {data.predicted} kg</p>
          )}
          {data.upperBound && data.lowerBound && (
            <p className="text-xs text-gray-500">
              Range: {data.lowerBound} - {data.upperBound} kg
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">BMI Trend Forecast</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span className="text-gray-600">Historical</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
            <span className="text-gray-600">Predicted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-gray-600">Confidence</span>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">{currentBMI}</div>
          <div className="text-sm text-gray-600">Current BMI</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">{targetBMI}</div>
          <div className="text-sm text-gray-600">Target BMI</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">-0.8</div>
          <div className="text-sm text-gray-600">kg/month avg</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              domain={[68, 76]}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="#e5e7eb"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stroke="none"
              fill="#e5e7eb"
              fillOpacity={0.3}
            />
            
            {/* Historical Line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* Predicted Line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* Target Line */}
            <Line
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={false}
              dataKey="target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Summary Cards */}
      <div className="space-y-3">
        <h3 className="text-md font-semibold text-gray-800 mb-3">AI Predictions</h3>
        {forecastSummary.map((forecast) => (
          <div key={forecast.period} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{forecast.period}</div>
                <div className="text-xs text-gray-500">Timeframe</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{forecast.predictedWeight} kg</div>
                <div className="text-xs text-gray-500">
                  ±{((forecast.confidenceInterval.max - forecast.confidenceInterval.min) / 2).toFixed(1)} kg
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-secondary">{forecast.targetWeight} kg</div>
                <div className="text-xs text-gray-500">Target</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {forecast.trend === 'down' ? (
                <div className="flex items-center text-green-600">
                  <TrendingDown size={20} className="mr-1" />
                  <span className="text-sm font-medium">On Track</span>
                </div>
              ) : forecast.trend === 'up' ? (
                <div className="flex items-center text-red-600">
                  <TrendingUp size={20} className="mr-1" />
                  <span className="text-sm font-medium">Attention</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-600">
                  <Activity size={20} className="mr-1" />
                  <span className="text-sm font-medium">Stable</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Target size={20} className="text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">AI Insight</h4>
            <p className="text-sm text-blue-800">
              Based on your current progress, you're on track to reach your target weight within 60 days. 
              Maintain your current calorie deficit and exercise routine for optimal results. 
              Confidence in this prediction: 87%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
