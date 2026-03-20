import React, { useState } from 'react';
import { Plus, Camera, Search, Barcode, Flame, Beef, Wheat, Circle, Calendar, X, BookOpen, ShoppingBag, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIVisionMealLogger } from './AIVisionMealLogger';
import { MealPlanner } from './MealPlanner';
import { BarcodeScanner } from './BarcodeScanner';
import { RecipeExplorer } from './RecipeExplorer';
import { GroceryList } from './GroceryList';
import { AdBanner } from './AdBanner';


interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

interface NutritionData {
  dailyCalories: number;
  consumedCalories: number;
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fats: { current: number; goal: number };
}

export const Nutrition: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'recipes' | 'groceries'>('tracker');
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [showAIVision, setShowAIVision] = useState(false);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuantity, setSearchQuantity] = useState(1);

  const mockFoodDatabase = [
    { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 4, fat: 0 },
    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Brown Rice (1 cup)', calories: 215, protein: 5, carbs: 45, fat: 1.6 },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15 },
    { name: 'Egg (Large)', calories: 70, protein: 6, carbs: 0, fat: 5 },
    { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0.3 },
    { name: 'Almonds (28g)', calories: 160, protein: 6, carbs: 6, fat: 14 },
    { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
    { name: 'Broccoli (1 cup)', calories: 31, protein: 2.5, carbs: 6, fat: 0.3 }
  ];

  const filteredFoodResults = mockFoodDatabase.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualAdd = (food: typeof mockFoodDatabase[0]) => {
    const newMeal: any = {
      id: Date.now().toString(),
      type: selectedMealType,
      name: food.name,
      calories: food.calories * searchQuantity,
      protein: food.protein * searchQuantity,
      carbs: food.carbs * searchQuantity,
      fats: food.fat * searchQuantity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMeals([...meals, newMeal]);
    setShowManualSearch(false);
    setShowMealModal(false);
    setSearchQuery('');
    setSearchQuantity(1);
  };
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 45, fats: 8, time: '08:00' },
    { id: '2', name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 20, fats: 18, time: '12:30' }
  ]);

  const nutritionData: NutritionData = {
    dailyCalories: 2200,
    consumedCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: { current: meals.reduce((sum, meal) => sum + meal.protein, 0), goal: 150 },
    carbs: { current: meals.reduce((sum, meal) => sum + meal.carbs, 0), goal: 275 },
    fats: { current: meals.reduce((sum, meal) => sum + meal.fats, 0), goal: 73 }
  };

  const remainingCalories = nutritionData.dailyCalories - nutritionData.consumedCalories;

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snacks', label: 'Snacks', icon: '🍎' }
  ];

  const getMacroPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMacroColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const openMealModal = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowMealModal(true);
  };

  const addMeal = (method: string) => {
    if (method === 'photo') setShowAIVision(true);
    else if (method === 'barcode') setShowBarcodeScanner(true);
    else if (method === 'planner') setShowMealPlanner(true);
    else if (method === 'manual') setShowManualSearch(true);
    setShowMealModal(false);
  };

  const handleAIVisionMeal = (foods: any[]) => {
    console.log('handleAIVisionMeal called with foods:', foods);
    // Add identified foods to meals list
    const newMeals = foods.map(food => ({
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));
    setMeals(prev => [...prev, ...newMeals]);
    // Close the modal after adding foods
    setShowAIVision(false);
  };

  const handleBarcodeScan = (result: any) => {
    console.log('handleBarcodeScan called with result:', result);
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fats: result.fats,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setMeals(prev => [...prev, newMeal]);
    setShowBarcodeScanner(false);
  };

  return (
    <div className="px-4 py-4 space-y-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Nutrition</h1>
        <p className="text-sm text-gray-500">Track your meals and macros</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'tracker'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Activity size={18} className="mr-2" />
          Tracker
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'recipes'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <BookOpen size={18} className="mr-2" />
          Recipes
        </button>
        <button
          onClick={() => setActiveTab('groceries')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'groceries'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <ShoppingBag size={18} className="mr-2" />
          Groceries
        </button>
      </div>

      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Calories Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Daily Calories</h2>
          <div className="flex items-center text-primary">
            <Flame size={20} className="mr-1" />
            <span className="font-bold">{remainingCalories}</span>
            <span className="text-sm text-gray-500 ml-1">remaining</span>
          </div>
        </div>
        
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(nutritionData.consumedCalories / nutritionData.dailyCalories) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{nutritionData.consumedCalories} consumed</span>
          <span>{nutritionData.dailyCalories} goal</span>
        </div>
      </div>

      {/* Macro Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Macros</h2>
        
        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Beef size={16} className="text-red-500 mr-2" />
                <span className="text-sm font-medium">Protein</span>
              </div>
              <span className="text-sm text-gray-600">
                {nutritionData.protein.current}g / {nutritionData.protein.goal}g
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getMacroPercentage(nutritionData.protein.current, nutritionData.protein.goal)}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={`h-full ${getMacroColor(getMacroPercentage(nutritionData.protein.current, nutritionData.protein.goal))}`}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Wheat size={16} className="text-yellow-500 mr-2" />
                <span className="text-sm font-medium">Carbs</span>
              </div>
              <span className="text-sm text-gray-600">
                {nutritionData.carbs.current}g / {nutritionData.carbs.goal}g
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getMacroPercentage(nutritionData.carbs.current, nutritionData.carbs.goal)}%` }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className={`h-full ${getMacroColor(getMacroPercentage(nutritionData.carbs.current, nutritionData.carbs.goal))}`}
              />
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Circle size={16} className="text-purple-500 mr-2" />
                <span className="text-sm font-medium">Fats</span>
              </div>
              <span className="text-sm text-gray-600">
                {nutritionData.fats.current}g / {nutritionData.fats.goal}g
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getMacroPercentage(nutritionData.fats.current, nutritionData.fats.goal)}%` }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                className={`h-full ${getMacroColor(getMacroPercentage(nutritionData.fats.current, nutritionData.fats.goal))}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meal Timeline */}
      <AdBanner variant="nutrition" />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Today's Meals</h2>
        
        {mealTypes.map((mealType) => (
          <div key={mealType.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{mealType.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{mealType.label}</h3>
                  <div className="text-sm text-gray-500">
                    {meals
                      .filter(meal => mealType.id === 'breakfast' && meal.time.startsWith('08') ||
                                       mealType.id === 'lunch' && meal.time.startsWith('12') ||
                                       mealType.id === 'dinner' && meal.time.startsWith('18') ||
                                       mealType.id === 'snacks' && (!meal.time.startsWith('08') && !meal.time.startsWith('12') && !meal.time.startsWith('18')))
                      .reduce((sum, meal) => sum + meal.calories, 0)} calories
                  </div>
                </div>
              </div>
              <button
                onClick={() => openMealModal(mealType.id)}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {/* Meal Items */}
            <div className="space-y-2">
              {meals
                .filter(meal => mealType.id === 'breakfast' && meal.time.startsWith('08') ||
                                 mealType.id === 'lunch' && meal.time.startsWith('12') ||
                                 mealType.id === 'dinner' && meal.time.startsWith('18') ||
                                 mealType.id === 'snacks' && (!meal.time.startsWith('08') && !meal.time.startsWith('12') && !meal.time.startsWith('18')))
                .map(meal => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{meal.name}</div>
                      <div className="text-sm text-gray-500">{meal.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{meal.calories} cal</div>
                      <div className="text-xs text-gray-500">P: {meal.protein}g C: {meal.carbs}g F: {meal.fats}g</div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>
        ))}
      </div>

      {/* Meal Modal */}
      <AnimatePresence>
        {showMealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50"
            onClick={() => setShowMealModal(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white rounded-t-2xl p-6 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add {selectedMealType}</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => addMeal('manual')}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Search size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Manual Search</span>
                </button>
                
                <button
                  onClick={() => addMeal('barcode')}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Barcode size={24} className="text-secondary mb-2" />
                  <span className="text-sm font-medium">Barcode Scan</span>
                </button>
                
                <button
                  onClick={() => addMeal('photo')}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Camera size={24} className="text-accent mb-2" />
                  <span className="text-sm font-medium">AI Photo</span>
                </button>
              </div>
              
              {/* Meal Planner Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => addMeal('planner')}
                  className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Calendar size={20} className="mr-2" />
                  <span className="font-medium">Open 7-Day AI Meal Planner</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowMealModal(false)}
                className="w-full mt-4 py-3 text-gray-600 font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      )}

      {activeTab === 'recipes' && (
        <RecipeExplorer />
      )}

      {activeTab === 'groceries' && (
        <GroceryList />
      )}

      {/* AI Vision Modal */}
      {showAIVision && (
        <AIVisionMealLogger
          onMealIdentified={handleAIVisionMeal}
          onClose={() => setShowAIVision(false)}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScanComplete={handleBarcodeScan}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Meal Planner Modal */}
      {showMealPlanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">7-Day AI Meal Planner</h2>
                <button
                  onClick={() => setShowMealPlanner(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <MealPlanner />
            </div>
          </div>
        </div>
      )}
      {/* Manual Search Modal */}
      <AnimatePresence>
        {showManualSearch && (
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
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                <h3 className="font-bold">Manual Search</h3>
                <button onClick={() => setShowManualSearch(false)} className="p-1 hover:bg-white/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search food database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredFoodResults.length > 0 ? (
                  filteredFoodResults.map((food, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => handleManualAdd(food)}>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{food.name}</p>
                        <p className="text-xs text-gray-500">{food.calories} kcal / serving</p>
                      </div>
                      <Plus size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 italic text-sm">No foods found...</div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3 text-sm font-medium text-gray-600">
                  <span>Quantity (servings)</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSearchQuantity(Math.max(1, searchQuantity - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                    <span className="w-8 text-center font-bold text-primary">{searchQuantity}</span>
                    <button onClick={() => setSearchQuantity(searchQuantity + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
