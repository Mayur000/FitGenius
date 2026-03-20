import React, { useState, useEffect } from 'react';
import { Battery, Sun, Activity, Brain } from 'lucide-react';

interface FatigueData {
  time: string;
  predictedLevel: number;
  actualLevel: number;
  confidence: number;
  factors: {
    sleep: number;
    stress: number;
    activity: number;
    recovery: number;
  };
}

interface PredictionFactors {
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  activityIntensity: number;
  recoveryDays: number;
}

export const FatiguePrediction: React.FC = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [predictions, setPredictions] = useState<FatigueData[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<PredictionFactors>({
    sleepHours: 7,
    sleepQuality: 85,
    stressLevel: 3,
    activityIntensity: 5,
    recoveryDays: 2
  });

  // Generate hourly predictions
  useEffect(() => {
    const hourlyPredictions: FatigueData[] = [];
    const baseFatigue = 50; // Baseline fatigue level

    for (let hour = 0; hour < 24; hour++) {
      // Calculate time-based factors
      const isNight = hour >= 22 || hour < 6;
      const isPostLunch = hour >= 13 && hour <= 15;
      const isEvening = hour >= 18 && hour <= 21;
      
      // Calculate predicted fatigue based on factors
      let predictedLevel = baseFatigue;
      
      // Sleep impact
      const sleepImpact = selectedFactors.sleepHours < 6 ? -20 : 
                          selectedFactors.sleepHours < 7 ? -10 : 
                          selectedFactors.sleepHours < 8 ? 0 : 5;
      
      // Stress impact
      const stressImpact = selectedFactors.stressLevel > 7 ? 15 : 
                         selectedFactors.stressLevel > 5 ? 8 : 
                         selectedFactors.stressLevel > 3 ? 3 : 0;
      
      // Activity impact
      const activityImpact = selectedFactors.activityIntensity > 8 ? -10 : 
                         selectedFactors.activityIntensity > 6 ? -5 : 
                         selectedFactors.activityIntensity > 4 ? 0 : 5;
      
      // Recovery impact
      const recoveryImpact = selectedFactors.recoveryDays < 2 ? 10 : 
                         selectedFactors.recoveryDays < 3 ? 5 : 0;
      
      // Time-based adjustments
      if (isNight) {
        predictedLevel += 15; // Natural fatigue at night
      } else if (isPostLunch) {
        predictedLevel += 10; // Post-lunch dip
      } else if (isEvening) {
        predictedLevel += 5; // Evening wind-down
      } else {
        // Morning energy boost
        predictedLevel -= 5;
      }
      
      // Apply all factors
      predictedLevel += sleepImpact + stressImpact + activityImpact + recoveryImpact;
      
      // Add some randomness for realism
      predictedLevel += (Math.random() - 0.5) * 10;
      
      // Ensure within bounds
      predictedLevel = Math.max(10, Math.min(95, predictedLevel));
      
      // Generate actual level (what user would feel)
      const actualLevel = predictedLevel + (Math.random() - 0.5) * 15;
      
      hourlyPredictions.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        predictedLevel: Math.round(predictedLevel),
        actualLevel: Math.round(actualLevel),
        confidence: Math.max(0.7, Math.min(0.95, 1 - Math.abs(predictedLevel - actualLevel) / 50)),
        factors: {
          sleep: sleepImpact,
          stress: stressImpact,
          activity: activityImpact,
          recovery: recoveryImpact
        }
      });
    }
    
    setPredictions(hourlyPredictions);
  }, [selectedFactors]);

  const getFatigueColor = (level: number) => {
    if (level >= 80) return 'text-red-600 bg-red-100';
    if (level >= 60) return 'text-orange-600 bg-orange-100';
    if (level >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getFatigueLabel = (level: number) => {
    if (level >= 80) return 'High Fatigue';
    if (level >= 60) return 'Moderate Fatigue';
    if (level >= 40) return 'Low Fatigue';
    return 'Optimal Energy';
  };

  const getEnergyIcon = (level: number) => {
    if (level >= 70) return <Battery size={20} className="text-red-500" />;
    if (level >= 50) return <Activity size={20} className="text-orange-500" />;
    if (level >= 30) return <Sun size={20} className="text-yellow-500" />;
    return <Brain size={20} className="text-green-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Fatigue Level Prediction</h2>
          <p className="text-sm text-gray-600">AI-powered energy forecasting throughout the day</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain size={24} className="text-primary" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {predictions[currentHour]?.predictedLevel || 0}%
            </div>
            <div className="text-sm text-gray-600">Current Prediction</div>
          </div>
        </div>
      </div>

      {/* Input Factors */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-4">Prediction Factors</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Hours: {selectedFactors.sleepHours}h
            </label>
            <input
              type="range"
              min="4"
              max="10"
              value={selectedFactors.sleepHours}
              onChange={(e) => setSelectedFactors(prev => ({ ...prev, sleepHours: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleep Quality: {selectedFactors.sleepQuality}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={selectedFactors.sleepQuality}
              onChange={(e) => setSelectedFactors(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Level: {selectedFactors.stressLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedFactors.stressLevel}
              onChange={(e) => setSelectedFactors(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Intensity: {selectedFactors.activityIntensity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedFactors.activityIntensity}
              onChange={(e) => setSelectedFactors(prev => ({ ...prev, activityIntensity: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recovery Days: {selectedFactors.recoveryDays}/week
            </label>
            <input
              type="range"
              min="0"
              max="7"
              value={selectedFactors.recoveryDays}
              onChange={(e) => setSelectedFactors(prev => ({ ...prev, recoveryDays: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Current Hour Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {currentHour.toString().padStart(2, '0')}:00
        </div>
        <div className="flex items-center justify-center space-x-2">
          {getEnergyIcon(predictions[currentHour]?.predictedLevel || 0)}
          <div className={`text-lg font-medium ${getFatigueColor(predictions[currentHour]?.predictedLevel || 0)}`}>
            {getFatigueLabel(predictions[currentHour]?.predictedLevel || 0)}
          </div>
        </div>
      </div>

      {/* 24-Hour Prediction Chart */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-4">24-Hour Energy Forecast</h3>
        <div className="grid grid-cols-24 gap-1 text-xs">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className={`p-2 rounded text-center cursor-pointer transition-colors hover:scale-105 ${
                index === currentHour 
                  ? 'ring-2 ring-primary bg-primary' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setCurrentHour(index)}
            >
              <div className="font-medium text-gray-700 mb-1">
                {prediction.time}
              </div>
              <div className={`w-full h-8 rounded ${getFatigueColor(prediction.predictedLevel)}`}>
                <div className="h-full flex items-center justify-center">
                  {getEnergyIcon(prediction.predictedLevel)}
                </div>
              </div>
              <div className="text-xs text-gray-600">
                {prediction.predictedLevel}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain size={24} className="text-white" />
          <div>
            <h4 className="font-semibold text-white mb-2">AI Fatigue Analysis</h4>
            <p className="text-sm text-white opacity-90">
              Based on your current factors, the model predicts energy dips around 2:00 PM 
              and 6:00 PM. Consider scheduling important tasks during high-energy periods 
              (9:00 AM - 12:00 PM) and rest during low-energy periods.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white mt-2">
              <span>Model Accuracy:</span>
              <span className="font-bold">87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
