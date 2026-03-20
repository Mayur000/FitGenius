import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Weight, Droplets, Smile, X, Footprints,
  Flame, Moon, Dumbbell, Check
} from 'lucide-react';

type LogType = 'steps' | 'calories' | 'sleep' | 'water' | 'weight' | 'workout' | 'mood' | null;

interface LogEntry {
  type: Exclude<LogType, null>;
  value: string;
  extra?: string;
  ts: string;
}

const MOODS = ['😞', '😕', '😐', '🙂', '😄'];
const SLEEP_QUALITY = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export const QuickLog: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeLog, setActiveLog] = useState<LogType>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [saved, setSaved] = useState(false);

  // Form state
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [calorieType, setCalorieType] = useState<'burned' | 'consumed'>('burned');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState('Good');
  const [water, setWater] = useState(0);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutType, setWorkoutType] = useState('Cardio');
  const [workoutIntensity, setWorkoutIntensity] = useState('Moderate');
  const [mood, setMood] = useState(2);
  const [notes, setNotes] = useState('');

  const logOptions = [
    { id: 'steps' as LogType, label: 'Steps', icon: Footprints, color: 'bg-orange-500' },
    { id: 'calories' as LogType, label: 'Calories', icon: Flame, color: 'bg-red-500' },
    { id: 'sleep' as LogType, label: 'Sleep', icon: Moon, color: 'bg-indigo-500' },
    { id: 'water' as LogType, label: 'Water', icon: Droplets, color: 'bg-cyan-500' },
    { id: 'weight' as LogType, label: 'Weight', icon: Weight, color: 'bg-blue-500' },
    { id: 'workout' as LogType, label: 'Workout', icon: Dumbbell, color: 'bg-green-500' },
    { id: 'mood' as LogType, label: 'Mood', icon: Smile, color: 'bg-purple-500' },
  ];

  const handleSave = () => {
    if (!activeLog) return;
    let value = '';
    let extra = '';

    switch (activeLog) {
      case 'steps': value = `${steps} steps`; break;
      case 'calories': value = `${calories} kcal`; extra = calorieType; break;
      case 'sleep': value = `${sleepHours} hrs`; extra = sleepQuality; break;
      case 'water': value = `${water} glasses`; break;
      case 'weight': value = `${weight} ${weightUnit}`; break;
      case 'workout': value = `${workoutDuration} min`; extra = `${workoutType} · ${workoutIntensity}`; break;
      case 'mood': value = MOODS[mood]; extra = SLEEP_QUALITY[mood]; break;
    }

    setLogs(prev => [{
      type: activeLog,
      value,
      extra,
      ts: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }, ...prev]);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActiveLog(null);
      setNotes('');
    }, 1200);
  };

  const renderForm = () => {
    switch (activeLog) {
      case 'steps':
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Steps taken today</label>
            <div className="flex gap-2">
              <input type="number" value={steps} onChange={e => setSteps(e.target.value)}
                placeholder="e.g. 8500" className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1000, 2000, 5000, 10000].map(s => (
                <button key={s} onClick={() => setSteps(String(Number(steps || 0) + s))}
                  className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100">+{s.toLocaleString()}</button>
              ))}
            </div>
          </div>
        );
      case 'calories':
        return (
          <div className="space-y-3">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              {(['burned', 'consumed'] as const).map(t => (
                <button key={t} onClick={() => setCalorieType(t)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${calorieType === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>{t}</button>
              ))}
            </div>
            <input type="number" value={calories} onChange={e => setCalories(e.target.value)}
              placeholder="kcal" className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <div className="flex flex-wrap gap-2">
              {[200, 400, 600, 800].map(c => (
                <button key={c} onClick={() => setCalories(String(Number(calories || 0) + c))}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">+{c}</button>
              ))}
            </div>
          </div>
        );
      case 'sleep':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Hours slept</label>
              <input type="number" step="0.5" min="0" max="24" value={sleepHours} onChange={e => setSleepHours(e.target.value)}
                placeholder="e.g. 7.5" className="mt-1 w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Sleep Quality</label>
              <div className="flex gap-2 flex-wrap">
                {SLEEP_QUALITY.map(q => (
                  <button key={q} onClick={() => setSleepQuality(q)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${sleepQuality === q ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'water':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Glasses drunk</span>
              <span className="text-2xl font-bold text-cyan-600">{water} 💧</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setWater(Math.max(0, water - 1))}
                className="flex-1 py-3 bg-gray-100 rounded-xl text-2xl font-bold text-gray-600 hover:bg-gray-200">−</button>
              <span className="text-3xl font-bold text-cyan-500 w-12 text-center">{water}</span>
              <button onClick={() => setWater(water + 1)}
                className="flex-1 py-3 bg-cyan-50 rounded-xl text-2xl font-bold text-cyan-600 hover:bg-cyan-100">+</button>
            </div>
            <div className="flex gap-2">
              {[2, 4, 6, 8].map(g => (
                <button key={g} onClick={() => setWater(g)}
                  className={`flex-1 py-1 rounded-lg text-sm font-medium transition-all ${water === g ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'}`}>{g}x</button>
              ))}
            </div>
          </div>
        );
      case 'weight':
        return (
          <div className="space-y-3">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              {(['kg', 'lbs'] as const).map(u => (
                <button key={u} onClick={() => setWeightUnit(u)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${weightUnit === u ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>{u}</button>
              ))}
            </div>
            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder={`Weight in ${weightUnit}`} className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Notes (optional)" className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        );
      case 'workout':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input type="number" value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)}
                placeholder="e.g. 45" className="mt-1 w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
              <div className="flex gap-2 flex-wrap">
                {['Cardio', 'Strength', 'HIIT', 'Yoga', 'Sports'].map(t => (
                  <button key={t} onClick={() => setWorkoutType(t)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${workoutType === t ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Intensity</label>
              <div className="flex gap-2">
                {['Light', 'Moderate', 'Intense'].map(i => (
                  <button key={i} onClick={() => setWorkoutIntensity(i)}
                    className={`flex-1 py-1 rounded-lg text-sm font-medium transition-all ${workoutIntensity === i ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>{i}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'mood':
        return (
          <div className="space-y-3 text-center">
            <div className="flex justify-center gap-3">
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(i)}
                  className={`text-3xl transition-transform ${mood === i ? 'scale-130 drop-shadow-md' : 'opacity-50 hover:opacity-80'}`}
                  style={{ transform: mood === i ? 'scale(1.3)' : 'scale(1)' }}>{m}</button>
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">{SLEEP_QUALITY[mood]}</p>
          </div>
        );
      default: return null;
    }
  };

  const activeOption = logOptions.find(o => o.id === activeLog);

  return (
    <div className="bg-white rounded-2xl shadow-soft p-4">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded(true)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>Quick Log</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Quick Log</h3>
              <button onClick={() => { setExpanded(false); setActiveLog(null); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {logOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setActiveLog(activeLog === opt.id ? null : opt.id)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all text-xs font-medium ${
                      activeLog === opt.id
                        ? `${opt.color} text-white shadow-md`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Form */}
            <AnimatePresence>
              {activeLog && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-gray-50 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${activeOption?.color} flex items-center justify-center`}>
                      {activeOption && React.createElement(activeOption.icon, { size: 12, className: 'text-white' })}
                    </div>
                    <h4 className="font-semibold text-gray-700 text-sm">Log {activeOption?.label}</h4>
                  </div>

                  {renderForm()}

                  <div className="flex gap-2">
                    <button onClick={() => setActiveLog(null)}
                      className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSave}
                      className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                      {saved ? <><Check size={16} /> Saved!</> : 'Save'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Logs */}
            {logs.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's logs</p>
                {logs.slice(0, 5).map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                    <span className="capitalize text-gray-500">{log.type} {log.extra && <span className="text-gray-400">· {log.extra}</span>}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">{log.value}</span>
                      <span className="text-xs text-gray-400">{log.ts}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
