// src/utils/offersEngine.js

export function getAllOffers(currentOrderNumber = 1) {
  const now = new Date();
  const month = now.getMonth() + 1; 
  const day = now.getDate();        

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
        code: "ANNIVERSARY2026",
        discount: "20% OFF",
        condition: "Valid for the first 25 orders only",
        minOrder: 0,
        themeColor: "#8B4513"
      });
    } else {
      offersList.push({
        id: 'anniv_std',
        tag: "ANNIVERSARY",
        title: "Anniversary Standard Perk",
        description: "Thanks for celebrating with us! Enjoy our standard anniversary reward.",
        code: "ANNIVERSARY10",
        discount: "15% OFF",
        condition: "Min. order value ₹499",
        minOrder: 499,
        themeColor: "#D97706"
      });
    }
  }

  // 2. SPECIFIC DATE WINDOW (August 1st to August 15th)
  if (month === 8 && day >= 1 && day <= 15) {
    offersList.push({
      id: 'early_aug',
      tag: "LIMITED WINDOW",
      title: "Early August Flash Deal",
      description: "Get special discounts on all newly added seasonal inventory.",
      code: "EARLYAUG15",
      discount: "10% OFF",
      condition: "Applicable on seasonal inventory",
      minOrder: 0,
      themeColor: "#1D4ED8"
    });
  }

  // 3. DIWALI SEASON (October)
  if (month === 10) {
    offersList.push({
      id: 'diwali_season',
      tag: "DIWALI SEASON",
      title: "Full Month Festive Celebration",
      description: "Enjoy festive savings all through October on orders above ₹999!",
      code: "DIWALIALLMONTH",
      discount: "Flat 15% OFF",
      condition: "Min. order value ₹999",
      minOrder: 999,
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
    description: "Enjoy handcrafted freshness delivered right to your doorstep.",
    code: "LYTEFIRST",
    discount: "15% OFF",
    condition: "No minimum order required",
    minOrder: 0,
    themeColor: "#FF5958"
  });

  return offersList;
}