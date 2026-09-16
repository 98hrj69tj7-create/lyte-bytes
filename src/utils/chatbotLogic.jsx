// Comprehensive Menu & Business Database for Chef Lyte Concierge
const MENU_ITEMS_DB = [
  // --- 1. MEALS & BIRYANIS ---
  { 
    keywords: ['veg meal', 'non-veg meal', 'lunch', 'combo', 'pack', 'thali'], 
    answer: "Our lunch combos include Roti, Rice, Dal, Subzi/Curry (Veg: ₹150 | Non-Veg: ₹170), and a side. They are freshly crafted daily in small batches!" 
  },

  { 
    keywords: ['bulk catering', 'corporate event', 'party order', 'large gathering', 'customization'], 
    answer: "Yes, we curate bespoke menus for bulk catering and private gatherings with full customization options! Please note that final prices may vary depending on seasonal ingredient and fresh item availability." 
  },
  { 
    keywords: ['event menu', 'tailor', 'party curation', 'gathering'], 
    answer: "We offer tailored menu curation for private and corporate events. Since everything is crafted fresh, pricing and item availability can be discussed and adjusted directly with Team Lyte Bytes." 
  },
  { 
    keywords: ['biryani', 'white biryani', 'egg biryani', 'chicken biryani'], 
    answer: "We serve Royal White Egg Biryani (₹210) and Royal White Chicken Biryani (₹270). Both are crafted with aromatic spices and are local best-sellers!" 
  },

  // --- 2. SANDWICHES, POCKETS & FINGER FOODS ---
  { 
    keywords: ['sandwich', 'mini sandwich', 'regular sandwich', 'paneer tikka', 'bombay masala', 'coleslaw'], 
    answer: "We offer a wide range of Mini (₹85-₹130) and Regular (₹115-₹170) sandwiches including Paneer Tikka, Bombay Masala, Chicken Tikka, and Egg & Mayo." 
  },
  { 
    keywords: ['pocket', 'crispy pocket', 'veg pocket', 'chicken pocket', 'fish pocket', 'beet'], 
    answer: "Crispy Pockets are available in Mix Veg (₹100), Egg (₹120), Chicken (₹150), Fish (₹220), and Beet (₹170)." 
  },
  { 
    keywords: ['falafel', 'veg falafel', 'chicken falafel'], 
    answer: "We offer Veg Falafel (₹100) and Chicken Falafel (₹150), both packed with wholesome ingredients and high protein." 
  },
  { 
    keywords: ['cutlet', 'veg cutlet', 'chicken cutlet', 'fish cutlet'], 
    answer: "Our handcrafted cutlets include Mix Veg (₹110), Chicken (₹140), and Fish (₹170)." 
  },

  // --- 3. BAKERY, CAKES & COOKIES ---
  { 
    keywords: ['cake', 'plum cake', 'birthday cake', 'wedding cake', 'banana cake', 'christmas', 'baking'], 
    answer: "We bake Traditional Rich Plum Cakes (₹500-₹1000), custom Birthday/Wedding Cakes (₹950/kg), and moist Banana Cake Loaves (₹900)." 
  },
  { 
    keywords: ['cookie', 'shortbread', 'oat meal', 'florentine', 'kulkul', 'rose cookies', 'snack'], 
    answer: "Our bakery treats feature Highland Shortbreads (from ₹250), Oat Meal Cookies, Almond Florentines, festive Kulkuls, and Rose Cookies." 
  },

  // --- 4. ACHARS, JAMS & SPREADS ---
  { 
    keywords: ['achar', 'pickle', 'mutton achar', 'chicken achar', 'prawn achar', 'fish achar', 'garlic achar', 'tomato thokku'], 
    answer: "Ammi's Achars are handcrafted in small batches! We have Mutton, Chicken, Prawn, Fish, Garlic, and Tomato Thokku starting at ₹110 (100gms)." 
  },
  { 
    keywords: ['jam', 'spread', 'mango jam', 'strawberry jam', 'guava jam', 'chutney', 'preserves'], 
    answer: "We offer artisanal Jams & Spreads like Mango, Strawberry, and Guava Jams, plus Ripe Mango & Strawberry Chutneys (₹110–₹375)." 
  },
  { 
    keywords: ['wine', 'grape wine', 'non-alcoholic', 'beverage'], 
    answer: "Our Non-Alcoholic Red Grape Wine is festive, refreshing, and great for party packs at ₹950 (750ml)." 
  },

  // --- 5. SUBSCRIPTIONS & MEAL PASSES ---
  { 
    keywords: ['subscription', 'pass', 'executive meal pass', 'pause', 'skip', 'plan', 'weekly', 'monthly'], 
    answer: "We offer flexible weekly and monthly meal subscription passes. You can easily pause or skip days by giving Team Lyte Bytes a day's notice via WhatsApp." 
  },
  { 
    keywords: ['subscription cost', 'meal pass price', 'discount', 'monthly package'], 
    answer: "Our subscription passes are designed to offer the best value for regular meals, giving you handcrafted freshness at preferential package rates. Check the 'Plans' tab for active pass pricing!" 
  },
  { 
    keywords: ['subscription menu', 'same food', 'daily change', 'weekly schedule'], 
    answer: "Subscription meals follow a rotating, wholesome daily menu featuring balanced combinations so you never get bored of your daily lunch or dinner." 
  },
  { 
    keywords: ['transfer subscription', 'give to someone', 'friend'], 
    answer: "Subscription passes are tied to your customer profile, but if you're pausing or gifting days, let Team Lyte Bytes know on WhatsApp and we'll gladly assist!" 
  },
  { 
    keywords: ['refund subscription', 'cancel pass', 'money back'], 
    answer: "Subscription passes are non-refundable once activated, but if you face any relocation or schedule issues, reach out to Team Lyte Bytes and we'll find a flexible solution for you." 
  },

  // --- 6. NUTRITION, ALLERGENS & COMPLIANCE ---
  { 
    keywords: ['calorie', 'macro', 'protein', 'carb', 'fat', 'nutrition', 'healthy', 'diet'], 
    answer: "Calories and macros (protein, carbs, fats) are listed directly on every item card. Just tap any item image in the menu to open its detailed nutritional breakdown!" 
  },
  { 
    keywords: ['halal', 'fssai', 'hygiene', 'certified', 'pure'], 
    answer: "Lyte Bytes is 100% Halal Compliant and FSSAI registered (FSSAI No: 2122500802806). Every meal is freshly crafted with strict hygiene standards." 
  },
  { 
    keywords: ['allergy', 'nuts', 'dairy', 'gluten', 'preservative'], 
    answer: "Our products are made in small batches with real ingredients. If you have severe nut, dairy, or gluten allergies, please chat with Team Lyte Bytes directly to check specific items." 
  },

  // --- 7. DELIVERY, LOGISTICS & PAYMENT ---
  { 
    keywords: ['delivery', 'time', 'bengaluru', 'bangalore', 'hours', 'timing', 'schedule', 'open', 'monday'], 
    answer: "We deliver across selected areas in Bengaluru. Standard lunch orders are delivered between 12:00 PM and 12:45 PM. (Note: We rest and recharge on Mondays!)" 
  },
  { 
    keywords: ['payment', 'upi', 'gpay', 'phonepe', 'paytm', 'cash', 'cod'], 
    answer: "We accept secure digital payments via UPI, Google Pay, PhonePe, and Paytm directly at checkout for a seamless experience." 
  },
  { 
    keywords: ['bulk', 'corporate', 'gifting', 'party', 'catering', 'hamper'], 
    answer: "We curate bespoke festive bundles, corporate hampers, and bulk catering boxes for special events and private parties. Reach out via WhatsApp to customize yours!" 
  }
];

export function getBotResponse(userInput) {
  if (!userInput) return null;
  const query = userInput.toLowerCase().trim();
  
  // --- SENSITIVE ITEM INTERCEPTOR ---
  // Automatically routes sensitive meat queries to WhatsApp
  if (query.includes('beef') || query.includes('pork')) {
    return null; 
  }

  const tokens = query.split(/\s+/);
  
  let bestMatch = null;
  let highestScore = 0;

  for (const item of MENU_ITEMS_DB) {
    let score = 0;
    
    for (const kw of item.keywords) {
      if (query.includes(kw)) {
        score += kw.split(' ').length * 2;
      }
    }
    
    for (const token of tokens) {
      if (token.length > 2 && item.keywords.some(kw => kw.includes(token))) {
        score += 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item.answer;
    }
  }

  // Confidence threshold check: if score is too low, return null to trigger WhatsApp fallback
  if (highestScore < 2) {
    return null; 
  }

  return bestMatch;
}