import React from 'react';
import { 
  Clock, MapPin, Package, UserCheck, CheckCircle, 
  AlertCircle, Database, Eye, Lock, 
  ShieldCheck, Tag, Percent, Sparkles, FileText, CheckCircle2, DollarSign, ShieldAlert
} from 'lucide-react';

// ============================================================================
// 🎨 GLOBAL DESIGN SYSTEM & STYLING CONFIGURATION
// You can modify fonts, padding, spacing, and margins directly here.
// ============================================================================

// Controls the card container: border, background, inner padding, and spacing between cards
const cardStyle = {
  border: '1px dashed #4A443A',            // Border style and color
  borderRadius: '12px',                    // Rounded corners for the card
  padding: '8px 8px',                    // Internal spacing (Top/Bottom, Left/Right)
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',                              // Spacing between the title row and paragraph text
  boxShadow: '0 2px 8px rgba(44, 34, 30, 0.02)', // Subtle card shadow
  boxSizing: 'border-box'
};

// Controls the header alignment inside each micro-card (Icon + Title)
const headerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px'                               // Space between the icon box and the heading title text
};

// Controls the background and sizing of the icon container
const iconBoxStyle = {
  padding: '0px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Controls the typography of card titles (Font size, weight, letter spacing)
const titleStyle = {
  fontSize: '12px',                      // Adjust title font size here
  fontWeight: '500',                       // Font boldness (e.g., 600, 700, 800)
  letterSpacing: '0.2px',
  color: '#2C221E',                        // Title text color
  margin: 0
};

// Controls the typography and line height of the policy description body text
const textStyle = {
  margin: 0,
  fontSize: '10.5px',                      // Adjust body text font size here
  fontWeight: '400',
  lineHeight: '1.45',                      // Line spacing for readability
  color: '#665C52',                        // Body text color
  textAlign: 'left',
  paddingLeft: '1px'
};

// Controls the overall outer wrapper spacing between all cards in a modal
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',                              // Vertical gap/space between individual policy cards
  width: '100%',
  boxSizing: 'border-box'
};

// ==========================================
// 🛒 1. ORDERS POLICY CONTENT (Cart & Checkout)
// ==========================================
export function CartViewPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Clock size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Advance Ordering & Cut-Off</h4>
        </div>
        <p style={textStyle}>
          Many of our culinary items and preserves are prepared in small batches using traditional methods. Availability is subject to seasonal produce and daily preparation limits.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <FileText size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Order Confirmation</h4>
        </div>
        <p style={textStyle}>
          Once an order is placed, you will receive an acknowledgment or confirmation via SMS, WhatsApp, or email. We reserve the right to accept or decline any order at our discretion due to stock limitations or delivery zone constraints.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <DollarSign size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Payment Terms</h4>
        </div>
        <p style={textStyle}>
          Full payment is required at checkout. Payments are processed securely through authorized gateways (UPI, credit/debit cards, net banking, and wallets) without storing your complete financial credentials.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <CheckCircle2 size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Cancellations & Modifications</h4>
        </div>
        <p style={textStyle}>
          Requests for changes or cancellations must be made within a specified window before preparation or dispatch begins. Due to the perishable and fresh nature of our food, orders cannot be cancelled or modified once dispatched.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <AlertCircle size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Fair Usage</h4>
        </div>
        <p style={textStyle}>
          We reserve the right to cancel or block accounts associated with fraudulent, unverified, or repeated fake bookings.
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
          <div style={iconBoxStyle}>
            <Tag size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Coupon Stacking & Combination</h4>
        </div>
        <p style={textStyle}>
          Unless explicitly stated, promotional codes, store credits, and automated discounts cannot be stacked. Only one primary coupon can be applied per order.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Percent size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Loyalty Program Discounts</h4>
        </div>
        <p style={textStyle}>
          Tier-based loyalty perks automatically reflect in your cart based on your current account status (e.g., Platinum, Gold, Silver). Loyalty points cannot be exchanged for cash.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Sparkles size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Usage Limits & Expiry</h4>
        </div>
        <p style={textStyle}>
          Special offers, seasonal coupons, and price adjustments carry strict expiration dates and single-use thresholds. Expired or fully redeemed offers cannot be re-issued or applied retroactively.
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
          <div style={iconBoxStyle}>
            <MapPin size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Service Radius</h4>
        </div>
        <p style={textStyle}>
          We currently deliver exclusively within Bengaluru.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Clock size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Delivery Slots & Timelines</h4>
        </div>
        <p style={textStyle}>
          Standard delivery takes 24–48 hours. Preferred slots (Morning: 8–11 AM, Afternoon: 12–2 PM, Evening: 5–8 PM) can be selected at checkout.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Package size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Fees & Tracking</h4>
        </div>
        <p style={textStyle}>
          Delivery charges are calculated dynamically at checkout. Real-time status tracking is available in the app.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <ShieldAlert size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Address Accuracy & Handover</h4>
        </div>
        <p style={textStyle}>
          Please provide precise address details. Due to product perishability, our delivery partners can wait a maximum of 10 minutes at the drop location; uncontactable orders cannot be refunded.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <AlertCircle size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>External Delays</h4>
        </div>
        <p style={textStyle}>
          While we prioritize punctuality, unforeseen local conditions (severe weather, heavy traffic blockades) may occasionally impact delivery windows.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 📄 4. GENERAL TERMS & CONDITIONS CONTENT
