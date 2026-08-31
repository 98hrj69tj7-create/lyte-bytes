import React, { useState } from 'react';
import { 
  ArrowLeft, MessageCircle, CheckCircle, Mail, ChevronRight, 
  FileText, Gift, Bot, Send, Heart, MessageSquare 
} from 'lucide-react';
import { GeneralTermsModalContent } from './PolicyContents';
import FestiveHampersModal from './FestiveHampersModal';

const FAQ_DATA = [
  { question: "Are your products preservative-free?", answer: "Yes! Everything at Lyte Bytes is 100% handcrafted with zero preservatives, made strictly to order." },
  { question: "How does Ammi's Achar stay fresh?", answer: "Our pickles use traditional methods, premium cold-pressed oils, and natural sun-curing with zero chemical additives." },
  { question: "Do you offer custom catering packages?", answer: "Yes, we handle bespoke bulk orders and catering. You can tap our WhatsApp link below to inquire!" },
  { question: "How can I track my order?", answer: "You can check your live progress instantly by tapping the 'Track' icon on the bottom navigation bar." }
];

export default function SupportInfoView({
  theme = {},
  setView = () => {}
}) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Festive Hamper Modal State
  const [isHamperModalOpen, setIsHamperModalOpen] = useState(false);

  // Time check helper: Active between 08:00 AM (480 mins) and 10:00 PM (1320 mins)
  const checkIsLive = () => {
    const now = new Date();
    const totalMins = now.getHours() * 60 + now.getMinutes();
    return totalMins >= 540 && totalMins < 1320;
  };
  const isLive = checkIsLive();

  const handleLaunchChat = (textToPass) => {
    const text = textToPass || inputText;
    if (!text.trim()) return;
    setView('chatbot'); 
  };

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || 'clamp(16px, 4vw, 20px)' // 💡 FLUID RADIUS
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const message = "Hi, I would like to get assistance from Lyte Bytes Support.";
    const waUrl = `https://wa.me/9108286886?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflowY: 'auto',
      overflowX: 'hidden', 
      flex: 1, 
      paddingBottom: '140px', 
      paddingTop: '6px',
      boxSizing: 'border-box',
      width: '100%',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <style>{`
        @keyframes prismSweep {
          0% { left: -150%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }
        @keyframes pulseLive {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes pulseOffline {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .support-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
          cursor: pointer;
        }
        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(44, 34, 30, 0.08) !important;
          border-color: rgba(197, 160, 89, 0.8) !important;
        }
      `}</style>

      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0', gap: '8px' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: '1px solid rgba(197, 160, 89, 0.35)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
            fontWeight: '600', 
            padding: '6px 10px', 
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={15} style={{ flexShrink: 0 }}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.8px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingLeft: '75px',
          paddingRight: '75px'
        }}>
          Client Care
        </h2>
      </div>

      {/* Main Wrapper Card */}
      <div style={{ 
        border: '1.5px solid rgba(197, 160, 89, 0.45)', 
        borderRadius: activeTheme.radius,
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)', 
        padding: 'clamp(8px, 2.5vw, 10px)', // 💡 FLUID PADDING
        boxShadow: '0 12px 32px rgba(44, 34, 30, 0.07)',
        display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%', minWidth: 0
      }}>

        {/* OUR WALL OF LOVE BUTTON */}
        <div 
          className="support-card" 
          onClick={() => setView('wall_of_love')}
          style={{ 
            display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
            border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', 
            boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)',
            boxSizing: 'border-box', width: '100%', minWidth: 0, gap: '8px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
            <Heart size={30} color="#C5A059" fill="#C5A059" />
          </div>
          <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, color: activeTheme.text, fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              OUR WALL OF LOVE
            </h3>
            <p style={{ margin: 0, fontSize: 'clamp(9px, 2.5vw, 10px)', fontWeight: '700', color: '#8A6D2B', letterSpacing: '0.80px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Verified Customer Reviews
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px', flexShrink: 0 }}>
            <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          </div>
        </div>

        {/* FESTIVE BUNDLES & HAMPERS CONTAINER */}
        <div 
          className="support-card" 
          onClick={() => setIsHamperModalOpen(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 'clamp(8px, 3vw, 10px) clamp(10px, 3.5vw, 12px)', 
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
            border: '1px solid rgba(197, 160, 89, 0.5)', 
            borderRadius: '16px', 
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 0,
            gap: '8px'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-150%',
            width: '150%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.28), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'prismSweep 4s infinite ease-in-out',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
            <div style={{ 
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0 
            }}>
              <Gift size={30} color="#C5A059" />
            </div>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px', minWidth: 0 }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  ✦ Bespoke Gifting ✦
                </span>
              </div>
              <h3 style={{ margin: '0 0 1px 0', fontFamily: "'Cormorant Garamond', serif", color: '#1A1816', fontSize: 'clamp(15px, 4.5vw, 17px)', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Festive Bundles & Hampers
              </h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: 'clamp(10.5px, 3vw, 11.5px)', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Curated boxes for celebrations
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
            position: 'relative',
            backgroundColor: 'rgba(197, 160, 89, 0.12)',
            zIndex: 2
          }}>
            <ChevronRight size={18} color="#C5A059" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          </div>
        </div>

        {/* INSTANT AI CONCIERGE BANNER WITH GLOWING LIVE / OFFLINE STATUS BADGE */}
        <div style={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)', 
          borderRadius: '16px', 
          border: '1.5px solid rgba(197, 160, 89, 0.5)', 
          padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          boxSizing: 'border-box',
          boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed rgba(197, 160, 89, 0.4)', paddingBottom: '8px', gap: '8px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <Bot size={28} color="#C5A059" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '700', color: activeTheme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Instant AI Concierge</span>
            </div>

            {/* Dynamic Time-Based Status Badge with Glowing Effect */}
            {isLive ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
                color: '#15803d',
                letterSpacing: '0.5px',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #22c55e',
                  animation: 'pulseLive 2s infinite',
                  flexShrink: 0
                }} />
                LIVE
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
                color: '#dc2626',
                letterSpacing: '0.5px',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #ef4444',
                  animation: 'pulseOffline 2s infinite',
                  flexShrink: 0
                }} />
                OFFLINE
              </div>
            )}
          </div>

          <p style={{ marginTop: '-10px', fontSize: 'clamp(11px, 3vw, 12px)', color: '#78716C', lineHeight: '1.4', textAlign: 'left', minWidth: 0 }}>
            Have a question about our menu, ingredients, or custom catering? <br />Tap a topic below or type your own to start chatting with Chef Lyte!
          </p>

          {/* Elite 2x2 Grid Layout for All 4 Questions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '6px', 
            marginTop: '2px',
            boxSizing: 'border-box',
            minWidth: 0
          }}>
            {FAQ_DATA.map((faq, idx) => (
              <button 
                key={idx} 
                type="button" 
                onClick={() => handleLaunchChat(faq.question)} 
                style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid rgba(197, 160, 89, 0.4)', 
                  borderRadius: '8px', 
                  padding: '6px 10px', 
                  fontSize: 'clamp(10px, 2.8vw, 11px)', 
                  fontWeight: '600', 
                  color: '#8A6D2B', 
                  cursor: 'pointer', 
                  textAlign: 'left',
                  lineHeight: '1.3',
                  boxShadow: '0 2px 6px rgba(44, 34, 30, 0.02)',
                  transition: 'all 0.2s ease',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {faq.question}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '4px', minWidth: 0 }}>
            <input 
              type="text"
              placeholder="Ask a question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLaunchChat()}
              style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(197, 160, 89, 0.4)', backgroundColor: '#FFFFFF', fontSize: 'clamp(11px, 3vw, 12px)', outline: 'none', color: activeTheme.text, minWidth: 0, boxSizing: 'border-box' }}
            />
            <button 
              type="button" 
              onClick={() => handleLaunchChat()} 
              style={{ background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', color: '#FFFFFF', border: 'none', borderRadius: '10px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <Send size={20} style={{ flexShrink: 0 }} />
            </button>
          </div>
        </div>

        {/* Leave Review Container */}
        <a href="https://g.page/r/CRodKxCU6unDEBM/review" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', width: '100%', boxSizing: 'border-box' }}>
          <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)', minWidth: 0, gap: '8px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
              <CheckCircle size={30} color="#C5A059" />
            </div>
            <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, color: activeTheme.text, fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Leave a Review</h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: 'clamp(10px, 2.8vw, 11px)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Share your experience with us</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px', flexShrink: 0 }}>
              <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} style={{ flexShrink: 0 }} />
            </div>
          </div>
        </a>

        {/* Support Options Section */}
        <div style={{ paddingTop: '1px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          
          <a href="https://wa.me/9108286886" onClick={handleWhatsAppClick} style={{ textDecoration: 'none', display: 'block', width: '100%', boxSizing: 'border-box' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)', minWidth: 0, gap: '8px', boxSizing: 'border-box' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <MessageCircle size={30} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>WhatsApp</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: 'clamp(10px, 2.8vw, 11px)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Immediate bespoke assistance</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px', flexShrink: 0 }}>
                <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </div>
            </div>
          </a>

          <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none', display: 'block', width: '100%', boxSizing: 'border-box' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)', minWidth: 0, gap: '8px', boxSizing: 'border-box' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <Mail size={30} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Email</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: 'clamp(10px, 2.8vw, 11px)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Detailed queries</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px', flexShrink: 0 }}>
                <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </div>
            </div>
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
            <div 
              className="support-card" 
              onClick={() => setTermsOpen(!termsOpen)}
              style={{ display: 'flex', alignItems: 'center', padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 14px)', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)', cursor: 'pointer', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)', minWidth: 0, gap: '8px', boxSizing: 'border-box' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <FileText size={30} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: 'clamp(16px, 4.5vw, 18px)', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>General Guidelines</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: 'clamp(10px, 2.8vw, 11px)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Terms, shipping & privacy</p>
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px',
                transform: termsOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                flexShrink: 0
              }}>
                <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </div>
            </div>

            {termsOpen && (
              <div style={{ paddingTop: '6px', paddingBottom: '6px', minWidth: 0 }}>
                <GeneralTermsModalContent brandColor="#C5A059" />
              </div>
            )}
          </div>

        </div>

        {/* SOCIAL MEDIA LINKS FOOTER (@lytebytes) */}
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '16px', 
          borderTop: '1px dashed rgba(197, 160, 89, 0.4)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '10px',
          minWidth: 0
        }}>
          <span style={{ fontSize: 'clamp(10px, 2.8vw, 11px)', fontWeight: '700', color: '#78716C', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
            Connect With Us @lytebytes
          </span>
          <div style={{ display: 'flex', gap: '12px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <a 
              href="https://instagram.com/lytebytes" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: activeTheme.text,
                fontSize: 'clamp(11px, 3vw, 12px)',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E4405F" style={{ flexShrink: 0 }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Instagram</span>
            </a>
            <a 
              href="https://facebook.com/lytebytes" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: activeTheme.text,
                fontSize: 'clamp(11px, 3vw, 12px)',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" style={{ flexShrink: 0 }}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Facebook</span>
            </a>
          </div>
        </div>

      </div>

      {/* Renders the separate festive hampers modal cleanly */}
      <FestiveHampersModal 
        isOpen={isHamperModalOpen} 
        onClose={() => setIsHamperModalOpen(false)} 
      />
    </div>
  );
}