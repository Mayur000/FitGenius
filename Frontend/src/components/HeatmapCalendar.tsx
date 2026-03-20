import React, { useState, useMemo } from 'react';
import { Calendar, Activity, TrendingUp, Target } from 'lucide-react';

interface ActivityData {
  date: Date;
  value: number;
  type: 'workout' | 'steps' | 'calories' | 'sleep' | 'water';
}

interface HeatmapDay {
  date: Date;
  value: number;
  intensity: 'none' | 'low' | 'medium' | 'high' | 'very-high';
}

export const HeatmapCalendar: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '1month' | '3months' | '6months' | 'year'>('7days');
  const [selectedMetric, setSelectedMetric] = useState<'workout' | 'steps' | 'calories' | 'sleep' | 'water'>('workout');

  // Generate mock activity data for the past year
  const generateMockData = (): ActivityData[] => {
    const data: ActivityData[] = [];
    const today = new Date();
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isRecent = i < 30;
      
      let value = 0;
      let type: ActivityData['type'] = 'workout';
      
      switch (selectedMetric) {
        case 'workout':
          type = 'workout';
          value = isWeekend ? Math.random() * 0.5 : Math.random() * 1.2;
          if (isRecent) value *= 1.3; // Recent activity boost
          break;
        case 'steps':
          type = 'steps';
          value = isWeekend ? 3000 + Math.random() * 5000 : 6000 + Math.random() * 8000;
          if (isRecent) value *= 1.2;
          break;
        case 'calories':
          type = 'calories';
          value = isWeekend ? 1800 + Math.random() * 800 : 2200 + Math.random() * 1000;
          if (isRecent) value *= 1.15;
          break;
        case 'sleep':
          type = 'sleep';
          value = isWeekend ? 6 + Math.random() * 2 : 6.5 + Math.random() * 1.5;
          if (isRecent) value *= 0.9; // Recent sleep dip
          break;
        case 'water':
          type = 'water';
          value = 6 + Math.random() * 4;
          if (isRecent) value *= 1.1;
          break;
      }
      
      data.push({ date, value, type });
    }
    
    return data;
  };

  const activityData = useMemo(() => generateMockData(), [selectedMetric]);

  // Process data into heatmap format
  const heatmapData = useMemo(() => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    const startDate = new Date(today);
    
    switch (selectedPeriod) {
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case '6months':
        startDate.setMonth(today.getMonth() - 6);
        break;
      case '3months':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '1month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '7days':
        startDate.setDate(today.getDate() - 7);
        break;
    }
    
    // Calculate max value for normalization
    const maxValue = Math.max(...activityData.map(d => d.value));
    
    // Create heatmap data
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayData = activityData.find(ad => 
        ad.date.toDateString() === d.toDateString()
      );
      
      let intensity: HeatmapDay['intensity'] = 'none';
      let value = 0;
      
      if (dayData) {
        value = dayData.value;
        const percentage = (value / maxValue) * 100;
        
        if (percentage >= 80) intensity = 'very-high';
        else if (percentage >= 60) intensity = 'high';
        else if (percentage >= 40) intensity = 'medium';
        else if (percentage >= 20) intensity = 'low';
      }
      
      data.push({
        date: new Date(d),
        value,
        intensity
      });
    }
    
    return data;
  }, [activityData, selectedPeriod]);

  // Get calendar weeks
  const getCalendarWeeks = () => {
    const weeks: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];
    
    heatmapData.forEach((day, index) => {
      currentWeek.push(day);
      
      // Start new week on Sunday (day 0) or after 7 days
      if (day.date.getDay() === 6 || index === heatmapData.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  const getIntensityColor = (intensity: HeatmapDay['intensity']) => {
    switch (intensity) {
      case 'very-high': return 'bg-green-600';
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-green-400';
      case 'low': return 'bg-green-300';
      default: return 'bg-gray-200';
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'workout': return 'Workout Intensity';
      case 'steps': return 'Daily Steps';
      case 'calories': return 'Calories Burned';
      case 'sleep': return 'Sleep Hours';
      case 'water': return 'Water Intake (L)';
    }
  };

  const getMetricUnit = () => {
    switch (selectedMetric) {
      case 'workout': return 'sessions';
      case 'steps': return 'steps';
      case 'calories': return 'kcal';
      case 'sleep': return 'hours';
      case 'water': return 'liters';
    }
  };

  const getMetricIcon = () => {
    switch (selectedMetric) {
      case 'workout': return <Activity size={16} />;
      case 'steps': return <TrendingUp size={16} />;
      case 'calories': return <Target size={16} />;
      case 'sleep': return <Calendar size={16} />;
      case 'water': return <Activity size={16} />;
    }
  };

  const calendarWeeks = getCalendarWeeks();
  const totalDays = heatmapData.length;
  const activeDays = heatmapData.filter(d => d.intensity !== 'none').length;
  const streak = calculateCurrentStreak();

  function calculateCurrentStreak(): number {
    let currentStreak = 0;
    
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].intensity !== 'none') {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Activity Heatmap</h2>
          <p className="text-sm text-gray-600">Track your consistency over time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activeDays}</div>
            <div className="text-sm text-gray-600">Active Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { value: 'workout', label: 'Workouts' },
          { value: 'steps', label: 'Steps' },
          { value: 'calories', label: 'Calories' },
          { value: 'sleep', label: 'Sleep' },
          { value: 'water', label: 'Water' }
        ].map(metric => (
          <button
            key={metric.value}
            onClick={() => setSelectedMetric(metric.value as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              selectedMetric === metric.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getMetricIcon()}
            <span>{metric.label}</span>
          </button>
        ))}
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { value: '7days', label: '7 Days' },
          { value: '1month', label: '1 Month' },
          { value: '3months', label: '3 Months' },
          { value: '6months', label: '6 Months' },
          { value: 'year', label: '1 Year' },
        ].map(period => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value as any)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              selectedPeriod === period.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Heatmap Calendar */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <span className="text-sm text-gray-600">No activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-300 rounded" />
            <span className="text-sm text-gray-600">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded" />
            <span className="text-sm text-gray-600">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-sm text-gray-600">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-sm text-gray-600">Very High</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {calendarWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = week[dayIndex];
                const isToday = day && day.date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={dayIndex}
                    className={`aspect-square rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                      day
                        ? `${getIntensityColor(day.intensity)} text-white hover:opacity-80 cursor-pointer`
                        : 'bg-gray-100'
                    } ${isToday ? 'ring-2 ring-primary' : ''}`}
                    title={day ? `${day.date.toLocaleDateString()}: ${day.value.toFixed(1)} ${getMetricUnit()}` : 'No data'}
                  >
                    {day ? day.date.getDate() : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {((activeDays / totalDays) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-primary font-medium">Consistency Rate</div>
        </div>
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {heatmapData.length > 0 ? 
              (heatmapData.reduce((sum, day) => sum + day.value, 0) / activeDays).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-sm text-green-700 font-medium">
            Avg {getMetricLabel()}
          </div>
        </div>
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {heatmapData.length > 0 ? 
              Math.max(...heatmapData.map(d => d.value)).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-sm text-yellow-700 font-medium">Best Day</div>
        </div>
        <div className="text-center p-4 bg-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {calculateWeeklyAverage().toFixed(1)}
          </div>
          <div className="text-sm text-blue-700 font-medium">Weekly Average</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg">
        <div className="flex items-start space-x-3">
          <Activity size={24} className="text-white" />
          <div>
            <h4 className="font-semibold text-white mb-2">AI Consistency Analysis</h4>
            <p className="text-sm text-white opacity-90">
              Your activity consistency is excellent with {((activeDays / totalDays) * 100).toFixed(1)}% adherence rate. 
              The {streak}-day streak shows strong habit formation. Consider maintaining current routine 
              for optimal results.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white mt-2">
              <span>Prediction:</span>
              <span className="font-bold">85% consistency next month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function calculateWeeklyAverage(): number {
    if (heatmapData.length === 0) return 0;
    
    const weeklyTotals = new Map<number, number>();
    
    heatmapData.forEach(day => {
      const weekNumber = Math.floor(day.date.getDate() / 7);
      const currentTotal = weeklyTotals.get(weekNumber) || 0;
      weeklyTotals.set(weekNumber, currentTotal + day.value);
    });
    
    const weeklyValues = Array.from(weeklyTotals.values());
    return weeklyValues.reduce((sum, val) => sum + val, 0) / weeklyValues.length;
  }
};
