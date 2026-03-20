import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Users, Star, ChefHat, Plus } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dishTypes: string[];
  ingredients: string[];
  instructions: string[];
  rating: number;
  reviewCount: number;
}

interface RecipeExplorerProps {
  onRecipeSelect?: (recipe: Recipe) => void;
}

export const RecipeExplorer: React.FC<RecipeExplorerProps> = ({ onRecipeSelect }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Mock Spoonacular API data
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Mediterranean Quinoa Bowl',
      image: 'https://spoonacular.com/recipeImages/637296-552x552.jpg',
      readyInMinutes: 25,
      servings: 4,
      calories: 420,
      protein: 12,
      carbs: 58,
      fats: 18,
      fiber: 8,
      sugar: 6,
      sodium: 680,
      difficulty: 'easy',
      cuisine: 'Mediterranean',
      dishTypes: ['main course', 'lunch', 'dinner'],
      ingredients: [
        '1 cup quinoa',
        '1 can chickpeas',
        '1 cucumber',
        '1/2 red onion',
        '1/4 cup olive oil',
        '2 cloves garlic',
        '1 lemon',
        '1 tsp cumin',
        '1 tsp paprika'
      ],
      instructions: [
        'Cook quinoa according to package directions',
        'Drain and rinse chickpeas',
        'Dice cucumber and red onion',
        'Mix all ingredients together',
        'Chill for 10 minutes before serving'
      ],
      rating: 4.5,
      reviewCount: 234
    },
    {
      id: '2',
      title: 'Grilled Chicken Teriyaki',
      image: 'https://spoonacular.com/recipeImages/637297-552x552.jpg',
      readyInMinutes: 30,
      servings: 4,
      calories: 380,
      protein: 35,
      carbs: 22,
      fats: 18,
      fiber: 2,
      sugar: 8,
      sodium: 890,
      difficulty: 'medium',
      cuisine: 'Asian',
      dishTypes: ['main course', 'dinner'],
      ingredients: [
        '4 chicken breasts',
        '1/4 cup soy sauce',
        '2 tbsp honey',
        '1 tbsp rice vinegar',
        '1 tsp ginger',
        '2 cloves garlic',
        '1 tbsp sesame oil',
        '2 green onions',
        '1 tbsp cornstarch',
        '2 green onions'
      ],
      instructions: [
        'Mix soy sauce, honey, vinegar, ginger, and garlic',
        'Marinate chicken for 30 minutes',
        'Grill chicken for 6-8 minutes per side',
        'Brush with teriyaki glaze while grilling',
        'Garnish with green onions and sesame seeds'
      ],
      rating: 4.2,
      reviewCount: 156
    },
    {
      id: '3',
      title: 'Vegan Buddha Bowl',
      image: 'https://spoonacular.com/recipeImages/637298-552x552.jpg',
      readyInMinutes: 20,
      servings: 2,
      calories: 520,
      protein: 18,
      carbs: 68,
      fats: 22,
      fiber: 12,
      sugar: 8,
      sodium: 420,
      difficulty: 'easy',
      cuisine: 'Asian',
      dishTypes: ['main course', 'lunch', 'dinner'],
      ingredients: [
        '1 cup brown rice',
        '1 block tofu',
        '1 cup broccoli',
        '1 carrot',
        '1 cucumber',
        '1/4 cup edamame',
        '2 tbsp peanut sauce',
        '1 tbsp sesame oil',
        '1 tsp sriracha',
        '2 green onions'
      ],
      instructions: [
        'Cook brown rice according to package directions',
        'Press tofu to remove excess water',
        'Steam broccoli for 5 minutes',
        'Sauté vegetables in sesame oil',
        'Add tofu and peanut sauce',
        'Top with sriracha and sesame seeds'
      ],
      rating: 4.8,
      reviewCount: 312
    },
    {
      id: '4',
      title: 'Classic Margherita Pizza',
      image: 'https://spoonacular.com/recipeImages/637299-552x552.jpg',
      readyInMinutes: 45,
      servings: 8,
      calories: 280,
      protein: 12,
      carbs: 35,
      fats: 10,
      fiber: 2,
      sugar: 3,
      sodium: 680,
      difficulty: 'medium',
      cuisine: 'Italian',
      dishTypes: ['main course', 'dinner'],
      ingredients: [
        '2 cups all-purpose flour',
        '1 cup warm water',
        '1 packet active dry yeast',
        '2 tbsp olive oil',
        '1 tsp salt',
        '1 tsp sugar',
        '2 cups shredded mozzarella',
        '1 cup tomato sauce',
        '1/4 cup fresh basil',
        '2 cloves garlic'
      ],
      instructions: [
        'Mix flour, water, yeast, oil, salt, and sugar',
        'Knead for 10 minutes until smooth',
        'Let rise for 1 hour until doubled',
        'Roll out dough and add toppings',
        'Bake at 475°F for 12-15 minutes'
      ],
      rating: 4.6,
      reviewCount: 523
    },
    {
      id: '5',
      title: 'Overnight Oats with Berries',
      image: 'https://spoonacular.com/recipeImages/637295-552x552.jpg',
      readyInMinutes: 5,
      servings: 1,
      calories: 380,
      protein: 14,
      carbs: 58,
      fats: 12,
      fiber: 10,
      sugar: 20,
      sodium: 150,
      difficulty: 'easy',
      cuisine: 'American',
      dishTypes: ['breakfast', 'snack'],
      ingredients: [
        '1/2 cup rolled oats',
        '1 cup almond milk',
        '1 tbsp chia seeds',
        '1 tbsp maple syrup',
        '1/2 cup mixed berries',
        '1 tbsp almond butter',
        '1 tsp vanilla extract'
      ],
      instructions: [
        'Mix oats, almond milk, chia seeds, and maple syrup',
        'Refrigerate overnight',
        'Top with berries and almond butter in the morning'
      ],
      rating: 4.7,
      reviewCount: 189
    }
  ];

  const cuisines = ['all', 'Mediterranean', 'Asian', 'Italian', 'American', 'Mexican', 'Indian'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];
  const mealTypes = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'];

  useEffect(() => {
    setRecipes(mockRecipes);
    setFilteredRecipes(mockRecipes);
  }, []);

  useEffect(() => {
    let filtered = recipes;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by cuisine
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(recipe => recipe.cuisine === selectedCuisine);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // Filter by meal type
    if (selectedMealType !== 'all') {
      filtered = filtered.filter(recipe =>
        recipe.dishTypes.some(type => type === selectedMealType)
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, selectedCuisine, selectedDifficulty, selectedMealType]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && <Star size={16} className="text-yellow-400 fill-current opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} size={16} className="text-gray-300" />
        ))}
      </div>
    );
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    if (onRecipeSelect) {
      onRecipeSelect(recipe);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Recipe Explorer</h2>
          <p className="text-sm text-gray-600">Discover healthy recipes from Spoonacular API</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{filteredRecipes.length}</div>
            <div className="text-sm text-gray-600">Recipes Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{recipes.length}</div>
            <div className="text-sm text-gray-600">Total Recipes</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Search recipes by name or ingredient..."
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Cuisine Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Meal Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {mealTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleRecipeSelect(recipe)}
          >
            {/* Recipe Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Quick Stats */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <Clock size={12} />
                  <span>{recipe.readyInMinutes} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={12} />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{recipe.title}</h3>
              
              {/* Rating and Difficulty */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                  </span>
                  <ChefHat size={14} className="text-gray-500" />
                </div>
                <div className="flex items-center space-x-1">
                  {getRatingStars(recipe.rating)}
                  <span className="text-sm text-gray-600">({recipe.reviewCount})</span>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{recipe.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{recipe.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{recipe.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{recipe.fats}g</div>
                  <div className="text-sm text-gray-600">Fats</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{recipe.fiber}g</div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
              </div>

              {/* Cuisine Type */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{recipe.cuisine}</span>
                <span>•</span>
                <span>{recipe.dishTypes.join(', ')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">{selectedRecipe.title}</h3>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Recipe Image */}
              <div className="relative h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Recipe Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Quick Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prep Time:</span>
                        <span className="font-medium">{selectedRecipe.readyInMinutes} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Servings:</span>
                        <span className="font-medium">{selectedRecipe.servings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className={`font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                          {selectedRecipe.difficulty.charAt(0).toUpperCase() + selectedRecipe.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Rating</h4>
                    <div className="flex items-center space-x-2">
                      {getRatingStars(selectedRecipe.rating)}
                      <span className="text-sm text-gray-600">({selectedRecipe.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Nutrition */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Nutrition per Serving</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calories:</span>
                        <span className="font-medium">{selectedRecipe.calories} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protein:</span>
                        <span className="font-medium">{selectedRecipe.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carbs:</span>
                        <span className="font-medium">{selectedRecipe.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fats:</span>
                        <span className="font-medium">{selectedRecipe.fats}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fiber:</span>
                        <span className="font-medium">{selectedRecipe.fiber}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sugar:</span>
                        <span className="font-medium">{selectedRecipe.sugar}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sodium:</span>
                        <span className="font-medium">{selectedRecipe.sodium}mg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Ingredients</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Instructions</h4>
                <ol className="space-y-2">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (onRecipeSelect) {
                      onRecipeSelect(selectedRecipe);
                      setSelectedRecipe(null);
                    }
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/600 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add to Meal Plan
                </button>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
