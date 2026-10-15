import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    ledger: string;
    planner: string;
    safety: string;
    saathi: string;
    schemes: string;
  };
  actions: {
    quickLog: string;
    voiceLog: string;
    addIncome: string;
    addExpense: string;
    confirm: string;
    cancel: string;
    edit: string;
    delete: string;
    simulate: string;
    resetDemo: string;
    checkScam: string;
    exploreSchemes: string;
  };
  dashboard: {
    recordedBalance: string;
    sevenDayInflow: string;
    upcomingObligations: string;
    shortfallAlertTitle: string;
    shortfallAlertDesc: string;
    noShortfallTitle: string;
    noShortfallDesc: string;
    recentActivity: string;
    emptyTransactions: string;
    viewAll: string;
  };
  ledger: {
    title: string;
    subtitle: string;
    all: string;
    income: string;
    expense: string;
    filterCategory: string;
    searchPlaceholder: string;
    entryDate: string;
    amount: string;
    category: string;
    status: string;
    method: string;
    confirmed: string;
    proposed: string;
  };
  planner: {
    title: string;
    subtitle: string;
    timeline14Day: string;
    loanSimulator: string;
    emergencyJar: string;
    loanSimulatorTitle: string;
    loanSimulatorSubtitle: string;
    principalLabel: string;
    rateLabel: string;
    tenureLabel: string;
    processingFeeLabel: string;
    monthlyEmi: string;
    totalInterest: string;
    totalBorrowingCost: string;
    effectiveRate: string;
    predatoryWarning: string;
    fairSavingsNote: string;
  };
  safety: {
    title: string;
    subtitle: string;
    pastePlaceholder: string;
    analyzeBtn: string;
    sampleScenarios: string;
    evidenceFound: string;
    safeStepsTitle: string;
    helplinesTitle: string;
    disclaimer: string;
  };
  saathi: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    sendBtn: string;
    promptSuggestions: string[];
    privacyBadge: string;
    assumptionsTitle: string;
  };
  voice: {
    listening: string;
    speakNow: string;
    reviewTitle: string;
    reviewSubtitle: string;
    confidence: string;
    scenarioChipsTitle: string;
  };
  privacy: {
    consentTitle: string;
    consentDesc: string;
    localOnlyMode: string;
    cloudAiMode: string;
    agreeBtn: string;
    switchLocalBtn: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Kamai Saathi',
    tagline: 'Money clarity. Safer choices.',
    nav: {
      home: 'Home',
      ledger: 'My Money',
      planner: 'Plan & Loan',
      safety: 'Scam Shield',
      saathi: 'Saathi AI',
      schemes: 'Govt Schemes',
    },
    actions: {
      quickLog: 'Quick Log',
      voiceLog: 'Voice Log',
      addIncome: 'Add Income',
      addExpense: 'Add Expense',
      confirm: 'Confirm Entry',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      simulate: 'Run What-If',
      resetDemo: 'Reset Demo Data',
      checkScam: 'Scan Message',
      exploreSchemes: 'Check Eligibility',
    },
    dashboard: {
      recordedBalance: 'Recorded Balance',
      sevenDayInflow: '7-Day Inflow',
      upcomingObligations: 'Upcoming Obligations',
      shortfallAlertTitle: 'Potential Cash Shortfall Detected',
      shortfallAlertDesc: 'Based on your recorded income and upcoming mandatory obligations, you face a potential deficit on Day 6 due to your Vehicle Loan EMI.',
      noShortfallTitle: 'Cash Flow Healthy',
      noShortfallDesc: 'Your projected earnings cover all known scheduled obligations over the next 14 days.',
      recentActivity: 'Recent Recorded Entries',
      emptyTransactions: 'No transactions recorded yet. Speak or tap below to add one.',
      viewAll: 'View Full Ledger',
    },
    ledger: {
      title: 'Financial Ledger',
      subtitle: 'Verified records of confirmed income and everyday expenses.',
      all: 'All',
      income: 'Income',
      expense: 'Expense',
      filterCategory: 'Filter by Category',
      searchPlaceholder: 'Search transactions...',
      entryDate: 'Date',
      amount: 'Amount',
      category: 'Category',
      status: 'Status',
      method: 'Method',
      confirmed: 'Confirmed',
      proposed: 'Pending Review',
    },
    planner: {
      title: 'Planning & What-If Simulations',
      subtitle: 'Forecast upcoming cash flows and uncover true borrowing costs before taking high-interest loans.',
      timeline14Day: '14-Day Cash Flow Timeline',
      loanSimulator: 'Loan Cost Simulator (True APR)',
      emergencyJar: 'Emergency Reserve',
      loanSimulatorTitle: 'Loan True-Cost Calculator',
      loanSimulatorSubtitle: 'Calculate hidden fees, true compound interest, and avoid predatory instant loan apps.',
      principalLabel: 'Borrowing Amount (Principal)',
      rateLabel: 'Annual Interest Rate (%)',
      tenureLabel: 'Tenure (Months)',
      processingFeeLabel: 'Upfront Processing Fee (₹)',
      monthlyEmi: 'Monthly EMI',
      totalInterest: 'Total Interest Paid',
      totalBorrowingCost: 'Total Borrowing Cost',
      effectiveRate: 'Effective Surcharge',
      predatoryWarning: 'High Risk: Annual rate exceeds 30% or processing fee is excessive. Consider verified microfinance schemes like PM-SVANidhi instead.',
      fairSavingsNote: 'Compared to a fair 12% microloan, this predatory offer costs you an extra',
    },
    safety: {
      title: 'Scam Shield & Threat Analyzer',
      subtitle: 'Paste any suspicious WhatsApp, SMS, or Telegram loan offer to detect deception indicators.',
      pastePlaceholder: 'Paste message here (e.g. "Instant ₹50,000 loan approved, click here to pay ₹500 fee...")',
      analyzeBtn: 'Analyze Threat Indicators',
      sampleScenarios: 'Try realistic test messages:',
      evidenceFound: 'Deceptive Indicators & Red Flags Detected',
      safeStepsTitle: 'Safe Verification Steps',
      helplinesTitle: 'Official Reporting Helplines',
      disclaimer: 'Notice: Automated scan identifies known heuristic patterns; it cannot guarantee that an unflagged message is 100% safe. Never enter your UPI PIN to receive money.',
    },
    saathi: {
      title: 'Saathi Financial Companion',
      subtitle: 'Ask questions in plain language about your budget, shortfall mitigation, and welfare schemes.',
      inputPlaceholder: 'Ask Saathi (e.g. "How can I avoid the shortfall on Day 6?")...',
      sendBtn: 'Ask',
      promptSuggestions: [
        'How can I cover the ₹1,980 shortfall on Day 6?',
        'What government schemes can help me as an auto driver?',
        'Is taking a 36% instant loan a good idea for emergency cash?',
        'Explain how my closing balance was calculated.',
      ],
      privacyBadge: 'Privacy Protected: Raw transactions stay in your browser. Saathi receives only coarsened summary aggregates.',
      assumptionsTitle: 'Assumptions & Basis of Advice',
    },
    voice: {
      listening: 'Listening to your voice...',
      speakNow: 'Speak naturally in any of the 6 supported languages.',
      reviewTitle: 'Review Proposed Entry',
      reviewSubtitle: 'AI interpreted your voice. Confirm the details before it enters your ledger.',
      confidence: 'Detection Confidence',
      scenarioChipsTitle: 'Or tap a verified scenario in your language:',
    },
    privacy: {
      consentTitle: 'Privacy & Data Protection Notice',
      consentDesc: 'Kamai Saathi stores your full financial ledger locally on your device. When Cloud AI is enabled, only single voice snippets and anonymized aggregates are processed ephemerally on the server with zero permanent storage.',
      localOnlyMode: 'Air-Gapped Local-Only Mode',
      cloudAiMode: 'Cloud AI Companion Enabled',
      agreeBtn: 'I Agree & Continue',
      switchLocalBtn: 'Switch to Local-Only Mode',
    },
  },
  hi: {
    appName: 'कमाई साथी',
    tagline: 'पैसे की समझ। सुरक्षित फ़ैसले।',
    nav: {
      home: 'होम',
      ledger: 'मेरा पैसा',
      planner: 'योजना व लोन',
      safety: 'स्कैम शील्ड',
      saathi: 'साथी AI',
      schemes: 'सरकारी योजनाएं',
    },
    actions: {
      quickLog: 'त्वरित एंट्री',
      voiceLog: 'बोलकर जोड़ें',
      addIncome: 'कमाई जोड़ें',
      addExpense: 'खर्च जोड़ें',
      confirm: 'एंट्री पक्की करें',
      cancel: 'रद्द करें',
      edit: 'बदलें',
      delete: 'हटाएं',
      simulate: 'सिम्युलेशन चलाएं',
      resetDemo: 'डेमो रीसेट करें',
      checkScam: 'मैसेज जांचें',
      exploreSchemes: 'पात्रता देखें',
    },
    dashboard: {
      recordedBalance: 'मौजूदा शेष राशि',
      sevenDayInflow: '7 दिन की आवक',
      upcomingObligations: 'आगामी देनदारियां',
      shortfallAlertTitle: 'पैसे की कमी की चेतावनी',
      shortfallAlertDesc: 'आपकी दर्ज कमाई और आगामी ईएमआई के आधार पर छठे दिन गाड़ी की ईएमआई के कारण पैसे कम पड़ सकते हैं।',
      noShortfallTitle: 'कैश-फ्लो सुरक्षित है',
      noShortfallDesc: 'अगले 14 दिनों में आपकी अनुमानित कमाई सभी देनदारियों को पूरा करने के लिए पर्याप्त है।',
      recentActivity: 'हाल के दर्ज लेनदेन',
      emptyTransactions: 'अभी तक कोई एंट्री नहीं है। नीचे बोलकर या लिखकर जोड़ें।',
      viewAll: 'पूरा खाता देखें',
    },
    ledger: {
      title: 'खाता बही (लेजर)',
      subtitle: 'आपकी पक्की कमाई और रोज़मर्रा के खर्चों का पारदर्शी रिकॉर्ड।',
      all: 'सभी',
      income: 'कमाई',
      expense: 'खर्च',
      filterCategory: 'श्रेणी चुनें',
      searchPlaceholder: 'लेनदेन खोजें...',
      entryDate: 'तारीख',
      amount: 'रकम',
      category: 'श्रेणी',
      status: 'स्थिति',
      method: 'तरीका',
      confirmed: 'पुष्ट',
      proposed: 'समीक्षा बाकी',
    },
    planner: {
      title: 'योजना और लोन सिम्युलेटर',
      subtitle: 'आगामी खर्चों का पूर्व-अनुमान लगाएं और महंगे लोन की असली लागत समझें।',
      timeline14Day: '14 दिन का कैश-फ्लो टाइमलाइन',
      loanSimulator: 'लोन लागत कैलकुलेटर',
      emergencyJar: 'आपातकालीन बचत',
      loanSimulatorTitle: 'लोन की असली लागत समझें',
      loanSimulatorSubtitle: 'छिपी हुई प्रोसेसिंग फीस और भारी ब्याज से सावधान रहें।',
      principalLabel: 'लोन की मूल रकम (Principal)',
      rateLabel: 'वार्षिक ब्याज दर (%)',
      tenureLabel: 'अवधि (महीने)',
      processingFeeLabel: 'प्रोसेसिंग फीस (₹)',
      monthlyEmi: 'मासिक किस्त (EMI)',
      totalInterest: 'कुल ब्याज',
      totalBorrowingCost: 'लोन की कुल लागत',
      effectiveRate: 'प्रभावी अधिभार दर',
      predatoryWarning: 'खतरा: 30% से अधिक ब्याज दर या भारी फीस शोषणकारी है। पीएम-स्वनिधि जैसी सरकारी योजनाओं पर विचार करें।',
      fairSavingsNote: '12% के उचित लोन की तुलना में, यह ऐप आपसे अतिरिक्त वसूल रहा है',
    },
    safety: {
      title: 'स्कैम शील्ड (धोखाधड़ी जांच)',
      subtitle: 'व्हाट्सएप या एसएमएस पर आए संदिग्ध मैसेज को पेस्ट करके जांचें।',
      pastePlaceholder: 'मैसेज यहां पेस्ट करें (जैसे: तुरंत 50,000 का लोन मंजूर, 500 रुपये फीस भरें...)',
      analyzeBtn: 'खतरे की जांच करें',
      sampleScenarios: 'नमूना मैसेज जांचें:',
      evidenceFound: 'पहचाने गए खतरे और लाल झंडे',
      safeStepsTitle: 'सुरक्षित सत्यापन के कदम',
      helplinesTitle: 'आधिकारिक साइबर हेल्पलाइन',
      disclaimer: 'सूचना: स्वचालित जांच सामान्य धोखाधड़ी के पैटर्न पकड़ती है। पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन न डालें।',
    },
    saathi: {
      title: 'साथी - आपका वित्तीय मार्गदर्शक',
      subtitle: 'अपने बजट, ईएमआई और सरकारी योजनाओं के बारे में आसान हिंदी में पूछें।',
      inputPlaceholder: 'साथी से पूछें (उदा. छठे दिन की कमी से कैसे बचें?)...',
      sendBtn: 'पूछें',
      promptSuggestions: [
        'छठे दिन की ₹1,980 की कमी को कैसे पूरा करूं?',
        'ऑटो चालकों के लिए कौन सी सरकारी योजनाएं हैं?',
        'क्या इमरजेंसी में 36% ब्याज वाला लोन लेना सही है?',
        'मेरा शेष बैलेंस कैसे निकाला गया, समझाइए।',
      ],
      privacyBadge: 'गोपनीयता सुरक्षित: आपका वित्तीय विवरण आपके फोन में ही रहता है।',
      assumptionsTitle: 'सलाह का आधार व शर्तें',
    },
    voice: {
      listening: 'आपकी आवाज सुनी जा रही है...',
      speakNow: 'स्वाभाविक रूप से अपनी भाषा में बोलें।',
      reviewTitle: 'प्रस्तावित एंट्री की समीक्षा',
      reviewSubtitle: 'AI ने आपकी आवाज से यह समझा है। खाते में जोड़ने से पहले जांच लें।',
      confidence: 'सटीकता विश्वास',
      scenarioChipsTitle: 'या हिंदी में बना-बनाया वाक्य चुनें:',
    },
    privacy: {
      consentTitle: 'गोपनीयता और डेटा सुरक्षा',
      consentDesc: 'कमाई साथी आपका सारा वित्तीय डेटा केवल आपके फोन में सुरक्षित रखता है। क्लाउड AI चालू होने पर भी कोई निजी डेटा सर्वर पर स्टोर नहीं किया जाता।',
      localOnlyMode: 'लोकल-ओनली मोड (पूर्ण ऑफ़लाइन)',
      cloudAiMode: 'क्लाउड AI साथी सक्षम',
      agreeBtn: 'स्वीकार करें और आगे बढ़ें',
      switchLocalBtn: 'ऑफ़लाइन मोड में बदलें',
    },
  },
  kn: {
    appName: 'ಕಮಾಯಿ ಸಾಥಿ',
    tagline: 'ಹಣದ ಸ್ಪಷ್ಟತೆ. ಸುರಕ್ಷಿತ ಆಯ್ಕೆಗಳು.',
    nav: {
      home: 'ಮುಖಪುಟ',
      ledger: 'ನನ್ನ ಹಣ',
      planner: 'ಯೋಜನೆ & ಸಾಲ',
      safety: 'ಸ್ಕ್ಯಾಮ್ ಶೀಲ್ಡ್',
      saathi: 'ಸಾಥಿ AI',
      schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆ',
    },
    actions: {
      quickLog: 'ತ್ವರಿತ ನಮೂದು',
      voiceLog: 'ಧ್ವನಿ ಮೂಲಕ ಸೇರಿಸಿ',
      addIncome: 'ಆದಾಯ ಸೇರಿಸಿ',
      addExpense: 'ಖರ್ಚು ಸೇರಿಸಿ',
      confirm: 'ಖಚಿತಪಡಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      edit: 'ತಿದ್ದಿ',
      delete: 'ಅಳಿಸಿ',
      simulate: 'ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಿ',
      resetDemo: 'ಡೆಮೊ ರೀಸೆಟ್',
      checkScam: 'ಸಂದೇಶ ಪರಿಶೀಲಿಸಿ',
      exploreSchemes: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
    },
    dashboard: {
      recordedBalance: 'ದಾಖಲಾದ ಬ್ಯಾಲೆನ್ಸ್',
      sevenDayInflow: '7 ದಿನದ ಆದಾಯ',
      upcomingObligations: 'ಮುಂಬರುವ ಬಾಕಿಗಳು',
      shortfallAlertTitle: 'ಹಣದ ಕೊರತೆಯ ಎಚ್ಚರಿಕೆ',
      shortfallAlertDesc: 'ನಿಮ್ಮ ದಾಖಲಾದ ಆದಾಯ ಮತ್ತು ಮುಂಬರುವ ವೆಚ್ಚಗಳ ಆಧಾರದ ಮೇಲೆ, 6 ನೇ ದಿನ ವಾಹನದ ಇಎಂಐ ಕಾರಣ ಕೊರತೆಯಾಗಬಹುದು.',
      noShortfallTitle: 'ಹಣದ ಹರಿವು ಉತ್ತಮವಾಗಿದೆ',
      noShortfallDesc: 'ಮುಂದಿನ 14 ದಿನಗಳಲ್ಲಿ ನಿಮ್ಮ ಆದಾಯವು ನಿಗದಿತ ಖರ್ಚುಗಳನ್ನು ಪೂರೈಸಲು ಸಾಕಾಗುತ್ತದೆ.',
      recentActivity: 'ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು',
      emptyTransactions: 'ಇನ್ನೂ ಯಾವುದೇ ವಹಿವಾಟು ದಾಖಲಾಗಿಲ್ಲ. ಕೆಳಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಟ್ಯಾಪ್ ಮಾಡಿ.',
      viewAll: 'ಪೂರ್ಣ ಲೆಡ್ಜರ್ ವೀಕ್ಷಿಸಿ',
    },
    ledger: {
      title: 'ಹಣಕಾಸು ಲೆಡ್ಜರ್',
      subtitle: 'ಖಚಿತಪಡಿಸಿದ ಆದಾಯ ಮತ್ತು ವೆಚ್ಚಗಳ ನಿಖರ ದಾಖಲೆ.',
      all: 'ಎಲ್ಲವೂ',
      income: 'ಆದಾಯ',
      expense: 'ವೆಚ್ಚ',
      filterCategory: 'ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ',
      searchPlaceholder: 'ವಹಿವಾಟು ಹುಡುಕಿ...',
      entryDate: 'ದಿನಾಂಕ',
      amount: 'ಮೊತ್ತ',
      category: 'ವರ್ಗ',
      status: 'ಸ್ಥಿತಿ',
      method: 'ವಿಧಾನ',
      confirmed: 'ಖಚಿತವಾಗಿದೆ',
      proposed: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    },
    planner: {
      title: 'ಯೋಜನೆ ಮತ್ತು ಸಾಲ ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ಮುಂಬರುವ ನಗದು ಕೊರತೆಗಳನ್ನು ಊಹಿಸಿ ಮತ್ತು ದುಬಾರಿ ಸಾಲದ ಮೋಸದಿಂದ ತಪ್ಪಿಸಿಕೊಳ್ಳಿ.',
      timeline14Day: '14 ದಿನಗಳ ನಗದು ಹರಿವು',
      loanSimulator: 'ಸಾಲದ ನಿಜವಾದ ವೆಚ್ಚ ಲೆಕ್ಕಾಚಾರ',
      emergencyJar: 'ತುರ್ತು ನಿಧಿ',
      loanSimulatorTitle: 'ಸಾಲದ ನೈಜ ವೆಚ್ಚದ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
      loanSimulatorSubtitle: 'ಗುಪ್ತ ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ ಮತ್ತು ಹೆಚ್ಚಿನ ಬಡ್ಡಿಯನ್ನು ಮೊದಲೇ ತಿಳಿಯಿರಿ.',
      principalLabel: 'ಸಾಲದ ಅಸಲು (Principal)',
      rateLabel: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿ ದರ (%)',
      tenureLabel: 'ಅವಧಿ (ತಿಂಗಳುಗಳು)',
      processingFeeLabel: 'ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ (₹)',
      monthlyEmi: 'ಮಾಸಿಕ ಕಂತು (EMI)',
      totalInterest: 'ಒಟ್ಟು ಬಡ್ಡಿ',
      totalBorrowingCost: 'ಸಾಲದ ಒಟ್ಟು ವೆಚ್ಚ',
      effectiveRate: 'ಪರಿಣಾಮಕಾರಿ ದರ',
      predatoryWarning: 'ಎಚ್ಚರಿಕೆ: ಬಡ್ಡಿದರ 30% ಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಪಿಎಂ-ಸ್ವನಿಧಿ ಅಂತಹ ಕಡಿಮೆ ಬಡ್ಡಿಯ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ.',
      fairSavingsNote: '12% ನ್ಯಾಯಯುತ ಸಾಲಕ್ಕೆ ಹೋಲಿಸಿದರೆ, ಈ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ನೀವು ಹೆಚ್ಚುವರಿ ಕೊಡುವ ಹಣ',
    },
    safety: {
      title: 'ಸ್ಕ್ಯಾಮ್ ಶೀಲ್ಡ್ (ವಂಚನೆ ರಕ್ಷಣೆ)',
      subtitle: 'ಅನುಮಾನಾಸ್ಪದ ವಾಟ್ಸಾಪ್ ಅಥವಾ ಎಸ್‌ಎಂಎಸ್ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ.',
      pastePlaceholder: 'ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ (ಉದಾ: ತಕ್ಷಣ 50,000 ಸಾಲ ಪಡೆಯಿರಿ, 500 ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ ಕಟ್ಟಿ...)',
      analyzeBtn: 'ಅಪಾಯ ವಿಶ್ಲೇಷಿಸಿ',
      sampleScenarios: 'ಮಾದರಿ ಪರೀಕ್ಷಾ ಸಂದೇಶಗಳು:',
      evidenceFound: 'ಪತ್ತೆಯಾದ ವಂಚನೆಯ ಲಕ್ಷಣಗಳು',
      safeStepsTitle: 'ಸುರಕ್ಷಿತ ಪರಿಶೀಲನಾ ಕ್ರಮಗಳು',
      helplinesTitle: 'ಸಹಾಯವಾಣಿಗಳು',
      disclaimer: 'ಗಮನಿಸಿ: ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಬೇಡಿ.',
    },
    saathi: {
      title: 'ಸಾಥಿ - ನಿಮ್ಮ ಹಣಕಾಸು ಮಿತ್ರ',
      subtitle: 'ನಿಮ್ಮ ಬಜೆಟ್, ಸಾಲಗಳು ಮತ್ತು ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲೇ ಮಾತನಾಡಿ.',
      inputPlaceholder: 'ಸಾಥಿಯನ್ನು ಕೇಳಿ (ಉದಾ. 6 ನೇ ದಿನದ ಕೊರತೆಯನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುವುದು?)...',
      sendBtn: 'ಕೇಳಿ',
      promptSuggestions: [
        '6 ನೇ ದಿನದ ₹1,980 ಕೊರತೆಯನ್ನು ಹೇಗೆ ತಪ್ಪಿಸುವುದು?',
        'ಆಟೋ ಚಾಲಕರಿಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಸಿಗುತ್ತವೆ?',
        'ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 36% ಬಡ್ಡಿಯ ಆನ್‌ಲೈನ್ ಸಾಲ ತೆಗೆದುಕೊಳ್ಳಬಹುದೇ?',
        'ನನ್ನ ಬ್ಯಾಲೆನ್ಸ್ ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ ಎಂಬುದನ್ನು ವಿವರಿಸಿ.',
      ],
      privacyBadge: 'ಗೌಪ್ಯತೆ ರಕ್ಷಿತ: ನಿಮ್ಮ ಹಣಕಾಸಿನ ಮಾಹಿತಿ ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತದೆ.',
      assumptionsTitle: 'ಸಲಹೆಯ ಆಧಾರ ಮತ್ತು ಷರತ್ತುಗಳು',
    },
    voice: {
      listening: 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
      speakNow: 'ಸ್ಪಷ್ಟವಾಗಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ.',
      reviewTitle: 'ಪ್ರಸ್ತಾವಿತ ನಮೂದನ್ನು ಪರಿಶೀಲಿಸಿ',
      reviewSubtitle: 'AI ನಿಮ್ಮ ಧ್ವನಿಯಿಂದ ಹೀಗೆ ಗುರುತಿಸಿದೆ. ಖಚಿತಪಡಿಸಿ.',
      confidence: 'ಗುರುತಿಸುವಿಕೆಯ ನಿಖರತೆ',
      scenarioChipsTitle: 'ಅಥವಾ ಕನ್ನಡದ ಮಾದರಿ ವಾಕ್ಯವನ್ನು ಆರಿಸಿ:',
    },
    privacy: {
      consentTitle: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಭದ್ರತೆ',
      consentDesc: 'ಕಮಾಯಿ ಸಾಥಿ ನಿಮ್ಮ ಎಲ್ಲಾ ಹಣಕಾಸಿನ ವಹಿವಾಟುಗಳನ್ನು ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲೇ ಸಂಗ್ರಹಿಸುತ್ತದೆ. ಯಾವುದೇ ಖಾಸಗಿ ಮಾಹಿತಿ ಸರ್ವರ್‌ನಲ್ಲಿ ಶಾಶ್ವತವಾಗಿ ಉಳಿಯುವುದಿಲ್ಲ.',
      localOnlyMode: 'ಸ್ಥಳೀಯ ಆಫ್‌ಲೈನ್ ಮೋಡ್',
      cloudAiMode: 'ಕ್ಲೌಡ್ AI ಸಕ್ರಿಯ',
      agreeBtn: 'ಒಪ್ಪಿಕೊಂಡು ಮುಂದುವರಿಯಿರಿ',
      switchLocalBtn: 'ಆಫ್‌ಲೈನ್‌ಗೆ ಬದಲಾಯಿಸಿ',
    },
  },
  ta: {
    appName: 'கமாய் சாதி',
    tagline: 'பணத் தெளிவு. பாதுகாப்பான முடிவுகள்.',
    nav: {
      home: 'முகப்பு',
      ledger: 'என் பணம்',
      planner: 'திட்டம் & கடன்',
      safety: 'மோசடி தடுப்பு',
      saathi: 'சாதி AI',
      schemes: 'அரசு திட்டங்கள்',
    },
    actions: {
      quickLog: 'விரைவு பதிவு',
      voiceLog: 'குரல் மூலம் சேர்',
      addIncome: 'வருமானம் சேர்',
      addExpense: 'செலவு சேர்',
      confirm: 'உறுதி செய்',
      cancel: 'ரத்து செய்',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      simulate: 'ஒப்பீடு செய்',
      resetDemo: 'டெமோ ரீசெட்',
      checkScam: 'செய்தியை சரிபார்',
      exploreSchemes: 'தகுதி பார்க்க',
    },
    dashboard: {
      recordedBalance: 'இருப்புத் தொகை',
      sevenDayInflow: '7 நாள் வரவு',
      upcomingObligations: 'வரவிருக்கும் செலவுகள்',
      shortfallAlertTitle: 'பணப் பற்றாக்குறை எச்சரிக்கை',
      shortfallAlertDesc: 'உங்கள் வாகனக் கடன் தவணை காரணமாக 6 ஆம் நாள் பணப் பற்றாக்குறை ஏற்பட வாய்ப்புள்ளது.',
      noShortfallTitle: 'பணப்புழக்கம் சீராக உள்ளது',
      noShortfallDesc: 'அடுத்த 14 நாட்களில் வரவிருக்கும் செலவுகளை சமாளிக்க வருமானம் போதுமானது.',
      recentActivity: 'சமீபத்திய பதிவுகள்',
      emptyTransactions: 'பதிவுகள் எதுவும் இல்லை. குரல் மூலம் சேர்க்கவும்.',
      viewAll: 'முழு கணக்கையும் பார்க்க',
    },
    ledger: {
      title: 'வரவு செலவு கணக்கு',
      subtitle: 'உறுதிசெய்யப்பட்ட வருமானம் மற்றும் அன்றாட செலவுகளின் வெளிப்படையான பட்டியல்.',
      all: 'அனைத்தும்',
      income: 'வருமானம்',
      expense: 'செலவு',
      filterCategory: 'வகை தேர்ந்தெடுக்கவும்',
      searchPlaceholder: 'தேடுக...',
      entryDate: 'தேதி',
      amount: 'தொகை',
      category: 'வகை',
      status: 'நிலை',
      method: 'முறை',
      confirmed: 'உறுதியானது',
      proposed: 'சரிபார்க்கவும்',
    },
    planner: {
      title: 'திட்டமிடல் & கடன் கணக்கீடு',
      subtitle: 'எதிர்கால பற்றாக்குறையை கணித்து அதிக வட்டி கொண்ட மோசடி கடன்களை தவிர்க்கவும்.',
      timeline14Day: '14 நாள் பணப் புழக்க வரைபடம்',
      loanSimulator: 'உண்மையான கடன் செலவு கால்குலேட்டர்',
      emergencyJar: 'அவசர நிதி',
      loanSimulatorTitle: 'கடன் உண்மையான செலவு கால்குலேட்டர்',
      loanSimulatorSubtitle: 'மறைமுக கட்டணங்கள் மற்றும் கூட்டு வட்டியை துல்லியமாக அறியவும்.',
      principalLabel: 'கடன் அசல் (Principal)',
      rateLabel: 'ஆண்டு வட்டி (%)',
      tenureLabel: 'காலம் (மாதங்கள்)',
      processingFeeLabel: 'செயலாக்க கட்டணம் (₹)',
      monthlyEmi: 'மாத தவணை (EMI)',
      totalInterest: 'மொத்த வட்டி',
      totalBorrowingCost: 'கடனின் மொத்த செலவு',
      effectiveRate: 'உண்மையான கூடுதல் வீதம்',
      predatoryWarning: 'எச்சரிக்கை: 30% க்கும் அதிகமான வட்டி விகிதம் அதிக சுமையாகும். பிஎம்-ஸ்வநிதி போன்ற அரசு திட்டங்களை தேர்ந்தெடுக்கவும்.',
      fairSavingsNote: '12% நியாயமான கடனுடன் ஒப்பிடும்போது நீங்கள் இழக்கும் கூடுதல் தொகை',
    },
    safety: {
      title: 'மோசடி தடுப்புக் கேடயம் (Scam Shield)',
      subtitle: 'சந்தேகத்திற்கிடமான வாட்ஸ்அப் அல்லது எஸ்எம்எஸ் செய்திகளை சோதிக்கவும்.',
      pastePlaceholder: 'செய்தியை இங்கே ஒட்டவும் (எ.கா: உடனடியாக 50,000 கடன், 500 கட்டணம் செலுத்துங்கள்...)',
      analyzeBtn: 'ஆபத்தை கண்டறியவும்',
      sampleScenarios: 'மாதிரி செய்திகள்:',
      evidenceFound: 'கண்டறியப்பட்ட மோசடி அறிகுறிகள்',
      safeStepsTitle: 'பாதுகாப்பு வழிமுறைகள்',
      helplinesTitle: 'உதவி எண்கள்',
      disclaimer: 'குறிப்பு: பணம் பெற ஒருபோதும் UPI பின்னை உள்ளிடாதீர்கள்.',
    },
    saathi: {
      title: 'சாதி - உங்கள் நிதி வழிகாட்டி',
      subtitle: 'உங்கள் பட்ஜெட் மற்றும் அரசு திட்டங்கள் குறித்து தமிழில் கேளுங்கள்.',
      inputPlaceholder: 'சாதியிடம் கேளுங்கள் (எ.கா: 6 ஆம் நாள் பற்றாக்குறையை எப்படி தவிர்ப்பது?)...',
      sendBtn: 'கேள்',
      promptSuggestions: [
        '6 ஆம் நாள் ₹1,980 பற்றாக்குறையை எப்படி ஈடுசெய்வது?',
        'ஆட்டோ ஓட்டுநர்களுக்கான அரசு திட்டங்கள் என்ன?',
        'அவசர தேவைக்கு 36% வட்டி கடன் எடுக்கலாமா?',
        'எனது இருப்புத் தொகை எவ்வாறு கணக்கிடப்பட்டது என்பதை விளக்குக.',
      ],
      privacyBadge: 'ரகசியம் பாதுகாப்பானது: உங்கள் தகவல்கள் உங்கள் போனிலேயே இருக்கும்.',
      assumptionsTitle: 'ஆலோசனையின் அடிப்படை',
    },
    voice: {
      listening: 'கேட்கிறது...',
      speakNow: 'இயல்பாக தமிழில் பேசுங்கள்.',
      reviewTitle: 'பதிவை சரிபார்க்கவும்',
      reviewSubtitle: 'AI உங்கள் குரலில் இருந்து இதை பரிந்துரைத்துள்ளது. உறுதிப்படுத்தவும்.',
      confidence: 'துல்லியம்',
      scenarioChipsTitle: 'அல்லது மாதிரி வாக்கியத்தை தேர்ந்தெடுக்கவும்:',
    },
    privacy: {
      consentTitle: 'தனியுரிமை மற்றும் பாதுகாப்பு',
      consentDesc: 'கமாய் சாதி உங்கள் நிதி தகவல்களை உங்கள் சாதனத்தில் மட்டுமே பாதுகாப்பாக வைத்திருக்கிறது.',
      localOnlyMode: 'ஆஃப்லைன் முறை',
      cloudAiMode: 'கிளவுட் AI வசதி',
      agreeBtn: 'ஏற்றுக்கொண்டு தொடர்க',
      switchLocalBtn: 'ஆஃப்லைனுக்கு மாற்றவும்',
    },
  },
  te: {
    appName: 'కమాయి సాథీ',
    tagline: 'డబ్బుపై స్పష్టత. సురక్షిత నిర్ణయాలు.',
    nav: {
      home: 'హోమ్',
      ledger: 'నా డబ్బు',
      planner: 'ప్లాన్ & లోన్',
      safety: 'స్కామ్ షీల్డ్',
      saathi: 'సాథీ AI',
      schemes: 'ప్రభుత్వ పథకాలు',
    },
    actions: {
      quickLog: 'త్వరిత నమోదు',
      voiceLog: 'వాయిస్ ద్వారా చేర్చండి',
      addIncome: 'ఆదాయం చేర్చండి',
      addExpense: 'ఖర్చు చేర్చండి',
      confirm: 'ధృవీకరించండి',
      cancel: 'రద్దు చేయండి',
      edit: 'సవరించండి',
      delete: 'తొలగించండి',
      simulate: 'పోల్చండి',
      resetDemo: 'డెమో రీసెట్',
      checkScam: 'సందేశాన్ని తనిఖీ చేయండి',
      exploreSchemes: 'అర్హత చూడండి',
    },
    dashboard: {
      recordedBalance: 'నమోదైన బ్యాలెన్స్',
      sevenDayInflow: '7 రోజుల రాబడి',
      upcomingObligations: 'రాబోయే చెల్లింపులు',
      shortfallAlertTitle: 'డబ్బు కొరత హెచ్చరిక',
      shortfallAlertDesc: '6వ రోజున మీ వాహన లోన్ EMI కారణంగా డబ్బు కొరత ఏర్పడే అవకాశం ఉంది.',
      noShortfallTitle: 'నగదు ప్రవాహం సరిపడా ఉంది',
      noShortfallDesc: 'తదుపరి 14 రోజుల్లో రాబోయే ఖర్చులను భర్తీ చేయడానికి మీ ఆదాయం సరిపోతుంది.',
      recentActivity: 'ఇటీవలి లావాదేవీలు',
      emptyTransactions: 'ఇంకా ఎటువంటి లావాదేవీ నమోదు కాలేదు.',
      viewAll: 'మొత్తం లెడ్జర్ చూడండి',
    },
    ledger: {
      title: 'ఆర్థిక లెడ్జర్',
      subtitle: 'ధృవీకరించబడిన ఆదాయం మరియు ఖర్చుల పారదర్శక రికార్డు.',
      all: 'అన్నీ',
      income: 'ఆదాయం',
      expense: 'ఖర్చు',
      filterCategory: 'కేటగిరీ ఎంచుకోండి',
      searchPlaceholder: 'వెతకండి...',
      entryDate: 'తేదీ',
      amount: 'మొత్తం',
      category: 'కేటగిరీ',
      status: 'స్థితి',
      method: 'విధానం',
      confirmed: 'ధృవీకరించబడింది',
      proposed: 'పరిశీలనలో ఉంది',
    },
    planner: {
      title: 'ప్రణాళిక & లోన్ సిమ్యులేటర్',
      subtitle: 'రాబోయే నగదు కొరతలను అంచనా వేయండి మరియు అధిక వడ్డీ యాప్‌ల మోసాలను నివారించండి.',
      timeline14Day: '14 రోజుల నగదు ప్రవాహం',
      loanSimulator: 'లోన్ ఖర్చు కాలిక్యులేటర్',
      emergencyJar: 'అత్యవసర నిధి',
      loanSimulatorTitle: 'లోన్ అసలు ఖర్చు కాలిక్యులేటర్',
      loanSimulatorSubtitle: 'దాగి ఉన్న ప్రాసెసింగ్ ఫీజులు మరియు అధిక వడ్డీని ముందుగానే తెలుసుకోండి.',
      principalLabel: 'అసలు మొత్తం (Principal)',
      rateLabel: 'వార్షిక వడ్డీ రేటు (%)',
      tenureLabel: 'వ్యవధి (నెలలు)',
      processingFeeLabel: 'ప్రాసెసింగ్ ఫీజు (₹)',
      monthlyEmi: 'నెలవారీ వాయిదా (EMI)',
      totalInterest: 'మొత్తం వడ్డీ',
      totalBorrowingCost: 'లోన్ మొత్తం ఖర్చు',
      effectiveRate: 'నికర అదనపు భారం',
      predatoryWarning: 'హెచ్చరిక: 30% కంటే ఎక్కువ వడ్డీ రేటు అత్యంత ప్రమాదకరం. పీఎం-స్వనిధి వంటి ప్రభుత్వ రుణాలను పరిశీలించండి.',
      fairSavingsNote: '12% సాధారణ లోన్ తో పోలిస్తే ఈ యాప్ లో మీరు చెల్లించే అదనపు భారం',
    },
    safety: {
      title: 'స్కామ్ షీల్డ్ (మోసాల నివారణ)',
      subtitle: 'అనుమానాస్పద సందేశాలను ఇక్కడ తనిఖీ చేసి మోసాలను గుర్తించండి.',
      pastePlaceholder: 'సందేశాన్ని ఇక్కడ అతికించండి (ఉదా: తక్షణమే 50,000 లోన్, 500 ఫీజు చెల్లించండి...)',
      analyzeBtn: 'ప్రమాదాన్ని గుర్తించండి',
      sampleScenarios: 'నమూనా సందేశాలు:',
      evidenceFound: 'గుర్తించబడిన మోసపూరిత గుర్తులు',
      safeStepsTitle: 'సురక్షిత ధృవీకరణ మార్గాలు',
      helplinesTitle: 'హెల్ప్‌లైన్లు',
      disclaimer: 'గమనిక: డబ్బు అందుకోవడానికి ఎప్పుడూ UPI పిన్ నమోదు చేయవద్దు.',
    },
    saathi: {
      title: 'సాథీ - మీ ఆర్థిక మార్గదర్శి',
      subtitle: 'మీ బడ్జెట్ మరియు ప్రభుత్వ పథకాల గురించి తెలుగులో అడగండి.',
      inputPlaceholder: 'సాథీని అడగండి (ఉదా. 6వ రోజు కొరతను ఎలా అధిగమించాలి?)...',
      sendBtn: 'అడగండి',
      promptSuggestions: [
        '6వ రోజు వచ్చే ₹1,980 కొరతను ఎలా అధిగమించాలి?',
        'ఆటో డ్రైవర్ల కోసం ఏ ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి?',
        'అత్యవసర సమయంలో 36% వడ్డీ లోన్ తీసుకోవడం సరైనదేనా?',
        'నా బ్యాలెన్స్ ఎలా లెక్కించారో వివరించండి.',
      ],
      privacyBadge: 'గోప్యత రక్షించబడింది: మీ వివరాలు మీ ఫోన్‌లోనే సురక్షితంగా ఉంటాయి.',
      assumptionsTitle: 'సలహా ఆధారాలు',
    },
    voice: {
      listening: 'వినబడుతోంది...',
      speakNow: 'సహజంగా తెలుగులో మాట్లాడండి.',
      reviewTitle: 'నమోదును పరిశీలించండి',
      reviewSubtitle: 'AI మీ వాయిస్ ద్వారా ఇలా గుర్తించింది. ధృవీకరించండి.',
      confidence: 'ఖచ్చితత్వం',
      scenarioChipsTitle: 'లేదా తెలుగు నమూనా వాక్యాన్ని ఎంచుకోండి:',
    },
    privacy: {
      consentTitle: 'గోప్యత మరియు సమాచార రక్షణ',
      consentDesc: 'కమాయి సాథీ మీ మొత్తం ఆర్థిక సమాచారాన్ని మీ పరికరంలోనే భద్రపరుస్తుంది.',
      localOnlyMode: 'ఆఫ్‌లైన్ మోడ్',
      cloudAiMode: 'క్లౌడ్ AI సాథీ',
      agreeBtn: 'అంగీకరించి ముందుకు సాగండి',
      switchLocalBtn: 'ఆఫ్‌లైన్‌కు మారండి',
    },
  },
  mr: {
    appName: 'कमाई साथी',
    tagline: 'पैशांची स्पष्टता. सुरक्षित निर्णय.',
    nav: {
      home: 'मुख्य',
      ledger: 'माझे पैसे',
      planner: 'नियोजन व कर्ज',
      safety: 'स्कॅम शील्ड',
      saathi: 'साथी AI',
      schemes: 'शासकीय योजना',
    },
    actions: {
      quickLog: 'झटपट नोंद',
      voiceLog: 'आवाजाने जोडा',
      addIncome: 'कमाई जोडा',
      addExpense: 'खर्च जोडा',
      confirm: 'नोंद पक्की करा',
      cancel: 'रद्द करा',
      edit: 'बदला',
      delete: 'हटवा',
      simulate: 'तुलना करा',
      resetDemo: 'डेमो रीसेट करा',
      checkScam: 'संदेश तपासा',
      exploreSchemes: 'पात्रता तपासा',
    },
    dashboard: {
      recordedBalance: 'शिल्लक रक्कम',
      sevenDayInflow: '७ दिवसांची कमाई',
      upcomingObligations: 'येणारे खर्च',
      shortfallAlertTitle: 'पैशांच्या तुटवड्याचा इशारा',
      shortfallAlertDesc: 'तुमच्या नियमित कमाई आणि गाडीच्या हप्त्यामुळे ६ व्या दिवशी पैशांचा तुटवडा जाणवू शकतो.',
      noShortfallTitle: 'आर्थिक स्थिती सुरक्षित',
      noShortfallDesc: 'पुढील १४ दिवसांतील खर्च भागवण्यासाठी तुमची अंदाजित कमाई पुरेशी आहे.',
      recentActivity: 'अलीकडील व्यवहार',
      emptyTransactions: 'अद्याप कोणतेही व्यवहार नोंदवलेले नाहीत.',
      viewAll: 'संपूर्ण वही पहा',
    },
    ledger: {
      title: 'आर्थिक खातेवही',
      subtitle: 'निश्चित कमाई आणि दैनंदिन खर्चाची पारदर्शक नोंद.',
      all: 'सर्व',
      income: 'कमाई',
      expense: 'खर्च',
      filterCategory: 'वर्गवारी निवडा',
      searchPlaceholder: 'व्यवहार शोधा...',
      entryDate: 'तारीख',
      amount: 'रक्कम',
      category: 'वर्गवारी',
      status: 'स्थिती',
      method: 'पद्धत',
      confirmed: 'निश्चित',
      proposed: 'तपासणी बाकी',
    },
    planner: {
      title: 'नियोजन आणि कर्ज गणक',
      subtitle: 'आगामी खर्चाचा अंदाज घ्या आणि महागड्या कर्जाच्या सापळ्यातून वाचा.',
      timeline14Day: '१४ दिवसांचा कॅश-फ्लो',
      loanSimulator: 'कर्जाचा खरा खर्च',
      emergencyJar: 'आपत्कालीन बचत',
      loanSimulatorTitle: 'कर्जाचा खरा खर्च गणक',
      loanSimulatorSubtitle: 'लपलेली प्रोसेसिंग फी आणि चक्रवाढ व्याजाचा खरा भार समजून घ्या.',
      principalLabel: 'कर्जाची मुद्दल (Principal)',
      rateLabel: 'वार्षिक व्याजदर (%)',
      tenureLabel: 'मुदत (महिने)',
      processingFeeLabel: 'प्रोसेसिंग फी (₹)',
      monthlyEmi: 'मासिक हप्ता (EMI)',
      totalInterest: 'एकूण व्याज',
      totalBorrowingCost: 'कर्जाचा एकूण खर्च',
      effectiveRate: 'प्रभावी अधिभार दर',
      predatoryWarning: 'धोका: ३०% पेक्षा जास्त व्याजदर अत्यंत जाचक आहे. पीएम-स्वनिधी सारख्या शासकीय योजनांचा विचार करा.',
      fairSavingsNote: '१२% च्या योग्य कर्जाच्या तुलनेत या अ‍ॅपवर तुम्ही भरत असलेले जादा पैसे',
    },
    safety: {
      title: 'स्कॅम शील्ड (फसवणूक प्रतिबंध)',
      subtitle: 'व्हॉट्सअ‍ॅप किंवा मेसेजद्वारे आलेले संशयास्पद संदेश तपासा.',
      pastePlaceholder: 'येथे संदेश पेस्ट करा (उदा. त्वरित ५०,००० कर्ज मंजूर, ५०० फी भरा...)',
      analyzeBtn: 'धोका तपासा',
      sampleScenarios: 'नमुना संदेश:',
      evidenceFound: 'आढळलेले फसवणुकीचे संकेत',
      safeStepsTitle: 'सुरक्षित पडताळणी पद्धत',
      helplinesTitle: 'मदत क्रमांक',
      disclaimer: 'सूचना: पैसे मिळवण्यासाठी कधीही UPI पिन टाकू नका.',
    },
    saathi: {
      title: 'साथी - तुमचा आर्थिक मार्गदर्शक',
      subtitle: 'तुमचे बजेट, कर्ज आणि शासकीय योजनांबद्दल मराठीत विचारा.',
      inputPlaceholder: 'साथीला विचारा (उदा. ६ व्या दिवसाचा तुटवडा कसा टाळावा?)...',
      sendBtn: 'विचारा',
      promptSuggestions: [
        '६ व्या दिवशी येणारा ₹१,९८० चा तुटवडा कसा भरून काढायचा?',
        'रिक्षा चालकांसाठी कोणत्या शासकीय योजना आहेत?',
        'अडचणीच्या वेळी ३६% व्याजाचे झटपट कर्ज घेणे योग्य आहे का?',
        'माझी शिल्लक रक्कम कशी मोजली गेली ते स्पष्ट करा.',
      ],
      privacyBadge: 'गोपनीयता सुरक्षित: तुमची माहिती तुमच्या मोबाईलमध्येच राहते.',
      assumptionsTitle: 'सल्ल्याचा आधार व अटी',
    },
    voice: {
      listening: 'ऐकत आहे...',
      speakNow: 'मराठीत सहजपणे बोला.',
      reviewTitle: 'प्रस्तावित नोंदीची पडताळणी',
      reviewSubtitle: 'AI ने तुमच्या आवाजातून हे नोंदवले आहे. खात्री करा.',
      confidence: 'अचूकता',
      scenarioChipsTitle: 'किंवा मराठीतील नमुना वाक्य निवडा:',
    },
    privacy: {
      consentTitle: 'गोपनीयता आणि डेटा संरक्षण',
      consentDesc: 'कमाई साथी तुमचा आर्थिक डेटा केवळ तुमच्या फोनमध्ये सुरक्षित ठेवते.',
      localOnlyMode: 'स्थानिक ऑफलाइन मोड',
      cloudAiMode: 'क्लाउड AI साथी सक्षम',
      agreeBtn: 'मान्य करा आणि पुढे जा',
      switchLocalBtn: 'ऑफलाइन मोड निवडा',
    },
  },
};

