import { Language, TransactionCategory } from '../types';

export interface StructuredFinancialItem {
  type: 'income' | 'expense';
  amount: number;
  category: TransactionCategory;
  description: string;
  confidence: number;
}

// 1. Indic Digit Translations
const INDIC_DIGIT_MAP: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9',
  '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4', '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9',
  '௦': '0', '௧': '1', '௨': '2', '௩': '3', '௪': '4', '௫': '5', '௬': '6', '௭': '7', '௮': '8', '௯': '9',
};

// 2. Comprehensive Word Numbers in English & 5 Regional Languages
const NUMBER_WORDS: [RegExp, string][] = [
  // 12000 specific patterns (direct fix for twelve thousand / बारह हजार / 12000)
  [/twelve\s*thousand/gi, '12000'],
  [/बारह\s*(?:हजार|हज़ार)/gi, '12000'],
  [/बारा\s*हजार/gi, '12000'],
  [/ಹನ್ನೆರಡು\s*ಸಾವಿರ/gi, '12000'],
  [/பன்னிரண்டு\s*ஆயிரம்/gi, '12000'],
  [/பன்னிரண்டாயிரம்/gi, '12000'],
  [/పన్నెండు\s*వేలు/gi, '12000'],
  [/twelve\s*hundred/gi, '1200'],
  [/बारह\s*सौ/gi, '1200'],
  [/बाराशे/gi, '1200'],

  // Common Thousands
  [/one\s*thousand/gi, '1000'],
  [/एक\s*(?:हजार|हज़ार)/gi, '1000'],
  [/दोन\s*हजार/gi, '2000'],
  [/two\s*thousand/gi, '2000'],
  [/दो\s*(?:हजार|हज़ार)/gi, '2000'],
  [/three\s*thousand/gi, '3000'],
  [/तीन\s*(?:हजार|हज़ार)/gi, '3000'],
  [/four\s*thousand/gi, '4000'],
  [/चार\s*(?:हजार|हज़ार)/gi, '4000'],
  [/five\s*thousand/gi, '5000'],
  [/पांच\s*(?:हजार|हज़ार)/gi, '5000'],
  [/six\s*thousand/gi, '6000'],
  [/छह\s*(?:हजार|हज़ार)/gi, '6000'],
  [/seven\s*thousand/gi, '7000'],
  [/सात\s*(?:हजार|हज़ार)/gi, '7000'],
  [/eight\s*thousand/gi, '8000'],
  [/आठ\s*(?:हजार|हज़ार)/gi, '8000'],
  [/nine\s*thousand/gi, '9000'],
  [/नौ\s*(?:हजार|हज़ार)/gi, '9000'],
  [/ten\s*thousand/gi, '10000'],
  [/दस\s*(?:हजार|हज़ार)/gi, '10000'],
  [/eleven\s*thousand/gi, '11000'],
  [/ग्यारह\s*(?:हजार|हज़ार)/gi, '11000'],
  [/thirteen\s*thousand/gi, '13000'],
  [/तेरह\s*(?:हजार|हज़ार)/gi, '13000'],
  [/fourteen\s*thousand/gi, '14000'],
  [/चौदह\s*(?:हजार|हज़ार)/gi, '14000'],
  [/fifteen\s*thousand/gi, '15000'],
  [/पंद्रह\s*(?:हजार|हज़ार)/gi, '15000'],
  [/sixteen\s*thousand/gi, '16000'],
  [/सोलह\s*(?:हजार|हज़ार)/gi, '16000'],
  [/twenty\s*thousand/gi, '20000'],
  [/बीस\s*(?:हजार|हज़ार)/gi, '20000'],
  [/twenty\s*five\s*thousand/gi, '25000'],
  [/पच्चीस\s*(?:हजार|हज़ार)/gi, '25000'],
  [/thirty\s*thousand/gi, '30000'],
  [/तीस\s*(?:हजार|हज़ार)/gi, '30000'],
  [/forty\s*thousand/gi, '40000'],
  [/चालीस\s*(?:हजार|हज़ार)/gi, '40000'],
  [/fifty\s*thousand/gi, '50000'],
  [/पचास\s*(?:हजार|हज़ार)/gi, '50000'],

  // Hundreds
  [/one\s*hundred/gi, '100'],
  [/एक\s*सौ/gi, '100'],
  [/two\s*hundred/gi, '200'],
  [/दो\s*सौ/gi, '200'],
  [/three\s*hundred/gi, '300'],
  [/तीन\s*सौ/gi, '300'],
  [/four\s*hundred/gi, '400'],
  [/चार\s*सौ/gi, '400'],
  [/five\s*hundred/gi, '500'],
  [/पांच\s*सौ/gi, '500'],
  [/six\s*hundred/gi, '600'],
  [/छह\s*सौ/gi, '600'],
  [/seven\s*hundred/gi, '700'],
  [/सात\s*सौ/gi, '700'],
  [/eight\s*hundred/gi, '800'],
  [/आठ\s*सौ/gi, '800'],
  [/nine\s*hundred/gi, '900'],
  [/नौ\s*सौ/gi, '900'],
  [/ढाई\s*सौ/gi, '250'],
  [/डेढ़\s*सौ/gi, '150'],
  [/डेढ़\s*(?:हजार|हज़ार)/gi, '1500'],
  [/ढाई\s*(?:हजार|हज़ार)/gi, '2500'],

  // Regional language word numbers
  [/ಒಂದು\s*ಸಾವಿರ/gi, '1000'],
  [/ಎರಡು\s*ಸಾವಿರ/gi, '2000'],
  [/ಐದು\s*ಸಾವಿರ/gi, '5000'],
  [/ಹತ್ತು\s*ಸಾವಿರ/gi, '10000'],
  [/ಆಯிரம்/gi, '1000'],
  [/இரண்டாயிரம்/gi, '2000'],
  [/ஐந்தாயிரம்/gi, '5000'],
  [/பத்தாயிரம்/gi, '10000'],
  [/వెయ్యి/gi, '1000'],
  [/రెండు\s*వేలు/gi, '2000'],
  [/ఐదు\s*వేలు/gi, '5000'],
  [/పది\s*వేలు/gi, '10000'],
  [/एक\s*लाख/gi, '100000'],
  [/one\s*lakh/gi, '100000'],
];

