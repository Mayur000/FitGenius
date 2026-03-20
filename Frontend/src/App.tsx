import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { HealthTracker } from './components/HealthTracker';
import { Nutrition } from './components/Nutrition';
import { Fitness } from './components/Fitness';
import { Profile } from './components/Profile';
import { OnboardingForm } from './components/OnboardingForm';
import { Home, Activity, Utensils, Dumbbell, User } from 'lucide-react';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(true); // Set to true for testing
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <OnboardingForm onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'health':
        return <HealthTracker />;
      case 'nutrition':
        return <Nutrition />;
      case 'fitness':
        return <Fitness />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/2" />

      {/* App shell: sidebar on desktop, stacked on mobile */}
      <div className="flex min-h-screen relative z-10">

        {/* --- SIDEBAR NAV (desktop only) --- */}
        <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100/50 fixed top-0 left-0 h-full z-50 py-8 px-4">
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-display font-extrabold text-primary">FitGenius</h1>
            <p className="text-xs text-gray-400 mt-0.5">AI Health & Wellness</p>
          </div>
          <nav className="flex flex-col gap-1">
            {([
              { tab: 'dashboard', icon: <Home size={20}/>, label: 'Dashboard' },
              { tab: 'health', icon: <Activity size={20}/>, label: 'Health' },
              { tab: 'nutrition', icon: <Utensils size={20}/>, label: 'Nutrition' },
              { tab: 'fitness', icon: <Dumbbell size={20}/>, label: 'Fitness' },
              { tab: 'profile', icon: <User size={20}/>, label: 'Profile' },
            ] as const).map(({ tab, icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className={activeTab === tab ? 'text-primary' : 'text-gray-400'}>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 lg:ml-64 overflow-y-auto pb-28 lg:pb-8">
          {renderActiveTab()}
        </main>

        {/* --- BOTTOM NAV (mobile only) --- */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/80 backdrop-blur-xl border-t border-gray-100/50 px-2 py-3 z-50">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === 'dashboard' ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home size={22} className={`mb-1 transition-transform ${activeTab === 'dashboard' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-wide">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === 'health' ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Activity size={22} className={`mb-1 transition-transform ${activeTab === 'health' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-wide">Health</span>
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === 'nutrition' ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Utensils size={22} className={`mb-1 transition-transform ${activeTab === 'nutrition' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-wide">Nutrition</span>
            </button>
            <button
              onClick={() => setActiveTab('fitness')}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === 'fitness' ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Dumbbell size={22} className={`mb-1 transition-transform ${activeTab === 'fitness' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-wide">Fitness</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === 'profile' ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User size={22} className={`mb-1 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-wide">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
