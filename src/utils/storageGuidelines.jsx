// src/utils/storageGuidelines.js

export const STORAGE_GUIDELINES = {
  pickle: {
    title: "Storage & Care — Pickles",
    shelfLife: "6 Months",
    instructions: [
      "The pickle will be good for 6 months.",
      "Avoid using a wet spoon, as the moisture can develop fungus.",
      "Maintain the oil levels in the pickle. In case it reduces, heat 2 tablespoons of refined oil and pour it on the top. (Do not close the lid immediately until the oil is cool).",
      "Store in a cool space if not refrigerated.",
      "Always use a fresh and a dry spoon."
    ]
  },
  richPlumCake: {
    title: "Storage & Reheating — Traditional Rich Plum Cake",
    shelfLife: "25–30 Days",
    instructions: [
      "Shelf life: 25–30 days.",
      "Make sure to have the cake covered with cling film or use a vacuum container to store; this will maintain the texture.",
      "Please store in a cool and dry place but do not refrigerate the cake.",
      "Brush the cake with Wine/Orange juice to maintain the moisture.",
      "Heat up the cake in a microwave (30–45 seconds) or OTG (preheat 120°C for 4 minutes) for best results."
    ]
  }
};

/**
 * Helper to match item category/subcategory or name to its guideline key
 */
export const getGuidelineForItem = (item) => {
  if (!item) return null;
  const name = item.name?.toLowerCase() || '';
  const category = item.category?.toLowerCase() || '';

  if (name.includes('pickle') || category.includes('pickle')) {
    return STORAGE_GUIDELINES.pickle;
  }
  if (name.includes('plum cake') || name.includes('rich plum')) {
    return STORAGE_GUIDELINES.richPlumCake;
  }

  return null; // Default if no specific guideline matches
};