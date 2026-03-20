import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, AlertTriangle, TrendingUp, Info, Shield } from 'lucide-react';

interface RiskFactor {
  name: string;
  value: number;
  status: 'low' | 'moderate' | 'high' | 'optimal';
  impact: 'positive' | 'negative';
  description: string;
}

interface DiseaseRisk {
  disease: string;
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  factors: RiskFactor[];
  recommendations: string[];
  icon: React.ReactNode;
}

export const DiseaseRiskScoring: React.FC = () => {
  const diseaseRisks: DiseaseRisk[] = [
    {
      disease: 'Type 2 Diabetes',
      overallRisk: 23,
      riskLevel: 'low',
      icon: <Brain size={24} className="text-purple-500" />,
      factors: [
        {
          name: 'Blood Glucose',
          value: 85,
          status: 'optimal',
          impact: 'positive',
          description: 'Fasting glucose levels are within healthy range'
        },
        {
          name: 'BMI',
          value: 24.1,
          status: 'moderate',
          impact: 'negative',
          description: 'Slightly elevated BMI increases risk'
        },
        {
          name: 'Physical Activity',
          value: 78,
          status: 'optimal',
          impact: 'positive',
          description: 'Regular exercise significantly reduces risk'
        },
        {
          name: 'Age',
          value: 35,
          status: 'low',
          impact: 'positive',
          description: 'Age is within lower risk category'
        }
      ],
      recommendations: [
        'Maintain current exercise routine',
        'Focus on weight management to reach BMI 22-24',
        'Continue balanced diet with low glycemic foods',
        'Annual health screenings recommended'
      ]
    },
    {
      disease: 'Hypertension',
      overallRisk: 31,
      riskLevel: 'moderate',
      icon: <Heart size={24} className="text-red-500" />,
      factors: [
        {
          name: 'Blood Pressure',
          value: 125/82,
          status: 'moderate',
          impact: 'negative',
          description: 'Slightly elevated blood pressure'
        },
        {
          name: 'Sodium Intake',
          value: 3200,
          status: 'moderate',
          impact: 'negative',
          description: 'Above recommended daily limit'
        },
        {
          name: 'Stress Levels',
          value: 65,
          status: 'moderate',
          impact: 'negative',
          description: 'Elevated stress affects blood pressure'
        },
        {
          name: 'Cardio Fitness',
          value: 72,
          status: 'optimal',
          impact: 'positive',
          description: 'Good cardiovascular fitness'
        }
      ],
      recommendations: [
        'Reduce sodium intake to <2300mg/day',
        'Practice stress management techniques',
        'Increase aerobic exercise to 150min/week',
        'Monitor blood pressure weekly'
      ]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'very-high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskProgressColor = (value: number) => {
    if (value <= 25) return 'bg-green-500';
    if (value <= 50) return 'bg-yellow-500';
    if (value <= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getFactorStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600';
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Disease Risk Assessment</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Shield size={16} className="mr-1" />
          <span>ML-Powered Analysis</span>
        </div>
      </div>

      {diseaseRisks.map((risk, index) => (
        <motion.div
          key={risk.disease}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          {/* Disease Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {risk.icon}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{risk.disease}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getRiskColor(risk.riskLevel)}`}>
                    {risk.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className="text-sm text-gray-500">
                    {risk.overallRisk}% probability
                  </span>
                </div>
              </div>
            </div>
            
            {/* Risk Progress Circle */}
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={getRiskProgressColor(risk.overallRisk)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - risk.overallRisk / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{risk.overallRisk}%</span>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Risk Factors Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {risk.factors.map((factor) => (
                <div key={factor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800">{factor.name}</span>
                      {factor.impact === 'positive' ? (
                        <TrendingUp size={16} className="text-green-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                  <div className="text-right ml-3">
                    <div className={`font-semibold ${getFactorStatusColor(factor.status)}`}>
                      {typeof factor.value === 'number' ? factor.value : factor.value}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{factor.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">AI Recommendations</h4>
                <ul className="space-y-1">
                  {risk.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="text-sm text-blue-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Overall Health Summary */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Overall Health Outlook</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-sm opacity-90">Health Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold">LOW</div>
            <div className="text-sm opacity-90">Overall Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold">+3.2</div>
            <div className="text-sm opacity-90">Years (Life Expectancy)</div>
          </div>
        </div>
        <p className="mt-4 text-sm opacity-90">
          Your current health metrics indicate strong overall wellness with minimal disease risk factors. 
          Continue maintaining your healthy lifestyle for optimal long-term outcomes.
        </p>
      </div>
    </div>
  );
};
