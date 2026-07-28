// src/utils/offersEngine.js

export function getAllOffers(currentOrderNumber = 1) {
  // Capture current real-time metrics for date/time validation
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12 (Current month)
  const day = now.getDate();        // Current day of the month
  const hour = now.getHours();      // 0-23 format
  const minute = now.getMinutes();  // 0-59 format

  const offersList = [];

  // 1. ANNIVERSARY SALE (July 27th to August 27th)
  const isAnniversaryWindow = (month === 7 && day >= 27) || (month === 8 && day <= 27);

  if (isAnniversaryWindow) {
    if (currentOrderNumber <= 25) {
      offersList.push({
        id: 'anniv_early',
        tag: "ANNIVERSARY - EARLY BIRD",
        title: "Anniversary Celebration",
        description: "Exclusive early bird reward! Celebrate with us.",
        code: "ANNI25",
        discount: "25% OFF",
        condition: "Valid for the first 25 orders only",
        minOrder: 0,
        themeColor: "#8B4513"
      });
    } else {
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

  // 2. SPECIFIC DATE & PRECISE TIME WINDOW 
  // Example: August 1st to August 15th, strictly between 10:30 AM (10:30) and 4:45 PM (16:45)
  // We calculate total current minutes from midnight to handle minute comparisons cleanly.
  const currentTotalMinutes = hour * 60 + minute;
  const startTotalMinutes = 10 * 60 + 30; // 10:30 AM = (10 * 60) + 30 = 630 minutes
  const endTotalMinutes = 16 * 60 + 45;   // 4:45 PM = (16 * 60) + 45 = 1005 minutes

  const isWithinDateWindow = month === 8 && day >= 1 && day <= 15;
  const isWithinTimeWindow = currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;

  if (isWithinDateWindow && isWithinTimeWindow) {
    offersList.push({
      id: 'early_aug',
      tag: "LIMITED WINDOW",
      title: "INDEPENDENCE DAY SPECIAL",
      description: "Get special discounts this Independence Day.",
      code: "IND15",
      discount: "15% OFF",
      condition: "Valid Aug 1-15 between 00:00 AM & 23:59 PM",
      minOrder: 0,
      themeColor: "#1D4ED8"
    });
  }

  // 3. DIWALI SEASON (October)
  if (month === 10) {
    offersList.push({
      id: 'diwali_season',
      tag: "FESTIVE SEASON",
      title: "Full Month Festive Celebration",
      description: "Enjoy festive savings all through October on orders above ₹999!",
      code: "FEST20",
      discount: "Flat 20% OFF",
      condition: "Enjoy the festive season with us",
      minOrder: 0,
      themeColor: "#D97706"
    });
  }

  // 4. HOLI DELIGHTS (March)
  if (month === 3) {
    offersList.push({
      id: 'holi_delights',
      tag: "RANG BARSE",
      title: "Holi Delights Offer",
      description: "Buy any 2 snacks or sweets and get 1 traditional beverage free.",
      code: "HOLIFEST",
      discount: "B2G1 FREE",
      condition: "Applicable on all snack items",
      minOrder: 299,
      themeColor: "#DB2777"
    });
  }

  // 5. EVERGREEN DEFAULT STORE OFFER
  offersList.push({
    id: 'welcome_perk',
    tag: "LYTE PERKS",
    title: "Welcome Wholesome Offer",
    description: "Enjoy handcrafted freshness delivered to you.",
    code: "APPFIRST",
    discount: "10% OFF",
    condition: "No minimum order required",
    minOrder: 0,
    themeColor: "#FF5958"
  });

  return offersList;
}