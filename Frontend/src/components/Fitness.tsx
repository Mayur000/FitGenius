import React, { useState, useRef } from 'react';
import { Play, Pause, Dumbbell, Search, ChevronDown, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonOverlay } from './SkeletonOverlay';
import { RestTimer } from './RestTimer';
import { ProgressionAnalytics } from './ProgressionAnalytics';
import { AdBanner } from './AdBanner';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

interface WorkoutSession {
  exercise: Exercise;
  currentSet: number;
  totalSets: number;
  currentReps: number;
  targetReps: number;
  isResting: boolean;
  restTime: number;
}

export const Fitness: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState<'session' | 'library' | 'progression'>('session');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [showFormAnalysis] = useState(true);
  const [repCount, setRepCount] = useState(0);
  const [formFeedback, setFormFeedback] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'beginner'
  });
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);

  const exercises: Exercise[] = [
    { id: '1', name: 'Squats', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner' },
    { id: '2', name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
    { id: '3', name: 'Deadlifts', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced' },
    { id: '4', name: 'Pull-ups', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
    { id: '5', name: 'Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'intermediate' },
    { id: '6', name: 'Bicep Curls', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' }
  ];

  const allExercises = [...exercises, ...customExercises];

  const muscleGroups = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms'];
  const equipment = ['all', 'bodyweight', 'barbell', 'dumbbells', 'machine'];

  const startWorkout = (exercise: Exercise) => {
    setCurrentSession({
      exercise,
      currentSet: 1,
      totalSets: 3,
      currentReps: 0,
      targetReps: 12,
      isResting: false,
      restTime: 60
    });
    setIsWorkoutActive(true);
    setRepCount(0);
    setFormFeedback('Get ready to start!');
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setCurrentSession(null);
    setRepCount(0);
    setFormFeedback('');
  };

  const incrementRep = () => {
    if (currentSession) {
      const newReps = repCount + 1;
      setRepCount(newReps);
      
      // Simulate AI form feedback
      if (newReps % 3 === 0) {
        const feedbacks = [
          'Great form! Keep your back straight',
          'Lower your hips more on the next rep',
          'Good pace! Maintain controlled movement',
          'Excellent depth! Push through your heels'
        ];
        setFormFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
      }
      
      if (newReps >= currentSession.targetReps) {
        completeSet();
      }
    }
  };

  const completeSet = () => {
    if (currentSession) {
      if (currentSession.currentSet >= currentSession.totalSets) {
        setFormFeedback('Workout complete! Great job!');
        setTimeout(stopWorkout, 2000);
      } else {
        setFormFeedback(`Set ${currentSession.currentSet} complete! Rest time: ${currentSession.restTime}s`);
        setCurrentSession({
          ...currentSession,
          currentSet: currentSession.currentSet + 1,
          isResting: true
        });
        setRepCount(0);
        
        setTimeout(() => {
          setCurrentSession(prev => prev ? { ...prev, isResting: false } : null);
          setFormFeedback('Ready for next set!');
        }, currentSession.restTime * 1000);
      }
    }
  };

  const filteredExercises = allExercises.filter(exercise => {
    const matchesMuscle = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
    const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMuscle && matchesEquipment && matchesSearch;
  });

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const exercise: Exercise = {
      id: Date.now().toString(),
      ...newExercise
    };
    setCustomExercises([exercise, ...customExercises]);
    setShowAddForm(false);
    setNewExercise({ name: '', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner' });
  };

  return (
    <div className="px-4 py-4 space-y-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Fitness</h1>
        <p className="text-sm text-gray-500">Track your workouts and exercises</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('session')}
          className={`flex-1 py-2 px-2 sm:px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'session'
              ? 'bg-white text-primary shadow-soft'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Session
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 px-2 sm:px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'library'
              ? 'bg-white text-primary shadow-soft'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setActiveTab('progression')}
          className={`flex-1 py-2 px-2 sm:px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'progression'
              ? 'bg-white text-primary shadow-soft'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'session' ? (
        /* Workout Session */
        <div className="space-y-6">
          {!isWorkoutActive ? (
            /* Exercise Selection */
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Choose Exercise</h2>
              <div className="grid grid-cols-1 gap-3">
                {exercises.slice(0, 3).map((exercise) => (
                  <motion.button
                    key={exercise.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startWorkout(exercise)}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                        <div className="text-sm text-gray-500">
                          {exercise.muscleGroup} • {exercise.equipment}
                        </div>
                      </div>
                      <Play size={20} className="text-primary" />
                    </div>
                  </motion.button>
                ))}
              </div>
              <AdBanner variant="fitness" />
            </div>
          ) : (
            /* Active Workout */
            <div className="space-y-6">
              {/* Camera View with Skeleton Overlay */}
              <div className="relative bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
                {showFormAnalysis && <SkeletonOverlay videoRef={videoRef} isActive={showFormAnalysis} />}
              </div>

              {/* Exercise Info */}
              {currentSession && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {currentSession.exercise.name}
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {currentSession.currentSet}/{currentSession.totalSets}
                      </div>
                      <div className="text-sm text-gray-600">Sets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {repCount}/{currentSession.targetReps}
                      </div>
                      <div className="text-sm text-gray-600">Reps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        {currentSession.restTime}s
                      </div>
                      <div className="text-sm text-gray-600">Rest</div>
                    </div>
                  </div>

                  {/* Rest Timer */}
                  <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
                    <RestTimer
                      duration={currentSession?.restTime || 60}
                      onRestComplete={() => {
                        setFormFeedback('Great job! Rest complete.');
                        setCurrentSession(prev => prev ? { ...prev, isResting: false } : null);
                      }}
                      onTimerUpdate={(time) => {
                        // Update session with remaining rest time
                        if (currentSession) {
                          setCurrentSession({ ...currentSession, restTime: time });
                        }
                      }}
                    />
                  </div>

                  {/* Form Feedback */}
                  <AnimatePresence>
                    {formFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-lg mb-4 ${
                          formFeedback.includes('complete') || formFeedback.includes('Great') || formFeedback.includes('Excellent')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <p className="font-medium">{formFeedback}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Controls */}
                  <div className="flex space-x-3">
                    {!currentSession.isResting ? (
                      <button
                        onClick={incrementRep}
                        className="flex-1 btn-primary flex items-center justify-center"
                      >
                        <Dumbbell size={20} className="mr-2" />
                        Count Rep
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Resting...
                      </button>
                    )}
                    <button
                      onClick={stopWorkout}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      <Pause size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : activeTab === 'library' ? (
        /* Exercise Library */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Exercise Library</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors"
            >
              <Plus size={16} /> Add Custom
            </button>
          </div>

          <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <select
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {muscleGroups.map(group => (
                    <option key={group} value={group}>
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {equipment.map(eq => (
                    <option key={eq} value={eq}>
                      {eq.charAt(0).toUpperCase() + eq.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            {filteredExercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {exercise.muscleGroup}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {exercise.equipment}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('session');
                      startWorkout(exercise);
                    }}
                    className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                  >
                    <Play size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      ) : (
        <ProgressionAnalytics />
      )}
      {/* Add Exercise Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                <h3 className="font-bold text-lg">Add Custom Exercise</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-white/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddExercise} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                  <input
                    type="text"
                    required
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g. Diamond Pushups"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
                    <select
                      value={newExercise.muscleGroup}
                      onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                      {muscleGroups.filter(g => g !== 'all').map(g => (
                        <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                    <select
                      value={newExercise.equipment}
                      onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                      {equipment.filter(e => e !== 'all').map(e => (
                        <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <div className="flex gap-2">
                    {['beginner', 'intermediate', 'advanced'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewExercise({ ...newExercise, difficulty: d })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                          newExercise.difficulty === d
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity mt-4"
                >
                  Create Exercise
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
