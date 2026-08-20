import React, { useState } from 'react';
import { ArrowLeft, Send, Bot, MessageCircle, User } from 'lucide-react';

const FAQ_DATA = [
  // --- LUNCH & CATERING ---
  { 
    question: "What is included in the lunch combo?", 
    answer: "Each combo includes Roti, Rice, Dal, Subzi or Curry (veg or chicken), and a complimentary item like raita, papad, salad or sweet. You can view the detailed breakdown directly on the Catering menu page!" 
  },
  { 
    question: "Is the menu fixed or does it change daily?", 
    answer: "Our rotating menu ensures variety and keeps your meals exciting, perfect for daily orders and subscription plans alike. Contact us on WhatsApp to know more about the menu." 
  },
  { 
    question: "Can I choose between veg & non-veg daily?", 
    answer: "Yes! You can select your preference in advance right when browsing items or adding them to your bag. Check order conditions to know more." 
  },

  // --- NUTRITION & MACROS ---
  { 
    question: "Where can I find calories and macros?", 
    answer: "Calories and nutritional breakdowns (macros) are available instantly in the item details view—just tap or click on any item image across the app to open its nutrition chart!" 
  },

  // --- SUBSCRIPTIONS & MEALS ---
  { 
    question: "Do you offer meal subscriptions?", 
    answer: "Enjoy our weekly and monthly meal plans at special discounted rates. You can inquire about plans via WhatsApp in Client Care." 
  },
  { 
    question: "Can I pause or skip days in my subscription?", 
    answer: "Of course! Just inform us at least a day in advance by messaging our kitchen through the WhatsApp support link in Client Care." 
  },
  { 
    question: "Do I need to pay in advance for subscriptions?", 
    answer: "Yes, we request payment securely at the start of your plan via our integrated UPI payment gateway at checkout." 
  },

  // --- DELIVERY & TRACKING ---
  { 
    question: "Do you offer delivery services & what time is lunch delivered?", 
    answer: "Yes, we deliver across selected areas in Bengaluru. Lunch deliveries are typically made between 11:30 AM and 12:30 PM. You can track your order live anytime using the 'Track' icon on the bottom navigation bar!" 
  },

  // --- PAYMENTS & ORDERS ---
  { 
    question: "What payment modes do you accept?", 
    answer: "We accept secure digital payments via UPI, Google Pay, PhonePe, and Paytm, accessible seamlessly on the Payment screen during checkout." 
  },
  { 
    question: "Do you take orders for parties and events?", 
    answer: "Yes! We specialise in bulk catering for all occasions. Tap the 'Bulk Ordering & Pricing' or 'WhatsApp Support' card under the Catering Meals Menu to discuss custom tailoring for your event." 
  },

  // --- GENERAL MENU & PRODUCT INFO ---
  { 
    question: "Are your products preservative-free?", 
    answer: "Yes! Everything at Lyte Bytes is 100% handcrafted with zero preservatives, made strictly to order." 
  },
  { 
    question: "How do Ammi's Achar and Jams stay fresh?", 
    answer: "Our pickles and artisanal jams use traditional methods with zero chemical additives. Check individual item descriptions for specific shelf-life details." 
  }
];

// 4 Main Featured Quick Questions
const MAIN_FAQS = [
  "What is included in the lunch combo?",
  "Do you offer meal subscriptions?",
  "Do you offer delivery services & what time is lunch delivered?",
  "Are your products preservative-free?"
];

