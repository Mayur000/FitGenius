import React from 'react';
import { Home, Activity, Utensils, Dumbbell } from 'lucide-react';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab = 'dashboard', 
  onTabChange = () => {} 
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
