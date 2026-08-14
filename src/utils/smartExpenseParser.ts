import { ExpenseCategory, SmartCategoryItem } from '../types';

export interface SmartCategoryRule {
  category: ExpenseCategory;
  subCategory: string;
  keywords: string[];
  tags: string[];
  typicalUnitPrice?: string;
  iconName: string;
}

export const SMART_CATEGORY_RULES: SmartCategoryRule[] = [
  {
    category: 'Market Shopping',
    subCategory: 'Fresh Fish & Seafood',
    keywords: ['fish', 'mach', 'mache', 'machh', 'rui', 'katla', 'hilsha', 'ilish', 'pangash', 'telapia', 'tilapia', 'koi', 'shing', 'magur', 'pabda', 'tengra', 'chingri', 'prawn', 'shrimp', 'rupchanda', 'bata', 'shoal'],
    tags: ['Protein', 'Fresh Market', 'Perishable'],
    typicalUnitPrice: '৳250-800/kg',
    iconName: 'Fish',
  },
  {
    category: 'Market Shopping',
    subCategory: 'Meat & Poultry',
    keywords: ['chicken', 'murgi', 'broiler', 'sonali', 'desi murgi', 'beef', 'gorur', 'goru', 'meat', 'ghost', 'goshto', 'mutton', 'khashi', 'khasir', 'duck', 'hash', 'koliza', 'liver', 'keema', 'mince'],
    tags: ['Protein', 'Daily Meal', 'High Spend'],
    typicalUnitPrice: '৳220-850/kg',
    iconName: 'Beef',
  },
  {
    category: 'Market Shopping',
    subCategory: 'Eggs & Dairy',
    keywords: ['egg', 'dim', 'hater dim', 'farm egg', 'milk', 'dudh', 'cow milk', 'packet milk', 'aarong milk', 'curd', 'doi', 'butter', 'ghee', 'cheese', 'paneer'],
    tags: ['Protein', 'Breakfast', 'Essential'],
    typicalUnitPrice: '৳140-160/dozen',
    iconName: 'Egg',
  },
  {
    category: 'Market Shopping',
    subCategory: 'Staples & Grains',
    keywords: ['rice', 'chal', 'chawal', 'miniket', 'nazirshail', 'chinigura', 'polao chal', 'basmati', 'dal', 'mosur dal', 'mug dal', 'chana dal', 'khesari', 'flour', 'atta', 'maida', 'suji', 'noodle', 'noodles', 'pasta', 'maggi'],
    tags: ['Pantry', 'Bulk Purchase', 'Monthly Staple'],
    typicalUnitPrice: '৳65-120/kg',
    iconName: 'Wheat',
  },
  {
    category: 'Market Shopping',
    subCategory: 'Cooking Oils & Condiments',
    keywords: ['oil', 'tel', 'soyabean', 'mustard oil', 'sorishar tel', 'sunflower oil', 'salt', 'lobon', 'sugar', 'chini', 'vinegar', 'sauce', 'soya sauce', 'ghee', 'dalda'],
    tags: ['Pantry', 'Cooking Essential'],
    typicalUnitPrice: '৳170-220/Litre',
    iconName: 'Droplet',
  },
  {
    category: 'Market Shopping',
    subCategory: 'Spices & Aromatics',
    keywords: ['spices', 'mosla', 'masala', 'onion', 'piaj', 'pyaj', 'garlic', 'roshun', 'ginger', 'ada', 'turmeric', 'holud', 'chili', 'morich', 'shukna morich', 'kacha morich', 'coriander', 'dhonia', 'cumin', 'jira', 'cardamom', 'elachi', 'cinnamon', 'daruchini', 'clove', 'long', 'tejpatta', 'garam masala', 'radhuni'],
    tags: ['Spices', 'Flavor', 'Essential'],
    typicalUnitPrice: '৳60-350/item',
    iconName: 'Flame',
  },
  {
    category: 'Market Shopping',
    subCategory: 'Vegetables & Greens',
    keywords: ['vegetable', 'vegetables', 'sobji', 'shobji', 'potato', 'alu', 'potol', 'tomato', 'tamato', 'eggplant', 'begun', 'brinjal', 'gourd', 'lau', 'pumpkin', 'kumra', 'misti kumra', 'ladies finger', 'dherosh', 'bhindi', 'papaya', 'pepe', 'cabbage', 'badhakopi', 'cauliflower', 'fulkopi', 'spinach', 'palong shak', 'lal shak', 'kochu', 'kachakola', 'borboti', 'beans', 'sim', 'cucumber', 'shosa', 'lemon', 'lebu', 'carrot', 'gajor'],
    tags: ['Veggies', 'Fresh Market', 'Fiber'],
    typicalUnitPrice: '৳30-80/kg',
    iconName: 'Carrot',
  },
  {
    category: 'Gas',
    subCategory: 'LPG Gas Cylinder',
    keywords: ['gas', 'cylinder', 'lpg', 'lp gas', 'omera', 'beximco', 'bashundhara gas', 'jamuna gas', 'gas refill', 'chula', 'stove repair', 'gas pipe'],
    tags: ['Utility', 'Fuel', 'Fixed Shared'],
    typicalUnitPrice: '৳1350-1550/cylinder',
    iconName: 'Flame',
  },
  {
    category: 'Maid / Cook',
    subCategory: 'Cook & Housemaid Salary',
    keywords: ['cook', 'maid', 'bua', 'khala', 'mashi', 'rannar bua', 'cook salary', 'bua salary', 'maid bill', 'bua bonus', 'khala salary', 'dishwasher', 'cleaning lady'],
    tags: ['Service', 'Monthly Fixed', 'Staff'],
    typicalUnitPrice: '৳1200-2500/month',
    iconName: 'Users',
  },
  {
    category: 'Utility',
    subCategory: 'Electricity & Power',
    keywords: ['electric', 'electricity', 'current', 'current bill', 'power', 'desco', 'dpdc', 'reb', 'nesco', 'wzpdcl', 'prepaid meter', 'meter recharge', 'token', 'bijli'],
    tags: ['Utility', 'Power', 'Monthly'],
    typicalUnitPrice: 'Monthly Variable',
    iconName: 'Zap',
  },
  {
    category: 'Utility',
    subCategory: 'Water & Waste Management',
    keywords: ['water', 'pani', 'wasa', 'water bill', 'jar water', 'mum water', 'water filter', 'waste', 'garbage', 'dustbin bill', 'moila bill', 'sweeper', 'cleaner bill'],
    tags: ['Utility', 'Sanitation'],
    typicalUnitPrice: '৳50-500',
    iconName: 'Trash',
  },
  {
    category: 'Internet',
    subCategory: 'Broadband Wi-Fi Bill',
    keywords: ['internet', 'wifi', 'wi-fi', 'broadband', 'optical fiber', 'net bill', 'link3', 'carnival', 'amberit', 'isp', 'router', 'cat6 cable'],
    tags: ['Utility', 'Connectivity', 'Monthly Fixed'],
    typicalUnitPrice: '৳500-1200/month',
    iconName: 'Wifi',
  },
  {
    category: 'Rent',
    subCategory: 'Mess Apartment Rent',
    keywords: ['rent', 'house rent', 'basha bhara', 'flat rent', 'room rent', 'advance rent', 'landlord', 'service charge', 'security guard'],
    tags: ['Housing', 'Fixed Monthly', 'Large Expense'],
    typicalUnitPrice: '৳8000-25000/month',
    iconName: 'Home',
  },
  {
    category: 'Miscellaneous',
    subCategory: 'Cleaning & Mess Maintenance',
    keywords: ['harpic', 'vim', 'vim bar', 'dish soap', 'wheel powder', 'detergent', 'surf excel', 'handwash', 'tissue', 'savlon', 'dettol', 'mop', 'jhadu', 'broom', 'bulb', 'led light', 'tubelight', 'switch', 'socket', 'lock', 'tala', 'balti', 'bucket', 'mug', 'hardware', 'repair', 'plumber', 'filter candle'],
    tags: ['Hygiene', 'Maintenance', 'Supplies'],
    typicalUnitPrice: '৳20-350',
    iconName: 'Wrench',
  },
];

