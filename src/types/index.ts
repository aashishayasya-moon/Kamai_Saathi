export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr';

export type TransactionCategory =
  | 'delivery'
  | 'trips'
  | 'salary'
  | 'daily_wages'
  | 'sales'
  | 'fuel'
  | 'groceries'
  | 'food'
  | 'rent'
  | 'emi'
  | 'medical'
  | 'utilities'
  | 'education'
  | 'savings'
  | 'other';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number; // In INR (e.g. 1200)
  amountPaise: number; // In minor units (e.g. 120000 paise) for exact integer math
  currency: 'INR';
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  description: string;
  entryMethod: 'voice' | 'manual' | 'preset';
  confirmationStatus: 'confirmed' | 'proposed';
  createdAt: string;
}

export interface ScheduledObligation {
  id: string;
  title: string;
  amount: number;
  amountPaise: number;
  dueDateOffset: number; // 1 to 14 days from today
  dueDateString: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
  category: TransactionCategory;
  isMandatory: boolean; // true for EMI, rent; false for discretionary savings
}

export interface ForecastDay {
  dayNumber: number; // 1 to 14
  dateString: string;
  dayOfWeek: string;
  openingBalancePaise: number;
  daytimeIncomePaise: number;
  scheduledDebitsPaise: number;
  closingBalancePaise: number;
  openingBalance: number;
  daytimeIncome: number;
  scheduledDebits: number;
  closingBalance: number;
  isShortfall: boolean;
  shortfallAmount: number;
  notes: string[];
  debitItems: { title: string; amount: number; isMandatory: boolean }[];
}

export interface Persona {
  id: 'ramesh' | 'priya' | 'aarav';
  name: string;
  role: string;
  location: string;
  tagline: string;
  bio: string;
  initialBalance: number;
  workingDaysWeeklyIncome: number;
  restDays: number[]; // Day numbers where income is 0 (e.g. [6, 13] for Sundays)
  obligations: ScheduledObligation[];
  initialTransactions: Transaction[];
  shockEvent?: {
    day: number;
    description: string;
    incomeOverride: number;
    extraExpense: { title: string; amount: number; category: TransactionCategory };
  };
}

export interface LoanSimulationResult {
  principal: number;
  annualRatePercent: number;
  tenureMonths: number;
  processingFee: number;
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
  totalBorrowingCost: number;
  netDisbursed: number;
  effectiveRatePercent: number;
  isPredatory: boolean;
  fairAlternativeDiff: number;
}

export interface ScamRedFlag {
  flag: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  evidence: string;
  explanation: string;
}

export interface ScamAssessment {
  riskLevel: 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK';
  riskScore: number; // 0 to 100
  summary: string;
  detectedRedFlags: ScamRedFlag[];
  safeVerificationSteps: string[];
  officialHelplines: { title: string; contact: string; url?: string }[];
  isHeuristicOnly: boolean;
}

export interface GovScheme {
  id: string;
  name: string;
  officialNameHindi: string;
  targetBeneficiaries: string;
  benefitSummary: string;
  maxBenefitAmount: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  lastVerifiedDate: string;
  ruleVersion: string;
  checkQuestions: { id: string; question: string }[];
}

export interface SaathiDetectedTransaction {
  type: 'income' | 'expense';
  amount: number;
  category: TransactionCategory;
  description: string;
  confidence?: number;
  isLogged?: boolean;
}

export interface SaathiMessage {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  timestamp: string;
  assumptions?: string[];
  suggestedActions?: string[];
  detectedTransactions?: SaathiDetectedTransaction[];
}
