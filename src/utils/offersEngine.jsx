export function getAllOffers(currentOrderNumber = 1) {
  // ==========================================================================
  // 🎛️ OFFER CONTROL PANEL (TRUE = ACTIVE, FALSE = TURNED OFF)
  // Set any offer flag to false to disable it instantly without deleting code.
  // ==========================================================================
  const ENABLE_OFFERS = {
    anniversaryEarly: false,    // Controls Anniversary Early Bird (Orders <= 25)
    anniversaryStandard: true,  // Controls Anniversary Standard Perk (Orders > 25)
    independenceDay: true,     // Controls Independence Day Special
    diwaliSeason: true,        // Controls Diwali Festive Celebration
    holiDelights: true,        // Controls Holi Delights Offer
    welcomePerk: true          // Controls Evergreen Welcome Offer
  };

  // ==========================================================================
  // 1. TIME & DATE CAPTURE ENGINE
  // Extracts real-time system metrics to evaluate active date/time windows
  // ==========================================================================
  const now = new Date();
  const month = now.getMonth() + 1; // Extracts current month (1 = Jan, 12 = Dec)
  const day = now.getDate();        // Extracts current calendar day of the month (1-31)
  const hour = now.getHours();      // Extracts current hour in 24-hour format (0-23)
  const minute = now.getMinutes();  // Extracts current minute (0-59)

  // Initialize an empty array to collect all currently valid offers
  const offersList = [];

  // ==========================================================================
  // 2. ANNIVERSARY SALE (July 27th to August 27th)
  // Dynamic tiered reward based on customer order sequence number
  // ==========================================================================
  const isAnniversaryWindow = (month === 7 && day >= 27) || (month === 8 && day <= 27);

  if (isAnniversaryWindow) {
    if (currentOrderNumber <= 25 && ENABLE_OFFERS.anniversaryEarly) {
      // Tier 1: Early bird reward for the first 25 orders (Controlled by anniversaryEarly flag)
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
      // Tier 2: Standard anniversary perk for order 26 onwards (Controlled by anniversaryStandard flag)
      offersList.push({
        id: 'anniv_std',
        tag: "ANNIVERSARY",
        title: "Anniversary Standard Perk",
        description: "Enjoy our anniversary reward.",
        code: "ANNI15",
        discount: "15% OFF",
        condition: "Min. order value ₹499",
        minOrder: 499,
        themeColor: "#D97706"
      });
    }
  }

  // ==========================================================================
  // 3. PRECISE DATE & TIME WINDOW OFFER (Independence Day Special)
  // Controlled by the independenceDay boolean flag
  // ==========================================================================
  const currentTotalMinutes = hour * 60 + minute;
  const startTotalMinutes = 10 * 60 + 30; // 10:30 AM converted to minutes (630 mins)
  const endTotalMinutes = 16 * 60 + 45;   // 4:45 PM converted to minutes (1005 mins)

  const isWithinDateWindow = month === 8 && day >= 1 && day <= 15; // Active August 1 to August 15
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

  // ==========================================================================
  // 4. DIWALI SEASON OFFER (Active throughout October / Month 10)
  // Controlled by the diwaliSeason boolean flag
  // ==========================================================================
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

  // ==========================================================================
  // 5. HOLI DELIGHTS OFFER (Active throughout March / Month 3)
  // Controlled by the holiDelights boolean flag
  // ==========================================================================
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

  // ==========================================================================
  // 6. EVERGREEN DEFAULT STORE OFFER (First Order Only)
  // Controlled by the welcomePerk boolean flag and restricted to the first order
  // ==========================================================================
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

  // Returns the final filtered array of active offers to the checkout/cart engine
  return offersList;
}