import React, { useState } from 'react';
import { ArrowLeft, Star, Camera, Mail } from 'lucide-react';

export default function WallOfLoveView({
  theme = {},
  setView = () => {},
  testimonials = [],
  onSelectReview = () => {}
}) {
  const [activeTab, setActiveTab] = useState('all');

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
      case 'email':
        return <Mail size={14} color="#C5A059" />;
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
        return <Mail size={24} color="#C5A059" />;
    }
  };

  const filteredReviews = activeTab === 'all' 
    ? testimonials 
    : testimonials.filter(item => item.source?.toLowerCase() === activeTab);

  const tabs = [
    { id: 'all', label: 'All Reviews' },
    { id: 'google', label: 'Google' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'email', label: 'Email' }
  ];

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
      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '16px', padding: '6px 0' }}>
        <button 
          onClick={() => setView('info')} 
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <ArrowLeft size={15}/> Back
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
          Wall of Love
        </h2>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '4px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, #C5A059 0%, #A3803F 100%)' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFF' : activeTheme.text,
              border: '1px solid rgba(197, 160, 89, 0.4)',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(197, 160, 89, 0.3)' : 'none',
              flexShrink: 0
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#78716C', fontSize: '13px' }}>
            No reviews found for this category yet.
          </div>
        ) : (
          filteredReviews.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectReview(item)}
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF4EB 100%)',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(44, 34, 30, 0.04)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Source Watermark */}
              <div style={{
                position: 'absolute',
                right: '-10px',
                bottom: '-10px',
                width: '75px',
                height: '75px',
                opacity: 0.07,
                pointerEvents: 'none',
                zIndex: 0
              }}>
                {renderWatermarkSvg(item.source)}
              </div>

              {/* Review Stars & Rating */}
              <div style={{ display: 'flex', gap: '3px', position: 'relative', zIndex: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#C5A059" color="#C5A059" />
                ))}
              </div>

              {/* Review Text */}
              <p style={{ margin: 0, fontSize: '13px', color: activeTheme.text, lineHeight: '1.5', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                "{item.text}"
              </p>

              {/* Optional Photo Tag */}
              {item.imageUrl && (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '10px', color: '#8A6D2B', background: 'rgba(197, 160, 89, 0.15)', padding: '2px 6px', borderRadius: '6px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Camera size={10} /> Photo Attached
                  </span>
                </div>
              )}

              {/* Author & Source Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingTop: '8px', borderTop: '1px dashed rgba(197, 160, 89, 0.3)', position: 'relative', zIndex: 1 }}>
                <span style={{ fontWeight: '700', color: '#FF5958', fontSize: '12.5px' }}>
                  {item.author}
                </span>
                <span style={{ textTransform: 'capitalize', color: '#78716C', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {renderSourceLogo(item.source)} {item.source}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}