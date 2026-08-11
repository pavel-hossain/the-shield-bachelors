import { ExpenseCategory } from '../types';

interface KeywordRule {
  keywords: string[];
  category: ExpenseCategory;
}

const CATEGORY_RULES: KeywordRule[] = [
  {
    category: 'Market Shopping',
    keywords: [
      'bazar', 'bazaar', 'market', 'food', 'grocery', 'groceries', 'fish', 'mach', 'mache',
      'chicken', 'murgi', 'beef', 'meat', 'ghost', 'goshto', 'mutton', 'khasir',
      'rice', 'chawal', 'chal', 'dal', 'oil', 'tel', 'sobji', 'shobji', 'vegetable', 'vegetables',
      'egg', 'dim', 'spices', 'mosla', 'masala', 'potato', 'alu', 'onion', 'piaj', 'pyaj',
      'milk', 'dudh', 'dhoi', 'curd', 'fruit', 'phol', 'bread', 'ruti', 'atta', 'maida',
      'kacha bazar', 'bazar expense', 'daily bazar', 'bazer'
    ],
  },
  {
    category: 'Gas',
    keywords: [
      'gas', 'cylinder', 'lpg', 'lp gas', 'stove', 'gas bill', 'cylinder refill', 'chula'
    ],
  },
  {
    category: 'Internet',
    keywords: [
      'internet', 'wifi', 'wi-fi', 'broadband', 'net', 'net bill', 'router', 'fiber'
    ],
  },
  {
    category: 'Maid / Cook',
    keywords: [
      'maid', 'cook', 'bua', 'khala', 'bua salary', 'cook salary', 'maid salary', 'mashi',
      'cooking', 'bua bill'
    ],
  },
  {
    category: 'Utility',
    keywords: [
      'utility', 'electric', 'electricity', 'bijli', 'power', 'current', 'current bill',
      'water', 'pani', 'waso', 'wasa', 'water bill', 'waste', 'dustbin', 'garbage',
      'sweeper', 'cleaner', 'service charge', 'lift'
    ],
  },
  {
    category: 'Rent',
    keywords: [
      'rent', 'house rent', 'basha bhara', 'bhara', 'room rent', 'flat rent', 'advance rent'
    ],
  },
  {
    category: 'Miscellaneous',
    keywords: [
      'repair', 'filter', 'bulb', 'light', 'lock', 'cleaning', 'harpic', 'tissue',
      'soap', 'sabun', 'bucket', 'balti', 'hardware', 'maintanance', 'maintenance'
    ],
  },
];

/**
 * Suggests an ExpenseCategory based on keywords in the description/title.
 * Returns null if no keyword match is found.
 */
export function suggestExpenseCategory(title: string): ExpenseCategory | null {
  if (!title || !title.trim()) return null;

  const normalized = title.toLowerCase().trim();

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      // Word boundary regex for accurate keyword matching
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalized) || normalized.includes(kw)) {
        return rule.category;
      }
    }
  }

  return null;
}

/**
 * Common example keywords for UI hints
 */
export const CATEGORY_KEYWORD_EXAMPLES = [
  { label: 'Bazar / Fish', kw: 'Bazar', cat: 'Market Shopping' as ExpenseCategory },
  { label: 'Electricity / Power', kw: 'Electricity', cat: 'Utility' as ExpenseCategory },
  { label: 'Bua / Cook Salary', kw: 'Cook', cat: 'Maid / Cook' as ExpenseCategory },
  { label: 'Gas Cylinder', kw: 'Gas', cat: 'Gas' as ExpenseCategory },
  { label: 'WiFi / Net', kw: 'Internet', cat: 'Internet' as ExpenseCategory },
  { label: 'House Rent', kw: 'Rent', cat: 'Rent' as ExpenseCategory },
];
