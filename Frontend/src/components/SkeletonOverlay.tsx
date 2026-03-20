import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface Keypoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}

interface SkeletonOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onFormAnalysis?: (analysis: FormAnalysis) => void;
}

interface FormAnalysis {
  overallScore: number;
  issues: string[];
  suggestions: string[];
}

export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({ 
  isActive, 
  onFormAnalysis 
}) => {
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);

  // Mock pose detection simulation
  useEffect(() => {
    if (!isActive) {
      setKeypoints([]);
      return;
    }

    const interval = setInterval(() => {
      // Simulate MediaPipe pose detection
      const mockKeypoints: Keypoint[] = [
        { x: 0.5, y: 0.15, confidence: 0.95, name: 'nose' },
        { x: 0.48, y: 0.18, confidence: 0.92, name: 'left_eye' },
        { x: 0.52, y: 0.18, confidence: 0.91, name: 'right_eye' },
        { x: 0.45, y: 0.25, confidence: 0.88, name: 'left_shoulder' },
        { x: 0.55, y: 0.25, confidence: 0.89, name: 'right_shoulder' },
        { x: 0.35, y: 0.45, confidence: 0.85, name: 'left_elbow' },
        { x: 0.65, y: 0.45, confidence: 0.84, name: 'right_elbow' },
        { x: 0.25, y: 0.65, confidence: 0.82, name: 'left_wrist' },
        { x: 0.75, y: 0.65, confidence: 0.81, name: 'right_wrist' },
        { x: 0.5, y: 0.4, confidence: 0.93, name: 'left_hip' },
        { x: 0.5, y: 0.4, confidence: 0.92, name: 'right_hip' },
        { x: 0.35, y: 0.75, confidence: 0.78, name: 'left_knee' },
        { x: 0.65, y: 0.75, confidence: 0.77, name: 'right_knee' },
        { x: 0.25, y: 0.85, confidence: 0.75, name: 'left_ankle' },
        { x: 0.75, y: 0.85, confidence: 0.74, name: 'right_ankle' }
      ];

      // Add some realistic movement variation
      const time = Date.now() / 1000;
      const animatedKeypoints = mockKeypoints.map(kp => ({
        ...kp,
        x: kp.x + Math.sin(time * 2 + parseInt(kp.name)) * 0.02,
        y: kp.y + Math.cos(time * 3 + parseInt(kp.name)) * 0.01
      }));

      setKeypoints(animatedKeypoints);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  // Form analysis simulation
  useEffect(() => {
    if (keypoints.length > 0 && onFormAnalysis) {
      const analysis = analyzeForm(keypoints);
      onFormAnalysis(analysis);
    }
  }, [keypoints, onFormAnalysis]);

  const analyzeForm = (points: Keypoint[]): FormAnalysis => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check form issues
    const leftShoulder = points.find(p => p.name === 'left_shoulder');
    const rightShoulder = points.find(p => p.name === 'right_shoulder');
    const leftElbow = points.find(p => p.name === 'left_elbow');
    const rightElbow = points.find(p => p.name === 'right_elbow');

    if (leftShoulder && leftElbow) {
      const elbowAngle = calculateAngle(leftShoulder, leftElbow, points.find(p => p.name === 'left_wrist'));
      if (elbowAngle < 160) {
        issues.push('Left arm not fully extended');
        suggestions.push('Focus on full arm extension');
        score -= 10;
      }
    }

    if (rightShoulder && rightElbow) {
      const elbowAngle = calculateAngle(rightShoulder, rightElbow, points.find(p => p.name === 'right_wrist'));
      if (elbowAngle < 160) {
        issues.push('Right arm not fully extended');
        suggestions.push('Focus on full arm extension');
        score -= 10;
      }
    }

    // Check depth
    const avgDepth = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    if (avgDepth < 0.3) {
      issues.push('Too close to camera');
      suggestions.push('Move back from camera for better tracking');
      score -= 15;
    }

    return {
      overallScore: Math.max(0, score),
      issues,
      suggestions
    };
  };

  const calculateAngle = (p1: Keypoint | undefined, p2: Keypoint | undefined, p3: Keypoint | undefined): number => {
    if (!p1 || !p2 || !p3) return 0;
    
    const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = angle2 - angle1;
    
    if (angle > Math.PI) angle -= 2 * Math.PI;
    if (angle < -Math.PI) angle += 2 * Math.PI;
    
    return angle * (180 / Math.PI);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG Skeleton Overlay */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1 1">
        {/* Skeleton connections */}
        <g stroke="rgba(34, 197, 94, 0.8)" strokeWidth="0.008" fill="none">
          {/* Torso */}
          <line x1={keypoints.find(kp => kp.name === 'left_shoulder')?.x || 0.45} 
                y1={keypoints.find(kp => kp.name === 'left_shoulder')?.y || 0.25}
                x2={keypoints.find(kp => kp.name === 'right_shoulder')?.x || 0.55} 
                y2={keypoints.find(kp => kp.name === 'right_shoulder')?.y || 0.25} />
          <line x1={keypoints.find(kp => kp.name === 'left_shoulder')?.x || 0.45} 
                y1={keypoints.find(kp => kp.name === 'left_shoulder')?.y || 0.25}
                x2={keypoints.find(kp => kp.name === 'left_hip')?.x || 0.5} 
                y2={keypoints.find(kp => kp.name === 'left_hip')?.y || 0.4} />
          <line x1={keypoints.find(kp => kp.name === 'right_shoulder')?.x || 0.55} 
                y1={keypoints.find(kp => kp.name === 'right_shoulder')?.y || 0.25}
                x2={keypoints.find(kp => kp.name === 'right_hip')?.x || 0.5} 
                y2={keypoints.find(kp => kp.name === 'right_hip')?.y || 0.4} />
          
          {/* Arms */}
          <line x1={keypoints.find(kp => kp.name === 'left_shoulder')?.x || 0.45} 
                y1={keypoints.find(kp => kp.name === 'left_shoulder')?.y || 0.25}
                x2={keypoints.find(kp => kp.name === 'left_elbow')?.x || 0.35} 
                y2={keypoints.find(kp => kp.name === 'left_elbow')?.y || 0.45} />
          <line x1={keypoints.find(kp => kp.name === 'left_elbow')?.x || 0.35} 
                y1={keypoints.find(kp => kp.name === 'left_elbow')?.y || 0.45}
                x2={keypoints.find(kp => kp.name === 'left_wrist')?.x || 0.25} 
                y2={keypoints.find(kp => kp.name === 'left_wrist')?.y || 0.65} />
          <line x1={keypoints.find(kp => kp.name === 'right_shoulder')?.x || 0.55} 
                y1={keypoints.find(kp => kp.name === 'right_shoulder')?.y || 0.25}
                x2={keypoints.find(kp => kp.name === 'right_elbow')?.x || 0.65} 
                y2={keypoints.find(kp => kp.name === 'right_elbow')?.y || 0.45} />
          <line x1={keypoints.find(kp => kp.name === 'right_elbow')?.x || 0.65} 
                y1={keypoints.find(kp => kp.name === 'right_elbow')?.y || 0.45}
                x2={keypoints.find(kp => kp.name === 'right_wrist')?.x || 0.75} 
                y2={keypoints.find(kp => kp.name === 'right_wrist')?.y || 0.65} />
          
          {/* Legs */}
          <line x1={keypoints.find(kp => kp.name === 'left_hip')?.x || 0.5} 
                y1={keypoints.find(kp => kp.name === 'left_hip')?.y || 0.4}
                x2={keypoints.find(kp => kp.name === 'left_knee')?.x || 0.35} 
                y2={keypoints.find(kp => kp.name === 'left_knee')?.y || 0.75} />
          <line x1={keypoints.find(kp => kp.name === 'left_knee')?.x || 0.35} 
                y1={keypoints.find(kp => kp.name === 'left_knee')?.y || 0.75}
                x2={keypoints.find(kp => kp.name === 'left_ankle')?.x || 0.25} 
                y2={keypoints.find(kp => kp.name === 'left_ankle')?.y || 0.85} />
          <line x1={keypoints.find(kp => kp.name === 'right_hip')?.x || 0.5} 
                y1={keypoints.find(kp => kp.name === 'right_hip')?.y || 0.4}
                x2={keypoints.find(kp => kp.name === 'right_knee')?.x || 0.65} 
                y2={keypoints.find(kp => kp.name === 'right_knee')?.y || 0.75} />
          <line x1={keypoints.find(kp => kp.name === 'right_knee')?.x || 0.65} 
                y1={keypoints.find(kp => kp.name === 'right_knee')?.y || 0.75}
                x2={keypoints.find(kp => kp.name === 'right_ankle')?.x || 0.75} 
                y2={keypoints.find(kp => kp.name === 'right_ankle')?.y || 0.85} />
        </g>
        
        {/* Keypoints */}
        {keypoints.map((kp, index) => (
          <circle
            key={index}
            cx={kp.x}
            cy={kp.y}
            r="0.015"
            fill={getConfidenceColor(kp.confidence)}
            stroke="white"
            strokeWidth="0.005"
            className="transition-all duration-100"
          />
        ))}
      </svg>

      {/* Form Analysis Overlay */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="bg-black bg-opacity-75 backdrop-blur-sm rounded-lg p-3 text-white max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Camera size={16} />
              <span className="text-sm font-medium">AI Form Analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs">Live</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Form Score</span>
              <span className={`text-lg font-bold ${getScoreColor(85)}`}>
                {85}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
