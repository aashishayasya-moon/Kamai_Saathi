import { ScamAssessment, ScamRedFlag } from '../types';

export interface SampleScamScenario {
  id: string;
  title: string;
  source: 'WhatsApp' | 'SMS' | 'Telegram';
  category: string;
  messageText: string;
  simulatedRiskLevel: 'HIGH_RISK' | 'CAUTION';
}

export const sampleScamScenarios: SampleScamScenario[] = [
  {
    id: 'scam-1',
    title: 'Fake Instant Loan App (Advance Fee + APK)',
    source: 'WhatsApp',
    category: 'Predatory Instant Credit',
    messageText:
      'Congratulations! Your loan of ₹1,00,000 has been APPROVED under PM Mudra Scheme without CIBIL. Transfer ₹999 as processing file verification fee to GPay 9876543210@upi to disburse immediately. Click to install app: http://bit.ly/pm-fast-loan.apk. Offer expires in 20 mins!',
    simulatedRiskLevel: 'HIGH_RISK',
  },
  {
    id: 'scam-2',
    title: 'UPI "Receive Money" PIN Trap',
    source: 'SMS',
    category: 'UPI Refund Fraud',
    messageText:
      'Dear Customer, refund of ₹4,250 for your canceled order is ready. Open your PhonePe/GPay app, approve collect request from refund-dept@icici, and enter your UPI PIN to claim money in bank account now.',
    simulatedRiskLevel: 'HIGH_RISK',
  },
  {
    id: 'scam-3',
    title: 'Work-from-Home YouTube Like Scam',
    source: 'Telegram',
    category: 'Part-Time Task Scam',
    messageText:
      'Part-time daily earning opportunity! Earn ₹2,500 - ₹5,000 daily by simply subscribing to YouTube videos and Google reviews. Send ₹1,000 security deposit for VIP Task Group to start daily payout.',
    simulatedRiskLevel: 'HIGH_RISK',
  },
  {
    id: 'scam-4',
    title: 'Electricity Power Disconnection Threat',
    source: 'SMS',
    category: 'Utility Urgent Threat',
    messageText:
      'URGENT: Your electricity connection will be disconnected tonight at 9:30 PM because your previous bill was not updated. Contact our billing officer immediately on 9123456789 or download Mahavitaran-update.apk.',
    simulatedRiskLevel: 'HIGH_RISK',
  },
];

/**
 * Client-Side Offline Heuristic Risk Evaluator
 * Runs entirely in the browser when offline or when Local-Only mode is enabled.
 */
export function evaluateScamHeuristics(messageText: string): ScamAssessment {
  const flags: ScamRedFlag[] = [];
  const lower = messageText.toLowerCase();

  let riskScore = 15; // Baseline low risk for generic scanned message

  // 1. Advance Fee / Processing Fee demands
  const feePattern =
    /(pay|transfer|deposit|send)\s*(₹|rs\.?|inr)?\s*(\d+).*?(fee|charge|verification|advance|activation|file)/i;
  if (feePattern.test(messageText) || lower.includes('processing fee') || lower.includes('file fee')) {
    flags.push({
      flag: 'Advance Fee Demand Before Disbursement',
      severity: 'CRITICAL',
      evidence: messageText.match(feePattern)?.[0] || 'Requests upfront fee',
      explanation:
        'Legitimate lenders NEVER ask borrowers to transfer advance money via UPI/GPay to release a loan. Processing fees are deducted from the principal upon disbursement.',
    });
    riskScore += 35;
  }

  // 2. APK file download links
  const apkPattern = /(\.apk|bit\.ly|tinyurl\.com|t\.me|drive\.google\.com|download-app)/i;
  if (apkPattern.test(messageText)) {
    flags.push({
      flag: 'Unverified APK / Sideload App Link',
      severity: 'CRITICAL',
      evidence: messageText.match(apkPattern)?.[0] || 'APK/Shortened URL detected',
      explanation:
        'Sideloaded APK apps bypass Google Play Store security checks. Predatory loan apps frequently steal contact lists and photos to blackmail borrowers.',
    });
    riskScore += 35;
  }

  // 3. UPI PIN to "receive" money trap
  if (
    (lower.includes('upi pin') || lower.includes('enter pin')) &&
    (lower.includes('receive') || lower.includes('claim') || lower.includes('refund') || lower.includes('collect request'))
  ) {
    flags.push({
      flag: 'UPI PIN Reversal Deception',
      severity: 'CRITICAL',
      evidence: 'Mentions entering UPI PIN to receive or claim refund',
      explanation:
        'GOLDEN RULE: You NEVER need to enter your UPI PIN to receive money or get a refund. Entering your PIN ALWAYS debits money from your account.',
    });
    riskScore += 40;
  }

  // 4. Artificial Urgency / Pressure tactics
  const urgencyPattern = /(expires in|within \d+ mins|immediately|urgent|tonight at|account blocked|disconnected tonight)/i;
  if (urgencyPattern.test(messageText)) {
    flags.push({
      flag: 'High-Pressure Urgency Tactics',
      severity: 'WARNING',
      evidence: messageText.match(urgencyPattern)?.[0] || 'Urgent deadline indicator',
      explanation:
        'Scammers create artificial panic (e.g. 15 minutes deadline or power cut) so victims make hasty decisions without verifying with official sources.',
    });
    riskScore += 20;
  }

  // 5. Unrealistic claims / No CIBIL check
  if (lower.includes('no cibil') || lower.includes('without cibil') || lower.includes('guaranteed approval')) {
    flags.push({
      flag: 'Unrealistic "No CIBIL" Loan Promise',
      severity: 'WARNING',
      evidence: 'Claims guaranteed approval without credit check',
      explanation:
        'Regulated banks and NBFCs are legally mandated by the RBI to assess borrower eligibility. Unconditional loan promises are typical of illegal predatory apps.',
    });
    riskScore += 20;
  }

  // Cap score at 99
  const finalScore = Math.min(99, Math.max(10, riskScore));
  const riskLevel: 'HIGH_RISK' | 'CAUTION' | 'LOW_RISK' =
    finalScore >= 60 ? 'HIGH_RISK' : finalScore >= 35 ? 'CAUTION' : 'LOW_RISK';

  const summary =
    riskLevel === 'HIGH_RISK'
      ? `High-Risk Indicators Detected (${flags.length} red flags found). Do not transfer any money, do not install APK files, and do not enter your UPI PIN.`
      : riskLevel === 'CAUTION'
        ? `Moderate Caution Warranted. The message contains pressure tactics or unusual payment instructions. Verify through official customer care channels.`
        : `Low Risk Detected based on known pattern heuristics. However, always exercise personal diligence.`;

  return {
    riskLevel,
    riskScore: finalScore,
    summary,
    detectedRedFlags: flags,
    safeVerificationSteps: [
      'Never enter your UPI PIN to receive a payment or refund.',
      'Check if the lender is on the RBI Registered NBFC list at sachet.rbi.org.in.',
      'Never download financial apps from WhatsApp or SMS links (.apk files); only use the official Google Play Store.',
      'If you already sent money, immediately call the National Cyber Crime Helpline at 1930.',
    ],
    officialHelplines: [
      { title: 'National Cyber Crime Reporting Helpline', contact: '1930', url: 'https://cybercrime.gov.in' },
      { title: 'RBI Sachet Portal (Check Unregistered Lenders)', contact: 'sachet.rbi.org.in', url: 'https://sachet.rbi.org.in' },
      { title: 'National Consumer Helpline', contact: '1915', url: 'https://consumerhelpline.gov.in' },
    ],
    isHeuristicOnly: true,
  };
}
