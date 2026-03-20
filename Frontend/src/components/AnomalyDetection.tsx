import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

interface Anomaly {
  id: string;
  type: 'weight_spike' | 'sleep_disruption' | 'calorie_drop' | 'activity_decline' | 'heart_rate_irregularity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  value: number;
  normalRange: { min: number; max: number };
  detectedAt: Date;
  recommendations: string[];
}

export const AnomalyDetection: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      type: 'weight_spike',
      severity: 'high',
      title: 'Unusual Weight Increase',
      description: 'Weight increased by 3.2kg in 24 hours, significantly above your normal variation',
      value: 78.5,
      normalRange: { min: 73.0, max: 75.5 },
      detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recommendations: [
        'Review recent dietary changes',
        'Check for sodium retention',
        'Monitor hydration levels'
      ]
    },
    {
      id: '2',
      type: 'sleep_disruption',
      severity: 'medium',
      title: 'Sleep Pattern Disruption',
      description: 'Sleep quality dropped 40% from your 7-day average with 2.5 hours less deep sleep',
      value: 5.2,
      normalRange: { min: 7.0, max: 8.5 },
      detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      recommendations: [
        'Avoid screens 1 hour before bed',
        'Consider stress management techniques',
        'Maintain consistent sleep schedule'
      ]
    },
    {
      id: '3',
      type: 'calorie_drop',
      severity: 'medium',
      title: 'Caloric Intake Anomaly',
      description: 'Daily calories dropped 45% below target, potentially affecting performance',
      value: 1210,
      normalRange: { min: 2000, max: 2500 },
      detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      recommendations: [
        'Review meal timing and frequency',
        'Check for appetite changes',
        'Consider consulting nutritionist'
      ]
    },
    {
      id: '4',
      type: 'activity_decline',
      severity: 'low',
      title: 'Activity Level Decline',
      description: 'Step count decreased 35% over 3 days while maintaining normal routine',
      value: 6520,
      normalRange: { min: 8000, max: 12000 },
      detectedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      recommendations: [
        'Check for injury or illness',
        'Review recent workout intensity',
        'Consider active recovery techniques'
      ]
    },
    {
      id: '5',
      type: 'heart_rate_irregularity',
      severity: 'critical',
      title: 'Heart Rate Irregularity',
      description: 'Resting heart rate showed unusual patterns with 15% variability increase',
      value: 95,
      normalRange: { min: 60, max: 80 },
      detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      recommendations: [
        'Immediate medical consultation recommended',
        'Avoid intense physical activity',
        'Monitor for additional symptoms'
      ]
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weight_spike': return <TrendingUp size={20} />;
      case 'sleep_disruption': return <Activity size={20} />;
      case 'calorie_drop': return <TrendingDown size={20} />;
      case 'activity_decline': return <Activity size={20} />;
      case 'heart_rate_irregularity': return <AlertTriangle size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hours ago`;
    } else {
      return 'Just now';
    }
  };

  const dismissAnomaly = (id: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Anomaly Detection</h2>
          <p className="text-sm text-gray-600">AI-powered pattern recognition</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <AlertTriangle size={16} />
          <span>{anomalies.length} active anomalies</span>
        </div>
      </div>

      {/* Anomaly List */}
      <div className="space-y-4">
        {anomalies.map((anomaly) => (
          <motion.div
            key={anomaly.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Icon and Type */}
                <div className={`p-2 rounded-lg ${getSeverityColor(anomaly.severity)}`}>
                  {getTypeIcon(anomaly.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{anomaly.title}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{anomaly.description}</p>
                  
                  {/* Value and Normal Range */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Current:</span>
                      <span className="text-lg font-bold text-gray-800">{anomaly.value}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Normal:</span>
                      <span className="text-sm text-gray-600">
                        {anomaly.normalRange.min} - {anomaly.normalRange.max}
                      </span>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {anomaly.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Dismiss Button */}
              <button
                onClick={() => dismissAnomaly(anomaly.id)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Timestamp */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
              <Clock size={12} />
              <span>{formatTimeAgo(anomaly.detectedAt)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Anomaly Summary</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600">
              {anomalies.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-xs text-gray-600">Critical</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {anomalies.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-xs text-gray-600">High</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {anomalies.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-xs text-gray-600">Medium</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {anomalies.filter(a => a.severity === 'low').length}
            </div>
            <div className="text-xs text-gray-600">Low</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">AI Pattern Analysis</h4>
            <p className="text-sm text-blue-800 mb-2">
              Detected 5 anomalies in the last 7 days. Your patterns show increased stress indicators 
              and potential recovery issues. Consider adjusting training intensity and sleep schedule.
            </p>
            <div className="flex items-center space-x-4 text-sm text-blue-800">
              <span>Pattern Score:</span>
              <span className="font-bold">72/100</span>
              <span className="text-blue-600">(Action Required)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
