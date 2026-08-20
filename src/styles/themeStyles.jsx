// src/styles/themeStyles.js

export const getSharedStyles = (theme) => ({
  backButtonStyle: {
    background: 'transparent',
    border: 'none',
    color: theme.brand,
    fontSize: 'clamp(12px, 3.5vw, 14px)', // 💡 FLUID TYPOGRAPHY
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 0',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    transition: 'opacity 0.2s ease',
    flexShrink: 0
  },
  inputStyle: {
    width: '100%',
    boxSizing: 'border-box',
    border: theme.border,
    background: '#FFFBF2',
    color: theme.text,
    borderRadius: theme.radius || '12px',
    padding: 'clamp(10px, 3vw, 13px) clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
    fontSize: 'clamp(12px, 3.5vw, 13.5px)', // 💡 FLUID TYPOGRAPHY
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
    WebkitTapHighlightColor: 'transparent',
    minWidth: 0
  },
  actionButtonStyle: {
    backgroundColor: theme.buttonBg || theme.brand,
    color: theme.buttonText || '#FFFFFF',
    border: 'none',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 4px 14px rgba(225, 112, 85, 0.2)',
    padding: 'clamp(10px, 3vw, 12px) clamp(14px, 4vw, 18px)',
    fontSize: 'clamp(12px, 3.5vw, 14px)',
    borderRadius: theme.radius || '12px',
    minWidth: 0
  },
  secondaryButtonStyle: {
    backgroundColor: 'transparent',
    color: theme.text,
    border: theme.border,
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    padding: 'clamp(10px, 3vw, 12px) clamp(14px, 4vw, 18px)',
    fontSize: 'clamp(12px, 3.5vw, 14px)',
    borderRadius: theme.radius || '12px',
    minWidth: 0
  },
  accordionHeaderStyle: {
    border: theme.border,
    background: theme.bg,
    borderRadius: theme.radius || '12px',
    padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3.5vw, 16px)', // 💡 FLUID PADDING
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    transition: 'background 0.2s ease',
    minWidth: 0
  }
});

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxcQ3x6REyLMeids_Lh7t0shVUdbSHRizgdzW4rC_C-xM7j7FGy_t0VDEjSex9YdfJwg/exec";

// 1. GET: Fetch all historical transactions from Google Sheets
export async function fetchHistoricalOrders() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch historical orders:", error);
    return [];
  }
}

// 2. POST: Submit a live order from the PWA to Google Sheets
export async function submitLiveOrder(orderPayload) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(orderPayload),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to submit order:", error);
  }
}

export function getAllOffers(currentOrderNumber = 1) {
  const ENABLE_OFFERS = {
    anniversaryEarly: false,
    anniversaryStandard: true,
    independenceDay: true,
    diwaliSeason: true,
    holiDelights: true,
    welcomePerk: true
  };

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const offersList = [];

  const isAnniversaryWindow = (month === 7 && day >= 27) || (month === 8 && day <= 27);

  if (isAnniversaryWindow) {
    if (currentOrderNumber <= 25 && ENABLE_OFFERS.anniversaryEarly) {
      offersList.push({
        id: 'anniv_early',
        tag: "ANNIVERSARY",
        title: "Anniversary Early Bird",
        description: "Exclusive early bird reward! Celebrate with us.",
        code: "ANNI25",
        discount: "25% OFF",
        condition: "Valid for the first 25 orders only",
        minOrder: 0,
        themeColor: "#8B4513"
      });
    } else if (currentOrderNumber > 0 && ENABLE_OFFERS.anniversaryStandard) {
      offersList.push({
        id: 'anniv_std',
        tag: "ANNIVERSARY",
        title: "Anniversary Standard Perk",
        description: "Enjoy our standard anniversary reward.",
        code: "ANNI15",
        discount: "15% OFF",
        condition: "Min. order value ₹499",
        minOrder: 499,
        themeColor: "#D97706"
      });
    }
  }

  const currentTotalMinutes = hour * 60 + minute;
  const startTotalMinutes = 10 * 60 + 30;
  const endTotalMinutes = 16 * 60 + 45;

  const isWithinDateWindow = month === 8 && day >= 1 && day <= 15;
  const isWithinTimeWindow = currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;

  if (ENABLE_OFFERS.independenceDay && isWithinDateWindow && isWithinTimeWindow) {
    offersList.push({
      id: 'early_aug',
      tag: "LIMITED",
      title: "Independence Day Special",
      description: "Get special discounts this Independence Day.",
      code: "IND15",
      discount: "15% OFF",
      condition: "Valid Aug 1-15 between 10:30 AM & 04:45 PM",
      minOrder: 0,
      themeColor: "#1D4ED8"
    });
  }

  if (ENABLE_OFFERS.diwaliSeason && month === 10) {
    offersList.push({
      id: 'diwali_season',
      tag: "FESTIVE",
      title: "Full Month Festive Celebration",
      description: "Enjoy festive savings all through October on orders!",
      code: "FEST20",
      discount: "20% OFF",
      condition: "Enjoy the festive season with us",
      minOrder: 0,
      themeColor: "#D97706"
    });
  }

  if (ENABLE_OFFERS.holiDelights && month === 3) {
    offersList.push({
      id: 'holi_delights',
      tag: "HOLI",
      title: "Holi Delights Offer",
      description: "Buy any 2 snacks and get 1 traditional beverage free.",
      code: "HOLIFEST",
      discount: "SPECIAL",
      condition: "Applicable on all snack items",
      minOrder: 299,
      themeColor: "#DB2777"
    });
  }

  if (ENABLE_OFFERS.welcomePerk && currentOrderNumber === 1) {
    offersList.push({
      id: 'welcome_perk',
      tag: "WELCOME",
      title: "Welcome Offer",
      description: "Try our handcrafted freshness.",
      code: "APPFIRST",
      discount: "10% OFF",
      condition: "Min. order value ₹250",
      minOrder: 250,
      themeColor: "#FF5958"
    });
  }

  return offersList;
}