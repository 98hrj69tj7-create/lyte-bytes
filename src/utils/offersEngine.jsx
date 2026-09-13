export function getAllOffers(currentOrderNumber = 1, customerOrderHistory = []) {
  // ==========================================================================
  // 🎛️ OFFER CONTROL PANEL (TRUE = ACTIVE, FALSE = TURNED OFF)
  // ==========================================================================
  const ENABLE_OFFERS = {
    ganeshChaturthi2026: true, // Ganesh Chaturthi (Sep 2026 window) - 15%
    dasaraNavratri2026: true,  // Mysore Dasara / Navratri (Oct 2026) - 15%
    diwaliSeason2026: true,    // Diwali Festive Celebration (Oct 2026) - 10%
    kannadaRajyotsava: true,   // Kannada Rajyotsava (Nov 2026) - 15%
    christmasSeason: true,     // Christmas Festive Perk (Dec 10-22) - Tiered rule
    sankranthi2027: true,      // Makar Sankranthi / Pongal (Jan 2027) - 15%
    republicDay2027: true,     // Republic Day Special (Jan 2027) - 20%
    ugadi2027: true,           // Ugadi / Regional New Year (March 2027) - 20%
    holiDelights2027: true,    // Holi Delights Offer (March 2027) - 10%
    anniversaryEarly: false,   // Anniversary Early Bird (Orders <= 25)
    anniversaryStandard: true, // Anniversary Standard Perk (Orders > 25, Jul-Aug 2027) - 15%
    independenceDay2027: true, // Independence Day Special (Aug 2027) - 20%
    ganeshChaturthi2027: true, // Ganesh Chaturthi (Sep 2027 window) - 15%
    welcomePerk: true          // Evergreen Welcome Offer (Order #1) - 10%
  };

  const now = new Date();
  const year = now.getFullYear();   // Extracts current year (e.g., 2026 or 2027)
  const month = now.getMonth() + 1; // 1 = Jan, 12 = Dec
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const offersList = [];

  // ==========================================================================
  // HELPER: Check if customer has already claimed a code in the current calendar month
  // ==========================================================================
  const hasClaimedOfferThisMonth = () => {
    if (!customerOrderHistory || !Array.isArray(customerOrderHistory)) return false;
    return customerOrderHistory.some(order => {
      if (!order.date || !order.usedOfferCode) return false;
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === year && (orderDate.getMonth() + 1) === month;
    });
  };

  const alreadyGotMonthlyOffer = hasClaimedOfferThisMonth();

  // ==========================================================================
  // 1. GANESH CHATURTHI (Late August / Early September 2026 & 2027) - 15% (5-7 days window)
  // ==========================================================================
  const isGaneshWindow = (year === 2026 && month === 9 && day <= 10) || 
                         (year === 2027 && ((month === 8 && day >= 25) || (month === 9 && day <= 8)));

  if (ENABLE_OFFERS.ganeshChaturthi2026 && isGaneshWindow && currentOrderNumber <= 20 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'ganesh_chaturthi',
      tag: "FESTIVE",
      title: "Ganesh Chaturthi Celebration",
      description: "Delight in authentic traditional sweets crafted for the festival.",
      code: "BAPPA15",
      discount: "15% OFF",
      condition: "First 20 orders only",
      minOrder: 400,
      themeColor: "#EA580C"
    });
  }

  // ==========================================================================
  // 2. MYSORE DASARA / NAVRATRI SPECIAL (October 2026) - 15%
  // ==========================================================================
  if (ENABLE_OFFERS.dasaraNavratri2026 && year === 2026 && month === 10 && day >= 1 && day <= 15 && currentOrderNumber <= 20 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'dasara_special',
      tag: "REGIONAL",
      title: "Dasara Festivity",
      description: "Celebrating Navratri and Dasara with royal flavors.",
      code: "DASARA15",
      discount: "15% OFF",
      minOrder: 599,
      themeColor: "#9333EA"
    });
  }

  // ==========================================================================
  // 3. DIWALI SEASON OFFER (October 2026) - 10% (Long duration celebration)
  // ==========================================================================
  if (ENABLE_OFFERS.diwaliSeason2026 && year === 2026 && month === 10 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'diwali_season',
      tag: "FESTIVE",
      title: "Festive Month",
      description: "Enjoy festive savings all through October on orders!",
      code: "FEST10",
      discount: "10% OFF",
      minOrder: 0,
      themeColor: "#D97706"
    });
  }

  // ==========================================================================
  // 4. KANNADA RAJYOTSAVA / NAMMA BENGALURU WEEK (November 1-7, 2026) - 15%
  // ==========================================================================
  if (ENABLE_OFFERS.kannadaRajyotsava && year === 2026 && month === 11 && day >= 1 && day <= 7 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'rajyotsava_perk',
      tag: "LOCAL",
      title: "Kannada Rajyotsava",
      description: "Proudly local! Celebrating Namma Bengaluru with exclusive state festival perks.",
      code: "NAMMA15",
      discount: "15% OFF",
      minOrder: 299,
      themeColor: "#CA8A04"
    });
  }

  // ==========================================================================
  // 5. CHRISTMAS FESTIVE PERK (Dec 10-22, 2026 & 2027) - Tiered Rule
  // First 5 orders: 20% (Min ₹999) | Next 10 orders: 15% (Min ₹599) | Next 10 orders: 10% (Min ₹300)
  // Max 1 code per month per customer account / phone number
  // ==========================================================================
  if (ENABLE_OFFERS.christmasSeason && month === 12 && day >= 10 && day <= 22 && !alreadyGotMonthlyOffer) {
    let christmasTier = null;

    if (currentOrderNumber <= 5) {
      christmasTier = { code: "TREATS20", discount: "20% OFF", minOrder: 999, condition: "First 5 orders • Min. order ₹999 • Max 1 per month" };
    } else if (currentOrderNumber <= 15) {
      christmasTier = { code: "TREATS15", discount: "15% OFF", minOrder: 599, condition: "Orders 6–15 • Min. order ₹599 • Max 1 per month" };
    } else if (currentOrderNumber <= 25) {
      christmasTier = { code: "TREATS10", discount: "10% OFF", minOrder: 300, condition: "Orders 16–25 • Min. order ₹300 • Max 1 per month" };
    }

    if (christmasTier) {
      offersList.push({
        id: 'christmas_perk',
        tag: "FESTIVE",
        title: "Christmas Festive Perk",
        description: "Spread the joy with warm seasonal treats and handcrafted holiday boxes.",
        ...christmasTier,
        themeColor: "#15803D"
      });
    }
  }

  // ==========================================================================
  // 6. MAKAR SANKRANTHI / PONGAL (January 12-17, 2027) - 15%
  // ==========================================================================
  if (ENABLE_OFFERS.sankranthi2027 && year === 2027 && month === 1 && day >= 12 && day <= 17 && currentOrderNumber <= 20 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'sankranthi_fest',
      tag: "FESTIVE",
      title: "Sankranthi Harvest Special",
      description: "Celebrate the harvest season with traditional sweets and treats.",
      code: "SANKRANTHI15",
      discount: "15% OFF",
      condition: "First 20 orders only",
      minOrder: 399,
      themeColor: "#CA8A04"
    });
  }

  // ==========================================================================
  // 7. REPUBLIC DAY SPECIAL (January 24-26, 2027) - 20% (Short 3-day window)
  // ==========================================================================
  if (ENABLE_OFFERS.republicDay2027 && year === 2027 && month === 1 && day >= 24 && day <= 26 && currentOrderNumber <= 10 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'republic_day',
      tag: "LIMITED",
      title: "Republic Day Flash Perk",
      description: "Honouring craftsmanship with special patriotic savings.",
      code: "REPUBLIC20",
      discount: "20% OFF",
      condition: "First 10 orders only",
      minOrder: 250,
      themeColor: "#1D4ED8"
    });
  }

  // ==========================================================================
  // 8. UGADI / REGIONAL NEW YEAR (Mid March 2027 Window) - 20% (Short window)
  // ==========================================================================
  if (ENABLE_OFFERS.ugadi2027 && year === 2027 && month === 3 && day >= 15 && day <= 25 && currentOrderNumber <= 5 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'ugadi_special',
      tag: "REGIONAL",
      title: "Ugadi New Beginnings",
      description: "Welcoming the auspicious new year with handcrafted flavours.",
      code: "UGADI20",
      discount: "20% OFF",
      condition: "First 5 orders only",
      minOrder: 350,
      themeColor: "#16A34A"
    });
  }

  // ==========================================================================
  // 9. HOLI DELIGHTS OFFER (March 2027) - 10%
  // ==========================================================================
  if (ENABLE_OFFERS.holiDelights2027 && year === 2027 && month === 3 && currentOrderNumber <= 15 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'holi_delights',
      tag: "HOLI",
      title: "Holi Delights Offer",
      description: "Celebrate with vibrant seasonal treats and refreshing beverages.",
      code: "HOLI10",
      discount: "10% OFF",
      minOrder: 299,
      themeColor: "#DB2777"
    });
  }

  // ==========================================================================
  // 10. ANNIVERSARY SALE (July 27th to August 27th, 2027) - 15%
  // ==========================================================================
  const isAnniversaryWindow2027 = year === 2027 && ((month === 7 && day >= 27) || (month === 8 && day <= 27));

  if (isAnniversaryWindow2027 && currentOrderNumber <= 10 && !alreadyGotMonthlyOffer) {
    if (currentOrderNumber <= 25 && ENABLE_OFFERS.anniversaryEarly) {
      offersList.push({
        id: 'anniv_early',
        tag: "ANNIVERSARY",
        title: "Anniversary Early Bird",
        description: "Exclusive early bird reward! Celebrate with us.",
        code: "ANNI25",
        discount: "25% OFF",
        condition: "First 10 orders only",
        minOrder: 0,
        themeColor: "#8B4513"
      });
    } else if (currentOrderNumber > 0 && ENABLE_OFFERS.anniversaryStandard) {
      offersList.push({
        id: 'anniv_std',
        tag: "ANNIVERSARY",
        title: "Anniversary Standard Perk",
        description: "Enjoy our anniversary reward.",
        code: "ANNI10",
        discount: "10% OFF",
        condition: "First 25 orders only",
        minOrder: 499,
        themeColor: "#D97706"
      });
    }
  }

  // ==========================================================================
  // 11. INDEPENDENCE DAY SPECIAL (August 1-15, 2027, 00:00 AM - 23:59 PM) - 10%
  // ==========================================================================
  const currentTotalMinutes = hour * 60 + minute;
  const startTotalMinutes = 0 * 60 + 0; 
  const endTotalMinutes = 23 * 60 + 59;   

  const isAugDateWindow2027 = year === 2027 && month === 8 && day >= 1 && day <= 15;
  const isWithinTimeWindow = currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;

  if (ENABLE_OFFERS.independenceDay2027 && isAugDateWindow2027 && isWithinTimeWindow && currentOrderNumber <= 20 && !alreadyGotMonthlyOffer) {
    offersList.push({
      id: 'early_aug',
      tag: "LIMITED",
      title: "Independence Day Special",
      description: "Get special discounts this Independence Day.",
      code: "IND20",
      discount: "10% OFF",
      minOrder: 0,
      themeColor: "#1D4ED8"
    });
  }

  // ==========================================================================
  // 12. EVERGREEN DEFAULT STORE OFFER (First Order Only - All Year Round) - 10%
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

  return offersList;
}