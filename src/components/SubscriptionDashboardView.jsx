import React, { useState, useEffect } from 'react';
import { ArrowLeft, Club, Sparkles } from 'lucide-react';

export default function SubscriptionDashboardView({ theme, customer, setView }) {
  const [activePass, setActivePass] = useState(null);
  const [skippedDates, setSkippedDates] = useState([]);

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
    if (isSunday || isPast) return; // Cannot modify past history or Sundays
    if (skippedDates.includes(dateStr)) {
      setSkippedDates(skippedDates.filter(d => d !== dateStr));
    } else {
      setSkippedDates([...skippedDates, dateStr]);
    }
  };

  // Simulating calendar days with past and future states
  const calendarDays = [
    { date: '19', day: 'WED', status: 'completed', isPast: true }, // Past: Green (Delivered)
    { date: '20', day: 'THU', status: 'missed', isPast: true },    // Past: Black (Missed / Failed to inform)
    { date: '21', day: 'FRI', status: 'completed', isPast: true }, // Past: Green (Delivered)
    { date: '22', day: 'SAT', status: 'active', isPast: false },   // Future: Yellow (Active/Scheduled)
    { date: '23', day: 'SUN', status: 'off', isPast: false },      // Sunday Off
    { date: '24', day: 'MON', status: 'active', isPast: false },   // Future: Yellow (Active/Scheduled)
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

  return (
    <div style={{ padding: '16px 4px 50px 4px', maxWidth: '480px', margin: '0 auto', width: '100%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Uniform Header */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0', gap: '8px' }}>
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
        border: '1.5px solid rgba(197, 160, 89, 0.7)',
        marginBottom: '20px',
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', marginLeft:'10px'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Club size={13} color="#C5A059" />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#C5A059', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Executive Club
            </span>
          </div>
          <div style={{ borderRadius: '8px', fontSize: '10px', fontWeight: '500', color: '#FFD700', marginRight:'10px' }}>
            {passIdNumber}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          padding: '4px 10px',
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
              {remainingCredits} left <span style={{ color: '#A8A29E', fontWeight: '500', fontSize: '10.5px' }}>(₹{retainedBalance.toLocaleString('en-IN')})</span>
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
          <div style={{ fontSize: '11px', color: '#FFD700', fontWeight: '500', marginLeft:'10px' }}>
            📍 Location: {hubLoc}
          </div>
        </div>
      </div>

      {/* 📅 Delivery Schedule Grid */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '20px',
        border: '1.5px solid rgba(197, 160, 89, 0.4)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        textAlign: 'left'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: '#1A1816', margin: '0 0 0px 0' }}>
            Delivery Schedule
          </h3>
          <p style={{ fontSize: '11.5px', color: '#78716C', margin: 0 }}>
            Tap future dates to pause delivery (No-loss credits)
          </p>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '5px' }}>
          {calendarDays.map((d, index) => {
            const isSunday = d.day === 'SUN';
            const dateKey = `${d.day}_${d.date}`;
            const isPaused = !d.isPast && skippedDates.includes(dateKey);
            
            let bg = '#FAF4EB';
            let border = '1px solid rgba(197, 160, 89, 0.4)';
            let dotColor = '#CA8A04'; // Active -> Yellow
            let textColor = '#1A1816';
            let opacity = 1;

            if (d.isPast) {
              opacity = 0.8;
              if (d.status === 'completed') {
                bg = '#ECFDF5';
                border = '1px solid #059669';
                dotColor = '#059669'; // Completed -> Green
              } else if (d.status === 'missed') {
                bg = '#F5F5F4';
                border = '1px solid #000000';
                dotColor = '#000000'; // Skipped/Missed late -> Black
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
              dotColor = '#EF4444'; // Paused -> Red
              textColor = '#DC2626';
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
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  marginBottom: '2px'
                }}
              >
                <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#78716C' }}>
                  {d.day}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: textColor }}>
                  {d.date}
                </div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor }} />
              </div>
            );
          })}
        </div>

        {/* Legend in a single responsive horizontal line */}
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '4px', 
          fontSize: '10px', 
          color: '#78716C', 
          fontWeight: '700' 
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CA8A04' }}></span> Active
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span> Paused
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span> Completed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000000' }}></span> Missed
          </span>
        </div>
      </div>

    </div>
  );
}