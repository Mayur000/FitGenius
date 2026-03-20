import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, Search, Plus, X, Package } from 'lucide-react';

interface BarcodeResult {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  ingredients: string[];
  allergens: string[];
  confidence: number;
}

interface BarcodeScannerProps {
  onScanComplete: (result: BarcodeResult) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanComplete, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  // Barcode scanner (camera + manual)
  const [scanResult, setScanResult] = useState<BarcodeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [searchQuery] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock barcode database
  const barcodeDatabase: BarcodeResult[] = [
    {
      id: '1',
      barcode: '0123456789012',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      calories: 100,
      protein: 10,
      carbs: 12,
      fats: 0,
      fiber: 0,
      sugar: 12,
      sodium: 60,
      servingSize: '1 cup (227g)',
      ingredients: ['Cultured Pasteurized Grade A Milk', 'Live Active Yogurt Cultures', 'Pectin'],
      allergens: ['Milk'],
      confidence: 0.95
    },
    {
      id: '2',
      barcode: '0123456789034',
      name: 'Whole Wheat Bread',
      brand: 'Nature\'s Own',
      calories: 80,
      protein: 4,
      carbs: 15,
      fats: 1,
      fiber: 2,
      sugar: 3,
      sodium: 150,
      servingSize: '1 slice (28g)',
      ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar'],
      allergens: ['Wheat', 'Gluten'],
      confidence: 0.92
    },
    {
      id: '3',
      barcode: '01234567890567',
      name: 'Organic Chicken Breast',
      brand: 'Perdue',
      calories: 110,
      protein: 23,
      carbs: 0,
      fats: 2.5,
      fiber: 0,
      sugar: 0,
      sodium: 70,
      servingSize: '4 oz (113g)',
      ingredients: ['Chicken Breast', 'Water', 'Salt'],
      allergens: [],
      confidence: 0.88
    },
    {
      id: '4',
      barcode: '01234567890789',
      name: 'Almond Milk',
      brand: 'Silk',
      calories: 30,
      protein: 1,
      carbs: 1,
      fats: 2.5,
      fiber: 0,
      sugar: 0,
      sodium: 150,
      servingSize: '1 cup (240ml)',
      ingredients: ['Almondmilk', 'Calcium Carbonate', 'Sea Salt', 'Carrageenan', 'Vitamin A Palmitate', 'Vitamin D2'],
      allergens: ['Tree Nuts'],
      confidence: 0.91
    }
  ];

  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      setIsScanning(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const simulateBarcodeScan = useCallback(() => {
    setIsProcessing(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const randomProduct = barcodeDatabase[Math.floor(Math.random() * barcodeDatabase.length)];
      setScanResult(randomProduct);
      setIsProcessing(false);
      stopCamera();
    }, 2000);
  }, [barcodeDatabase, stopCamera]);

