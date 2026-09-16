import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, MessageCircle, User } from 'lucide-react';
import { getBotResponse } from '../utils/chatbotLogic.jsx'; 

const QUICK_SUGGESTIONS = [
  "What's in the lunch combo?",
  "Tell me about Ammi's Achars",
  "Do you have biryanis?",
  "Where can I see calories?"
];

export default function ConciergeChatView({ theme = {}, onBack }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! Welcome to Lyte Bytes Support. I'm Chef Lyte, your digital menu guide. What items or details can I help you find today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const chatFeedRef = useRef(null);

  // Smooth internal scroll that won't bounce the parent window
  const scrollToBottom = () => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const matchedAnswer = getBotResponse(text);

      if (matchedAnswer) {
        setMessages(prev => [...prev, { sender: 'bot', text: matchedAnswer }]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: "I want to make sure you get the exact answer for that! Let me connect you directly with our kitchen so you can chat with Team Lyte Bytes right away:",
            showWhatsAppButton: true 
          }
        ]);
      }
    }, 500);
  };

  const activeTheme = {
    text: theme?.text || '#1A1816',
    brand: '#FF5958',
    gold: '#8A6D2B'
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0, left: 0, right: 0, 
      /* Removed bottom: 0 so it doesn't fight the height */
      height: '90dvh', /* 💡 Change this to 75dvh, 80dvh, or 82dvh to test! */
      zIndex: 99999, 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#FFFDF9',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      
      {/* Header Navigation: Respects the iPhone Dynamic Island */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative', 
        padding: 'max(8px, env(safe-area-inset-top)) clamp(12px, 4vw, 18px) 8px clamp(12px, 4vw, 18px)', 
        backgroundColor: 'rgba(255, 253, 249, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        flexShrink: 0,
        zIndex: 10
      }}>
        <button 
          onClick={onBack} 
          style={{ 
            position: 'absolute',
            left: 'clamp(16px, 4vw, 20px)',
            background: '#FFFFFF', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: activeTheme.text, 
            fontSize: 'var(--font-caption)', 
            fontWeight: '600', 
            padding: 'clamp(2px, 2vw, 4px) clamp(6px, 3vw, 10px)', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <ArrowLeft size={15} style={{ flexShrink: 0 }}/> Back
        </button>
        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'var(--font-h2)', 
          color: activeTheme.brand, 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.8px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Chef Lyte
        </h2>
      </div>

      {/* Message Feed Container: Fluid internal scroll */}
      <div ref={chatFeedRef} style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: 'clamp(16px, 5vw, 24px) clamp(16px, 4vw, 20px)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'clamp(12px, 3.5vw, 16px)',
        WebkitOverflowScrolling: 'touch', 
        backgroundColor: '#FFFDF9'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
            
            {msg.sender === 'bot' && (
              <div style={{ width: 'clamp(28px, 7vw, 32px)', height: 'clamp(28px, 7vw, 32px)', borderRadius: '50%', backgroundColor: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                <Bot size={18} color={activeTheme.gold} />
              </div>
            )}

            <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                padding: 'clamp(10px, 3vw, 14px) clamp(14px, 4vw, 18px)', 
                borderRadius: msg.sender === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px', 
                fontSize: 'clamp(14px, 3.8vw, 15px)', 
                lineHeight: '1.5', 
                backgroundColor: msg.sender === 'user' ? activeTheme.brand : '#FFFFFF', 
                color: msg.sender === 'user' ? '#FFFFFF' : activeTheme.text, 
                border: msg.sender === 'bot' ? '1px solid rgba(197, 160, 89, 0.25)' : '1px solid transparent', 
                boxShadow: msg.sender === 'bot' ? '0 4px 14px rgba(0,0,0,0.03)' : '0 4px 14px rgba(255, 89, 88, 0.25)', 
                textAlign: 'left',
                fontWeight: '500'
              }}>
                {msg.text}
              </div>

              {msg.showWhatsAppButton && (
                <a 
                  href="https://wa.me/9122500802806?text=Hi%20Lyte%20Bytes%20Team,%20I%20have%20a%20specific%20question%20about%20your%20menu." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#25D366',
                    color: '#FFFFFF',
                    padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 18px)',
                    borderRadius: '12px',
                    fontSize: 'clamp(13px, 3.5vw, 14px)',
                    fontWeight: '700',
                    textDecoration: 'none',
                    boxShadow: '0 6px 16px rgba(37, 211, 102, 0.25)',
                    alignSelf: 'flex-start'
                  }}
                >
                  <MessageCircle size={16} /> Chat with Team Lyte Bytes
                </a>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: 'clamp(28px, 7vw, 32px)', height: 'clamp(28px, 7vw, 32px)', borderRadius: '50%', backgroundColor: 'rgba(255, 89, 88, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255, 89, 88, 0.2)' }}>
                <User size={18} color={activeTheme.brand} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER OVERRIDE: Balances the home indicator without floating off the edge */}
      <div style={{ 
        paddingTop: 'clamp(10px, 2.5vw, 14px)',
        paddingLeft: 'clamp(16px, 4vw, 20px)',
        paddingRight: 'clamp(16px, 4vw, 20px)',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', 
        backgroundColor: '#FFFDF9',
        borderTop: '1px solid rgba(197, 160, 89, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(10px, 2.5vw, 14px)',
        flexShrink: 0,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.02)',
        zIndex: 10
      }}>
        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {QUICK_SUGGESTIONS.map((suggestion, idx) => (
            <button 
              key={idx} 
              type="button" 
              onClick={() => handleSend(suggestion)} 
              style={{ 
                background: '#FFFFFF', 
                border: '1px solid rgba(197, 160, 89, 0.35)', 
                borderRadius: '16px', 
                padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3.5vw, 16px)', 
                fontSize: 'clamp(12px, 3.2vw, 13px)', 
                fontWeight: '600', 
                color: activeTheme.gold, 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
          <input 
            type="text"
            placeholder="Message Chef Lyte..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              flex: 1, 
              minWidth: 0, 
              padding: 'clamp(14px, 3.5vw, 16px)', 
              borderRadius: '16px', 
              border: '1px solid rgba(197, 160, 89, 0.4)', 
              backgroundColor: '#FFFFFF', 
              fontSize: 'clamp(14.5px, 4vw, 15px)', 
              outline: 'none', 
              color: activeTheme.text,
              boxSizing: 'border-box',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
            }}
          />
          <button 
            type="button" 
            onClick={() => handleSend()} 
            style={{ 
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', 
              color: '#FFFFFF', 
              border: 'none', 
              borderRadius: '16px', 
              width: 'clamp(50px, 12vw, 54px)', 
              height: 'clamp(50px, 12vw, 54px)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              boxShadow: '0 4px 14px rgba(255, 89, 88, 0.35)',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}