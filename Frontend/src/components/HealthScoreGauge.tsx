import React from 'react';
import { motion } from 'framer-motion';

interface HealthScoreGaugeProps {
  score: number;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // primary - green
    if (score >= 60) return '#f97316'; // accent - orange
    return '#ef4444'; // red
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
        </svg>
        
        {/* Progress circle */}
        <motion.svg 
          className="transform -rotate-90 w-48 h-48 absolute top-0 left-0"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke={getScoreColor(score)}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </motion.svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div 
              className="text-4xl font-bold"
              style={{ color: getScoreColor(score) }}
            >
              {score}
            </div>
            <div className="text-sm text-gray-500 mt-1">out of 100</div>
            <div 
              className="text-sm font-medium mt-2"
              style={{ color: getScoreColor(score) }}
            >
              {getScoreMessage(score)}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Score breakdown */}
      <div className="mt-6 w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Exercise</span>
          <span className="font-medium">85%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Nutrition</span>
          <span className="font-medium">72%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sleep</span>
          <span className="font-medium">80%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Hydration</span>
          <span className="font-medium">75%</span>
        </div>
      </div>
    </div>
  );
};