  const handleManualSearch = useCallback(() => {
    if (manualCode.trim()) {
      setIsProcessing(true);
      
      setTimeout(() => {
        const found = barcodeDatabase.find(item => 
          item.barcode.includes(manualCode.trim()) || 
          item.name.toLowerCase().includes(manualCode.trim().toLowerCase())
        );
        
        if (found) {
          setScanResult(found);
        } else {
          // Show not found message
          setScanResult({
            id: 'not-found',
            barcode: manualCode,
            name: 'Product Not Found',
            brand: 'Unknown',
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0,
            servingSize: 'N/A',
            ingredients: [],
            allergens: [],
            confidence: 0
          });
        }
        setIsProcessing(false);
      }, 1000);
    }
  }, [manualCode]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAllergenColor = (allergen: string) => {
    const highRiskAllergens = ['Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Eggs', 'Milk', 'Wheat', 'Soy'];
    return highRiskAllergens.includes(allergen) ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Barcode Scanner</h2>
              <p className="text-sm text-gray-600">Scan packaged foods for instant nutrition data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scanner View */}
        {!scanResult && (
          <div className="space-y-6">
            {/* Camera/Manual Input */}
            <div className="grid grid-cols-2 gap-6">
              {/* Camera Scanner */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Camera Scanner</h3>
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  {isScanning ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera size={48} className="mb-3 mx-auto opacity-50" />
                        <p className="text-sm opacity-75">Position barcode in frame</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-x-4 top-4 h-1 bg-red-500 animate-pulse" />
                      <div className="absolute inset-x-4 bottom-4 h-1 bg-red-500 animate-pulse" />
                      <div className="absolute inset-y-4 left-4 w-1 bg-red-500 animate-pulse" />
                      <div className="absolute inset-y-4 right-4 w-1 bg-red-500 animate-pulse" />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4 mt-4">
                  {!isScanning ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/600 transition-colors"
                    >
                      <Camera size={20} className="mr-2" />
                      Start Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      <X size={20} className="mr-2" />
                      Stop Camera
                    </button>
                  )}
                  
                  {isScanning && (
                    <button
                      onClick={simulateBarcodeScan}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Scan size={20} className="mr-2" />
                      {isProcessing ? 'Scanning...' : 'Simulate Scan'}
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Manual Entry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barcode or Product Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleManualSearch();
                          }
                        }}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter barcode or search product..."
                      />
                      <button
                        onClick={handleManualSearch}
                        disabled={!manualCode.trim() || isProcessing}
                        className="absolute right-2 top-3 p-1 text-gray-500 hover:text-primary transition-colors"
                      >
                        <Search size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {searchQuery && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Searching for: "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Processing Overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent border-r-transparent border-b-transparent animate-spin rounded-full" />
                    <p className="text-white mt-4">Scanning barcode...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Scan Result */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    scanResult.id === 'not-found' 
                      ? 'bg-red-100' 
                      : 'bg-green-100'
                  }`}>
                    <Package size={20} className={
                      scanResult.id === 'not-found' ? 'text-red-600' : 'text-green-600'
                    } />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {scanResult.name}
                    </h3>
                    <p className="text-sm text-gray-600">{scanResult.brand}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span>Barcode:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {scanResult.barcode}
                      </span>
                    </div>
                    {scanResult.confidence > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span>Confidence:</span>
                        <span className={getConfidenceColor(scanResult.confidence)}>
                          {(scanResult.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {scanResult.id !== 'not-found' && (
                  <button
                    onClick={() => onScanComplete(scanResult)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/600 transition-colors"
                  >
                    <Plus size={20} className="mr-2" />
                    Add to Nutrition Log
                  </button>
                )}
              </div>

              {/* Nutrition Information */}
              {scanResult.id !== 'not-found' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Macros */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Macronutrients</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Calories:</span>
                        <span className="font-medium">{scanResult.calories} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Protein:</span>
                        <span className="font-medium">{scanResult.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Carbs:</span>
                        <span className="font-medium">{scanResult.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fats:</span>
                        <span className="font-medium">{scanResult.fats}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fiber:</span>
                        <span className="font-medium">{scanResult.fiber}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Additional Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sugar:</span>
                        <span className="font-medium">{scanResult.sugar}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sodium:</span>
                        <span className="font-medium">{scanResult.sodium}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Serving:</span>
                        <span className="font-medium">{scanResult.servingSize}</span>
                      </div>
                    </div>
                  </div>

                {/* Ingredients */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                {scanResult.allergens.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Allergens</h4>
                    <div className="flex flex-wrap gap-2">
                      {scanResult.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getAllergenColor(allergen)}`}
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Not Found Message */}
              {scanResult.id === 'not-found' && (
                <div className="text-center py-6">
                  <div className="text-red-600 mb-4">
                    <Package size={48} className="mx-auto mb-3" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Product Not Found</h4>
                  <p className="text-gray-600 mb-4">
                    The barcode "{scanResult.barcode}" was not found in our database. 
                    Try manual entry or check if the product is available.
                  </p>
                  <button
                    onClick={() => setScanResult(null)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
