import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Bell, Volume2 } from 'lucide-react';

interface RestTimerProps {
  duration: number; // in seconds
  onRestComplete?: () => void;
  onTimerUpdate?: (timeLeft: number) => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ 
  duration, 
  onRestComplete, 
  onTimerUpdate 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<{ oscillator: any; gainNode: any; audioContext: any } | null>(null);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && notificationsEnabled) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, [notificationsEnabled]);

  // Create audio context for notification sound
  useEffect(() => {
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // 800Hz beep sound
      oscillator.type = 'sine';
      
      // Store reference for playing beep
      (audioRef.current as any) = { oscillator, gainNode, audioContext };
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = Math.max(0, prev - 1);
          if (onTimerUpdate) {
            onTimerUpdate(newTime);
          }
          
          // Check if timer completed
          if (newTime === 0) {
            setIsActive(false);
            if (onRestComplete) {
              onRestComplete();
            }
            playNotificationSound();
            sendBrowserNotification();
            return 0; // Stop the timer
          }
          
          // Warning at 5 seconds
          if (newTime === 5 && soundEnabled) {
            playWarningSound();
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, onTimerUpdate, onRestComplete, soundEnabled]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    setTimeLeft(duration);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      const { oscillator, gainNode, audioContext } = audioRef.current;
      if (oscillator && gainNode && audioContext) {
        oscillator.frequency.value = 1000; // Higher pitch for completion
        gainNode.gain.value = 0.3;
        
        (oscillator as any).start();
        setTimeout(() => {
          (oscillator as any).stop();
        }, 200);
      }
    }
  };

  const playWarningSound = () => {
    if (soundEnabled && audioRef.current) {
      const { oscillator, gainNode, audioContext } = audioRef.current;
      if (oscillator && gainNode && audioContext) {
        oscillator.frequency.value = 600; // Lower pitch for warning
        gainNode.gain.value = 0.2;
        
        (oscillator as any).start();
        setTimeout(() => {
          (oscillator as any).stop();
        }, 100);
      }
    }
  };

  const sendBrowserNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('Rest Time Complete!', {
        body: 'Your rest period is over. Ready for the next set!',
        icon: '/favicon.ico',
        tag: 'fitness-timer'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const getTimerColor = () => {
    if (timeLeft === 0) return 'text-green-600';
    if (timeLeft <= 5) return 'text-yellow-600';
    return 'text-gray-800';
  };

  if (!isActive && timeLeft === duration) {
    return null; // Don't show if not started
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Rest Timer</h3>
        <button
          onClick={() => setIsActive(false)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-gray-800 mb-2">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56} * (1 - getProgressPercentage() / 100)}`}
              className={`transition-all duration-1000 ${getTimerColor()}`}
              transform="rotate(-90)"
              style={{
                transformOrigin: 'center'
              }}
            />
          </svg>
          
          {/* Time in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getTimerColor()}`}>
              {Math.ceil(getProgressPercentage())}%
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          {timeLeft > 0 ? 'Rest time remaining' : 'Rest complete!'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="btn-primary flex items-center"
          >
            <Clock size={20} className="mr-2" />
            Start Rest Timer
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={pauseTimer}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                isPaused 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              {isPaused ? (
                <>
                  <Clock size={20} className="mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Clock size={20} className="mr-2" />
                  Pause
                </>
              )}
            </button>
            
            <button
              onClick={resetTimer}
              className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              <Clock size={20} className="mr-2" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Timer Settings</h4>
        
        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Sound Effects</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled 
                  ? 'bg-primary' 
                  : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Browser Notifications</span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationsEnabled 
                  ? 'bg-primary' 
                  : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Duration Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Duration</span>
            </div>
            <select
              value={duration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                if (!isActive) {
                  setTimeLeft(newDuration);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isActive}
            >
              <option value={30}>30s</option>
              <option value={45}>45s</option>
              <option value={60}>60s</option>
              <option value={90}>90s</option>
              <option value={120}>120s</option>
              <option value={180}>180s</option>
            </select>
          </div>
        </div>

        {/* Permission Status */}
        {notificationsEnabled && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Bell size={16} className="text-gray-600" />
              <span className="text-gray-600">
                Notifications: {Notification.permission === 'granted' ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
