import {
  ForecastDay,
  LoanSimulationResult,
  Persona,
  ScheduledObligation,
  Transaction,
} from '../types';

/**
 * Format any INR amount into standard Indian comma separation (Lakh / Crore)
 * e.g. 145000 -> "₹1,45,000.00" or without decimals "₹1,45,000"
 */
export function formatINR(amount: number, showDecimals = false): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const fixed = absVal.toFixed(showDecimals ? 2 : 0);
  const [intPart, decPart] = fixed.split('.');

  // Indian numbering regex: last 3 digits, then groups of 2
  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const result = `₹${formattedInt}${showDecimals && decPart ? '.' + decPart : ''}`;
  return isNegative ? `-${result}` : result;
}

/**
 * Convert Rupees to minor-unit Paise (integer)
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert Paise to Rupees (float)
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Deterministically computes current ledger balance from confirmed transactions
 */
export function calculateLedgerBalance(
  transactions: Transaction[],
  initialBalanceRupees: number
): {
  balancePaise: number;
  balanceRupees: number;
  totalIncomePaise: number;
  totalExpensePaise: number;
  confirmedCount: number;
  proposedCount: number;
} {
  let balancePaise = rupeesToPaise(initialBalanceRupees);
  let totalIncomePaise = 0;
  let totalExpensePaise = 0;
  let confirmedCount = 0;
  let proposedCount = 0;

  for (const t of transactions) {
    if (t.confirmationStatus === 'confirmed') {
      confirmedCount++;
      const paise = t.amountPaise || rupeesToPaise(t.amount);
      if (t.type === 'income') {
        balancePaise += paise;
        totalIncomePaise += paise;
      } else {
        balancePaise -= paise;
        totalExpensePaise += paise;
      }
    } else {
      proposedCount++;
    }
  }

  return {
    balancePaise,
    balanceRupees: paiseToRupees(balancePaise),
    totalIncomePaise,
    totalExpensePaise,
    confirmedCount,
    proposedCount,
  };
}

/**
 * Reducing-Balance Loan EMI and True Borrowing Cost Calculator
 * Formula: E = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
 * r = monthly interest rate (annualRatePercent / 1200)
 */