export default function ConciergeChatView({ theme = {}, onBack }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! Welcome to Lyte Bytes Concierge. I'm Chef Lyte, your digital guide, how can I help you discover our handcrafted gourmet delights today?" }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputText('');

    setTimeout(() => {
      const userTextLower = text.toLowerCase();
      const matchedFaq = FAQ_DATA.find(faq => {
        const qLower = faq.question.toLowerCase();
        return qLower.includes(userTextLower) || userTextLower.includes(qLower.split(' ')[0]) || userTextLower.includes(qLower.split(' ')[1]);
      });

      if (matchedFaq) {
        setMessages(prev => [...prev, { sender: 'bot', text: matchedFaq.answer }]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: "I want to make sure you get the exact details you need! For custom requests or specific inquiries not covered here, please connect directly with our kitchen on WhatsApp:",
            showWhatsAppButton: true 
          }
        ]);
      }
    }, 600);
  };

  const activeTheme = {
    text: theme?.text || '#1A1816',
    radius: 'clamp(16px, 4vw, 20px)' // 💡 FLUID RADIUS
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
      
      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '20px', padding: '6px 0' }}>
        <button 
          onClick={onBack} 
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
            padding: '6px 12px', 
            borderRadius: '12px', 
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease'
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
          fontSize: 'var(--font-h2)', // 💡 FLUID TYPOGRAPHY
          color: '#FF5958', 
          margin: 0, 
          fontWeight: '700', 
          letterSpacing: '0.8px', 
          textTransform: 'uppercase', 
          pointerEvents: 'none' 
        }}>
          Chef Lyte
        </h2>
      </div>

      {/* Main Wrapper Card */}
      <div style={{ 
        border: '1.5px solid rgba(197, 160, 89, 0.45)', 
        borderRadius: activeTheme.radius,
        background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF5EC 100%)', 
        padding: 'clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
        boxShadow: '0 12px 32px rgba(44, 34, 30, 0.07)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        boxSizing: 'border-box', 
        width: '100%',
        minHeight: '420px'
      }}>
        
        {/* Messages Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '340px', paddingBottom: '10px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
              {/* Bot Avatar */}
              {msg.sender === 'bot' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={28} color="#8A6D2B" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  padding: 'clamp(10px, 3vw, 14px) clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
                  borderRadius: '14px', 
                  fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
                  lineHeight: '1.5', 
                  backgroundColor: msg.sender === 'user' ? '#FF5958' : '#FFFFFF', 
                  color: msg.sender === 'user' ? '#FFFFFF' : activeTheme.text, 
                  border: msg.sender === 'bot' ? '1px solid rgba(197, 160, 89, 0.3)' : 'none', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)', 
                  textAlign: 'left' 
                }}>
                  {msg.text}
                </div>

                {/* Optional WhatsApp Redirect Button in Bot Message */}
                {msg.showWhatsAppButton && (
                  <a 
                    href="https://wa.me/?text=Hi%20Lyte%20Bytes,%20I%20have%20a%20custom%20inquiry%20regarding%20your%20menu." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#25D366',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
                      fontWeight: '700',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <MessageCircle size={15} /> Chat with Kitchen on WhatsApp
                  </a>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={28} color="#FF5958" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 4 Main Quick FAQ Tap Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingBottom: '4px' }}>
          {MAIN_FAQS.map((question, idx) => (
            <button 
              key={idx} 
              type="button" 
              onClick={() => handleSend(question)} 
              style={{ 
                background: '#FFFFFF', 
                border: '1px solid rgba(197, 160, 89, 0.4)', 
                borderRadius: '12px', 
                padding: 'clamp(6px, 2vw, 8px) clamp(10px, 2.5vw, 12px)', // 💡 FLUID PADDING
                fontSize: 'var(--font-caption)', // 💡 FLUID TYPOGRAPHY
                fontWeight: '600', 
                color: '#8A6D2B', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {question}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        {/* 💡 BULLETPROOF FLEX: minWidth: 0 prevents input from crowding send button */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', width: '100%', boxSizing: 'border-box' }}>
          <input 
            type="text"
            placeholder="Ask Chef Lyte a question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              flex: 1, 
              minWidth: 0, 
              padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)', // 💡 FLUID PADDING
              borderRadius: '12px', 
              border: '1px solid rgba(197, 160, 89, 0.4)', 
              backgroundColor: '#FFFFFF', 
              fontSize: 'var(--font-body)', // 💡 FLUID TYPOGRAPHY
              outline: 'none', 
              color: activeTheme.text,
              boxSizing: 'border-box'
            }}
          />
          <button 
            type="button" 
            onClick={() => handleSend()} 
            style={{ 
              background: 'linear-gradient(135deg, #FF5958 0%, #E11D48 100%)', 
              color: '#FFFFFF', 
              border: 'none', 
              borderRadius: '12px', 
              width: 'clamp(42px, 10vw, 48px)', // 💡 FLUID BUTTON WIDTH
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              boxShadow: '0 4px 12px rgba(255, 89, 88, 0.3)',
              flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}