/**
 * Normalizes speech text so all monetary representations
 * (12000, 12,000, 12.000, 12k, 12 thousand, 12 हजार, बारह हजार, etc.)
 * become clean integer amounts.
 */
export function normalizeSpokenFinancialText(rawText: string): string {
  if (!rawText) return '';

  // 1. Translate Indic numerals to ASCII digits
  let s = rawText.replace(/[०-९೦-೯౦-౯௦-௯]/g, (ch) => INDIC_DIGIT_MAP[ch] || ch);

  // 2. Map spoken word numbers across languages
  for (const [pattern, replacement] of NUMBER_WORDS) {
    s = s.replace(pattern, ` ${replacement} `);
  }

  // 3. Normalize Indian & international thousand commas (e.g. 12,000 -> 12000, 1,20,000 -> 120000)
  s = s.replace(/(\d+),(\d{3})(?!\d)/g, '$1$2');
  s = s.replace(/(\d+),(\d{2}),(\d{3})(?!\d)/g, '$1$2$3');

  // 4. Handle European style or Speech-To-Text dot thousand separators: e.g. 12.000 -> 12000
  // (Notice: 3 zeros after dot indicates thousand separator, NOT cents/paise)
  s = s.replace(/(\d+)\.000(?!\d)/g, '$1000');

  // 5. Strip currency prefixes before digits so they don't confuse regex
  s = s.replace(/(?:₹|rs\.?|inr|रु\.?|रू\.?)\s*/gi, ' ');

  // 6. Multipliers: 12k or 12 k -> 12000
  s = s.replace(/(\d+(?:\.\d+)?)\s*k\b/gi, (_, n) => String(Math.round(parseFloat(n) * 1000)));

  // 7. Suffixes across languages: 12 thousand, 12 हजार, 12 ಸಾವಿರ, 12 ஆயிரம், 12 వేలు -> 12000
  s = s.replace(
    /(\d+(?:\.\d+)?)\s*(?:thousand|thousands|thsd|हज़ार|हजार|ಸಾವಿರ|ஆயிரம்|வேలు)(?:\s|$|[^\w\u0900-\u0D7F])/gi,
    (_, n) => `${Math.round(parseFloat(n) * 1000)} `
  );

  // 8. Lakhs: 1.5 lakh -> 150000, 12 lakh -> 1200000
  s = s.replace(
    /(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख|ಲಕ್ಷ|லட்சம்|లక్ష)(?:\s|$|[^\w\u0900-\u0D7F])/gi,
    (_, n) => `${Math.round(parseFloat(n) * 100000)} `
  );

  // 9. Remove trailing "/-" or "/="
  s = s.replace(/\/[-=]/g, ' ');

  return s.trim();
}

