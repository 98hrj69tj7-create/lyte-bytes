import React from 'react';
import { Flame, Sparkles, Award, Zap, Clock, Star, ChefHat } from 'lucide-react';

const TAG_CONFIG = {
  BEST_SELLER: {
    label: 'Best Seller',
    bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#14120F',
    icon: Award,
  },
  HOT: {
    label: 'Hot',
    bg: 'linear-gradient(135deg, #FF5958 0%, #FF2A2A 100%)',
    color: '#FFFFFF',
    icon: Flame,
  },
  NEW: {
    label: 'New',
    bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: '#FFFFFF',
    icon: Sparkles,
  },
  FAST_MOVING: {
    label: 'Fast Moving',
    bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    color: '#FFFFFF',
    icon: Zap,
  },
  CHEFS_SPECIAL: {
    label: "Chef's Special",
    bg: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    color: '#FFFFFF',
    icon: ChefHat,
  },
  LIMITED: {
    label: 'Limited',
    bg: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)',
    color: '#FFFFFF',
    icon: Clock,
  }
};

export default function ProductBadge({ tagKey }) {
  const config = TAG_CONFIG[tagKey?.toUpperCase()] || {
    label: tagKey,
    bg: '#FF5958',
    color: '#FFFFFF',
    icon: Star,
  };

  const IconComponent = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '20px',
        background: config.bg,
        color: config.color,
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(4px)',
      }}
    >
      {IconComponent && <IconComponent size={12} strokeWidth={2.5} />}
      {config.label}
    </span>
  );
}