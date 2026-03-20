import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: string;
}

interface AIVisionMealLoggerProps {
  onMealIdentified: (foods: FoodItem[]) => void;
  onClose: () => void;
}

export const AIVisionMealLogger: React.FC<AIVisionMealLoggerProps> = ({ 
  onMealIdentified, 
  onClose 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedFoods, setIdentifiedFoods] = useState<FoodItem[]>([]);
  const [cameraError, setCameraError] = useState<string>('');
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock AI food identification results
  const mockFoodIdentification = useCallback((): FoodItem[] => {
    return [
      {
        id: '1',
        name: 'Grilled Chicken Breast',
        confidence: 94,
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
        quantity: '100g'
      },
      {
        id: '2',
        name: 'Brown Rice',
        confidence: 87,
        calories: 111,
        protein: 2.6,
        carbs: 23,
        fats: 0.9,
        quantity: '100g'
      },
      {
        id: '3',
        name: 'Broccoli',
        confidence: 92,
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fats: 0.4,
        quantity: '100g'
      }
    ];
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError('');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser.');
        return;
      }
      
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch {
          throw new Error('Camera access denied or not available');
        }
      }
      
      streamRef.current = stream;
      setIsCapturing(true);

      // Assign stream after state update so the video element is mounted
      setTimeout(() => {
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            setCameraError('Unable to start camera preview.');
          });
        }
      }, 50);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera device found. Please connect a camera.');
        } else {
          setCameraError('Unable to access camera. Please check permissions.');
        }
      } else {
        setCameraError('Camera error occurred. Please try again.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg');
        processImage(imageData);
      }
    }
  }, []);

  const processImage = useCallback(async (_imageData: string) => {
    setIsProcessing(true);
    stopCamera();
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const foods = mockFoodIdentification();
    setIdentifiedFoods(foods);
    setIsProcessing(false);
  }, [mockFoodIdentification, stopCamera]);

  const toggleFoodSelection = useCallback((foodId: string) => {
    setSelectedFoods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(foodId)) {
        newSet.delete(foodId);
      } else {
        newSet.add(foodId);
      }
      return newSet;
    });
  }, []);

  const confirmSelection = useCallback(() => {
    const selectedFoodItems = identifiedFoods.filter(food => 
      selectedFoods.has(food.id)
    );
    console.log('Confirming selected foods:', selectedFoodItems);
    onMealIdentified(selectedFoodItems);
    // Clear selections
    setIdentifiedFoods([]);
    setSelectedFoods(new Set());
    // Don't call setShowAIVision here - let parent component handle it
  }, [identifiedFoods, selectedFoods, onMealIdentified]);

  const retakePhoto = useCallback(() => {
    setIdentifiedFoods([]);
    setSelectedFoods(new Set());
    startCamera();
  }, [startCamera]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">AI Food Recognition</h2>
          <button
            onClick={() => {
              console.log('Close button clicked');
              if (onClose) {
                onClose();
              } else {
                console.error('onClose prop is not a function');
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Camera View */}
        {!identifiedFoods.length ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-xl overflow-hidden">
              {isCapturing ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '256px', objectFit: 'cover', display: 'block' }}
                  onCanPlay={(e) => {
                    (e.target as HTMLVideoElement).play();
                  }}
                  onError={() => {
                    setCameraError('Video stream error. Please try again.');
                  }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={48} className="text-white mb-3 mx-auto opacity-50" />
                    <p className="text-white text-sm opacity-75">
                      Position your meal in the frame
                    </p>
                  </div>
                </div>
              )}
              
              {/* Hidden canvas for image capture */}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {isCapturing && !isProcessing && (
                  <button
                    onClick={capturePhoto}
                    className="bg-white bg-opacity-20 backdrop-blur p-4 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Camera size={24} className="text-gray-700" />
                    </div>
                  </button>
                )}
              </div>
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw size={32} className="text-white mb-3 mx-auto animate-spin" />
                    <p className="text-white">AI analyzing your meal...</p>
                  </div>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-red-700 text-sm">{cameraError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isCapturing ? (
                <button
                  onClick={startCamera}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <Camera size={20} className="mr-2" />
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Food Identification Results */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Identified Foods ({identifiedFoods.length})
              </h3>
              <button
                onClick={retakePhoto}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                Retake Photo
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {identifiedFoods.map((food) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFoods.has(food.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleFoodSelection(food.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-800">{food.name}</h4>
                        <span className={`text-sm font-medium ${getConfidenceColor(food.confidence)}`}>
                          {food.confidence}% match
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{food.quantity}</div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Cal:</span>
                          <span className="font-medium ml-1">{food.calories}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">P:</span>
                          <span className="font-medium ml-1">{food.protein}g</span>
                        </div>
                        <div>
                          <span className="text-gray-500">C:</span>
                          <span className="font-medium ml-1">{food.carbs}g</span>
                        </div>
                        <div>
                          <span className="text-gray-500">F:</span>
                          <span className="font-medium ml-1">{food.fats}g</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-3">
                      {selectedFoods.has(food.id) ? (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                disabled={selectedFoods.size === 0}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedFoods.size > 0
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add Selected ({selectedFoods.size})
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
