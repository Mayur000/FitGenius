import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface PersonalRecord {
  id?: string;
  exercise: string;
  weight?: number;
  reps?: number;
  value?: number | string;
  unit?: string;
  date: string;
  type: 'strength' | 'endurance';
}

interface OneRepMax {
  exercise: string;
  estimated1RM: number;
  currentBest: number;
  progression: number[];
  lastUpdated: string;
}

interface ExerciseVolume {
  exercise: string;
  totalVolume: number;
  volumeByMuscleGroup: { [group: string]: number };
  trend: 'increasing' | 'stable' | 'decreasing';
}

export const ProgressionAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('3months');
  const [selectedView, setSelectedView] = useState<'overview' | 'strength' | 'endurance'>('overview');

  // Mock data for 1RM estimates
  const oneRepMaxData: OneRepMax[] = [
    {
      exercise: 'Bench Press',
      estimated1RM: 185,
      currentBest: 180,
      progression: [165, 170, 175, 180],
      lastUpdated: '2024-03-15'
    },
    {
      exercise: 'Squat',
      estimated1RM: 225,
      currentBest: 220,
      progression: [200, 210, 215, 220, 225],
      lastUpdated: '2024-03-14'
    },
    {
      exercise: 'Deadlift',
      estimated1RM: 280,
      currentBest: 275,
      progression: [250, 260, 265, 275, 280],
      lastUpdated: '2024-03-13'
    },
    {
      exercise: 'Overhead Press',
      estimated1RM: 95,
      currentBest: 90,
      progression: [80, 85, 88, 90],
      lastUpdated: '2024-03-12'
    }
  ];

  // Mock data for exercise volume
  const volumeData: ExerciseVolume[] = [
    {
      exercise: 'Bench Press',
      totalVolume: 15400,
      volumeByMuscleGroup: {
        'chest': 8500,
        'shoulders': 3200,
        'triceps': 3700
      },
      trend: 'increasing'
    },
    {
      exercise: 'Squat',
      totalVolume: 28500,
      volumeByMuscleGroup: {
        'quadriceps': 12000,
        'glutes': 8500,
        'hamstrings': 8000
      },
      trend: 'stable'
    },
    {
      exercise: 'Deadlift',
      totalVolume: 18900,
      volumeByMuscleGroup: {
        'back': 9500,
        'glutes': 4700,
        'hamstrings': 4700
      },
      trend: 'increasing'
    }
  ];

  // Mock personal records
  const personalRecords: PersonalRecord[] = [
    { id: '1', exercise: 'Bench Press', value: 180, unit: 'lbs', date: '2024-03-10', type: 'strength' },
    { id: '2', exercise: 'Squat', value: 225, unit: 'lbs', date: '2024-03-08', type: 'strength' },
    { id: '3', exercise: 'Deadlift', value: 280, unit: 'lbs', date: '2024-03-05', type: 'strength' },
    { id: '4', exercise: '5K Run', value: '22:30', unit: 'time', date: '2024-03-01', type: 'endurance' },
    { id: '5', exercise: 'Pull-ups', value: 25, unit: 'reps', date: '2024-02-28', type: 'endurance' }
  ];

  const getProgressionColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'stable': return 'text-yellow-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRecordTypeColor = (type: string) => {
    return type === 'strength' ? 'bg-purple-500' : 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Progression Analytics</h2>
          <p className="text-sm text-gray-600">Track your strength and endurance improvements</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy size={20} className="text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">5 Personal Records</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-green-500" />
            <span className="text-sm font-medium text-gray-700">3 New PRs This Month</span>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2 mb-6">
        {['1month', '3months', '6months', '1year'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period === '1month' && '1 Month'}
            {period === '3months' && '3 Months'}
            {period === '6months' && '6 Months'}
            {period === '1year' && '1 Year'}
          </button>
        ))}
      </div>

      {/* View Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setSelectedView('overview')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'overview'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Target size={20} className="mr-2" />
          Overview
        </button>
        <button
          onClick={() => setSelectedView('strength')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'strength'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Trophy size={20} className="mr-2" />
          Strength
        </button>
        <button
          onClick={() => setSelectedView('endurance')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'endurance'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar size={20} className="mr-2" />
          Endurance
        </button>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-primary font-medium">Personal Records</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-700 font-medium">New PRs (30 days)</div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">+12%</div>
              <div className="text-sm text-yellow-700 font-medium">Avg Strength Gain</div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+8%</div>
              <div className="text-sm text-blue-700 font-medium">Avg Endurance Gain</div>
            </div>
          </div>

          {/* 1RM Estimates Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">1RM Progression</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oneRepMaxData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="exercise" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow-lg text-left">
                            <div className="font-semibold text-gray-800">{data.exercise}</div>
                            <div className="text-sm text-gray-600">
                              <div>Current: {data.currentBest} lbs</div>
                              <div>Estimated: {data.estimated1RM} lbs</div>
                              <div>Progression: <span className={getProgressionColor('stable')}>Stable</span></div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="currentBest"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    name="Current Best"
                  />
                  <Line 
                    type="monotone"
                    dataKey="estimated1RM"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    name="Estimated 1RM"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Distribution Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Volume Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="exercise" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow-lg text-left">
                            <div className="font-semibold text-gray-800">{data.exercise}</div>
                            <div className="text-sm text-gray-600">
                              <div>Total Volume: {data.totalVolume?.toLocaleString()}</div>
                              <div>Trend: <span className={getProgressionColor(data.trend)}>{data.trend}</span></div>
                            </div>
                            <div className="mt-1">
                              {Object.entries(data.volumeByMuscleGroup || {}).map(([group, volume]: any) => (
                                <div key={group} className="text-xs">
                                  <span className="font-medium capitalize">{group}:</span> {volume?.toLocaleString()}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="totalVolume" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Strength View */}
      {selectedView === 'strength' && (
        <div className="space-y-6">
          {/* Personal Records */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Strength Personal Records</h3>
            <div className="space-y-3">
              {personalRecords
                .filter(record => record.type === 'strength')
                .map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getRecordTypeColor(record.type)}`}>
                        <Award size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{record.exercise}</div>
                        <div className="text-sm text-gray-600">{record.date}</div>
                        <div className="text-lg font-bold text-gray-900">
                          {record.value} {record.unit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Trophy size={16} className="text-yellow-500" />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Endurance View */}
      {selectedView === 'endurance' && (
        <div className="space-y-6">
          {/* Personal Records */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Endurance Personal Records</h3>
            <div className="space-y-3">
              {personalRecords
                .filter(record => record.type === 'endurance')
                .map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getRecordTypeColor(record.type)}`}>
                        <Award size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{record.exercise}</div>
                        <div className="text-sm text-gray-600">{record.date}</div>
                        <div className="text-lg font-bold text-gray-900">
                          {record.value} {record.unit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Trophy size={16} className="text-blue-500" />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg">
        <div className="flex items-start space-x-3">
          <Trophy size={24} className="text-white" />
          <div>
            <h4 className="font-semibold text-white mb-2">AI Performance Analysis</h4>
            <p className="text-sm text-white opacity-90">
              Based on your progression data, you're showing excellent strength gains with 12% average improvement 
              and consistent endurance progression. Your current training volume is optimal for your experience level.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white">
              <span>Strength Projection:</span>
              <span className="font-bold">+15% by 6 months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
