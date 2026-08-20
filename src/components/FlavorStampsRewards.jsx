import React, { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';

const getStampDetails = (count) => {
  if (count >= 12) return { name: "Culinary Emperor", color: "#B45309", level: "Level 5" };
  if (count >= 9) return { name: "Glaze Grandmaster", color: "#7C3AED", level: "Level 4" };
  if (count >= 6) return { name: "Sponge Sovereign", color: "#D97706", level: "Level 3" };
  if (count >= 3) return { name: "Whisk Aristocrat", color: "#8A6D2B", level: "Level 2" };
  return { name: "Crumbs Bandit", color: "#64748B", level: "Level 1" };
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
  const streak = getStreakDetails(orders);

  const isBronzeTier = tier?.trim().toLowerCase() === 'bronze';
  const minOrdersForFirstMilestone = 2;

  const [whiskClaimed, setWhiskClaimed] = useState(initialWhiskClaimed);
  const [sovereignClaimed, setSovereignClaimed] = useState(initialSovereignClaimed);
  const [grandmasterClaimed, setGrandmasterClaimed] = useState(initialGrandmasterClaimed);
  const [emperorClaimed, setEmperorClaimed] = useState(initialEmperorClaimed);
  const [hasClaimedThisSession, setHasClaimedThisSession] = useState(false);
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
      
      setHasClaimedThisSession(true);
    } catch (err) {
      console.error("Failed to claim reward:", err);
    } finally {
      setIsClaiming(null);
    }
  };

  const brandColor = theme.brand || '#FF5958';
  const textColor = theme.text || '#1A1816';
  const radius = theme.radius || 'clamp(16px, 4vw, 20px)';

  const hasBronzeMilestoneUnlocked = isBronzeTier && orderCount >= minOrdersForFirstMilestone;
  const showMilestonesSection = hasBronzeMilestoneUnlocked || orderCount >= 6;

  // Strict sequential order check: Whisk -> Sovereign -> Grandmaster -> Emperor
  let activeReward = null;
  if (hasBronzeMilestoneUnlocked && !whiskClaimed) {
    activeReward = { type: 'whisk', title: 'Sugar Spark', subtitle: 'Bronze Milestone (2 Orders Completed)' };
  } else if (orderCount >= 6 && !sovereignClaimed) {
    activeReward = { type: 'sovereign', title: 'Caramel Craft', subtitle: 'Sovereign Perk (6 Stamps)' };
  } else if (orderCount >= 9 && !grandmasterClaimed) {
    activeReward = { type: 'grandmaster', title: 'The Alchemist’s Crust', subtitle: 'Grandmaster Perk (9 Stamps)' };
  } else if (orderCount >= 12 && !emperorClaimed) {
    activeReward = { type: 'emperor', title: 'The Golden Recipe', subtitle: 'Emperor Perk (12 Stamps)' };
  }

  // Sleek boutique card styling
  const cardStyle = {
    background: '#FFFDF9',
    border: '1px solid rgba(197, 160, 89, 0.4)',
    borderRadius: radius,
    padding: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    boxShadow: '0 4px 14px rgba(44, 34, 30, 0.04)',
    width: '100%',
    height: '100%',
    minWidth: 0,
    textAlign: 'left',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  };

  const badgeStyle = {
    fontSize: '10px',
    fontWeight: '800',
    backgroundColor: '#FFFFFF',
    padding: '1px 5px',
    borderRadius: '8px',
    border: '1px solid rgba(197, 160, 89, 0.3)',
    whiteSpace: 'nowrap',
    letterSpacing: '0.3px',
    display: 'inline-block'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', boxSizing: 'border-box', alignItems: 'stretch' }}>
        
        {/* Card 1: FLAVOUR STAMP */}
        <div style={cardStyle}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.8px'}}>
              Flavour Stamp
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ ...badgeStyle, color: stamp.color }}>
                {stamp.level}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: stamp.color, lineHeight: '1.2' }}>
              {orderCount} Stamps
            </div>
            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {orderCount >= minOrdersForFirstMilestone ? `🎖️ ${stamp.name}` : `Collect ${minOrdersForFirstMilestone - orderCount} more`}
            </div>
          </div>
        </div>

        {/* Card 2: ORDER STREAK */}
        <div style={cardStyle}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.8px'}}>
              Order Streak
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ ...badgeStyle, color: streak.color }}>
                {streak.level}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: streak.color, lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {streak.title}
            </div>
            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '600', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {streak.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Milestone Reward Vault */}
      {showMilestonesSection && (
        <div style={{ 
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)', 
          border: '1.5px solid rgba(197, 160, 89, 0.45)', 
          borderRadius: radius, 
          padding: '6px 14px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          boxSizing: 'border-box',
          boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)',
          width: '100%',
          textAlign: 'left'
        }}>
          {/* Header Row (Single Clean Line) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '2px', padding: '0px 0px', gap: '2px', minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '0.9px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              milestone Reward Unlock
            </div>
          </div>

          {activeReward ? (
            <div style={{ 
              padding: '6px 10px', 
              background: '#FFFFFF', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.4)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 10px rgba(44, 34, 30, 0.03)',
              boxSizing: 'border-box',
              width: '100%',
              minWidth: 0
            }}>
              <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '800', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeReward.title}
                </div>
                <div style={{ fontSize: '10.5px', color: '#8A6D2B', fontWeight: '700', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeReward.subtitle}
                </div>
              </div>
              
              {hasClaimedThisSession ? (
                <button 
                  disabled={true}
                  style={{ 
                    background: '#E5E7EB', 
                    color: '#9CA3AF', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: '11px', 
                    cursor: 'not-allowed',
                    marginTop: '14px',
                    flexShrink: '0',
                    boxShadow: 'none'
                  }}
                >
                  Claim
                </button>
              ) : (
                <button 
                  onClick={() => handleClaimReward(activeReward.type)}
                  disabled={isClaiming === activeReward.type}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: '11px', 
                    cursor: 'pointer',
                    marginTop: '14px',
                    flexShrink: '0',
                    boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  {isClaiming === activeReward.type ? 'Claiming...' : 'Claim'}
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              padding: '6px 10px', 
              background: '#ECFDF5', 
              borderRadius: '14px', 
              border: '1px solid rgba(5, 150, 105, 0.25)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2px',
              color: '#065F46',
              fontSize: '11.5px',
              fontWeight: '700'
            }}>
              <Check size={15} color="#059669" strokeWidth={3} style={{ flexShrink: 0 }} />
              Current milestone reward successfully claimed! Continue ordering to unlock subsequent elite tiers.
            </div>
          )}

          {/* Soft Disclaimer */}
          <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '400', fontStyle: 'italic', lineHeight: '1.2' }}>
            * Note: Rewards are unlocked and claimed progressively as you attain each culinary milestone. Only one active reward can be claimed per transaction.
          </div>
        </div>
      )}
    </div>
  );
}