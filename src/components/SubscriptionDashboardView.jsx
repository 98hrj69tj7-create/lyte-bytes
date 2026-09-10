import React, { useState, useEffect } from 'react';
import { ArrowLeft, Club, Sparkles } from 'lucide-react';

export default function SubscriptionDashboardView({ theme, customer, setView, setCart }) {
  const [activePass, setActivePass] = useState(null);
  const [skippedDates, setSkippedDates] = useState([]);
  const [vegSwitchedDates, setVegSwitchedDates] = useState([]);
  const [nvUpgradedDates, setNvUpgradedDates] = useState([]);
  const [upgradeModalDate, setUpgradeModalDate] = useState(null);

  useEffect(() => {
    try {
      const savedPasses = JSON.parse(localStorage.getItem('lyte_active_passes')) || [];
      if (savedPasses.length > 0) {
        setActivePass(savedPasses[savedPasses.length - 1]);
      } else {
        setActivePass({
          name: 'LBEMP (Fortnightly - Lunch - Non-Veg)',
          passId: 'LBEP_68886_24_JUN_01',
          duration: 'fortnightly',
          mealType: 'lunch',
          preference: 'non-veg',
          totalMeals: 24,
          remainingMeals: 18,
          hubLocation: 'Prestige Tech Park Tower B',
          price: 1938
        });
      }
    } catch (e) {
      console.error("Failed to load active pass", e);
    }
  }, []);

  const toggleSkipDate = (dateStr, isSunday, isPast) => {
    if (isSunday || isPast) return; 
    if (skippedDates.includes(dateStr)) {
      setSkippedDates(skippedDates.filter(d => d !== dateStr));
    } else {
      setSkippedDates([...skippedDates, dateStr]);
      setVegSwitchedDates(vegSwitchedDates.filter(d => d !== dateStr));
      setNvUpgradedDates(nvUpgradedDates.filter(d => d !== dateStr));
    }
  };

  const toggleVegSwitch = (dateStr, isSunday, isPast, preference, isPaused) => {
    if (isSunday || isPast || preference !== 'non-veg' || isPaused) return;
    
    if (vegSwitchedDates.includes(dateStr)) {
      setVegSwitchedDates(vegSwitchedDates.filter(d => d !== dateStr));
    } else {
      setVegSwitchedDates([...vegSwitchedDates, dateStr]);
    }
  };

  const handleNvUpgradeConfirm = (dateStr) => {
    const upgradeItem = {
      name: `Upgrading to NV (Date: ${dateStr})`,
      passId: activePass?.passId || 'LBEMP-UPGRADE',
      price: 20,
      qty: 1,
      unit: 'Meal Upgrade',
      isUpgrade: true,
      upgradeDate: dateStr
    };

    setCart(prev => [...prev, upgradeItem]);
    setNvUpgradedDates(prev => [...prev, dateStr]);
    setUpgradeModalDate(null);
    setView('cart');
  };

  const calendarDays = [
    { date: '19', day: 'WED', status: 'completed', isPast: true }, 
    { date: '20', day: 'THU', status: 'missed', isPast: true },    
    { date: '21', day: 'FRI', status: 'completed', isPast: true }, 
    { date: '22', day: 'SAT', status: 'active', isPast: false },   
    { date: '23', day: 'SUN', status: 'off', isPast: false },      
    { date: '24', day: 'MON', status: 'active', isPast: false },   
    { date: '25', day: 'TUE', status: 'active', isPast: false },
    { date: '26', day: 'WED', status: 'active', isPast: false },
    { date: '27', day: 'THU', status: 'active', isPast: false },
    { date: '28', day: 'FRI', status: 'active', isPast: false },
    { date: '29', day: 'SAT', status: 'active', isPast: false },
    { date: '30', day: 'SUN', status: 'off', isPast: false },
    { date: '31', day: 'MON', status: 'active', isPast: false },
    { date: '1', day: 'TUE', status: 'active', isPast: false },
  ];

  const remainingCredits = activePass ? activePass.remainingMeals || 18 : 18;
  const retainedBalance = remainingCredits * 150;
  const customerName = customer?.name || 'James D Savio';
  const passIdNumber = activePass?.passId || 'LBEP_68886_24_JUN_01';
  const hubLoc = activePass?.hubLocation || 'Prestige Tech Park Tower B';
  const planName = activePass?.name || 'LBEMP (Fortnightly - Lunch - Non-Veg)';
  
  const isNonVegPass = activePass?.preference === 'non-veg';
  const isVegPass = activePass?.preference === 'veg';

  return (
    <div style={{ padding: '16px 4px 50px 4px', maxWidth: '480px', margin: '0 auto', width: '100%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Uniform Header */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '10px', padding: '6px 0', gap: '8px' }}>
        <button 
          onClick={() => setView('account')} 
          style={{ 
            background: 'none', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#1A1816', 
            fontSize: '12px', 
            fontWeight: '600', 
            padding: '6px 10px', 
            borderRadius: '12px', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            zIndex: 1,
            flexShrink: 0
          }}
        >
          <ArrowLeft size={15} /> Account
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '20px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          pointerEvents: 'none'
        }}>
          Membership
        </h2>
      </div>

      {/* 💳 Sleek Digital Membership Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1816 0%, #2D2721 100%)',
        borderRadius: '20px',
        padding: '12px',
        color: '#FFFBF2',
        border: '3.5px solid rgba(197, 160, 89, 0.7)',
        marginBottom: '16px',
        boxShadow: '0 10px 28px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.15)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        textAlign: 'left'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, transparent, #FFD700, transparent)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', marginLeft:'8px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Club size={13} color="#C5A059" fill="#C5A059"/>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#C5A059', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Executive Club
            </span>
          </div>
          <div style={{ borderRadius: '8px', fontSize: '10px', fontWeight: '500', color: '#FFD700', marginRight:'8px' }}>
            {passIdNumber}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          padding: '4px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '5px',
          border: '1.5px solid rgba(197, 160, 89, 0.4)'
        }}>
          <div>
            <div style={{ fontSize: '9px', color: '#A8A29E', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Cardholder
            </div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFBF2' }}>
              {customerName}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: '#A8A29E', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Credits / Balance
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#34D399' }}>
              {remainingCredits} left <span style={{ color: '#A8A29E', fontWeight: '600', fontSize: '11px' }}>(₹{retainedBalance.toLocaleString('en-IN')})</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1px' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px', marginLeft:'10px' }}>
            Active Pass Plan
          </div>
          <div style={{ fontFamily: "sans-serif", fontSize: '15px', fontWeight: '700', color: '#FFFBF2', lineHeight: '1.2', marginBottom: '4px', marginLeft:'10px' }}>
            {planName}
          </div>
          <div style={{ fontSize: '11px', color: '#FFD700', fontWeight: '500', marginLeft:'8px' }}>
            📍 Location: {hubLoc}
          </div>
        </div>
      </div>

      {/* 📅 Delivery Schedule Grid */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '16px',
        border: '1.5px solid rgba(197, 160, 89, 0.4)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        textAlign: 'left'
      }}>
        <div style={{ marginBottom: '4px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: '#1A1816', margin: '0 0 0px 0' }}>
            Delivery Schedule
          </h3>
          <p style={{ fontSize: '11.5px', color: '#78716C', margin: 0 }}>
            Tap future dates to pause delivery or toggle meal preference
          </p>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '6px' }}>
          {calendarDays.map((d, index) => {
            const isSunday = d.day === 'SUN';
            const dateKey = `${d.day}_${d.date}`;
            const isPaused = !d.isPast && skippedDates.includes(dateKey);
            const isSwitchedToVeg = !d.isPast && vegSwitchedDates.includes(dateKey);
            const isUpgradedToNv = !d.isPast && nvUpgradedDates.includes(dateKey);
            
            let bg = '#FAF4EB';
            let border = '1px solid rgba(197, 160, 89, 0.4)';
            let dotColor = '#CA8A04'; 
            let textColor = '#1A1816';
            let opacity = 1;

            if (d.isPast) {
              opacity = 0.8;
              if (d.status === 'completed') {
                bg = '#ECFDF5';
                border = '1px solid #059669';
                dotColor = '#059669'; 
              } else if (d.status === 'missed') {
                bg = '#F5F5F4';
                border = '1px solid #000000';
                dotColor = '#000000'; 
                textColor = '#44403C';
              }
            } else if (isSunday) {
              bg = '#F5F5F4';
              border = '1px solid #E7E5E4';
              dotColor = '#D6D3D1';
              opacity = 0.6;
            } else if (isPaused) {
              bg = 'rgba(239, 68, 68, 0.08)';
              border = '1px dashed #EF4444';
              dotColor = '#EF4444'; 
              textColor = '#DC2626';
            } else if (isSwitchedToVeg) {
              bg = 'rgba(13, 148, 136, 0.08)';
              border = '1px solid #0D9488';
              dotColor = '#0D9488';
              textColor = '#0F766E';
            } else if (isUpgradedToNv) {
              bg = 'rgba(217, 119, 6, 0.08)';
              border = '1px solid #D97706';
              dotColor = '#D97706';
              textColor = '#B45309';
            }

            return (
              <div
                key={index}
                onClick={() => toggleSkipDate(dateKey, isSunday, d.isPast)}
                style={{
                  padding: '6px 2px',
                  borderRadius: '12px',
                  background: bg,
                  border: border,
                  textAlign: 'center',
                  cursor: (isSunday || d.isPast) ? 'default' : 'pointer',
                  opacity: opacity,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  transition: 'all 0.2s ease',
                  marginBottom: '2px'
                }}
              >
                <div style={{ fontSize: '9px', fontWeight: '800', color: '#78716C' }}>
                  {d.day}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: textColor }}>
                  {d.date}
                </div>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: dotColor }} />

                {/* Non-Veg Pass Holder: Downward Flex to Veg */}
                {isNonVegPass && !d.isPast && !isSunday && !isPaused && !isUpgradedToNv && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVegSwitch(dateKey, isSunday, d.isPast, activePass?.preference, isPaused);
                    }}
                    style={{
                      fontSize: '7px',
                      fontWeight: '800',
                      padding: '2px 2px',
                      borderRadius: '4px',
                      border: 'none',
                      background: isSwitchedToVeg ? '#0D9488' : 'rgba(13, 148, 136, 0.15)',
                      color: isSwitchedToVeg ? '#FFFFFF' : '#0F766E',
                      cursor: 'pointer',
                      marginTop: '2px',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {isSwitchedToVeg ? 'Veg ✓' : 'To Veg'}
                  </button>
                )}

                {/* Veg Pass Holder: Upward Flex to Non-Veg */}
                {isVegPass && !d.isPast && !isSunday && !isPaused && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUpgradeModalDate(dateKey);
                    }}
                    style={{
                      fontSize: '7px',
                      fontWeight: '800',
                      padding: '2px 2px',
                      borderRadius: '4px',
                      border: 'none',
                      background: isUpgradedToNv ? '#D97706' : 'rgba(217, 119, 6, 0.15)',
                      color: isUpgradedToNv ? '#FFFFFF' : '#B45309',
                      cursor: 'pointer',
                      marginTop: '2px',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {isUpgradedToNv ? 'NV ✓' : '+ NV ₹20'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend with High-Contrast Colors */}
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(197, 160, 89, 0.25)',
          fontSize: '9.5px', 
          color: '#78716C', 
          fontWeight: '700' 
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#CA8A04' }}></span> Active
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }}></span> Paused
          </span>
          {isNonVegPass && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0D9488' }}></span> Switched Veg
            </span>
          )}
          {isVegPass && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D97706' }}></span> NV Upgrade
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }}></span> Completed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#000000' }}></span> Missed
          </span>
        </div>
      </div>

      {/* 🚀 Sleek Option B Upgrade Confirmation Modal */}
      {upgradeModalDate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(20, 15, 12, 0.8)', backdropFilter: 'blur(6px)',
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
            borderRadius: '24px', padding: '24px', maxWidth: '360px', width: '100%',
            border: '1.5px solid rgba(197, 160, 89, 0.5)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box'
          }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: '#1A1816', margin: 0 }}>
              Upgrade Meal to Non-Veg
            </h3>
            <p style={{ fontSize: '12.5px', color: '#78716C', margin: 0, lineHeight: '1.5' }}>
              Upgrading this meal to Non-Veg requires an additional <strong>₹20</strong>. Proceed to secure checkout?
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button 
                onClick={() => setUpgradeModalDate(null)}
                style={{
                  flex: 1, padding: '11px', background: 'rgba(197, 160, 89, 0.1)', color: '#1A1816',
                  border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleNvUpgradeConfirm(upgradeModalDate)}
                style={{
                  flex: 1, padding: '11px', background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', color: '#FFFFFF',
                  border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 89, 88, 0.3)'
                }}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}