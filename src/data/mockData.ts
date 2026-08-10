import { Member, DailyMealRecord, Expense, Deposit, MonthPeriod } from '../types';

export const INITIAL_PERIODS: MonthPeriod[] = [
  { year: 2026, month: 8, label: 'August 2026', targetBudget: 28000 },
  { year: 2026, month: 7, label: 'July 2026', targetBudget: 26500 },
  { year: 2026, month: 6, label: 'June 2026', targetBudget: 25000 },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Aktar Hossain',
    phone: '01712345678',
    roomNo: '101',
    role: 'Manager',
    status: 'Active',
    avatarColor: 'bg-emerald-600 text-white',
    guardianName: 'Md. Delwar Hossain',
    guardianRelation: 'Father',
    guardianPhone: '01711002233',
    joiningDate: '2025-01-15',
  },
  {
    id: 'm2',
    name: 'Kamrul Islam',
    phone: '01898765432',
    roomNo: '101',
    role: 'Auditor',
    status: 'Active',
    avatarColor: 'bg-indigo-600 text-white',
    guardianName: 'Nasreen Begum',
    guardianRelation: 'Mother',
    guardianPhone: '01822334455',
    joiningDate: '2025-02-01',
  },
  {
    id: 'm3',
    name: 'Sumon Ahmed',
    phone: '01911223344',
    roomNo: '102',
    role: 'Member',
    status: 'Active',
    avatarColor: 'bg-amber-600 text-white',
    guardianName: 'Rafiqul Islam',
    guardianRelation: 'Father',
    guardianPhone: '01933445566',
    joiningDate: '2025-03-10',
  },
  {
    id: 'm4',
    name: 'Rakib Hasan',
    phone: '01655667788',
    roomNo: '102',
    role: 'Member',
    status: 'Active',
    avatarColor: 'bg-rose-600 text-white',
    guardianName: 'Anowar Hossain',
    guardianRelation: 'Elder Brother',
    guardianPhone: '01644556677',
    joiningDate: '2025-04-01',
  },
  {
    id: 'm5',
    name: 'Farhan Chowdhury',
    phone: '01799001122',
    roomNo: '103',
    role: 'Member',
    status: 'Active',
    avatarColor: 'bg-cyan-600 text-white',
    guardianName: 'Mostafa Chowdhury',
    guardianRelation: 'Father',
    guardianPhone: '01755667788',
    joiningDate: '2025-05-20',
  },
  {
    id: 'm6',
    name: 'Tanvir Rahman',
    phone: '01833445566',
    roomNo: '103',
    role: 'Member',
    status: 'Active',
    avatarColor: 'bg-violet-600 text-white',
    guardianName: 'Motiur Rahman',
    guardianRelation: 'Father',
    guardianPhone: '01866778899',
    joiningDate: '2025-06-01',
  },
  {
    id: 'm7',
    name: 'Ripon Sheikh',
    phone: '01977889900',
    roomNo: '104',
    role: 'Member',
    status: 'Active',
    avatarColor: 'bg-teal-600 text-white',
    guardianName: 'Sultan Sheikh',
    guardianRelation: 'Uncle / Guardian',
    guardianPhone: '01977889911',
    joiningDate: '2025-07-12',
  },
  {
    id: 'm8',
    name: 'Shakil Mahmud',
    phone: '01511223344',
    roomNo: '104',
    role: 'Member',
    status: 'Inactive',
    avatarColor: 'bg-slate-500 text-white',
    guardianName: 'Abul Kalam',
    guardianRelation: 'Father',
    guardianPhone: '01588990011',
    joiningDate: '2025-08-01',
  },
];

// Generate meal records for August 1 to August 9, 2026
export const INITIAL_MEALS: DailyMealRecord[] = [];

const memberIds = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];

