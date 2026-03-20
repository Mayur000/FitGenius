import React, { useState } from 'react';
import { Activity, Shield, FileText } from 'lucide-react';
import { ExpandedVitals } from './ExpandedVitals';
import { HeatmapCalendar } from './HeatmapCalendar';
import { DiseaseRiskScoring } from './DiseaseRiskScoring';
import { AnomalyDetection } from './AnomalyDetection';
import { FatiguePrediction } from './FatiguePrediction';
import { WeeklyWellnessReports } from './WeeklyWellnessReports';
import { AdBanner } from './AdBanner';

export const HealthTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'reports'>('overview');

  return (
    <div className="px-4 py-4 space-y-4 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Health Tracker</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-primary shadow-soft'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Activity size={16} className="mr-1 sm:mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'analysis'
              ? 'bg-white text-primary shadow-soft'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Shield size={16} className="mr-1 sm:mr-2" />
          Analysis
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'reports'
              ? 'bg-white text-primary shadow-soft'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileText size={16} className="mr-1 sm:mr-2" />
          Reports
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <ExpandedVitals />
            <AdBanner variant="health" />
            <HeatmapCalendar />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <DiseaseRiskScoring />
            <AnomalyDetection />
            <FatiguePrediction />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <WeeklyWellnessReports />
          </div>
        )}
      </div>
    </div>
  );
};