/**
 * Parses raw text containing one or multiple bazar/expense items (e.g. "Rice 25kg 1650, Murgi 3kg 680, Piaj 2kg 130")
 */
export function parseSmartExpenseText(rawInput: string): SmartCategoryItem[] {
  if (!rawInput || !rawInput.trim()) return [];

  // Split by newlines, commas, pluses, or semicolons
  const lines = rawInput
    .split(/[\n,;+]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results: SmartCategoryItem[] = [];

  lines.forEach((line, idx) => {
    // Extract price if present at the end or middle
    // Matches e.g. "500", "500tk", "৳500", "500/-", "= 500"
    const priceMatch = line.match(/(?:৳|tk|taka|=|\s)?\s*(\d+(?:\.\d{1,2})?)\s*(?:tk|taka|\/-|\/=|t)?(?:\s|$)/i);
    let estimatedPrice = 0;
    let textWithoutPrice = line;

    if (priceMatch) {
      // Find the last number which is typically the total price
      const allNumbers = [...line.matchAll(/(\d+(?:\.\d{1,2})?)/g)];
      if (allNumbers.length > 0) {
        const lastNum = allNumbers[allNumbers.length - 1][1];
        estimatedPrice = parseFloat(lastNum);
        textWithoutPrice = line.replace(new RegExp(`${lastNum}\\s*(?:tk|taka|\\/-|\\/=)?`, 'i'), '').trim();
      }
    }

    // Extract quantity if present (e.g. "2kg", "500gm", "1 dozen", "5 liter", "3 pcs")
    const qtyMatch = textWithoutPrice.match(/(\d+(?:\.\d{1,2})?\s*(?:kg|kilo|gm|gram|l|liter|litre|pcs|piece|pc|dozen|hali|packet|pkt|tin|cylinder|ta|ti))\b/i);
    const quantity = qtyMatch ? qtyMatch[1] : undefined;

    let itemName = textWithoutPrice;
    if (qtyMatch) {
      itemName = itemName.replace(qtyMatch[0], '').trim();
    }
    // Clean up punctuation
    itemName = itemName.replace(/^[-–—:=•*#\s]+|[-–—:=•*#\s]+$/g, '').trim();
    if (!itemName) itemName = line.trim();

    // Match best rule
    let matchedRule: SmartCategoryRule | null = null;
    let maxScore = 0;
    const lowerLine = line.toLowerCase();

    for (const rule of SMART_CATEGORY_RULES) {
      for (const kw of rule.keywords) {
        if (lowerLine.includes(kw)) {
          const score = kw.length; // longer keyword = higher specificity
          if (score > maxScore) {
            maxScore = score;
            matchedRule = rule;
          }
        }
      }
    }

    const defaultRule: SmartCategoryRule = {
      category: 'Market Shopping',
      subCategory: 'General Market Shopping',
      keywords: [],
      tags: ['Daily Market'],
      iconName: 'ShoppingBag',
    };

    const finalRule = matchedRule || defaultRule;
    const confidence = matchedRule ? (maxScore >= 5 ? 0.95 : 0.8) : 0.5;

    results.push({
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      rawText: line,
      item: itemName || line,
      quantity,
      estimatedPrice,
      category: finalRule.category,
      subCategory: finalRule.subCategory,
      confidence,
      tags: finalRule.tags,
    });
  });

  return results;
}

/**
 * Analyzes an expense list and produces smart suggestions for cost-cutting and budget balancing
 */
export function generateSmartExpenseInsights(
  categoryTotals: Record<string, number>,
  totalSpend: number,
  targetBudget: number
) {
  const insights: { type: 'tip' | 'warning' | 'positive'; message: string; subText?: string }[] = [];

  const marketSpend = categoryTotals['Market Shopping'] || 0;
  const utilitySpend = totalSpend - marketSpend;

  if (totalSpend > 0) {
    const marketPct = Math.round((marketSpend / totalSpend) * 100);
    if (marketPct > 75) {
      insights.push({
        type: 'warning',
        message: `Market food shopping consumes ${marketPct}% of total expenditure.`,
        subText: 'Consider buying staples (Rice, Oil, Onion, Dal) in wholesale 25kg/5L sacks from wholesale mokam to save up to 15-20%.',
      });
    }
  }

  if (categoryTotals['Gas'] && categoryTotals['Gas'] > 2800) {
    insights.push({
      type: 'tip',
      message: 'High LPG Gas Cylinder turnover detected.',
      subText: 'Remind cook khala to use pressure cookers for beef/dal and turn off burner pilots promptly.',
    });
  }

  if (categoryTotals['Utility'] && categoryTotals['Utility'] > 3500) {
    insights.push({
      type: 'tip',
      message: 'Electricity consumption peak detected.',
      subText: 'Ensure cooling fans and water pumps are switched off during peak daytime hours (11 AM - 5 PM).',
    });
  }

  if (targetBudget > 0 && totalSpend > 0) {
    const budgetPct = (totalSpend / targetBudget) * 100;
    if (budgetPct < 60) {
      insights.push({
        type: 'positive',
        message: 'Excellent budget discipline maintained this month!',
        subText: `You are operating within ${Math.round(budgetPct)}% of the target budget ceiling.`,
      });
    }
  }

  return insights;
}
