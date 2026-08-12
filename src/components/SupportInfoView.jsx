import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, MessageCircle, CheckCircle, Mail, Star, ChevronRight, 
  FileText, Gift, Camera 
} from 'lucide-react';
import { GeneralTermsModalContent } from './PolicyContents';

function TestimonialCard({ item, onClick, renderWatermarkSvg, renderSourceLogo, activeTheme, isGroup2 = false }) {
  const [hasMoreLines, setHasMoreLines] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkLines = () => {
      if (textRef.current) {
        const el = textRef.current;
        const computedLineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || (isGroup2 ? 14.85 : 16.2);
        
        el.style.display = 'block';
        el.style.webkitLineClamp = 'unset';
        const fullHeight = el.scrollHeight;
        
        el.style.display = '-webkit-box';
        el.style.webkitLineClamp = '3';
        
        const lineCount = fullHeight / computedLineHeight;
        setHasMoreLines(lineCount > 3);
      }
    };

    checkLines();
    window.addEventListener('resize', checkLines);
    return () => window.removeEventListener('resize', checkLines);
  }, [item.text, isGroup2]);

  return (
    <div 
      onClick={onClick}
      className="support-card"
      style={{
        flex: '0 0 260px',
        width: '260px',
        height: '124px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(197, 160, 89, 0.4)', 
        borderRadius: '14px', 
        padding: '10px 12px',
        boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        textAlign: 'left',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-15deg)',
        width: '100px',
        height: '100px',
        opacity: 0.035,
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderWatermarkSvg(item.source)}
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p 
            ref={textRef}
            className="testimonial-text-clamp" 
            style={{ 
              margin: 0, 
              fontSize: isGroup2 ? '11.5px' : '12px', 
              color: activeTheme.text, 
              lineHeight: '1.4', 
              fontStyle: isGroup2 ? 'italic' : 'normal',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: '500'
            }}
          >
            "{item.text}"
          </p>
          {hasMoreLines && (
            <span style={{ fontSize: isGroup2 ? '10px' : '10.5px', color: '#FF5958', fontWeight: '700', display: 'inline-block', marginTop: '1px', letterSpacing: '0.2px' }}>
              Read more &rarr;
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', borderTop: '1px solid rgba(197, 160, 89, 0.25)', paddingTop: '6px', marginTop: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: isGroup2 ? '700' : '600', color: activeTheme.text }}>
              {isGroup2 ? `— ${item.author}` : item.author}
            </span>
            {/* Camera badge if image is attached */}
            {item.imageUrl && (
              <span style={{
                fontSize: '9px',
                color: '#C5A059',
                backgroundColor: 'rgba(197, 160, 89, 0.12)',
                padding: '1px 6px',
                borderRadius: '6px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Camera size={10} color="#C5A059" /> Photo
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {renderSourceLogo(item.source)}
            {isGroup2 && (
              <span style={{ fontSize: '9px', color: '#78716C', textTransform: 'capitalize', fontWeight: '600' }}>
                {item.source}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupportInfoView({
  theme = {},
  setView = () => {}
}) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      source: 'facebook',
      text: 'This customised wedding cake made our day extra special because not just the cake ruled, but the taste was beyond comparison!',
      author: 'Deborah Sarkar',
      imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      source: 'google',
      text: 'The best pickles and homemade treats! Authentic taste and amazing packaging.',
      author: 'Priya S.'
    },
    {
      id: 3,
      source: 'instagram',
      text: 'Loved the Jam and pickles! Super quick delivery and top-notch quality.',
      author: 'Lizy Priya',
      imageUrl: 'https://images.unsplash.com/photo-1589135113942-8c10fae13460?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 4,
      source: 'whatsapp',
      text: 'Received the order safely today. The tomato pickle reminds me of home!',
      author: 'Angelina.'
    },
    {
      id: 5,
      source: 'whatsapp',
      text: 'The gesture boxes and custom sweets arrived perfectly on time. Everyone loved them!',
      author: 'Karthik R.'
    }
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxdXpaz1SsK_mPTIfYAWK_yXQnHNiAUDtQS8g6ZrgqgP0bR6cPbr-bnuS2whC-lG8T_/exec';
        if (SHEET_API_URL.includes('YOUR_GOOGLE_')) return;
        
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const normalizedReviews = data
            .map(item => ({
              id: item.ID || item.id || Math.random(),
              text: item.Text || item.text || '',
              author: item.Author || item.author || 'Customer',
              source: (item.Source || item.source || 'google').toLowerCase(),
              imageUrl: item.Image || item.image || item.Photo || item.photo || item.imageUrl || item['Image URL'] || null
            }))
            .filter(item => item.text && item.text.trim().length > 0);
          
          if (normalizedReviews.length > 0) {
            setTestimonials(normalizedReviews);
          }
        }
      } catch (error) {
        console.error('Failed to fetch live reviews, using fallback data:', error);
      }
    };

    fetchReviews();
  }, []);

  const activeTheme = {
    brand: theme?.brand || '#FF5958',
    text: theme?.text || '#1A1816',
    border: theme?.border || '1px solid rgba(197, 160, 89, 0.4)',
    bg: theme?.bg || '#FFFDF9',
    radius: theme?.radius || '20px'
  };

  const renderSourceLogo = (source) => {
    switch (source?.toLowerCase()) {
      case 'google':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.32 7.23 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.5-.38-2.25s.13-1.53.38-2.25V6.6H1.19A11.93 11.93 0 000 12c0 1.92.45 3.73 1.19 5.35l4.09-3.1z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#E4405F">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderWatermarkSvg = (source) => {
    switch (source?.toLowerCase()) {
      case 'google':
        return (
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.32 7.23 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.5-.38-2.25s.13-1.53.38-2.25V6.6H1.19A11.93 11.93 0 000 12c0 1.92.45 3.73 1.19 5.35l4.09-3.1z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path fill="#E4405F" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path fill="#25D366" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.32 7.23 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.5-.38-2.25s.13-1.53.38-2.25V6.6H1.19A11.93 11.93 0 000 12c0 1.92.45 3.73 1.19 5.35l4.09-3.1z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
          </svg>
        );
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Lyte Bytes',
      'ORG:Lyte Bytes - Gourmet Delights',
      'TEL;TYPE=WORK,VOICE:+919108286886',
      'NOTE:Handcrafted Goodness & Gourmet Delights Since 1995',
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Lyte_Bytes_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const message = "Hi, I would like to get assistance from Lyte Bytes Support.";
    const waUrl = `https://wa.me/9108286886?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleWhatsAppGiftInquiry = (e) => {
    e.preventDefault();
    const message = "Hi, I would like to inquire about custom gift hampers and festival bundles.";
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
        @keyframes scrollTicker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes prismSweep {
          0% { left: -150%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }
        .testimonial-track {
          display: flex;
          gap: 0;
          width: max-content;
          flex-shrink: 0;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: scrollTicker 42s linear infinite;
        }
        .testimonial-group {
          display: flex;
          gap: 16px;
          flex-shrink: 0;
        }
        .testimonial-track:hover {
          animation-play-state: paused;
        }
        .support-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .support-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(44, 34, 30, 0.08) !important;
          border-color: rgba(197, 160, 89, 0.6) !important;
        }
        .testimonial-text-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ticker-mask-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .ticker-mask-container::before,
        .ticker-mask-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 45px;
          z-index: 2;
          pointer-events: none;
        }
        .ticker-mask-container::before {
          left: 0;
          background: linear-gradient(to right, #FFFDF9, rgba(255, 253, 249, 0));
        }
        .ticker-mask-container::after {
          right: 0;
          background: linear-gradient(to left, #FFFDF9, rgba(255, 253, 249, 0));
        }
      `}</style>

      {/* ================= UNIFORM HEADER SECTION ================= */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            border: '1px solid rgba(197, 160, 89, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: '13px', 
            fontWeight: '600', 
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={15}/> Menu
        </button>
        <h2 style={{ 
          position: 'absolute', 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '21px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.5px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Client Care
        </h2>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        border: '1px solid rgba(197, 160, 89, 0.4)', 
        borderRadius: activeTheme.radius,
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
        padding: '18px', 
        boxShadow: '0 8px 24px rgba(44, 34, 30, 0.06)',
        display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box', width: '100%'
      }}>

        {/* 🌟 Festive Gift Hampers / Bulk Order Callout Card */}
        <div 
          className="support-card" 
          onClick={handleWhatsAppGiftInquiry}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '14px 16px', 
            background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
            border: '1px dashed #C5A059', 
            borderRadius: '16px', 
            boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-150%',
            width: '150%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.2), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'prismSweep 4s infinite ease-in-out',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
            <div style={{ 
              backgroundColor: 'rgba(197, 160, 89, 0.15)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0 
            }}>
              <Gift size={20} color="#C5A059" />
            </div>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  ✦ Bespoke Gifting
                </span>
              </div>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '17px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Festive Bundles & Hampers
              </h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Curated gourmet boxes for celebrations
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
            marginLeft: '10px',
            position: 'relative',
            zIndex: 2
          }}>
            <ChevronRight size={18} color="#C5A059" strokeWidth={2.5} />
          </div>
        </div>

        {/* 1. Give Feedback Container */}
        <a href="https://g.page/r/CRodKxCU6unDEBM/review" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
          <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '14px', boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
              <CheckCircle size={22} color="#C5A059" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '16px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>Leave a Review</h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>Share your experience</p>
            </div>
            <ChevronRight size={16} color="#78716C" />
          </div>
        </a>

        {/* 2. Wall of Love Section */}
        <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.35)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '1.2px', textAlign: 'left' }}>
              The Wall of Love
            </span>
            <span style={{ fontSize: '11.5px', color: '#8A6D2B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
              <Star size={12} fill="#C5A059" color="#C5A059" /> Verified Curation
            </span>
          </div>

          <div className="ticker-mask-container">
            <div style={{ width: '100%', overflow: 'hidden', position: 'relative', padding: '6px 0' }}>
              <div className="testimonial-track" key={testimonials.length}>
                <div className="testimonial-group">
                  {testimonials.map((item, index) => (
                    <TestimonialCard 
                      key={`g1-${index}`}
                      item={item}
                      onClick={() => setSelectedReview(item)}
                      renderWatermarkSvg={renderWatermarkSvg}
                      renderSourceLogo={renderSourceLogo}
                      activeTheme={activeTheme}
                      isGroup2={false}
                    />
                  ))}
                </div>

                <div className="testimonial-group">
                  {testimonials.map((item, index) => (
                    <TestimonialCard 
                      key={`g2-${index}`}
                      item={item}
                      onClick={() => setSelectedReview(item)}
                      renderWatermarkSvg={renderWatermarkSvg}
                      renderSourceLogo={renderSourceLogo}
                      activeTheme={activeTheme}
                      isGroup2={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Support & Terms Options Section */}
        <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.35)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <a href="https://wa.me/9108286886" onClick={handleWhatsAppClick} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '14px', boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.3)', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <MessageCircle size={22} color="#25D366" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '16px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>WhatsApp</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>Immediate bespoke assistance</p>
              </div>
              <ChevronRight size={16} color="#78716C" />
            </div>
          </a>

          <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '14px', boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <Mail size={22} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '16px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>Email</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>Detailed queries & bulk orders</p>
              </div>
              <ChevronRight size={16} color="#78716C" />
            </div>
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              className="support-card" 
              onClick={() => setTermsOpen(!termsOpen)}
              style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', backgroundColor: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '14px', boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)', cursor: 'pointer' }}
            >
              <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '12px', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <FileText size={22} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '16px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>General Guidelines</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '11.5px', fontWeight: '500' }}>Terms, shipping & privacy</p>
              </div>
              <ChevronRight 
                size={16} 
                color="#78716C" 
                style={{ 
                  transform: termsOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} 
              />
            </div>

            {termsOpen && (
              <div style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <GeneralTermsModalContent brandColor="#C5A059" />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ================= EXPANDED REVIEW MODAL (WITH PHOTO) ================= */}
      {selectedReview && (
        <div 
          onClick={() => setSelectedReview(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(20, 15, 12, 0.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '16px', boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)', 
              borderRadius: '24px', 
              padding: '24px',
              maxWidth: '380px', 
              width: '100%', 
              boxSizing: 'border-box',
              position: 'relative', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              textAlign: 'left', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              maxHeight: '85vh', 
              overflowY: 'auto',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-15deg)',
              width: '180px',
              height: '180px',
              opacity: 0.035,
              pointerEvents: 'none',
              zIndex: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {renderWatermarkSvg(selectedReview.source)}
            </div>

            <div style={{ position: 'relative', zIndex: '1', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={12} fill="#C5A059" color="#C5A059" />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Verified {selectedReview.source} Review
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedReview(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Display Image ONLY in expanded mode if present */}
              {selectedReview.imageUrl && (
                <div style={{
                  width: '100%',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  backgroundColor: '#000'
                }}>
                  <img 
                    src={selectedReview.imageUrl} 
                    alt={`Review by ${selectedReview.author}`} 
                    style={{
                      width: '100%',
                      maxHeight: '230px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              <p style={{ margin: 0, fontSize: '13.5px', color: activeTheme.text, lineHeight: '1.6', fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
                "{selectedReview.text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(197, 160, 89, 0.3)' }}>
                <span style={{ fontWeight: '700', color: activeTheme.text, fontSize: '15px', fontFamily: "'Cormorant Garamond', serif" }}>{selectedReview.author}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {renderSourceLogo(selectedReview.source)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}