/**
 * 6-Language Test Voice Scenarios with pre-parsed verified data
 */
export interface VoiceScenarioChip {
  id: string;
  language: Language;
  languageLabel: string;
  phrase: string;
  audioSimText: string;
  parsedResult: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    confidence: number;
  }[];
}

export const sampleVoiceScenarios: VoiceScenarioChip[] = [
  {
    id: 'en-1',
    language: 'en',
    languageLabel: 'English',
    phrase: 'Earned 1200 today from deliveries and spent 250 on petrol',
    audioSimText: '“Earned 1200 today from deliveries and spent 250 on petrol”',
    parsedResult: [
      {
        type: 'income',
        amount: 1200,
        category: 'delivery',
        description: 'Delivery earnings',
        confidence: 0.98,
      },
      {
        type: 'expense',
        amount: 250,
        category: 'fuel',
        description: 'Petrol fuel',
        confidence: 0.96,
      },
    ],
  },
  {
    id: 'hi-1',
    language: 'hi',
    languageLabel: 'हिन्दी',
    phrase: 'आज डिलीवरी से 1200 रुपये मिले और 250 का पेट्रोल डलवाया',
    audioSimText: '“आज डिलीवरी से 1200 रुपये मिले और 250 का पेट्रोल डलवाया”',
    parsedResult: [
      {
        type: 'income',
        amount: 1200,
        category: 'delivery',
        description: 'डिलीवरी कमाई',
        confidence: 0.97,
      },
      {
        type: 'expense',
        amount: 250,
        category: 'fuel',
        description: 'पेट्रोल खर्च',
        confidence: 0.96,
      },
    ],
  },
  {
    id: 'kn-1',
    language: 'kn',
    languageLabel: 'ಕನ್ನಡ',
    phrase: 'ಇಂದು ಡೆಲಿವರಿಯಿಂದ 1200 ರೂಪಾಯಿ ಬಂತು ಮತ್ತು 250 ರೂಪಾಯಿ ಪೆಟ್ರೋಲ್‌ಗೆ ಖರ್ಚು ಮಾಡಿದೆ',
    audioSimText: '“ಇಂದು ಡೆಲಿವರಿಯಿಂದ 1200 ರೂಪಾಯಿ ಬಂತು ಮತ್ತು 250 ರೂಪಾಯಿ ಪೆಟ್ರೋಲ್‌ಗೆ ಖರ್ಚು ಮಾಡಿದೆ”',
    parsedResult: [
      {
        type: 'income',
        amount: 1200,
        category: 'delivery',
        description: 'ಡೆಲಿವರಿ ಆದಾಯ',
        confidence: 0.96,
      },
      {
        type: 'expense',
        amount: 250,
        category: 'fuel',
        description: 'ಪೆಟ್ರೋಲ್ ವೆಚ್ಚ',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'ta-1',
    language: 'ta',
    languageLabel: 'தமிழ்',
    phrase: 'இன்று டெலிவரியில் 1200 ரூபாய் வருமானம் மற்றும் பெட்ரோலுக்கு 250 ரூபாய் செலவு',
    audioSimText: '“இன்று டெலிவரியில் 1200 ரூபாய் வருமானம் மற்றும் பெட்ரோலுக்கு 250 ரூபாய் செலவு”',
    parsedResult: [
      {
        type: 'income',
        amount: 1200,
        category: 'delivery',
        description: 'டெலிவரி வருமானம்',
        confidence: 0.97,
      },
      {
        type: 'expense',
        amount: 250,
        category: 'fuel',
        description: 'பெட்ரோல் செலவு',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'te-1',
    language: 'te',
    languageLabel: 'తెలుగు',
    phrase: 'ఈ రోజు డెలివరీ ద్వారా 1200 రూపాయలు సంపాదించాను మరియు పెట్రోల్ కోసం 250 ఖర్చు చేశాను',
    audioSimText: '“ఈ రోజు డెలివరీ ద్వారా 1200 రూపాయలు సంపాదించాను మరియు పెట్రోల్ కోసం 250 ఖర్చు చేశాను”',
    parsedResult: [
      {
        type: 'income',
        amount: 1200,
        category: 'delivery',
        description: 'డెలివరీ ఆదాయం',
        confidence: 0.96,
      },
      {
        type: 'expense',
        amount: 250,
        category: 'fuel',
        description: 'పెట్రోల్ ఖర్చు',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'mr-1',
    language: 'mr',
    languageLabel: 'मराठी',
    phrase: 'आज डिलिव्हरीमधून 1200 रुपये मिळाले आणि 250 रुपयांचे पेट्रोल भरले',
    audioSimText: '“आज डिलिव्हरीमधून 1200 रुपये मिळाले आणि 250 रुपयांचे पेट्रोल भरले”',
    parsedResult: [
      {
        type: 'income',
        amount: 1200,
        category: 'delivery',
        description: 'डिलिव्हरी कमाई',
        confidence: 0.97,
      },
      {
        type: 'expense',
        amount: 250,
        category: 'fuel',
        description: 'पेट्रोल खर्च',
        confidence: 0.96,
      },
    ],
  },
];
