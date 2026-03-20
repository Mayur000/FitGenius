import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplets, TrendingUp, Save, AlertCircle } from 'lucide-react';

interface VitalEntry {
  id: string;
  type: 'body_fat' | 'waist' | 'blood_pressure' | 'blood_glucose' | 'resting_heart_rate' | 'temperature';
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
}

interface BloodPressureEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  timestamp: Date;
  notes?: string;
}

export const ExpandedVitals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'body_composition' | 'cardiovascular' | 'metabolic'>('overview');
  const [entries, setEntries] = useState<VitalEntry[]>([]);
  const [bloodPressureEntries, setBloodPressureEntries] = useState<BloodPressureEntry[]>([]);

  // Mock historical data
  const mockEntries: VitalEntry[] = [
    {
      id: '1',
      type: 'body_fat',
      value: 18.5,
      unit: '%',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: 'Morning measurement after workout'
    },
    {
      id: '2',
      type: 'waist',
      value: 82.5,
      unit: 'cm',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Consistent with diet plan'
    },
    {
      id: '3',
      type: 'resting_heart_rate',
      value: 62,
      unit: 'bpm',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      notes: 'Excellent recovery state'
    },
    {
      id: '4',
      type: 'temperature',
      value: 36.8,
      unit: '°C',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: 'Normal range'
    }
  ];

  const mockBloodPressureEntries: BloodPressureEntry[] = [
    {
      id: '1',
      systolic: 118,
      diastolic: 78,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: 'Morning reading'
    },
    {
      id: '2',
      systolic: 122,
      diastolic: 82,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'After workout'
    },
    {
      id: '3',
      systolic: 115,
      diastolic: 75,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      notes: 'Resting measurement'
    }
  ];

  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [restingHeartRate, setRestingHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'body_fat':
      case 'waist':
        return <Activity size={20} className="text-purple-500" />;
      case 'blood_pressure':
      case 'resting_heart_rate':
        return <Heart size={20} className="text-red-500" />;
      case 'blood_glucose':
        return <Droplets size={20} className="text-blue-500" />;
      case 'temperature':
        return <TrendingUp size={20} className="text-orange-500" />;
      default:
        return <Activity size={20} className="text-gray-500" />;
    }
  };

  const getVitalLabel = (type: string) => {
    switch (type) {
      case 'body_fat': return 'Body Fat %';
      case 'waist': return 'Waist Circumference';
      case 'blood_pressure': return 'Blood Pressure';
      case 'blood_glucose': return 'Blood Glucose';
      case 'resting_heart_rate': return 'Resting Heart Rate';
      case 'temperature': return 'Body Temperature';
      default: return 'Vital';
    }
  };

  const getVitalColor = (type: string) => {
    switch (type) {
      case 'body_fat':
      case 'waist':
        return 'text-purple-600 bg-purple-100';
      case 'blood_pressure':
      case 'resting_heart_rate':
        return 'text-red-600 bg-red-100';
      case 'blood_glucose':
        return 'text-blue-600 bg-blue-100';
      case 'temperature':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSaveVital = (type: string, value: string, unit: string) => {
    const newEntry: VitalEntry = {
      id: Date.now().toString(),
      type: type as any,
      value: parseFloat(value),
      unit,
      timestamp: new Date(),
      notes: notes || undefined
    };
    
    setEntries(prev => [newEntry, ...prev]);
    
    // Clear form
    switch (type) {
      case 'body_fat':
        setBodyFat('');
        break;
      case 'waist':
        setWaist('');
        break;
      case 'blood_pressure':
        setSystolic('');
        setDiastolic('');
        break;
      case 'blood_glucose':
        setBloodGlucose('');
        break;
      case 'resting_heart_rate':
        setRestingHeartRate('');
        break;
      case 'temperature':
        setTemperature('');
        break;
    }
    setNotes('');
  };

  const handleSaveBloodPressure = () => {
    const newEntry: BloodPressureEntry = {
      id: Date.now().toString(),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : undefined,
      timestamp: new Date(),
      notes: notes || undefined
    };
    
    setBloodPressureEntries(prev => [newEntry, ...prev]);
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setNotes('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Expanded Vitals</h2>
          <p className="text-sm text-gray-600">Track comprehensive health metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{entries.length}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{bloodPressureEntries.length}</div>
            <div className="text-sm text-gray-600">BP Readings</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        {[
          { value: 'overview', label: 'Overview' },
          { value: 'body_composition', label: 'Body Composition' },
          { value: 'cardiovascular', label: 'Cardiovascular' },
          { value: 'metabolic', label: 'Metabolic' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Entries */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Recent Vitals</h3>
            <div className="space-y-3">
              {[...mockEntries, ...entries].slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getVitalColor(entry.type)}`}>
                      {getVitalIcon(entry.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {getVitalLabel(entry.type)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {entry.value} {entry.unit}
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-gray-500 italic">
                          "{entry.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Save size={16} className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Blood Pressure History */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Blood Pressure History</h3>
            <div className="space-y-3">
              {[...mockBloodPressureEntries, ...bloodPressureEntries].slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <Heart size={20} className="text-red-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Blood Pressure</div>
                      <div className="text-sm text-gray-600">
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {entry.systolic}/{entry.diastolic} mmHg
                      </div>
                      {entry.notes && (
                        <div className="text-xs text-gray-500 italic">
                          "{entry.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Save size={16} className="text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Body Composition Tab */}
      {activeTab === 'body_composition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Body Fat Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Body Fat %</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Fat Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter body fat percentage"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">%</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Add any notes about this measurement..."
                  />
                </div>
                <button
                  onClick={() => handleSaveVital('body_fat', bodyFat, '%')}
                  disabled={!bodyFat}
                  className="w-full flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Save Body Fat
                </button>
              </div>
            </div>

            {/* Waist Circumference Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Waist Circumference</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waist Measurement
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter waist circumference"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">cm</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Add any notes about this measurement..."
                  />
                </div>
                <button
                  onClick={() => handleSaveVital('waist', waist, 'cm')}
                  disabled={!waist}
                  className="w-full flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Save Waist Measurement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cardiovascular Tab */}
      {activeTab === 'cardiovascular' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Blood Pressure Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Blood Pressure</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="80"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pulse (bpm)
                  </label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Add any notes about this reading..."
                  />
                </div>
                <button
                  onClick={handleSaveBloodPressure}
                  disabled={!systolic || !diastolic}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Save Blood Pressure
                </button>
              </div>
            </div>

            {/* Resting Heart Rate Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Resting Heart Rate</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heart Rate (bpm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={restingHeartRate}
                      onChange={(e) => setRestingHeartRate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="60"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">bpm</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Add any notes about this measurement..."
                  />
                </div>
                <button
                  onClick={() => handleSaveVital('resting_heart_rate', restingHeartRate, 'bpm')}
                  disabled={!restingHeartRate}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Save Heart Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metabolic Tab */}
      {activeTab === 'metabolic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Blood Glucose Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Blood Glucose</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Glucose (mg/dL)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bloodGlucose}
                      onChange={(e) => setBloodGlucose(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="100"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">mg/dL</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Add any notes about this reading..."
                  />
                </div>
                <button
                  onClick={() => handleSaveVital('blood_glucose', bloodGlucose, 'mg/dL')}
                  disabled={!bloodGlucose}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Save Blood Glucose
                </button>
              </div>
            </div>

            {/* Body Temperature Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-md font-semibold text-gray-800 mb-4">Body Temperature</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="36.5"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">°C</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Add any notes about this measurement..."
                  />
                </div>
                <button
                  onClick={() => handleSaveVital('temperature', temperature, '°C')}
                  disabled={!temperature}
                  className="w-full flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  Save Temperature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle size={24} className="text-white" />
          <div>
            <h4 className="font-semibold text-white mb-2">AI Vitals Analysis</h4>
            <p className="text-sm text-white opacity-90">
              Your vital measurements show consistent patterns across all categories. 
              Blood pressure readings are within optimal range, body composition metrics 
              indicate positive progress toward your goals. Continue current routine for best results.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white mt-2">
              <span>Health Score:</span>
              <span className="font-bold">85/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
