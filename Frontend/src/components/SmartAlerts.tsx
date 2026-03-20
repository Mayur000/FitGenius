import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Droplets, Brain, Heart, X, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  message: string;
  category: 'stress' | 'nutrition' | 'fitness' | 'health';
  timestamp: Date;
  actionable?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export const SmartAlerts: React.FC = () => {
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Stress Detected',
      message: 'Your stress levels have been elevated for 3 consecutive days. Consider meditation or a relaxing walk.',
      category: 'stress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionable: true,
      actionText: 'Start Meditation',
      onAction: () => console.log('Starting meditation...')
    },
    {
      id: '2',
      type: 'info',
      title: 'Protein Deficit',
      message: 'You\'re 25g short on your protein goal today. Add a high-protein snack to meet your target.',
      category: 'nutrition',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      actionable: true,
      actionText: 'Suggest Snacks',
      onAction: () => console.log('Showing protein snacks...')
    },
    {
      id: '3',
      type: 'success',
      title: 'Workout Streak!',
      message: 'Congratulations! You\'ve maintained a 7-day workout streak. Keep up the great work!',
      category: 'fitness',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      actionable: false
    },
    {
      id: '4',
      type: 'critical',
      title: 'Hydration Alert',
      message: 'You\'re significantly behind on water intake today. Risk of dehydration detected.',
      category: 'health',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      actionable: true,
      actionText: 'Log Water',
      onAction: () => console.log('Opening water logger...')
    }
  ]);

  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle size={20} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      case 'info': return <TrendingUp size={20} className="text-blue-500" />;
      default: return <Brain size={20} className="text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stress': return <Brain size={16} className="text-purple-500" />;
      case 'nutrition': return <Heart size={16} className="text-green-500" />;
      case 'fitness': return <TrendingUp size={16} className="text-blue-500" />;
      case 'health': return <Droplets size={16} className="text-cyan-500" />;
      default: return <Brain size={16} className="text-gray-500" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">AI Insights & Alerts</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Brain size={16} className="mr-1" />
          <span>{activeAlerts.length} active</span>
        </div>
      </div>

      <AnimatePresence>
        {activeAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <CheckCircle size={48} className="mx-auto mb-3 text-green-500 opacity-50" />
            <p>All systems optimal! No alerts at this time.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg border ${getAlertStyle(alert.type)} relative`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                        {getCategoryIcon(alert.category)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        {alert.actionable && alert.actionText && (
                          <button
                            onClick={alert.onAction}
                            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            {alert.actionText} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Alert Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-500">
              {alerts.filter(a => a.type === 'critical').length}
            </div>
            <div className="text-xs text-gray-500">Critical</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-500">
              {alerts.filter(a => a.type === 'warning').length}
            </div>
            <div className="text-xs text-gray-500">Warnings</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-500">
              {alerts.filter(a => a.type === 'info').length}
            </div>
            <div className="text-xs text-gray-500">Insights</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-500">
              {alerts.filter(a => a.type === 'success').length}
            </div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
        </div>
      </div>
    </div>
  );
};