// Seed realistic meals for August 1 to August 9
for (let day = 1; day <= 9; day++) {
  const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;
  memberIds.forEach((mId, idx) => {
    // Generate slight variations
    let breakfast = 0.5;
    let lunch = 1;
    let dinner = 1;

    if ((day + idx) % 5 === 0) {
      lunch = 0; // skipped lunch
    }
    if ((day + idx) % 7 === 0) {
      breakfast = 0;
      dinner = 0; // guest / out
    }
    if ((day + idx) % 3 === 0) {
      lunch = 2; // guest meal
    }

    INITIAL_MEALS.push({
      id: `meal-${dateStr}-${mId}`,
      date: dateStr,
      memberId: mId,
      breakfast,
      lunch,
      dinner,
    });
  });
}

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-08-01',
    title: 'Fish, Rice & Fresh Vegetables Market',
    category: 'Market Shopping',
    amount: 1850,
    paidByMemberId: 'm1',
    notes: 'Bought Ruhi fish 2.5kg, Minikit Rice 10kg, Pulses and Vegetables at Magura Sadar Market.',
  },
  {
    id: 'exp-2',
    date: '2026-08-02',
    title: 'Poultry Chicken & Spices',
    category: 'Market Shopping',
    amount: 1420,
    paidByMemberId: 'm3',
    notes: 'Broiler chicken 3kg, Oil 2L, Spices and Ginger.',
  },
  {
    id: 'exp-3',
    date: '2026-08-03',
    title: 'Cook & Maid Monthly Advance',
    category: 'Maid / Cook',
    amount: 3500,
    paidByMemberId: 'm1',
    notes: 'Paid monthly maid allowance for August 2026.',
  },
  {
    id: 'exp-4',
    date: '2026-08-04',
    title: 'Beef & Mustard Oil Market',
    category: 'Market Shopping',
    amount: 2200,
    paidByMemberId: 'm2',
    notes: 'Fresh Beef 2kg and Pure Mustard Oil.',
  },
  {
    id: 'exp-5',
    date: '2026-08-05',
    title: 'High-Speed WiFi Internet Bill',
    category: 'Internet',
    amount: 800,
    paidByMemberId: 'm1',
    notes: 'Police Line Fiber Net monthly charge.',
  },
  {
    id: 'exp-6',
    date: '2026-08-06',
    title: 'Egg, Vegetables & Onions',
    category: 'Market Shopping',
    amount: 980,
    paidByMemberId: 'm4',
    notes: 'Farm egg 2 crates, Onion 3kg, Potatoes 5kg.',
  },
  {
    id: 'exp-7',
    date: '2026-08-07',
    title: 'LP Gas Cylinder Refill',
    category: 'Gas',
    amount: 1450,
    paidByMemberId: 'm5',
    notes: '12.5kg Gas Cylinder refill from Magura bus stand.',
  },
  {
    id: 'exp-8',
    date: '2026-08-08',
    title: 'Hilsa Fish & Spices Market',
    category: 'Market Shopping',
    amount: 2150,
    paidByMemberId: 'm6',
    notes: '2 Hilsa fishes, Turmeric, Garlic and Garlic paste.',
  },
  {
    id: 'exp-9',
    date: '2026-08-09',
    title: 'Prepaid Electricity Bill Recharge',
    category: 'Utility',
    amount: 1200,
    paidByMemberId: 'm1',
    notes: 'DESCO/NESCO prepaid meter recharge for Police Line Mess.',
  },
];

export const INITIAL_DEPOSITS: Deposit[] = [
  {
    id: 'dep-1',
    date: '2026-08-01',
    memberId: 'm1',
    amount: 4000,
    method: 'Cash',
    transactionId: 'CASH-001',
    notes: 'Manager initial advance deposit',
  },
  {
    id: 'dep-2',
    date: '2026-08-01',
    memberId: 'm2',
    amount: 3500,
    method: 'bKash',
    transactionId: 'BK89320194',
    notes: 'bKash Personal Send Money',
  },
  {
    id: 'dep-3',
    date: '2026-08-02',
    memberId: 'm3',
    amount: 3000,
    method: 'Nagad',
    transactionId: 'NG77123901',
    notes: 'Nagad Cash In',
  },
  {
    id: 'dep-4',
    date: '2026-08-02',
    memberId: 'm4',
    amount: 2500,
    method: 'bKash',
    transactionId: 'BK90112833',
    notes: 'Partial deposit',
  },
  {
    id: 'dep-5',
    date: '2026-08-03',
    memberId: 'm5',
    amount: 3500,
    method: 'Cash',
    transactionId: 'CASH-002',
    notes: 'Hand cash given to Manager',
  },
  {
    id: 'dep-6',
    date: '2026-08-04',
    memberId: 'm6',
    amount: 3000,
    method: 'bKash',
    transactionId: 'BK11029384',
    notes: 'bKash deposit',
  },
  {
    id: 'dep-7',
    date: '2026-08-05',
    memberId: 'm7',
    amount: 1500,
    method: 'Nagad',
    transactionId: 'NG44920192',
    notes: 'Partial 1st installment',
  },
  {
    id: 'dep-8',
    date: '2026-08-08',
    memberId: 'm4',
    amount: 1000,
    method: 'Cash',
    transactionId: 'CASH-003',
    notes: '2nd installment cash deposit',
  },
];
