import React, { useMemo } from 'react';
import { HealthScoreGauge } from './HealthScoreGauge';
import { WeeklyTrends } from './WeeklyTrends';
import { QuickLog } from './QuickLog';
import { SmartAlerts } from './SmartAlerts';
import { BMITrendForecast } from './BMITrendForecast';
import { AdBanner } from './AdBanner';

export const Dashboard: React.FC = () => {
  // Picks a random slot (0 = after alerts, 1 = after BMI, 2 = after trends) — stable per mount
  const adSlot = useMemo(() => Math.floor(Math.random() * 3), []);

  return (
    <div className="px-4 py-4 space-y-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Welcome back! 👋</h1>
        <p className="text-sm text-gray-500">Here's your health overview today</p>
      </div>

      {/* AI Insights */}
      <SmartAlerts />
      {adSlot === 0 && <AdBanner />}

      {/* Health Score Card */}
      <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Daily Health Score</h2>
        <HealthScoreGauge score={78} />
      </div>

      {/* BMI Trend Forecast */}
      <BMITrendForecast />
      {adSlot === 1 && <AdBanner />}

      {/* Weekly Trends */}
      <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Weekly Trends</h2>
        <WeeklyTrends />
      </div>
      {adSlot === 2 && <AdBanner />}

      {/* Quick Log */}
      <QuickLog />
    </div>
  );
};
