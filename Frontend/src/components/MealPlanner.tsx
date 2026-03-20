import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChefHat, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  aiGenerated: boolean;
}

interface DayPlan {
  date: string;
  dayName: string;
  totalCalories: number;
  meals: Meal[];
}

export const MealPlanner: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  // Mock AI-generated meal plan
  const weeklyPlan: DayPlan[] = [
    {
      date: '2024-03-20',
      dayName: 'Monday',
      totalCalories: 2150,
      meals: [
        {
          id: '1',
          name: 'Protein Power Oatmeal',
          type: 'breakfast',
          calories: 420,
          protein: 28,
          carbs: 45,
          fats: 12,
          ingredients: ['Rolled oats', 'Whey protein', 'Berries', 'Almonds'],
          prepTime: 10,
          difficulty: 'easy',
          aiGenerated: true
        },
        {
          id: '2',
          name: 'Grilled Chicken Buddha Bowl',
          type: 'lunch',
          calories: 580,
          protein: 42,
          carbs: 38,
          fats: 18,
          ingredients: ['Chicken breast', 'Quinoa', 'Avocado', 'Mixed greens'],
          prepTime: 25,
          difficulty: 'medium',
          aiGenerated: true
        },
        {
          id: '3',
          name: 'Salmon with Roasted Vegetables',
          type: 'dinner',
          calories: 650,
          protein: 45,
          carbs: 35,
          fats: 22,
          ingredients: ['Atlantic salmon', 'Broccoli', 'Sweet potato', 'Olive oil'],
          prepTime: 30,
          difficulty: 'medium',
          aiGenerated: true
        },
        {
          id: '4',
          name: 'Greek Yogurt Parfait',
          type: 'snack',
          calories: 180,
          protein: 15,
          carbs: 20,
          fats: 6,
          ingredients: ['Greek yogurt', 'Granola', 'Honey', 'Mixed berries'],
          prepTime: 5,
          difficulty: 'easy',
          aiGenerated: true
        }
      ]
    },
    {
      date: '2024-03-21',
      dayName: 'Tuesday',
      totalCalories: 2080,
      meals: [
        {
          id: '5',
          name: 'Veggie Scramble Wrap',
          type: 'breakfast',
          calories: 380,
          protein: 22,
          carbs: 32,
          fats: 14,
          ingredients: ['Eggs', 'Spinach', 'Bell peppers', 'Whole wheat wrap'],
          prepTime: 15,
          difficulty: 'easy',
          aiGenerated: true
        },
        {
          id: '6',
          name: 'Turkey & Avocado Club',
          type: 'lunch',
          calories: 520,
          protein: 38,
          carbs: 40,
          fats: 16,
          ingredients: ['Turkey breast', 'Avocado', 'Bacon', 'Whole grain bread'],
          prepTime: 12,
          difficulty: 'easy',
          aiGenerated: true
        },
        {
          id: '7',
          name: 'Beef Stir-Fry',
          type: 'dinner',
          calories: 620,
          protein: 40,
          carbs: 42,
          fats: 20,
          ingredients: ['Lean beef', 'Mixed vegetables', 'Brown rice', 'Soy sauce'],
          prepTime: 20,
          difficulty: 'medium',
          aiGenerated: true
        },
        {
          id: '8',
          name: 'Protein Smoothie',
          type: 'snack',
          calories: 240,
          protein: 20,
          carbs: 28,
          fats: 8,
          ingredients: ['Protein powder', 'Banana', 'Spinach', 'Almond milk'],
          prepTime: 5,
          difficulty: 'easy',
          aiGenerated: true
        }
      ]
    }
  ];

  const generateNewPlan = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">7-Day AI Meal Planner</h2>
          <p className="text-sm text-gray-600">Personalized nutrition plan powered by AI</p>
        </div>
        <button
          onClick={generateNewPlan}
          disabled={isGenerating}
          className="btn-primary flex items-center"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ChefHat size={16} className="mr-2" />
              Generate New Plan
            </>
          )}
        </button>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weeklyPlan.map((day, index) => (
          <button
            key={day.date}
            onClick={() => setActiveDay(index)}
            className={`p-3 rounded-lg border-2 transition-all text-center ${
              activeDay === index
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{day.dayName}</div>
            <div className="text-lg font-bold text-gray-800">{day.totalCalories}</div>
            <div className="text-xs text-gray-600">calories</div>
          </button>
        ))}
      </div>

      {/* Selected Day Details */}
      {weeklyPlan[activeDay] && (
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-800">
              {weeklyPlan[activeDay].dayName}'s Meals
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              <span>{weeklyPlan[activeDay].date}</span>
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-4">
            {weeklyPlan[activeDay].meals.map((meal) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getMealIcon(meal.type)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                        {meal.aiGenerated && (
                          <div className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            <ChefHat size={12} className="mr-1" />
                            AI Generated
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">{meal.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{meal.calories}</div>
                    <div className="text-xs text-gray-600">calories</div>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">{meal.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">{meal.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">{meal.fats}g</div>
                    <div className="text-xs text-gray-600">Fats</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-800">{meal.prepTime}m</div>
                    <div className="text-xs text-gray-600">Prep</div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Difficulty and Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{meal.prepTime} minutes</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(meal.difficulty)}`}>
                    {meal.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daily Summary */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-primary mb-1">Daily Summary</h4>
                <div className="text-sm text-gray-600">
                  Total: {weeklyPlan[activeDay].totalCalories} calories
                </div>
              </div>
              <div className="flex items-center text-primary">
                <CheckCircle size={20} className="mr-2" />
                <span className="font-medium">On Track</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle size={20} className="text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">AI Nutrition Insights</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• This meal plan supports your weight loss goal with a 250-calorie daily deficit</li>
              <li>• Protein distribution optimized for muscle preservation (25% of total calories)</li>
              <li>• Meal timing designed for sustained energy throughout the day</li>
              <li>• All meals meet your dietary preferences and restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
