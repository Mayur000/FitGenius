import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type AdVariant = 'fitness' | 'nutrition' | 'health' | 'sleep' | 'supplement';

interface AdBannerProps {
  onUpgrade?: () => void;
  variant?: AdVariant;
}

const ADS: Record<AdVariant, { emoji: string; title: string; subtitle: string; cta: string }> = {
  fitness: {
    emoji: '💪',
    title: 'Get 20% off Whey Protein',
    subtitle: 'Premium quality, all flavors — shop now',
    cta: 'Shop',
  },
  nutrition: {
    emoji: '🥗',
    title: 'Try HelloFresh — Save 50%',
    subtitle: 'Pre-portioned, chef-crafted meal kits',
    cta: 'Claim',
  },
  health: {
    emoji: '🩺',
    title: 'Get a Free Health Checkup',
    subtitle: 'Book at-home lab tests starting at ₹299',
    cta: 'Book',
  },
  sleep: {
    emoji: '😴',
    title: 'Sleep Better with BrainOrg',
    subtitle: 'AI-powered sleep analysis — free trial',
    cta: 'Try Free',
  },
  supplement: {
    emoji: '💊',
    title: 'MuscleBlaze D3 + Omega-3',
    subtitle: 'Essential vitamins for active lifestyles',
    cta: 'Buy Now',
  },
};

export const AdBanner: React.FC<AdBannerProps> = ({ onUpgrade, variant = 'fitness' }) => {
  const ad = ADS[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm my-4"
    >
      {/* Ad Label */}
      <div className="text-[9px] font-bold text-gray-400 tracking-widest px-4 pt-2">
        ADVERTISEMENT · FREE PLAN
      </div>

      {/* Ad Content */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{ad.emoji}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">{ad.title}</p>
            <p className="text-gray-400 text-xs truncate">{ad.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="flex-shrink-0 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary-dark transition-colors"
        >
          {ad.cta} <ArrowRight size={10} />
        </button>
      </div>

      {/* Remove ads CTA */}
      <div
        onClick={onUpgrade}
        className="bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <p className="text-xs text-gray-500">
          Remove ads with <span className="font-semibold text-primary">Premium</span>
        </p>
        <div className="flex items-center gap-1 text-primary text-xs font-bold">
          <Zap size={11} /> Upgrade
        </div>
      </div>
    </motion.div>
  );
};


