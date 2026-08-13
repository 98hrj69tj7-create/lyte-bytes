import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, MessageCircle, CheckCircle, Mail, Star, ChevronRight, 
  FileText, Gift, Camera, Heart, ChevronLeft 
} from 'lucide-react';
import { GeneralTermsModalContent } from './PolicyContents';

function TestimonialCard({ item, onClick, renderWatermarkSvg, renderSourceLogo, activeTheme, style = {} }) {
  const [hasMoreLines, setHasMoreLines] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkLines = () => {
      if (textRef.current) {
        const el = textRef.current;
        const computedLineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || 16.8;
        
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
  }, [item.text]);

  return (
    <div 
      onClick={onClick}
      className="support-card"
      style={{
        width: '100%',
        height: '132px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6EE 100%)',
        border: '1px solid rgba(197, 160, 89, 0.45)',
        borderRadius: '16px',
        padding: '10px 16px',
        boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        textAlign: 'left',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...style
      }}
    >
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '12px',
        width: '32px',
        height: '32px',
        opacity: 0.15,
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
              fontSize: '12px',
              color: activeTheme.text, 
              lineHeight: '1.45', 
              fontFamily: "'Plus Jakarta Sans', sans-serif", 
              fontWeight: '400'
            }}
          >
            "{item.text}"
          </p>
          {hasMoreLines && (
            <span style={{ fontSize: '10.5px', color: '#FF5958', fontWeight: '500', display: 'inline-block', marginTop: '2px', letterSpacing: '0.2px' }}>
              Read more...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', paddingTop: '8px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: activeTheme.text, fontFamily: "sans-serif", fontSize: '12px' }}>
              {item.author}
            </span>
            {item.imageUrl && (
              <span style={{
                fontSize: '10px',
                color: '#8A6D2B',
                backgroundColor: 'rgba(197, 160, 89, 0.15)',
                padding: '2px 6px',
                borderRadius: '6px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                border: '1px solid rgba(197, 160, 89, 0.3)'
              }}>
                <Camera size={10} color="#8A6D2B" /> Photo
              </span>
            )}
          </div>
          <span style={{ fontSize: '10px', color: '#78716C', textTransform: 'capitalize', fontWeight: '600' }}>
            {item.source}
          </span>
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stackAnim, setStackAnim] = useState(false);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const INITIAL_FALLBACK_REVIEWS = [
    { id: 1, source: 'google', text: 'The best pickles and homemade treats! Authentic taste and amazing packaging.', author: 'Priya S.' },
    { id: 2, source: 'facebook', text: 'This customised wedding cake made our day extra special because the taste was beyond comparison!', author: 'Deborah Sarkar' },
    { id: 3, source: 'instagram', text: 'Loved the Jam and pickles! Super quick delivery and top-notch quality.', author: 'Lizy Priya' },
    { id: 4, source: 'whatsapp', text: 'Received the order safely today. The tomato pickle reminds me of home!', author: 'Angelina.' }
  ];

  // Stale-While-Revalidate: Instant initialization from localStorage cache (0ms lag)
  const [testimonials, setTestimonials] = useState(() => {
    try {
      const cached = localStorage.getItem('lytebytes_cached_reviews');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading cache', e);
    }
    return INITIAL_FALLBACK_REVIEWS;
  });

  // Stale-While-Revalidate: Background sync without UI jank or spinners
  useEffect(() => {
    const fetchFreshReviews = async () => {
      try {
        const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbxdXpaz1SsK_mPTIfYAWK_yXQnHNiAUDtQS8g6ZrgqgP0bR6cPbr-bnuS2whC-lG8T_/exec';
        if (SHEET_API_URL.includes('YOUR_GOOGLE_')) return;
        
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const normalizedReviews = data
            .map(item => ({
              id: item.id || item.ID || Math.random(),
              text: item.text || item.Text || '',
              author: item.author || item.Author || 'Customer',
              source: (item.source || item.Source || 'google').toLowerCase(),
              imageUrl: item.image || item.Image || item.Photo || item.photo || item.imageUrl || item['Image URL'] || null
            }))
            .filter(item => item.text && item.text.trim().length > 0);
          
          if (normalizedReviews.length > 0) {
            const freshString = JSON.stringify(normalizedReviews);
            const cachedString = localStorage.getItem('lytebytes_cached_reviews');
            
            if (freshString !== cachedString) {
              const shuffled = [...normalizedReviews];
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
              }
              setTestimonials(shuffled);
              localStorage.setItem('lytebytes_cached_reviews', freshString);
            }
          }
        }
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    };

    fetchFreshReviews();
  }, []);

  const handleNextCard = () => {
    if (stackAnim) return;
    setStackAnim(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setStackAnim(false);
    }, 280);
  };

  const handlePrevCard = () => {
    if (stackAnim) return;
    setStackAnim(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setStackAnim(false);
    }, 280);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 50) {
      handleNextCard();
    } else if (swipeDistance < -50) {
      handlePrevCard();
    }
  };

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
          <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path fill="#25D366" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
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

  const currentReview = testimonials[currentIndex] || testimonials[0];

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
        @keyframes slideOutCard {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(35px) rotate(3deg); opacity: 0; }
        }
        .support-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
          cursor: pointer;
        }
        .support-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(44, 34, 30, 0.1) !important;
          border-color: rgba(197, 160, 89, 0.8) !important;
        }
        .testimonial-text-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
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
            fontSize: '13px', 
            fontWeight: '600', 
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
          fontSize: '22px', 
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.8px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Client Care
        </h2>
      </div>

      {/* Main Wrapper Card */}
      <div style={{ 
        border: '1.5px solid rgba(197, 160, 89, 0.45)', 
        borderRadius: activeTheme.radius,
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)', 
        padding: '10px',
        boxShadow: '0 12px 32px rgba(44, 34, 30, 0.07)',
        display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%'
      }}>

        {/* ==========================================================
           OPTION 3: The Boutique Postcard Stack (Stacked Flash Cards)
           ========================================================== */}
        <div style={{ paddingBottom: '2px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#78716C', textTransform: 'uppercase', letterSpacing: '1.2px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Wall of Love
            </span>
            <span style={{ fontSize: '11px', color: '#8A6D2B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', padding: '0px 6px', borderRadius: '10px' }}>
              <Star size={11} fill="#C5A059" color="#C5A059" /> Verified Curation
            </span>
          </div>

          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '156px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}
          >
            {/* 3rd Layer Background Peek */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '12px',
              right: '12px',
              height: '132px',
              background: 'linear-gradient(135deg, #F3EAD9 0%, #EADDC7 100%)',
              border: '1px solid rgba(197, 160, 89, 0.2)',
              borderRadius: '16px',
              transform: 'scale(0.92)',
              zIndex: 0,
              boxShadow: '0 2px 6px rgba(44, 34, 30, 0.02)',
              pointerEvents: 'none'
            }} />

            {/* 2nd Layer Background Peek */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '6px',
              right: '6px',
              height: '132px',
              background: 'linear-gradient(135deg, #FAF4EB 0%, #F3EAD9 100%)',
              border: '1px solid rgba(197, 160, 89, 0.35)',
              borderRadius: '16px',
              transform: 'scale(0.96)',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(44, 34, 30, 0.04)',
              pointerEvents: 'none'
            }} />

            {/* Top Active Stacked Postcard */}
            <div 
              onClick={() => setSelectedReview(currentReview)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                animation: stackAnim ? 'slideOutCard 0.28s ease-in forwards' : 'none'
              }}
            >
              <TestimonialCard 
                item={currentReview}
                onClick={() => setSelectedReview(currentReview)}
                renderWatermarkSvg={renderWatermarkSvg}
                renderSourceLogo={renderSourceLogo}
                activeTheme={activeTheme}
                style={{ width: '100%', flex: 'unset' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', color: '#78716C', fontWeight: '600' }}>
              Note {currentIndex + 1} of {testimonials.length} (Swipe or tap next)
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handlePrevCard}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <ChevronLeft size={15} color="#C5A059" />
              </button>
              <button 
                onClick={handleNextCard}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <ChevronRight size={15} color="#C5A059" />
              </button>
            </div>
          </div>
        </div>

        {/* Festive Gift Hampers Callout */}
        <div 
          className="support-card" 
          onClick={handleWhatsAppGiftInquiry}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '5px 8px', 
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)', 
            border: '1.5px dashed #C5A059', 
            borderRadius: '16px', 
            boxShadow: '0 6px 20px rgba(44, 34, 30, 0.05)',
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
            background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.25), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'prismSweep 4s infinite ease-in-out',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0px', marginBottom: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#8A6D2B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  ✦ Bespoke Gifting ✦
                </span>
              </div>
              <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Festive Bundles & Hampers
              </h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: '11px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Curated boxes for celebrations
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(197, 160, 89, 0.12)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            flexShrink: '0',
            marginLeft: '4px',
            position: 'relative',
            zIndex: 2
          }}>
            <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} />
          </div>
        </div>

        {/* Leave Review Container */}
        <a href="https://g.page/r/CRodKxCU6unDEBM/review" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
          <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '14px 8px', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
              <CheckCircle size={30} color="#C5A059" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h3 style={{ margin: '0 0 0px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>Leave a Review</h3>
              <p style={{ margin: 0, color: '#78716C', fontSize: '11px', fontWeight: '500' }}>Share your experience with us</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px' }}>
              <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} />
            </div>
          </div>
        </a>

        {/* Support Options Section */}
        <div style={{ paddingTop: '1px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <a href="https://wa.me/9108286886" onClick={handleWhatsAppClick} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '14px 8px', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <MessageCircle size={30} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>WhatsApp</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '11px', fontWeight: '500' }}>Immediate bespoke assistance</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px' }}>
                <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} />
              </div>
            </div>
          </a>

          <a href="mailto:lytebytesblr@gmail.com" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <div className="support-card" style={{ display: 'flex', alignItems: 'center', padding: '14px 8px', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <Mail size={30} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>Email</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '11px', fontWeight: '500' }}>Detailed queries & bulk orders</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px' }}>
                <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} />
              </div>
            </div>
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              className="support-card" 
              onClick={() => setTermsOpen(!termsOpen)}
              style={{ display: 'flex', alignItems: 'center', padding: '14px 8px', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '16px', boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)', cursor: 'pointer' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <FileText size={30} color="#C5A059" />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h3 style={{ margin: '0 0 2px 0', color: activeTheme.text, fontSize: '18px', fontWeight: '700', fontFamily: "'Cormorant Garamond', serif" }}>General Guidelines</h3>
                <p style={{ margin: 0, color: '#78716C', fontSize: '11px', fontWeight: '500' }}>Terms, shipping & privacy</p>
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(197, 160, 89, 0.12)', borderRadius: '50%', width: '28px', height: '28px',
                transform: termsOpen ? 'rotate(90deg)' : 'rotate(0deg)', 
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' 
              }}>
                <ChevronRight size={16} color="#C5A059" strokeWidth={2.5} />
              </div>
            </div>

            {termsOpen && (
              <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                <GeneralTermsModalContent brandColor="#C5A059" />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Expanded Review Modal */}
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
              padding: '26px',
              maxWidth: '380px', 
              width: '100%', 
              boxSizing: 'border-box',
              position: 'relative', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1.5px solid #FF5958',
              textAlign: 'left', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              maxHeight: '85vh', 
              overflowY: 'auto',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
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
                  <Star size={13} fill="#C5A059" color="#C5A059" />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A6D2B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Verified {selectedReview.source} Review
                  </span>
                </div>
              </div>

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

              <p style={{ margin: 0, fontSize: '12px', color: activeTheme.text, lineHeight: '1.6', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: '500' }}>
                "{selectedReview.text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px'}}>
                <span style={{ fontWeight: '600', color: activeTheme.text, fontSize: '14px', fontFamily: "sans-serif" }}>{selectedReview.author}</span>
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