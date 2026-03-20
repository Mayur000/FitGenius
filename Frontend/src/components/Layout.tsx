import React from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
