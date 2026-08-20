import React, { useState, useEffect } from 'react';
import { Stamp, Crown, Flame, Check, Trophy, Award } from 'lucide-react';

const getStampDetails = (count) => {
  if (count >= 12) return { name: "The Culinary Emperor", icon: Crown, color: "#B45309", level: "Level 5" };
  if (count >= 9) return { name: "Glaze Grandmaster", icon: Trophy, color: "#7C3AED", level: "Level 4" };
  if (count >= 6) return { name: "Sponge Sovereign", icon: Crown, color: "#D97706", level: "Level 3" };
  if (count >= 3) return { name: "Whisk Aristocrat", icon: Award, color: "#8A6D2B", level: "Level 2" };
  return { name: "Crumbs Bandit", icon: Stamp, color: "#64748B", level: "Level 1" };
};

const getStreakDetails = (orders = []) => {
  if (!orders || orders.length === 0) {
    return { title: "Flat Batter", subtitle: "Standard", color: "#64748B", level: "Tier 0" };
  }
  let latestDate = null;
  orders.forEach(o => {
    const d = new Date(o.date);
    if (!isNaN(d.getTime())) {
      if (!latestDate || d > latestDate) latestDate = d;
    }
  });

  if (!latestDate) {
    return { title: "Flat Batter", subtitle: "Standard", color: "#64748B", level: "Tier 0" };
  }

  const now = new Date();
  const diffDays = Math.floor((now - latestDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 6) {
    return { title: "The Endless Bake", subtitle: "Elite Frequency", color: "#DC2626", level: "Tier 3" };
  } else if (diffDays >= 7 && diffDays <= 13) {
    return { title: "Rapid Rise", subtitle: "Consistent Ordering", color: "#D97706", level: "Tier 2" };
  } else if (diffDays >= 14 && diffDays <= 20) {
    return { title: "Rising Dough", subtitle: "Active Streak", color: "#EA580C", level: "Tier 1" };
  } else {
    return { title: "Flat Batter", subtitle: "Standard", color: "#64748B", level: "Tier 0" };
  }
};

export default function FlavorStampsRewards({ 
  orders = [], 
  theme = {}, 
  customerPhone = '', 
  webAppUrl = '',
  tier = '', 
  initialWhiskClaimed = false,
  initialSovereignClaimed = false,
  initialGrandmasterClaimed = false,
  initialEmperorClaimed = false
}) {
  const orderCount = orders.length;
  const stamp = getStampDetails(orderCount);
  const StampIcon = stamp.icon;
  const streak = getStreakDetails(orders);

  const isBronzeTier = tier?.trim().toLowerCase() === 'bronze';
  const minOrdersForFirstMilestone = 2;

  const [whiskClaimed, setWhiskClaimed] = useState(initialWhiskClaimed);
  const [sovereignClaimed, setSovereignClaimed] = useState(initialSovereignClaimed);
  const [grandmasterClaimed, setGrandmasterClaimed] = useState(initialGrandmasterClaimed);
  const [emperorClaimed, setEmperorClaimed] = useState(initialEmperorClaimed);
  const [isClaiming, setIsClaiming] = useState(null);

  useEffect(() => {
    setWhiskClaimed(initialWhiskClaimed);
    setSovereignClaimed(initialSovereignClaimed);
    setGrandmasterClaimed(initialGrandmasterClaimed);
    setEmperorClaimed(initialEmperorClaimed);
  }, [initialWhiskClaimed, initialSovereignClaimed, initialGrandmasterClaimed, initialEmperorClaimed]);

  const handleClaimReward = async (rewardType) => {
    setIsClaiming(rewardType);
    try {
      if (webAppUrl && customerPhone) {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'claim_reward', 
            phone: customerPhone, 
            rewardType: rewardType 
          })
        });
      }

      if (rewardType === 'whisk') setWhiskClaimed(true);
      if (rewardType === 'sovereign') setSovereignClaimed(true);
      if (rewardType === 'grandmaster') setGrandmasterClaimed(true);
      if (rewardType === 'emperor') setEmperorClaimed(true);
    } catch (err) {
      console.error("Failed to claim reward:", err);
    } finally {
      setIsClaiming(null);
    }
  };

  const brandColor = theme.brand || '#FF5958';
  const textColor = theme.text || '#1A1816';
  const radius = theme.radius || 'clamp(16px, 4vw, 20px)'; // 💡 FLUID RADIUS

  const hasBronzeMilestoneUnlocked = isBronzeTier && orderCount >= minOrdersForFirstMilestone;
  const hasOtherMilestonesUnlocked = orderCount >= 6;
  const showMilestonesSection = hasBronzeMilestoneUnlocked || hasOtherMilestonesUnlocked;

  // Tight, compact, and sleek card styling
  const cardStyle = {
    background: '#FFFDF9',
    border: '1px solid rgba(197, 160, 89, 0.4)',
    borderRadius: radius,
    padding: 'clamp(10px, 3vw, 12px)', // 💡 FLUID PADDING
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
    width: '100%',
    minWidth: 0
  };

  const iconBoxStyle = {
    padding: '5px',
    borderRadius: '8px',
    background: '#FFFFFF',
    border: '1px solid rgba(197, 160, 89, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
    flexShrink: 0
  };

  const badgeStyle = {
    fontSize: 'clamp(8.5px, 2.5vw, 9.5px)', // 💡 FLUID BADGE TYPOGRAPHY
    fontWeight: '800',
    backgroundColor: '#FFFFFF',
    padding: '1px 6px',
    borderRadius: '8px',
    border: '1px solid rgba(197, 160, 89, 0.3)',
    whiteSpace: 'nowrap',
    letterSpacing: '0.3px',
    flexShrink: 0
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Flavor Stamps + Streak Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Flavor Stamps Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '4px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <div style={iconBoxStyle}>
                <StampIcon size={18} color={stamp.color} />
              </div>
              <span style={{ fontSize: 'var(--font-caption)', fontWeight: '800', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Stamps</span>
            </div>
            <span style={{ ...badgeStyle, color: stamp.color }}>
              {stamp.level}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: '900', color: stamp.color, letterSpacing: '-0.3px', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {orderCount} Stamps
            </div>
            <div style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#78716C', fontWeight: '700', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {orderCount >= minOrdersForFirstMilestone ? `🎖️ ${stamp.name}` : `Collect ${minOrdersForFirstMilestone - orderCount} more`}
            </div>
          </div>
        </div>

        {/* Order Streak Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '4px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <div style={iconBoxStyle}>
                <Flame size={16} color={streak.color} />
              </div>
              <span style={{ fontSize: 'var(--font-caption)', fontWeight: '800', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Streak</span>
            </div>
            <span style={{ ...badgeStyle, color: streak.color }}>
              {streak.level}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: '800', color: streak.color, letterSpacing: '-0.3px', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{streak.title}</div>
            <div style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', color: '#78716C', fontWeight: '600', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{streak.subtitle}</div>
          </div>
        </div>
      </div>

      {/* Milestone Unlocks Section */}
      {showMilestonesSection && (
        <div style={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)', 
          border: '1.5px solid rgba(197, 160, 89, 0.45)', 
          borderRadius: radius, 
          padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          boxSizing: 'border-box',
          boxShadow: '0 6px 20px rgba(44, 34, 30, 0.04)',
          width: '100%'
        }}>
          <div style={{ fontSize: 'clamp(9.5px, 2.5vw, 10.5px)', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'left' }}>
            🎁 Milestone Reward Unlocks
          </div>

          {/* First Milestone: Bronze Tier + At least 2 Orders Completed */}
          {hasBronzeMilestoneUnlocked && (
            <div style={{ 
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
              boxSizing: 'border-box',
              width: '100%'
            }}>
              <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 'var(--font-body)', fontWeight: '700', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sugar Spark</div>
                <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Bronze Milestone (2 Orders Completed)</div>
              </div>
              {whiskClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-caption)', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <Check size={13} strokeWidth={3} style={{ flexShrink: 0 }} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('whisk')}
                  disabled={isClaiming === 'whisk'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3.5vw, 14px)', 
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: 'var(--font-caption)', 
                    cursor: 'pointer', 
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  {isClaiming === 'whisk' ? '...' : 'Claim'}
                </button>
              )}
            </div>
          )}

          {/* 6 Stamps: Mini Surprise */}
          {orderCount >= 6 && (
            <div style={{ 
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
              boxSizing: 'border-box',
              width: '100%'
            }}>
              <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 'var(--font-body)', fontWeight: '700', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Caramel Craft</div>
                <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Sovereign Perk (6 Stamps)</div>
              </div>
              {sovereignClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-caption)', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <Check size={13} strokeWidth={3} style={{ flexShrink: 0 }} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('sovereign')}
                  disabled={isClaiming === 'sovereign'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3.5vw, 14px)', 
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: 'var(--font-caption)', 
                    cursor: 'pointer', 
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  {isClaiming === 'sovereign' ? '...' : 'Claim'}
                </button>
              )}
            </div>
          )}

          {/* 9 Stamps: Free Delivery & 10% Off */}
          {orderCount >= 9 && (
            <div style={{ 
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
              boxSizing: 'border-box',
              width: '100%'
            }}>
              <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 'var(--font-body)', fontWeight: '700', color: textColor, lineHeight: '1.25', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>The Alchemist’s Crust</div>
                <div style={{ fontSize: 'clamp(9.5px, 2.5vw, 10.5px)', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Grandmaster Perk (9 Stamps)</div>
              </div>
              {grandmasterClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-caption)', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <Check size={13} strokeWidth={3} style={{ flexShrink: 0 }} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('grandmaster')}
                  disabled={isClaiming === 'grandmaster'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3.5vw, 14px)', 
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: 'var(--font-caption)', 
                    cursor: 'pointer', 
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  {isClaiming === 'grandmaster' ? '...' : 'Claim'}
                </button>
              )}
            </div>
          )}

          {/* 12 Stamps: Gift Voucher */}
          {orderCount >= 12 && (
            <div style={{ 
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
              boxSizing: 'border-box',
              width: '100%'
            }}>
              <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 'var(--font-body)', fontWeight: '700', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>The Golden Recipe</div>
                <div style={{ fontSize: 'var(--font-caption)', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Emperor Perk (12 Stamps)</div>
              </div>
              {emperorClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-caption)', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                  <Check size={13} strokeWidth={3} style={{ flexShrink: 0 }} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('emperor')}
                  disabled={isClaiming === 'emperor'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3.5vw, 14px)', 
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: 'var(--font-caption)', 
                    cursor: 'pointer', 
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  {isClaiming === 'emperor' ? '...' : 'Claim'}
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}