import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, X, Check, AlertCircle, TrendingUp, Calendar } from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'snacks' | 'beverages' | 'frozen' | 'pantry';
  checked: boolean;
  price?: number;
  notes?: string;
}

interface MealPlanItem {
  id: string;
  name: string;
  ingredients: string[];
  servings: number;
  category: string;
}

export const GroceryList: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'suggestions'>('list');
  const [suggestions, setSuggestions] = useState<MealPlanItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newItemCategory, setNewItemCategory] = useState<GroceryItem['category']>('produce');

  // Mock meal plan data
  const mockMealPlan: MealPlanItem[] = [
    {
      id: '1',
      name: 'Mediterranean Quinoa Bowl',
      ingredients: ['quinoa', 'chickpeas', 'cucumber', 'red onion', 'olive oil', 'garlic', 'lemon'],
      servings: 4,
      category: 'lunch'
    },
    {
      id: '2',
      name: 'Grilled Chicken Teriyaki',
      ingredients: ['chicken breasts', 'soy sauce', 'honey', 'rice vinegar', 'ginger', 'garlic', 'sesame oil'],
      servings: 4,
      category: 'dinner'
    },
    {
      id: '3',
      name: 'Vegan Buddha Bowl',
      ingredients: ['brown rice', 'tofu', 'broccoli', 'carrot', 'edamame', 'peanut sauce'],
      servings: 2,
      category: 'lunch'
    },
    {
      id: '4',
      name: 'Overnight Oats with Berries',
      ingredients: ['rolled oats', 'almond milk', 'chia seeds', 'maple syrup', 'mixed berries'],
      servings: 1,
      category: 'breakfast'
    }
  ];

  // Generate grocery suggestions from meal plan
  useEffect(() => {
    const generatedSuggestions: MealPlanItem[] = [];
    const ingredientMap = new Map<string, number>();

    // Count ingredients needed across all meals
    mockMealPlan.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        const count = ingredientMap.get(ingredient) || 0;
        ingredientMap.set(ingredient, count + meal.servings);
      });
    });

    // Create suggestions with estimated quantities
    ingredientMap.forEach((quantity, ingredient) => {
      const category = categorizeIngredient(ingredient);
      generatedSuggestions.push({
        id: Date.now().toString() + Math.random(),
        name: ingredient,
        ingredients: [ingredient],
        servings: Math.ceil(quantity / 2), // Estimate for 2 meals
        category
      });
    });

    setSuggestions(generatedSuggestions);
  }, []);

  const categorizeIngredient = (ingredient: string): GroceryItem['category'] => {
    const produce = ['quinoa', 'chickpeas', 'cucumber', 'red onion', 'broccoli', 'carrot', 'edamame', 'mixed berries', 'lemon'];
    const protein = ['chicken breasts', 'tofu'];
    const dairy = ['almond milk'];
    const grains = ['brown rice', 'rolled oats'];
    const pantry = ['olive oil', 'garlic', 'sesame oil', 'soy sauce', 'honey', 'rice vinegar', 'ginger', 'peanut sauce', 'maple syrup', 'chia seeds'];

    if (produce.includes(ingredient)) return 'produce';
    if (protein.includes(ingredient)) return 'protein';
    if (dairy.includes(ingredient)) return 'dairy';
    if (grains.includes(ingredient)) return 'grains';
    if (pantry.includes(ingredient)) return 'pantry';
    return 'snacks'; // default category
  };

  const getCategoryColor = (category: GroceryItem['category']) => {
    switch (category) {
      case 'produce': return 'text-green-600 bg-green-100';
      case 'protein': return 'text-red-600 bg-red-100';
      case 'dairy': return 'text-blue-600 bg-blue-100';
      case 'grains': return 'text-yellow-600 bg-yellow-100';
      case 'snacks': return 'text-purple-600 bg-purple-100';
      case 'beverages': return 'text-cyan-600 bg-cyan-100';
      case 'frozen': return 'text-orange-600 bg-orange-100';
      case 'pantry': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const addGroceryItem = () => {
    if (newItemName.trim()) {
      const newItem: GroceryItem = {
        id: Date.now().toString(),
        name: newItemName,
        quantity: parseInt(newItemQuantity),
        unit: newItemUnit,
        category: newItemCategory,
        checked: false
      };
      
      setGroceryItems(prev => [...prev, newItem]);
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemUnit('pcs');
    }
  };

  const addSuggestionToList = (suggestion: MealPlanItem) => {
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: suggestion.name,
      quantity: 1,
      unit: 'pcs',
      category: categorizeIngredient(suggestion.ingredients[0]) as GroceryItem['category'],
      checked: false
    };
    
    setGroceryItems(prev => [...prev, newItem]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const toggleItemChecked = (id: string) => {
    setGroceryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setGroceryItems(prev => prev.filter(item => item.id !== id));
  };

  const getCheckedItems = () => groceryItems.filter(item => item.checked).length;
  const getTotalItems = () => groceryItems.length;
  const getCompletionPercentage = () => {
    if (getTotalItems() === 0) return 0;
    return Math.round((getCheckedItems() / getTotalItems()) * 100);
  };

  const groupedItems = groceryItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<GroceryItem['category'], GroceryItem[]>);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Smart Grocery List</h2>
          <p className="text-sm text-gray-600">Auto-generated from your meal plans</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{getCheckedItems()}</div>
            <div className="text-sm text-gray-600">Checked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{getTotalItems()}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{getCompletionPercentage()}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'list'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ShoppingCart size={20} className="mr-2" />
          Shopping List
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp size={20} className="mr-2" />
          Suggestions
        </button>
      </div>

      {/* Shopping List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Add Item Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Add Item</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addGroceryItem();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter grocery item..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="pcs">Pieces</option>
                  <option value="lbs">Pounds</option>
                  <option value="kg">Kilograms</option>
                  <option value="oz">Ounces</option>
                  <option value="gal">Gallons</option>
                  <option value="ltr">Liters</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="produce">Produce</option>
                  <option value="protein">Protein</option>
                  <option value="dairy">Dairy</option>
                  <option value="grains">Grains</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                  <option value="frozen">Frozen</option>
                  <option value="pantry">Pantry</option>
                </select>
              </div>
            </div>
            <button
              onClick={addGroceryItem}
              disabled={!newItemName.trim()}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add to List
            </button>
          </div>

          {/* Grocery Items by Category */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 capitalize">
                    {category} ({items.length})
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category as GroceryItem['category'])}`}>
                    {items.filter(item => item.checked).length}/{items.length}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleItemChecked(item.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            item.checked
                              ? 'bg-primary border-primary'
                              : 'bg-gray-200 border-gray-300'
                          }`}
                        >
                          {item.checked && <Check size={16} className="text-white" />}
                        </button>
                        <div>
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              <Calendar size={20} className="inline mr-2" />
              Meal Plan Suggestions
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your meal plans, here are ingredients you might need:
            </p>
          </div>

          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{suggestion.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <span>For {suggestion.servings} servings</span>
                      <span>•</span>
                      <span>{suggestion.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => addSuggestionToList(suggestion)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/600 transition-colors"
                  >
                    <Plus size={20} className="mr-2" />
                    Add All
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {suggestions.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No Suggestions Available</h4>
              <p className="text-sm text-gray-600">
                Create a meal plan first to generate grocery suggestions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary to-secondary rounded-lg">
        <div className="flex items-start space-x-3">
          <ShoppingCart size={24} className="text-white" />
          <div>
            <h4 className="font-semibold text-white mb-2">AI Shopping Analysis</h4>
            <p className="text-sm text-white opacity-90">
              Your grocery list is {getCompletionPercentage()}% complete. 
              Based on your meal plans, you have {suggestions.length} suggested items 
              ready to add. Consider batch cooking for efficiency.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white mt-2">
              <span>Estimated Savings:</span>
              <span className="font-bold">$12-15/week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
