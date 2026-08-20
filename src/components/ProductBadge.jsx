import React from 'react';
import { Flame, Sparkles, Award, Zap, Clock, Star, ChefHat } from 'lucide-react';

const TAG_CONFIG = {
  BEST_SELLER: {
    label: 'Best Seller',
    bg: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)', // Gold / Champagne
    color: '#1A1816',
    icon: Award,
  },
  HOT: {
    label: 'Hot',
    bg: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', // Coral Red
    color: '#FFFFFF',
    icon: Flame,
  },
  NEW: {
    label: 'New',
    bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Emerald Green
    color: '#FFFFFF',
    icon: Sparkles,
  },
  FAST_MOVING: {
    label: 'Fast Moving',
    bg: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', // Ocean Cyan / Blue
    color: '#FFFFFF',
    icon: Zap,
  },
  CHEFS_SPECIAL: {
    label: "Chef's Special",
    bg: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', // Royal Purple
    color: '#FFFFFF',
    icon: ChefHat,
  },
  LIMITED: {
    label: 'Limited',
    bg: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', // Rich Indigo
    color: '#FFFFFF',
    icon: Clock,
  }
};

export default function ProductBadge({ tagKey }) {
  const config = TAG_CONFIG[tagKey?.toUpperCase()] || {
    label: tagKey,
    bg: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)',
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
        padding: 'clamp(3px, 1vw, 4px) clamp(8px, 2.5vw, 10px)', // 💡 FLUID PADDING
        borderRadius: '20px',
        background: config.bg,
        color: config.color,
        fontSize: 'clamp(10px, 2.8vw, 11px)', // 💡 FLUID TYPOGRAPHY
        fontWeight: '800',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(4px)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flexShrink: 0,
        minWidth: 0
      }}
    >
      {IconComponent && <IconComponent size={12} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{config.label}</span>
    </span>
  );
}