import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Search, Package, Loader2 } from 'lucide-react';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQscxfQpCFZxTywvO12f0PAEG9RJ2SmGsTvuZKCYMdd2RNyhu9cPfzJXJpS7NXegFW9y8ajDK32CRs_/pub?gid=0&single=true&output=csv";

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const testLine = parseCSVLine(lines[i]).map(h => h.toLowerCase());
    if (testLine.includes('cust_mobile') || testLine.includes('mobile') || testLine.includes('final_order_code')) {
      headerRowIndex = i;
      break;
    }
  }
  const headers = parseCSVLine(lines[headerRowIndex]).map((h, i) => 
    i === 0 ? h.replace(/^\uFEFF/, '').trim() : h.trim()
  );
  const result = [];
  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentLine = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = currentLine[index]?.trim() || '';
    });
    result.push(obj);
  }
  return result;
}

function parseCSVLine(text) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(item => item.replace(/^"|"$/g, '').trim());
}

function getField(row, possibleKeys) {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== '') return row[key];
    const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') return row[foundKey];
  }
  return '';
}

export default function TrackView({
  setView,
  currentStage,
  theme = {},
  setCart,
  cart,
  orderPlaced
}) {
  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '20px'
  };

  const [searchCode, setSearchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState(false);

  const hasActiveOrder = orderPlaced && cart && cart.length > 0;

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsSearching(true);
    setSearchedOrder(null);
    setSearchError(false);

    try {
      const response = await fetch(CSV_URL);
      const csvText = await response.text();
      const rows = parseCSV(csvText);

      const target = searchCode.trim().toLowerCase();
      const found = rows.find(r => {
        const code = getField(r, ['Final_Order_Code', 'Order_No', 'Order No', 'Invoice']);
        return code && code.toLowerCase() === target;
      });

      if (found) {
        const paymentStatus = getField(found, ['Payment_Status', 'Status', 'Payment']) || 'Paid';
        
        // Read the stage directly from the Google Sheet column (default to 1 if empty)
        const sheetStage = parseInt(getField(found, ['Stage', 'Order_Stage', 'Fulfillment_Stage']), 10);
        const resolvedStage = !isNaN(sheetStage) && sheetStage >= 1 && sheetStage <= 5 ? sheetStage : 1;

        setSearchedOrder({
          id: getField(found, ['Final_Order_Code', 'Order_No', 'Order No', 'Invoice']),
          item: `${getField(found, ['Variety / Item', 'Item', 'Product'])} (${getField(found, ['Qty_vol', 'Pack_Type', 'Size']) || 'Standard'})`,
          date: getField(found, ['Order_Date', 'Date', 'Timestamp']),
          total: getField(found, ['Amount', 'Total', 'Price']),
          status: paymentStatus,
          stage: resolvedStage
        });
      } else {
        setSearchError(true);
      }
    } catch (err) {
      console.error("Order lookup failed:", err);
      setSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  const renderStageTracker = (stageNum, orderDetails = null) => {
    const activeStage = stageNum || 1;
    const isCompleted = activeStage === 5;

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
        <style>{`
          @keyframes premiumGlow {
            0% { box-shadow: 0 0 0 0 rgba(255, 89, 88, 0.4), 0 0 12px rgba(255, 89, 88, 0.2); }
            70% { box-shadow: 0 0 0 10px rgba(255, 89, 88, 0), 0 0 20px rgba(255, 89, 88, 0.35); }
            100% { box-shadow: 0 0 0 0 rgba(255, 89, 88, 0), 0 0 12px rgba(255, 89, 88, 0.2); }
          }
        `}</style>

        {orderDetails && (
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '14px', padding: '12px 14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: activeTheme.text }}>{orderDetails.id}</div>
              <div style={{ fontSize: '12px', color: activeTheme.brand, fontWeight: '700', marginTop: '2px' }}>{orderDetails.item}</div>
              <div style={{ fontSize: '11px', color: '#78716C', fontWeight: '500', marginTop: '2px' }}>Placed on: {orderDetails.date || 'Recent'} • ₹{orderDetails.total}</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
              {orderDetails.status}
            </span>
          </div>
        )}

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4px 0 0 0' }}>
          {!isCompleted && (
            <div style={{ position: 'absolute', width: '72px', height: '72px', borderRadius: '50%', background: activeTheme.brand, opacity: 0.18, animation: 'pulse 2.2s infinite ease-in-out' }} />
          )}
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeTheme.brand, zIndex: '1', fontSize: '28px', boxShadow: '0 4px 12px rgba(255, 89, 88, 0.2)' }}>
            {activeStage === 1 ? '📝' : activeStage === 2 ? '👨‍🍳' : activeStage === 3 ? '📦' : activeStage === 4 ? '🛵' : '🎉'}
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: isCompleted ? '#059669' : activeTheme.brand, margin: '0 0 6px 0', fontSize: '21px', fontWeight: '700', textTransform: 'uppercase' }}>
            {isCompleted ? 'Order Completed' : 'Order Active'}
          </h3>
        </div>

        {/* 5-Stage Emoticon Progression */}
        <div style={{ width: '100%', borderTop: '1px solid rgba(197, 160, 89, 0.35)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', alignSelf: 'flex-start', letterSpacing: '0.8px' }}>
            Live Status Progression
          </span>

          {[
            { step: 1, icon: '📝', title: 'Order Received', desc: 'Your order is received and being processed' },
            { step: 2, icon: '👨‍🍳', title: 'Preparing', desc: 'Your order is being prepared with love' },
            { step: 3, icon: '📦', title: 'Packing', desc: 'We are carefully packing your order' },
            { step: 4, icon: '🛵', title: 'Out for Delivery', desc: 'Your order is on its way to you' },
            { step: 5, icon: '🎉', title: 'Completed', desc: 'Thank you for your order!' }
          ].map((item, index) => {
            const stepCompleted = item.step < activeStage;
            const isCurrent = item.step === activeStage;

            return (
              <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: stepCompleted || isCurrent ? '#FFFFFF' : '#FFFDF9', 
                    border: '1px solid rgba(197, 160, 89, 0.4)', fontSize: '24px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: (!isCompleted && isCurrent) ? 'premiumGlow 2s infinite ease-in-out' : 'none'
                  }}>
                    {item.icon}
                  </div>
                  {index < 4 && (
                    <div style={{
                      width: '2px', height: '30px',
                      background: (isCompleted || item.step < activeStage) ? activeTheme.brand : 'rgba(197, 160, 89, 0.3)',
                      margin: '2px 0'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingTop: '3px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: (!isCompleted && isCurrent) ? activeTheme.brand : (stepCompleted || isCurrent) ? activeTheme.text : '#78716C', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title} 
                    {!isCompleted && isCurrent && (
                      <span style={{ fontSize: '10px', background: '#FFF1EE', color: activeTheme.brand, padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#78716C', marginTop: '2px', fontWeight: '500' }}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (hasActiveOrder) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingBottom: '140px', paddingTop: '6px', boxSizing: 'border-box', width: '100%', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
          <button onClick={() => setView('home')} style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.text, fontSize: '13px', fontWeight: '600', padding: '6px 12px', borderRadius: '12px', zIndex: 1 }}>
            <ArrowLeft size={15}/> Home
          </button>
          <h2 style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '21px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', pointerEvents: 'none' }}>
            Live Order Track
          </h2>
        </div>

        <div style={{ border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: activeTheme.radius, background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', padding: '18px', boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)', display: 'flex', flexDirection: 'column', gap: '18px', boxSizing: 'border-box', width: '100%', alignItems: 'center', textAlign: 'center' }}>
          {renderStageTracker(currentStage || 1, null)}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
            <button type="button" onClick={() => window.open('https://wa.me/9108286886?text=Hi,%20I%20want%20an%20update%20on%20my%20recent%20order!', '_blank')} style={{ border: '1px solid rgba(255, 255, 255, 0.2)', background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', color: '#FFFFFF', padding: '14px', fontSize: '15px', fontWeight: '600', borderRadius: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 89, 88, 0.3)' }}>
              <MessageSquare size={18} /> Get WhatsApp Live Update
            </button>
            <button type="button" onClick={() => { setCart([]); setView('home'); }} style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: activeTheme.text, border: '1px solid rgba(197, 160, 89, 0.3)', padding: '12px', fontSize: '14px', fontWeight: '600', borderRadius: '14px', width: '100%', cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingBottom: '140px', paddingTop: '6px', boxSizing: 'border-box', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button onClick={() => setView('home')} style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: activeTheme.text, fontSize: '13px', fontWeight: '600', padding: '6px 12px', borderRadius: '12px', zIndex: 1 }}>
          <ArrowLeft size={15}/> Home
        </button>
        <h2 style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '21px', color: '#FF5958', margin: 0, fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', pointerEvents: 'none' }}>
          Live Tracking
        </h2>
      </div>

      <div style={{ border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: activeTheme.radius, background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', padding: '20px 18px', boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', width: '100%', alignItems: 'center', textAlign: 'center' }}>
        
        {!searchedOrder ? (
          <>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeTheme.brand, boxShadow: '0 4px 12px rgba(255, 89, 88, 0.1)' }}>
              <Package size={26} color={activeTheme.brand} />
            </div>

            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: activeTheme.brand, margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Track Past / Active Order
              </h3>
              <p style={{ color: '#78716C', fontSize: '13px', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
                Have an order code? Enter it below to check its live status from our kitchen engine.
              </p>
            </div>

            <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
              <input 
                type="text"
                placeholder="Enter Order ID (e.g. LB017-SH95-BAK-FC-0001)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                style={{ flex: 1, padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(197, 160, 89, 0.5)', background: '#FFFFFF', fontSize: '13px', color: activeTheme.text, fontWeight: '600', outline: 'none' }}
              />
              <button type="submit" disabled={isSearching} style={{ background: activeTheme.brand, color: '#FFFFFF', border: 'none', padding: '0 16px', borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(255, 89, 88, 0.25)' }}>
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Track
              </button>
            </form>

            {searchError && (
              <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600' }}>
                No order found matching "{searchCode}". Please check your code.
              </div>
            )}
          </>
        ) : (
          <>
            {renderStageTracker(searchedOrder.stage, searchedOrder)}
            <button type="button" onClick={() => setSearchedOrder(null)} style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: activeTheme.text, border: '1px solid rgba(197, 160, 89, 0.3)', padding: '12px', fontSize: '14px', fontWeight: '600', borderRadius: '14px', width: '100%', cursor: 'pointer', marginTop: '10px' }}>
              Track Another Order
            </button>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
          <button type="button" onClick={() => setView('home')} style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: activeTheme.text, border: '1px solid rgba(197, 160, 89, 0.3)', padding: '12px', fontSize: '14px', fontWeight: '600', borderRadius: '14px', width: '100%', cursor: 'pointer' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}