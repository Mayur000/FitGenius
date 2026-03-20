import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Award, 
  Activity, 
  Flame,
  CheckCircle,
  Crown,
  Zap,
  ChevronRight,
  LogOut,
  Bell,
  Lock,
  Smartphone,
  Scale,
  Ruler,
  Target
} from 'lucide-react';
import { AdBanner } from './AdBanner';

const TIERS = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '$0',
    interval: 'forever',
    description: 'Basic tracking designed for starting your journey.',
    icon: <User className="text-gray-500" size={24} />,
    color: 'bg-gray-100',
    textColor: 'text-gray-800',
    buttonColor: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    features: [
      'Basic Health Tracking (weight, sleep, calories)',
      'Limited Meal Logging (3 meals/day)',
      'Manual Workout Logging (no AI assistance)',
      'Short-term Analytics (7-day trend charts)',
      'Ad-supported experience'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Tier',
    price: '$9.99',
    interval: '/mo',
    description: 'Unlock the core "Genius" features of the platform.',
    icon: <Zap className="text-primary" size={24} />,
    color: 'bg-green-50 border-2 border-primary',
    textColor: 'text-primary-dark',
    buttonColor: 'bg-primary text-white hover:bg-primary/90',
    popular: true,
    features: [
      'Unlimited AI Vision food auto-logging',
      'Unlimited AI Meal Plan & Workout Generators',
      'BMI trend forecasting & risk scores',
      'AI Real-time form checker (pose estimation)',
      'Weekly wellness PDF reports',
      'Ad-free Experience'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Tier',
    price: '$19.99',
    interval: '/mo',
    description: 'Advanced optimization for high-end users.',
    icon: <Crown className="text-purple-500" size={24} />,
    color: 'bg-purple-50 border border-purple-200',
    textColor: 'text-purple-700',
    buttonColor: 'bg-purple-600 text-white hover:bg-purple-700',
    features: [
      'Everything in Premium',
      'Progressive overload calculator',
      'In-depth body composition tracking',
      '1-on-1 Coach matching',
      'Advanced meal prep planning tools',
      'Private community & early feature access'
    ]
  }
];

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile');
  const [currentPlan] = useState('free');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [healthSyncOn, setHealthSyncOn] = useState(false);

  return (
    <div className="px-4 py-4 space-y-4 max-w-5xl mx-auto w-full mb-20">
      {/* Header Profile Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
              alt="User Avatar" 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div className="absolute -bottom-1 -right-1 bg-gray-100 p-1 rounded-full border border-gray-300">
              <User size={12} className="text-gray-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mayur Narkhede</h1>
            <p className="text-sm text-gray-500">Free Tier Member • Joined Mar 2026</p>
          </div>
        </div>
        <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Flame size={24} className="text-orange-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">14</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Activity size={24} className="text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">28</div>
          <div className="text-xs text-gray-500">Workouts</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <Award size={24} className="text-yellow-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-800">5</div>
          <div className="text-xs text-gray-500">Badges</div>
        </div>
      </div>

      {/* Tabs */}
      <AdBanner variant="supplement" />
      <div className="flex bg-white rounded-xl p-1 shadow-sm">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          My Profile
        </button>
        <button 
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'subscription' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Subscription Plans
        </button>
      </div>

      {/* Subscription Plans */}
      {activeTab === 'subscription' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center md:px-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upgrade Your Fitness Journey</h2>
            <p className="text-gray-500">Unlock the actual AI-powered "Genius" within FitGenius. Choose the plan that best fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {TIERS.map((tier) => (
              <motion.div 
                key={tier.id}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl p-6 flex flex-col pt-8 ${tier.color} transition-all shadow-sm cursor-pointer`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                    <Zap size={12} /> MOST POPULAR
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold ${tier.textColor}`}>{tier.name}</h3>
                    {tier.icon}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500">{tier.interval}</span>
                  </div>
                  <p className="text-sm text-gray-600 min-h-[40px]">{tier.description}</p>
                </div>

                <div className="flex-grow space-y-3 mb-6">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} className={`mt-0.5 ${tier.id === 'premium' ? 'text-primary' : tier.id === 'pro' ? 'text-purple-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-700 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 rounded-xl font-bold transition-colors ${tier.buttonColor} ${currentPlan === tier.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {currentPlan === tier.id ? 'Current Plan' : `Upgrade to ${tier.name.split(' ')[0]}`}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Settings / Account Details */}
      {activeTab === 'profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <User size={18} className="text-gray-500" />
              <h3 className="font-semibold text-gray-800">Personal Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Full Name</label>
                  <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded-lg border border-gray-100">Alex Johnson</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Email</label>
                  <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded-lg border border-gray-100 truncate">alex.j@example.com</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Age</label>
                  <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded-lg border border-gray-100">28 years</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Gender</label>
                  <div className="text-sm text-gray-800 p-2 bg-gray-50 rounded-lg border border-gray-100">Male</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Weight</label>
                  <div className="flex items-center gap-2 text-sm text-gray-800 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <Scale size={14} className="text-gray-400" /> 175 lbs
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Height</label>
                  <div className="flex items-center gap-2 text-sm text-gray-800 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <Ruler size={14} className="text-gray-400" /> 5'10"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-800">Current Goals</h3>
              </div>
              <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Edit</button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Primary Goal</span>
                <span className="text-sm font-semibold text-gray-800 border bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 rounded-full">Build Muscle</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Target Weight</span>
                <span className="text-sm font-medium text-gray-800">185 lbs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Activity Level</span>
                <span className="text-sm font-medium text-gray-800">Highly Active</span>
              </div>
            </div>
          </div>

          {/* Connected Apps & Preferences */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Settings size={18} className="text-gray-500" />
              <h3 className="font-semibold text-gray-800">Preferences & Connections</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {/* Notifications Toggle */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg"><Bell size={18} className="text-gray-600" /></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Push Notifications</div>
                    <div className="text-xs text-gray-500">Reminders, alerts and weekly reports</div>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationsOn(!notificationsOn)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${notificationsOn ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${notificationsOn ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Health Sync Toggle */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg"><Smartphone size={18} className="text-gray-600" /></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Apple Health / Google Fit</div>
                    <div className="text-xs text-gray-500">Sync steps, sleep and vitals seamlessly</div>
                  </div>
                </div>
                <button 
                  onClick={() => setHealthSyncOn(!healthSyncOn)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${healthSyncOn ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${healthSyncOn ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Password / Security */}
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg"><Lock size={18} className="text-gray-600" /></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Security & Password</div>
                    <div className="text-xs text-gray-500">Update your security preferences</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <button className="w-full bg-white rounded-xl shadow-sm p-4 text-red-500 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors border border-red-100 mt-4">
            <LogOut size={18} /> Sign Out
          </button>
        </motion.div>
      )}
    </div>
  );
};