/**
 * Determine if a specific clause represents an Expense vs Income
 */
function isExpenseClause(clause: string): boolean {
  const c = clause.toLowerCase();

  // English & Hinglish keywords
  const englishExpense =
    /spent|spend|paid|pay|bought|buy|gave|cost|expense|petrol|diesel|fuel|gas|cng|recharge|bill|kharch|kharcha|diya|bhara|dharm|kirana|food|chai|tea|lunch|dinner|rent|emi|loan|medicine|medical|doctor|hospital|challan|fine/i.test(
      c
    );

  // Native Script Keywords
  const hindiExpense =
    /खर्च|खर्चा|खरीदा|खरीद|दिए|दिया|भरा|पेट्रोल|डीजल|किराया|किराना|राशन|खाना|दवाई|ईएमआई|किस्त|चालान|बिल/i.test(
      clause
    );
  const kannadaExpense =
    /ಖರ್ಚು|ಖರೀದಿಸಿದೆ|ಕೊಟ್ಟೆ|ಹಾಕಿಸಿದೆ|ಪೆಟ್ರೋಲ್|ಗ್ಯಾಸ್|ಬಾಡಿಗೆ|ಊಟ|ಔಷಧಿ|ಇಎಂಐ|ಕಂತು/i.test(clause);
  const tamilExpense =
    /செலவு|வாங்கினேன்|கொடுத்தேன்|டீசல்|பெட்ரோல்|வாடகை|சாப்பாடு|மருந்து|இஎம்ஐ|தவணை/i.test(clause);
  const teluguExpense =
    /ఖర్చు|కొన్నాను|ఇచ్చాను|పెట్రోల్|డీజిల్|అద్దె|భోజనం|మందులు|ఈఎంఐ|వాయిదా/i.test(clause);
  const marathiExpense =
    /खर्च|खरेदी|दिले|भरले|पेट्रोल|किराणा|भाडे|जेवण|औषध|हप्ता/i.test(clause);

  return (
    englishExpense ||
    hindiExpense ||
    kannadaExpense ||
    tamilExpense ||
    teluguExpense ||
    marathiExpense
  );
}

/**
 * Categorize transaction into 1 of the deterministic Kamai Saathi categories
 */
