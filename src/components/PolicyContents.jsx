import React from 'react';
import { 
  Clock, MapPin, Package, UserCheck, CheckCircle, 
  AlertCircle, Database, Eye, Lock, 
  ShieldCheck, Tag, Percent, Sparkles, FileText, CheckCircle2, DollarSign, ShieldAlert, Calendar, RefreshCw, Shuffle, Utensils,
  IndianRupeeIcon
} from 'lucide-react';

// ============================================================================
// 🎨 GLOBAL DESIGN SYSTEM & STYLING CONFIGURATION (FLUID SCALING)
// ============================================================================

const cardStyle = {
  border: '1px dashed #C5A059',
  borderRadius: '14px',
  padding: 'clamp(10px, 3vw, 14px) clamp(12px, 3.5vw, 16px)',
  background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF4EB 100%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  boxShadow: '0 4px 16px rgba(44, 34, 30, 0.04)',
  boxSizing: 'border-box',
  minWidth: 0,
  width: '100%'
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0
};

const iconBoxStyle = {
  padding: '0px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const titleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 'clamp(16px, 4.5vw, 18px)',
  fontWeight: '700',
  letterSpacing: '0.3px',
  color: '#1A1816',
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0
};

const textStyle = {
  margin: 0,
  fontSize: 'clamp(11.5px, 3.2vw, 12.5px)',
  fontWeight: '500',
  lineHeight: '1.45',
  color: '#78716C',
  textAlign: 'left',
  minWidth: 0
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  minWidth: 0
};

// ==========================================
// 🛒 1. ORDERS POLICY CONTENT (Cart & Checkout)
// ==========================================
export function CartViewPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Clock size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Advance Ordering & Cut-Off</h4>
        </div>
        <p style={textStyle}>
          Many of our culinary items and delicacies are prepared in small batches using traditional methods. Availability is subject to seasonal produce and daily preparation limits.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><FileText size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Order Confirmation</h4>
        </div>
        <p style={textStyle}>
          Once an order is placed, we reserve the right to accept or decline any order at our discretion due to stock limitations or delivery constraints.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><IndianRupeeIcon size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Payment Terms</h4>
        </div>
        <p style={textStyle}>
          Full payment is required at checkout through secure authorized payment modes (Gpay, Phonepe, Paytm) without storing any financial credentials.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><CheckCircle2 size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Cancellations & Modifications</h4>
        </div>
        <p style={textStyle}>
          Requests for changes must be made before preparation begins. Due to the perishable and fresh nature of our food, orders cannot be cancelled or modified once dispatched.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><AlertCircle size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Fair Usage</h4>
        </div>
        <p style={textStyle}>
          We reserve the right to cancel or block accounts associated with fraudulent, unverified, or repeated fake bookings.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Sparkles size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Pricing & Acceptance</h4>
        </div>
        <p style={textStyle}>
          Placing an order implies agreement to our pricing terms. All prices include applicable local taxes. Confirmed orders are unaffected by subsequent price adjustments.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><CheckCircle size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Quality & Returns</h4>
        </div>
        <p style={textStyle}>
          Perishable food items and opened packages are non-returnable. Damaged or incorrect deliveries must be reported with photographic proof within 24 hours for review.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><ShieldCheck size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>FSSAI & Halal Compliance</h4>
        </div>
        <p style={textStyle}>
          Operates as a certified FSSAI kitchen. <strong>Notice:</strong> Prepared in a home kitchen handling common allergens (nuts, dairy, gluten). Halal-certified ingredients are used in designated products.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 🏷️ 2. OFFERS POLICY CONTENT
// ==========================================
export function OfferPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Tag size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>No Clubbing & Offer Stacking</h4>
        </div>
        <p style={textStyle}>
          Promotional codes, discount vouchers, store credits, and executive pass privileges cannot be combined or clubbed. Only one primary coupon or discount mechanism can be applied per order.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Percent size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Welcome Offer & Thresholds</h4>
        </div>
        <p style={textStyle}>
          The 10% Welcome Offer is valid strictly for first-time sign-ins and initial qualifying orders. All coupons are subject to specified minimum order value requirements (excluding delivery fees and taxes).
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Sparkles size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Loyalty Perks, Expiry & Rights</h4>
        </div>
        <p style={textStyle}>
          Tier-based loyalty perks reflect automatically and hold no cash value. Expired offers cannot be applied retroactively. Management reserves the right to modify or terminate offers without prior notice.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 🚚 3. DELIVERY POLICY CONTENT
// ==========================================
export function DeliveryPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><MapPin size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Service Radius</h4>
        </div>
        <p style={textStyle}>
          We currently deliver exclusively within Bengaluru city limits.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Clock size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Delivery Slots & Timelines</h4>
        </div>
        <p style={textStyle}>
          Standard delivery takes 24–48 hours. Preferred delivery slots (date/time) can be selected at checkout based on availability.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><ShieldAlert size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Handover Protocol</h4>
        </div>
        <p style={textStyle}>
          Due to perishability, delivery partners can wait a maximum of 10 minutes at the drop location. Uncontactable orders at delivery cannot be refunded.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 🔒 4. PRIVACY POLICY CONTENT
// ==========================================
export function PrivacyPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Database size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Data Collection & Security</h4>
        </div>
        <p style={textStyle}>
          Essential details (name, phone, address) are collected strictly for order fulfillment and customer support. Data is never sold and is shared exclusively with verified local logistics partners.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Lock size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Credentials & Zero Tracking</h4>
        </div>
        <p style={textStyle}>
          We do not store passwords, unique PINs, or financial credentials on our servers, nor do we utilize tracking pixels, cookies, or third-party performance analytics.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><FileText size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Data Retention & Deletion</h4>
        </div>
        <p style={textStyle}>
          Order logs are archived securely for operational tracking. You retain the right to request complete deletion of your account and personal records at any time by contacting support.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 📅 5. SUBSCRIPTION PASS POLICY CONTENT
// ==========================================
export function SubscriptionPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Clock size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Flexible Skips & Cut-Offs</h4>
        </div>
        <p style={textStyle}>
          Pause or skip deliveries via your dashboard at least <strong>10 hours before</strong> the scheduled meal time to retain your credit. Meals missed within this window are forfeited.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}><Calendar size={16} color={brandColor} /></div>
          <h4 style={titleStyle}>Extended Validity & Rules</h4>
        </div>
        <p style={textStyle}>
          Weekly Passes remain active for up to <strong>14 days</strong>, and Monthly Passes for up to <strong>45 days</strong>. Passes are non-refundable once the first meal is dispatched.
        </p>
      </div>
    </div>
  );
}