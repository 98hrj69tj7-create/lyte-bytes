import React, { useState, useEffect } from 'react';
import { Stamp, Crown, Sparkles, Flame, Check, Trophy } from 'lucide-react';

const getStampDetails = (count) => {
  if (count >= 12) return { name: "The Culinary Emperor", icon: Crown, color: "#B45309" };
  if (count >= 9) return { name: "Glaze Grandmaster", icon: Trophy, color: "#7C3AED" };
  if (count >= 6) return { name: "Sponge Sovereign", icon: Crown, color: "#D97706" };
  if (count >= 3) return { name: "Whisk Aristocrat", icon: Sparkles, color: "#4F46E5" };
  return { name: "Crumbs Bandit", icon: Stamp, color: "#64748B" };
};

const getStreakDetails = (orders = []) => {
  if (!orders || orders.length === 0) {
    return { title: "Flat Batter", subtitle: "Standard", color: "#64748B" };
  }
  let latestDate = null;
  orders.forEach(o => {
    const d = new Date(o.date);
    if (!isNaN(d.getTime())) {
      if (!latestDate || d > latestDate) latestDate = d;
    }
  });

  if (!latestDate) {
    return { title: "Flat Batter", subtitle: "Standard", color: "#64748B" };
  }

  const now = new Date();
  const diffDays = Math.floor((now - latestDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 6) {
    return { title: "The Endless Bake", subtitle: "Elite Frequency", color: "#DC2626" };
  } else if (diffDays >= 7 && diffDays <= 13) {
    return { title: "Rapid Rise", subtitle: "Consistent Ordering", color: "#D97706" };
  } else if (diffDays >= 14 && diffDays <= 20) {
    return { title: "Rising Dough", subtitle: "Active Streak", color: "#EA580C" };
  } else {
    return { title: "Flat Batter", subtitle: "Standard", color: "#64748B" };
  }
};

export default function FlavorStampsRewards({ 
  orders = [], 
  theme = {}, 
  customerPhone = '', 
  webAppUrl = '',
  initialWhiskClaimed = false,
  initialSovereignClaimed = false,
  initialGrandmasterClaimed = false,
  initialEmperorClaimed = false
}) {
  const orderCount = orders.length;
  const stamp = getStampDetails(orderCount);
  const StampIcon = stamp.icon;
  const streak = getStreakDetails(orders);

  const [whiskClaimed, setWhiskClaimed] = useState(initialWhiskClaimed);
  const [sovereignClaimed, setSovereignClaimed] = useState(initialSovereignClaimed);
  const [grandmasterClaimed, setGrandmasterClaimed] = useState(initialGrandmasterClaimed);
  const [emperorClaimed, setEmperorClaimed] = useState(initialEmperorClaimed);
  const [isClaiming, setIsClaiming] = useState(null);

  // Sync state when initial props update from CSV data fetch
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
  const radius = theme.radius || '20px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Flavor Stamps + Streak Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ background: '#FFFDF9', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: radius, padding: '16px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ padding: '2px', borderRadius: '8px', display: 'flex' }}><StampIcon size={20} color={stamp.color} /></div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Flavor Stamps</span>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: stamp.color }}>{orderCount} Stamps</div>
            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '600', marginTop: '2px' }}>{orderCount >= 3 ? `🎖️ ${stamp.name}` : `Collect ${3 - orderCount} more`}</div>
          </div>
        </div>

        <div style={{ background: '#FFFDF9', border: '1px solid rgba(197, 160, 89, 0.35)', borderRadius: radius, padding: '16px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ padding: '2px', borderRadius: '8px', display: 'flex' }}><Flame size={20} color={streak.color} /></div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Streak</span>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: streak.color }}>{streak.title}</div>
            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '600', marginTop: '2px' }}>{streak.subtitle}</div>
          </div>
        </div>
      </div>

      {/* Milestone Unlocks Section */}
      {orderCount >= 3 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6ED 100%)', 
          border: '1.5px solid rgba(197, 160, 89, 0.45)', 
          borderRadius: radius, 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          boxSizing: 'border-box',
          boxShadow: '0 6px 20px rgba(44, 34, 30, 0.04)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            🎁 Milestone Reward Unlocks
          </div>

          {/* 3 Stamps: Sample */}
          {orderCount >= 3 && (
            <div style={{ 
              padding: '12px 14px', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: textColor }}>Sugar Spark</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Aristocrat Perk (3 Stamps)</div>
              </div>
              {whiskClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '0px 4px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)', marginTop:'-22px'}}>
                  <Check size={13} strokeWidth={3} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('whisk')}
                  disabled={isClaiming === 'whisk'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: '5px 10px', 
                    marginTop:'-15px',
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: '11px', 
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
              padding: '12px 14px', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: textColor }}>Caramel Craft</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Sovereign Perk (6 Stamps)</div>
              </div>
              {sovereignClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '0px 4px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)', marginTop:'-22px' }}>
                  <Check size={13} strokeWidth={3} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('sovereign')}
                  disabled={isClaiming === 'sovereign'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: '5px 10px', 
                    marginTop:'-15px',
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: '11px', 
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

          {/* 9 Stamps: Free Delivery (up to 10km) & 10% Off */}
          {orderCount >= 9 && (
            <div style={{ 
              padding: '12px 14px', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
            }}>
              <div style={{ textAlign: 'left', maxWidth: '68%' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: textColor, lineHeight: '1.25' }}>The Alchemist’s Crust</div>
                <div style={{ fontSize: '10.5px', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Grandmaster Perk (9 Stamps)</div>
              </div>
              {grandmasterClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '0px 4px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)', marginTop:'-22px' }}>
                  <Check size={13} strokeWidth={3} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('grandmaster')}
                  disabled={isClaiming === 'grandmaster'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: '5px 10px', 
                    marginTop:'-15px',
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: '11px', 
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
              padding: '12px 14px', 
              background: '#FFFDF9', 
              borderRadius: '14px', 
              border: '1px solid rgba(197, 160, 89, 0.3)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: textColor }}>The Golden Recipe</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '500', marginTop: '1px' }}>Emperor Perk (12 Stamps)</div>
              </div>
              {emperorClaimed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '600', color: '#059669', background: '#ECFDF5', padding: '0px 4px', borderRadius: '10px', flexShrink: 0, border: '1px solid rgba(5, 150, 105, 0.2)', marginTop:'-22px' }}>
                  <Check size={13} strokeWidth={3} /> Claimed
                </div>
              ) : (
                <button 
                  onClick={() => handleClaimReward('emperor')}
                  disabled={isClaiming === 'emperor'}
                  style={{ 
                    background: brandColor, 
                    color: '#FFF', 
                    border: 'none', 
                    padding: '5px 10px', 
                    marginTop:'-15px',
                    borderRadius: '10px', 
                    fontWeight: '700', 
                    fontSize: '11px', 
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