export function calculateLoanEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
  processingFee: number
): LoanSimulationResult {
  const p = Math.max(0, principal);
  const n = Math.max(1, tenureMonths);
  const fee = Math.max(0, processingFee);

  let monthlyEmi = 0;
  let totalRepayment = 0;
  let totalInterest = 0;

  if (annualRatePercent <= 0) {
    monthlyEmi = p / n;
    totalRepayment = p;
    totalInterest = 0;
  } else {
    const r = annualRatePercent / (12 * 100);
    const compound = Math.pow(1 + r, n);
    monthlyEmi = (p * (r * compound)) / (compound - 1);
    totalRepayment = monthlyEmi * n;
    totalInterest = totalRepayment - p;
  }

  const totalBorrowingCost = totalInterest + fee;
  const netDisbursed = Math.max(1, p - fee);
  const effectiveRatePercent = (totalBorrowingCost / netDisbursed) * 100;
  const isPredatory = annualRatePercent >= 30 || fee >= p * 0.05;

  // Fair benchmark loan (12% APR, ₹100 flat fee)
  const fairRate = 12 / (12 * 100);
  const fairCompound = Math.pow(1 + fairRate, n);
  const fairEmi = (p * (fairRate * fairCompound)) / (fairCompound - 1);
  const fairTotalCost = fairEmi * n - p + 100;
  const fairAlternativeDiff = Math.max(0, totalBorrowingCost - fairTotalCost);

  return {
    principal: p,
    annualRatePercent,
    tenureMonths: n,
    processingFee: fee,
    monthlyEmi: Math.round(monthlyEmi * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalBorrowingCost: Math.round(totalBorrowingCost * 100) / 100,
    netDisbursed: Math.round(netDisbursed * 100) / 100,
    effectiveRatePercent: Math.round(effectiveRatePercent * 10) / 10,
    isPredatory,
    fairAlternativeDiff: Math.round(fairAlternativeDiff * 100) / 100,
  };
}

/**
 * Generates 14-day rolling cash-flow trajectory with explicit daily timing:
 * 1. Start balance = previous close
 * 2. Daytime income added
 * 3. End-of-day scheduled obligations debited
 * 4. Close balance = start + income - debits
 */
export function generate14DayForecast(
  persona: Persona,
  currentBalanceRupees: number,
  customObligations: ScheduledObligation[] = [],
  includeShock = true
): ForecastDay[] {
  const days: ForecastDay[] = [];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  let runningBalancePaise = rupeesToPaise(currentBalanceRupees);
  const allObligations = [...persona.obligations, ...customObligations];

  for (let day = 1; day <= 14; day++) {
    const openingBalancePaise = runningBalancePaise;
    const dayOfWeek = daysOfWeek[(day - 1) % 7];
    const isRestDay = persona.restDays.includes(day);

    // Calculate Daytime Income
    let dayIncomeRupees = isRestDay ? 0 : persona.workingDaysWeeklyIncome;
    const notes: string[] = [];

    // Apply shock event if enabled (e.g. Ramesh Day 5 rain & medical emergency)
    let extraExpenseRupees = 0;
    if (includeShock && persona.shockEvent && persona.shockEvent.day === day) {
      dayIncomeRupees = persona.shockEvent.incomeOverride;
      extraExpenseRupees = persona.shockEvent.extraExpense.amount;
      notes.push(persona.shockEvent.description);
    }

    const daytimeIncomePaise = rupeesToPaise(dayIncomeRupees);

    // Match scheduled obligations for this day
    const matchingDebits = allObligations.filter((o) => o.dueDateOffset === day);
    const debitItems = matchingDebits.map((m) => ({
      title: m.title,
      amount: m.amount,
      isMandatory: m.isMandatory,
    }));

    if (extraExpenseRupees > 0 && persona.shockEvent) {
      debitItems.push({
        title: persona.shockEvent.extraExpense.title,
        amount: extraExpenseRupees,
        isMandatory: true,
      });
    }

    let totalScheduledDebitsPaise = 0;
    for (const item of debitItems) {
      totalScheduledDebitsPaise += rupeesToPaise(item.amount);
    }

    // Closing balance
    const closingBalancePaise =
      openingBalancePaise + daytimeIncomePaise - totalScheduledDebitsPaise;
    runningBalancePaise = closingBalancePaise;

    const closingBalance = paiseToRupees(closingBalancePaise);
    const isShortfall = closingBalance < 0;
    const shortfallAmount = isShortfall ? Math.abs(closingBalance) : 0;

    days.push({
      dayNumber: day,
      dateString: `Day ${day} (${dayOfWeek})`,
      dayOfWeek,
      openingBalancePaise,
      daytimeIncomePaise,
      scheduledDebitsPaise: totalScheduledDebitsPaise,
      closingBalancePaise,
      openingBalance: paiseToRupees(openingBalancePaise),
      daytimeIncome: dayIncomeRupees,
      scheduledDebits: paiseToRupees(totalScheduledDebitsPaise),
      closingBalance,
      isShortfall,
      shortfallAmount,
      notes,
      debitItems,
    });
  }

  return days;
}

/**
 * Self-Verifying Mathematical Acceptance Test Runner
 * Validates Test Vectors 1, 2, and 3 from the master plan.
 */
export function runCalculatorAcceptanceTests(): {
  allPassed: boolean;
  results: { testName: string; passed: boolean; details: string }[];
} {
  const results: { testName: string; passed: boolean; details: string }[] = [];

  // --- Test Vector 1: Ledger Balance ---
  const initialBal = 3420;
  const mockTx: Transaction[] = [
    {
      id: 'tx-1',
      type: 'income',
      amount: 1200,
      amountPaise: 120000,
      currency: 'INR',
      category: 'delivery',
      date: '2026-10-14',
      description: 'Delivery earnings',
      entryMethod: 'preset',
      confirmationStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: 250,
      amountPaise: 25000,
      currency: 'INR',
      category: 'fuel',
      date: '2026-10-14',
      description: 'Fuel',
      entryMethod: 'preset',
      confirmationStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-proposed',
      type: 'income',
      amount: 5000,
      amountPaise: 500000,
      currency: 'INR',
      category: 'salary',
      date: '2026-10-14',
      description: 'Proposed voice salary',
      entryMethod: 'voice',
      confirmationStatus: 'proposed',
      createdAt: new Date().toISOString(),
    },
  ];

  const ledgerResult = calculateLedgerBalance(mockTx, initialBal);
  const test1Passed = ledgerResult.balanceRupees === 4370;
  results.push({
    testName: 'Test Vector 1: Deterministic Ledger Balance',
    passed: test1Passed,
    details: `Expected ₹4,370.00, Got ₹${ledgerResult.balanceRupees}. Proposed item ignored.`,
  });

  // --- Test Vector 2: EMI & True Cost Amortization ---
  // Principal: ₹10,000, Rate: 36%, Months: 6, Fee: ₹800
  const emiResult = calculateLoanEmi(10000, 36, 6, 800);
  const expectedEmi = 1845.98; // Rounded from 1845.975
  const expectedTotalCost = 1875.85; // 1075.85 interest + 800 fee
  const test2Passed =
    Math.abs(emiResult.monthlyEmi - expectedEmi) <= 0.05 &&
    Math.abs(emiResult.totalBorrowingCost - expectedTotalCost) <= 0.05 &&
    emiResult.isPredatory === true;

  results.push({
    testName: 'Test Vector 2: Loan EMI & True Borrowing Cost',
    passed: test2Passed,
    details: `Monthly EMI: ₹${emiResult.monthlyEmi} (exp: ~₹${expectedEmi}), Total Cost: ₹${emiResult.totalBorrowingCost} (exp: ~₹${expectedTotalCost}), Predatory flag: ${emiResult.isPredatory}`,
  });

  // --- Test Vector 3: Ramesh 14-Day Forecast with Day 6 Shortfall ---
  const rameshPersona: Persona = {
    id: 'ramesh',
    name: 'Ramesh Kumar',
    role: 'Delivery & Auto Partner',
    location: 'Bangalore, Karnataka',
    tagline: 'Irregular daily gig earnings with fixed two-wheeler EMI',
    bio: 'Drives 8-10 hours daily. Weekly income fluctuates between ₹4,000 and ₹7,000.',
    initialBalance: 3420,
    workingDaysWeeklyIncome: 750,
    restDays: [6, 13], // Sundays
    obligations: [
      {
        id: 'ob-1',
        title: 'Fuel Advance',
        amount: 500,
        amountPaise: 50000,
        dueDateOffset: 2,
        dueDateString: 'Day 2 (Tue)',
        frequency: 'one-time',
        category: 'fuel',
        isMandatory: true,
      },
      {
        id: 'ob-2',
        title: 'Weekly Groceries',
        amount: 1200,
        amountPaise: 120000,
        dueDateOffset: 4,
        dueDateString: 'Day 4 (Thu)',
        frequency: 'weekly',
        category: 'groceries',
        isMandatory: true,
      },
      {
        id: 'ob-3',
        title: 'Two-Wheeler Loan EMI',
        amount: 4200,
        amountPaise: 420000,
        dueDateOffset: 6,
        dueDateString: 'Day 6 (Sat)',
        frequency: 'monthly',
        category: 'emi',
        isMandatory: true,
      },
      {
        id: 'ob-4',
        title: 'Mobile Recharge',
        amount: 350,
        amountPaise: 35000,
        dueDateOffset: 9,
        dueDateString: 'Day 9 (Tue)',
        frequency: 'monthly',
        category: 'utilities',
        isMandatory: true,
      },
      {
        id: 'ob-5',
        title: 'Room Maintenance',
        amount: 800,
        amountPaise: 80000,
        dueDateOffset: 13,
        dueDateString: 'Day 13 (Sat)',
        frequency: 'monthly',
        category: 'rent',
        isMandatory: true,
      },
    ],
    initialTransactions: [],
    shockEvent: {
      day: 5,
      description: 'Heavy Bangalore rains stopped deliveries; unexpected clinic medicine expense.',
      incomeOverride: 0,
      extraExpense: { title: 'Emergency Clinic Visit', amount: 2500, category: 'medical' },
    },
  };

  const forecast = generate14DayForecast(rameshPersona, 3420, [], true);
  const day5Close = forecast[4].closingBalance; // Day 5
  const day6 = forecast[5]; // Day 6
  const day10 = forecast[9]; // Day 10

  const test3Passed =
    day5Close === 2220 &&
    day6.closingBalance === -1980 &&
    day6.isShortfall === true &&
    day10.closingBalance === 670;

  results.push({
    testName: 'Test Vector 3: Ramesh 14-Day Shortfall Trajectory',
    passed: test3Passed,
    details: `Day 5 close: ₹${day5Close} (exp: ₹2,220), Day 6 close: ₹${day6.closingBalance} (exp: -₹1,980, deficit), Day 10 recovery: ₹${day10.closingBalance} (exp: +₹670).`,
  });

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}