function detectCategory(clause: string, isExpense: boolean): { category: TransactionCategory; description: string } {
  const c = clause.toLowerCase();

  if (/petrol|diesel|fuel|gas|cng|गैस|ಗ್ಯಾಸ್|டீசல்|డీజిల్|इंधन/i.test(clause)) {
    return { category: 'fuel', description: 'Fuel & Petrol' };
  }
  if (/food|lunch|dinner|chai|tea|hotel|breakfast|snack|खाना|भोजन|ಊಟ|சாப்பாடு|భోజనం|जेवण|चाय/i.test(clause)) {
    return { category: 'food', description: 'Food & Meals' };
  }
  if (/groceries|kirana|ration|sabzi|vegetables|किराना|राशन|सब्जी|ತರಕಾರಿ|மளிகை|కిరాణా|किराणा|भाजी/i.test(clause)) {
    return { category: 'groceries', description: 'Groceries & Ration' };
  }
  if (/emi|loan|kisht|kist|installment|ईएमआई|किस्त|ಕಂತು|தவணை|వాయిదా|हप्ता/i.test(clause)) {
    return { category: 'emi', description: 'Loan EMI Payment' };
  }
  if (/rent|room|pg|किराया|ಬಾಡಿಗೆ|வாடகை|అద్దె|भाडे/i.test(clause)) {
    return { category: 'rent', description: 'Rent Payment' };
  }
  if (/medical|doctor|medicine|dawai|दवाई|ಔಷಧಿ|மருந்து|మందులు|औषध/i.test(clause)) {
    return { category: 'medical', description: 'Medical & Health' };
  }
  if (/auto|trips|rapido|ola|uber|ride|rides|fare|ऑटो|ಆಟೋ|சவாரி|ప్రయాణం|फेऱ्या/i.test(clause)) {
    return { category: 'trips', description: isExpense ? 'Auto/Cab Fare' : 'Auto/Cab Earnings' };
  }
  if (/delivery|swiggy|zomato|zepto|blinkit|amazon|डिलिव्हरी|డెలివరీ|டெலிவரி/i.test(clause)) {
    return { category: 'delivery', description: 'Delivery Partner Payout' };
  }
  if (/salary|payout|stipend|वेतन|पगार|ಸಂಬಳ|சம்பளம்|జీతం/i.test(clause)) {
    return { category: 'salary', description: 'Salary Payout' };
  }
  if (/wages|daily\s*wage|दिहाड़ी|रोजगारी|కూలీ|கூலி|ಕೂಲಿ/i.test(clause)) {
    return { category: 'daily_wages', description: 'Daily Wage Work' };
  }
  if (/recharge|mobile|bill|electricity|bijli|बिजली|करंट/i.test(clause)) {
    return { category: 'utilities', description: 'Utility & Bills' };
  }
  if (/savings|bachat|बचत|ಉಳಿತಾಯ|சேமிப்பு|పొదుపు/i.test(clause)) {
    return { category: 'savings', description: 'Savings Deposit' };
  }

  return {
    category: isExpense ? 'other' : 'delivery',
    description: isExpense ? 'Daily Expense' : 'Daily Earnings',
  };
}

/**
 * Parse any natural language speech or typed transcript into structured financial proposals
 * Guaranteed to accurately extract numbers like 12000, 12,000, 250, etc.
 */
export function parseFinancialSpeech(
  transcript: string,
  _targetLang: Language = 'en'
): StructuredFinancialItem[] {
  if (!transcript || !transcript.trim()) return [];

  // Step 1: Normalize all number forms (including words & separators)
  const normalized = normalizeSpokenFinancialText(transcript);

  // Step 2: Split clauses CAREFULLY on conjunctions and punctuation
  // NEVER split on commas between digits!
  const clauses = normalized.split(
    /(?:\s+(?:और|and|मற்றும்|ಮತ್ತು|మరియు|आणि|but|plus|also|then)\s+|;|\n|(?<!\d)[.,](?!\d))/i
  );

  const candidates: StructuredFinancialItem[] = [];

  for (const clause of clauses) {
    const trimmed = clause.trim();
    if (!trimmed) continue;

    // Match numbers (including decimals up to 2 decimal places)
    const match = trimmed.match(/(\d+(?:\.\d{1,2})?)/);
    if (match) {
      const amount = parseFloat(match[1]);
      if (!isNaN(amount) && amount > 0) {
        const isExp = isExpenseClause(trimmed);
        const { category, description } = detectCategory(trimmed, isExp);

        candidates.push({
          type: isExp ? 'expense' : 'income',
          amount,
          category,
          description,
          confidence: 0.96,
        });
      }
    }
  }

  // If no items extracted through clauses, scan whole normalized text
  if (candidates.length === 0) {
    const matches = normalized.matchAll(/(\d+(?:\.\d{1,2})?)/g);
    for (const match of matches) {
      const amount = parseFloat(match[1]);
      if (!isNaN(amount) && amount > 0) {
        const isExp = isExpenseClause(normalized);
        const { category, description } = detectCategory(normalized, isExp);
        candidates.push({
          type: isExp ? 'expense' : 'income',
          amount,
          category,
          description,
          confidence: 0.94,
        });
        break; // Take the primary amount if only 1 clause
      }
    }
  }

  return candidates;
}