// ==========================================
export function GeneralTermsModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Sparkles size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Introduction & Acceptance</h4>
        </div>
        <p style={textStyle}>
          Welcome to our platform. By placing an order for our handcrafted foods, pickles, or gourmet treats, you agree to comply with and be bound by these terms and conditions.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <DollarSign size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Pricing Transparency & Changes</h4>
        </div>
        <p style={textStyle}>
          All prices listed are inclusive of applicable local taxes unless stated otherwise. We reserve the right to adjust product pricing, seasonal offers, or delivery fees at any time without prior notice, though active confirmed orders will not be affected.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <CheckCircle size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Quality Assurance & Returns</h4>
        </div>
        <p style={textStyle}>
          We adhere to strict hygiene and quality standards. Because our offerings include food and edible preserves, perishable items and opened packages are generally non-returnable.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Package size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Damaged or Incorrect Deliveries</h4>
        </div>
        <p style={textStyle}>
          If you receive a damaged, leaking, or incorrect item, please notify our support team via WhatsApp or email with photographic proof within 24 hours of delivery for verification and replacement or refund.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <ShieldCheck size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Limitation of Liability</h4>
        </div>
        <p style={textStyle}>
          We shall not be held liable for any adverse reactions, allergies, or health issues resulting from consumption, provided standard ingredients and preparation guidelines have been accurately represented. Customers with food allergies should review ingredient lists carefully.
        </p>
      </div>

       <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <ShieldCheck size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>FSSAI & Food Safety</h4>
        </div>
        <p style={textStyle}>
          Lyte Bytes operates as a certified FSSAI-registered kitchen adhering to strict hygiene standards. <strong>Allergy Notice:</strong> Prepared in a home kitchen that handles common allergens including nuts, dairy, and gluten.
        </p>
      </div>

       <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <ShieldCheck size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>FSSAI & Food Safety</h4>
        </div>
        <p style={textStyle}>
           <strong>Halal Compliance:</strong> Halal-certified ingredients are used in select products.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 🔒 5. PRIVACY POLICY & FOOD SAFETY CONTENT
// ==========================================
export function PrivacyPolicyModalContent({ brandColor = '#FF5958' }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Database size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Data Collection</h4>
        </div>
        <p style={textStyle}>
          We collect essential details (name, phone number, address) strictly for order fulfillment, logistics coordination, and customer support.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={iconBoxStyle}>
            <Eye size={14} color={brandColor} />
          </div>
          <h4 style={titleStyle}>Data Sharing & Security</h4>
        </div>
        <p style={textStyle}>
          Your information is never sold. Data is shared exclusively with trusted local logistics partners. We do not use tracking cookies.
        </p>
      </div>
    </div>
  );
}