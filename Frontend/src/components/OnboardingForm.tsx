import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Target, Apple, ChevronRight, ChevronLeft } from 'lucide-react';

interface FormData {
  // Account details
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  
  // Physical metrics
  age: string;
  gender: string;
  height: string;
  weight: string;
  
  // Goals
  goals: string[];
  
  // Dietary preferences
  dietType: string;
  allergies: string[];
}

interface OnboardingFormProps {
  onComplete?: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goals: [],
    dietType: '',
    allergies: []
  });

  const steps = [
    { title: 'Account Details', icon: User },
    { title: 'Physical Metrics', icon: Activity },
    { title: 'Goal Selection', icon: Target },
    { title: 'Dietary Preferences', icon: Apple }
  ];

  const goalOptions = [
    'Weight Loss',
    'Muscle Gain',
    'Health Maintenance',
    'Improved Endurance',
    'Better Sleep',
    'Stress Reduction'
  ];

  const dietOptions = [
    'Balanced',
    'Vegan',
    'Vegetarian',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'High Protein'
  ];

  const allergyOptions = [
    'Dairy',
    'Gluten',
    'Nuts',
    'Soy',
    'Eggs',
    'Shellfish',
    'None'
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleAllergyToggle = (allergy: string) => {
    if (allergy === 'None') {
      setFormData(prev => ({ ...prev, allergies: [] }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Onboarding completed:', formData);
    // Handle form submission
    if (onComplete) {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Account</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Physical Metrics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateFormData('height', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="70"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What are your goals?</h2>
            <p className="text-gray-600 mb-6">Select all that apply (minimum 1)</p>
            
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.goals.includes(goal)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{goal}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dietary Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Diet Type</label>
              <div className="grid grid-cols-2 gap-3">
                {dietOptions.map((diet) => (
                  <button
                    key={diet}
                    onClick={() => updateFormData('dietType', diet)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.dietType === diet
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Allergies & Restrictions</label>
              <div className="grid grid-cols-2 gap-3">
                {allergyOptions.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => handleAllergyToggle(allergy)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      (allergy === 'None' && formData.allergies.length === 0) ||
                      formData.allergies.includes(allergy)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-full h-1 mx-2 transition-all ${
                        index < currentStep ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center"
            >
              Complete Setup
              <ChevronRight size={20} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="btn-primary flex items-center"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
