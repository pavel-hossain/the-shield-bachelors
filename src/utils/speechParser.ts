import { ExpenseCategory, PaymentMethod, Member } from '../types';
import { suggestExpenseCategory } from './categorySuggester';

export type ParsedVoiceIntentType = 'EXPENSE' | 'MEAL' | 'DEPOSIT' | 'UNKNOWN';

export interface ParsedVoiceResult {
  intent: ParsedVoiceIntentType;
  rawText: string;
  confidence: number;
  
  // Expense payload
  expense?: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    paidByMemberId?: string;
    paidByMemberName?: string;
  };

  // Meal payload
  meal?: {
    memberId?: string;
    memberName: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    totalCount: number;
  };

  // Deposit payload
  deposit?: {
    memberId?: string;
    memberName: string;
    amount: number;
    method: PaymentMethod;
  };

  summary: string;
}

/**
 * Parses natural language spoken input into a Mess Action
 */
export function parseVoiceCommand(text: string, members: Member[]): ParsedVoiceResult {
  if (!text || !text.trim()) {
    return {
      intent: 'UNKNOWN',
      rawText: text,
      confidence: 0,
      summary: 'No speech recognized. Please speak clearly or try again.',
    };
  }

  const rawText = text.trim();
  const lower = rawText.toLowerCase();

  // Extract all numbers in text
  const numbers = rawText.match(/\d+(\.\d+)?/g)?.map(Number) || [];

  // Find matched member from list
  let matchedMember: Member | undefined = undefined;
  for (const m of members) {
    const nameLower = m.name.toLowerCase();
    const firstName = nameLower.split(' ')[0];
    if (lower.includes(nameLower) || (firstName.length >= 3 && lower.includes(firstName))) {
      matchedMember = m;
      break;
    }
  }

  // 1. Detect Deposit Intent
  if (
    lower.includes('deposit') ||
    lower.includes('joma') ||
    lower.includes('jmma') ||
    lower.includes('paid') ||
    lower.includes('bkash') ||
    lower.includes('nagad') ||
    lower.includes('bank') ||
    lower.includes('cash deposit')
  ) {
    const amount = numbers[0] || 1000;
    
    // Detect payment method
    let method: PaymentMethod = 'bKash';
    if (lower.includes('nagad')) method = 'Nagad';
    else if (lower.includes('cash')) method = 'Cash';
    else if (lower.includes('bank')) method = 'Bank Transfer';

    const memberName = matchedMember ? matchedMember.name : (members[0]?.name || 'Member');
    const memberId = matchedMember ? matchedMember.id : (members[0]?.id || 'm1');

    return {
      intent: 'DEPOSIT',
      rawText,
      confidence: matchedMember ? 0.95 : 0.8,
      deposit: {
        memberId,
        memberName,
        amount,
        method,
      },
      summary: `Deposit BDT ${amount.toLocaleString()} for ${memberName} via ${method}`,
    };
  }

  // 2. Detect Meal Intent
  if (
    lower.includes('meal') ||
    lower.includes('meals') ||
    lower.includes('khana') ||
    lower.includes('bhaat') ||
    lower.includes('breakfast') ||
    lower.includes('lunch') ||
    lower.includes('dinner') ||
    lower.includes('sokal') ||
    lower.includes('dupur') ||
    lower.includes('rat')
  ) {
    const memberName = matchedMember ? matchedMember.name : (members[0]?.name || 'Member');
    const memberId = matchedMember ? matchedMember.id : (members[0]?.id || 'm1');

    let b = 0, l = 0, d = 0;

    if (numbers.length >= 3) {
      b = numbers[0];
      l = numbers[1];
      d = numbers[2];
    } else if (numbers.length === 1) {
      // e.g. "2 meals for Rahim" -> split as 1 lunch + 1 dinner or set lunch/dinner
      const count = numbers[0];
      if (lower.includes('breakfast')) b = count;
      else if (lower.includes('lunch')) l = count;
      else if (lower.includes('dinner')) d = count;
      else {
        l = Math.floor(count / 2) || 1;
        d = Math.ceil(count / 2) || 1;
      }
    } else {
      // Default 1 lunch + 1 dinner
      l = 1;
      d = 1;
    }

    const totalCount = b + l + d;

    return {
      intent: 'MEAL',
      rawText,
      confidence: matchedMember ? 0.92 : 0.75,
      meal: {
        memberId,
        memberName,
        breakfast: b,
        lunch: l,
        dinner: d,
        totalCount,
      },
      summary: `Record ${totalCount} meals (${b} B, ${l} L, ${d} D) for ${memberName}`,
    };
  }

  // 3. Detect Expense Intent (Default if numbers or market words present)
  const amount = numbers[0] || 250;
  
  // Clean up title by stripping numbers and keywords
  let title = rawText
    .replace(/\b(add|expense|bazar|market|taka|bdt|cost|bill|tk|for|amount|paid)\b/gi, '')
    .replace(/\d+(\.\d+)?/g, '')
    .trim();

  if (!title) {
    title = 'Market Shopping Expense';
  } else {
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const category = suggestExpenseCategory(rawText) || 'Market Shopping';
  const paidByMemberName = matchedMember ? matchedMember.name : (members[0]?.name || 'Manager');
  const paidByMemberId = matchedMember ? matchedMember.id : (members[0]?.id || 'm1');

  return {
    intent: 'EXPENSE',
    rawText,
    confidence: numbers.length > 0 ? 0.9 : 0.7,
    expense: {
      title,
      amount,
      category,
      paidByMemberId,
      paidByMemberName,
    },
    summary: `Add ${category} Expense: "${title}" - BDT ${amount.toLocaleString()} (Paid by ${paidByMemberName})`,
  };
}

/**
 * Sample voice presets for instant testing
 */
export const VOICE_PRESET_EXAMPLES = [
  'Fish Bazar 450 taka paid by Rahim',
  'Gas cylinder refill 1600 taka',
  'Set 2 meals lunch and dinner for Tanvir',
  'Deposit 2000 taka for Sakib via bKash',
  'Electricity bill 1200 taka',
];
