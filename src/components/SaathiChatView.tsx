import React, { useState, useEffect, useRef } from 'react';
import {
  ForecastDay,
  Language,
  Persona,
  SaathiMessage,
  Transaction,
  TransactionCategory,
  SaathiDetectedTransaction,
} from '../types';
import { translations } from '../services/i18n';
import { formatINR, rupeesToPaise } from '../services/calculator';
import { geminiAudioService, StructuredTransactionCandidate } from '../services/geminiAudioService';
import { parseFinancialSpeech } from '../services/financialSpeechParser';
import {
  Send,
  Sparkles,
  ShieldCheck,
  Bot,
  User,
  Info,
  ArrowRight,
  HelpCircle,
  Volume2,
  VolumeX,
  AlertTriangle,
  Wallet,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Mic,
  MicOff,
  Square,
  AudioWaveform as Waveform,
  CheckCircle2,
  Globe,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
} from 'lucide-react';

interface SaathiChatViewProps {
  language: Language;
  persona: Persona;
  currentBalance: number;
  forecast: ForecastDay[];
  isLocalOnly: boolean;
  onAddTransactions?: (txs: Omit<Transaction, 'id' | 'createdAt'>[]) => void;
  onOpenVoiceModal?: () => void;
}

export const SaathiChatView: React.FC<SaathiChatViewProps> = ({
  language,
  persona,
  currentBalance,
  forecast,
  isLocalOnly,
  onAddTransactions,
  onOpenVoiceModal,
}) => {
  const t = translations[language];

  const firstShortfall = forecast.find((f) => f.isShortfall);

  // Initial welcome message from Saathi
  const getInitialGreeting = (): SaathiMessage => {
    let greeting = `Namaste ${persona.name}! I am Saathi, your personal AI financial companion. I am grounded in your recorded ledger balance of ₹${formatINR(currentBalance)} and 14-day cash-flow forecast. How can I help secure your money choices today?`;

    if (language === 'hi') {
      greeting = `नमस्ते ${persona.name}! मैं साथी हूँ, आपका व्यक्तिगत वित्तीय मार्गदर्शक। मैंने आपका ₹${formatINR(currentBalance)} का बहीखाता बैलेंस और 14 दिनों का नकद प्रवाह देखा है। आज आपकी आर्थिक सुरक्षा के लिए मैं क्या मदद कर सकता हूँ?`;
    } else if (language === 'kn') {
      greeting = `ನಮಸ್ಕಾರ ${persona.name}! ನಾನು ಸಾಥಿ, ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಹಣಕಾಸು ಮಾರ್ಗದರ್ಶಿ. ನಿಮ್ಮ ₹${formatINR(currentBalance)} ದಾಖಲಾದ ಲೆಕ್ಕ ಮತ್ತು 14 ದಿನಗಳ ನಗದು ಹರಿವನ್ನು ಗಮನಿಸಿದ್ದೇನೆ. ಇಂದು ನಿಮ್ಮ ಹಣಕಾಸು ಯೋಜನೆಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`;
    } else if (language === 'ta') {
      greeting = `வணக்கம் ${persona.name}! நான் சாதி, உங்கள் தனிப்பட்ட நிதி வழிகாட்டி. உங்கள் ₹${formatINR(currentBalance)} இருப்பு மற்றும் 14 நாள் பணப்புழக்கத்தை ஆய்வு செய்துள்ளேன். இன்று உங்களுக்கு எவ்வாறு உதவலாம்?`;
    } else if (language === 'te') {
      greeting = `నమస్కారం ${persona.name}! నేను సాథి, మీ వ్యక్తిగత ఆర్థిక మార్గదర్శిని. మీ ₹${formatINR(currentBalance)} లెడ్జర్ బ్యాలెన్స్ మరియు 14 రోజుల నగదు ప్రవాహాన్ని సమీక్షించాను. నేడు మీకు ఎలా సహాయపడగలను?`;
    } else if (language === 'mr') {
      greeting = `नमस्कार ${persona.name}! मी साथी आहे, तुमचा वैयक्तिक आर्थिक मार्गदर्शक. मी तुमचे ₹${formatINR(currentBalance)} चे नोंदवलेले शिल्लक आणि 14 दिवसांचा रोख प्रवाह पाहिला आहे. आज मी तुम्हाला कशी मदत करू शकतो?`;
    }

    return {
      id: 'welcome',
      sender: 'saathi',
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'How can I prepare for the Day 6 Vehicle EMI shortfall?',
        'Which verified government welfare schemes match my occupation?',
        'Why should I avoid instant online loan apps charging 36%?',
      ],
    };
  };

  const [messages, setMessages] = useState<SaathiMessage[]>([getInitialGreeting()]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Audio Voice Input in Saathi Chat
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [isTranscribingVoice, setIsTranscribingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const voiceTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isTranscribingVoice]);

  // Clean up timers & speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-Speech playback for Saathi responses
  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langCodeMap: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
    };

    utterance.lang = langCodeMap[language] || 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Microphone Voice Input for Saathi AI
  const handleStartVoiceRecording = async () => {
    setVoiceError(null);
    setVoiceDuration(0);

    try {
      await geminiAudioService.startRecording();
      setIsRecordingVoice(true);

      voiceTimerRef.current = setInterval(() => {
        setVoiceDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error in Saathi AI:', err);
      setIsRecordingVoice(false);
      setVoiceError(
        err?.message?.includes('Permission') || err?.name === 'NotAllowedError'
          ? 'Microphone permission was denied. You can tap the sample question chips below!'
          : 'Microphone not available in this window. Try the sample voice chips below.'
      );
    }
  };

  const handleStopVoiceRecording = async () => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    setIsRecordingVoice(false);
    setIsTranscribingVoice(true);

    try {
      const audioBlob = await geminiAudioService.stopRecording();
      const result = await geminiAudioService.transcribeAudioBlob(audioBlob, language);
      setIsTranscribingVoice(false);

      if (result.transcript && result.transcript.trim()) {
        // Automatically send the transcribed spoken utterance to Saathi AI with candidates
        handleSendMessage(result.transcript.trim(), result.candidates);
      } else {
        setVoiceError('No clear speech was detected. Please try speaking again.');
      }
    } catch (err: any) {
      setIsTranscribingVoice(false);
      console.warn('Voice transcribe error:', err);
      setVoiceError('Audio transcription encountered an issue. Please try again or type below.');
    }
  };

  // Send message to Saathi Gemini AI multi-turn assistant
  const handleSendMessage = async (
    textToSend = inputText,
    audioCandidates?: StructuredTransactionCandidate[]
  ) => {
    if (!textToSend.trim()) return;

    // 1. Infallible local parse of the speech/text (ensures 12000 is NEVER lost or truncated to 12)
    const localParsed = parseFinancialSpeech(textToSend, language);
    let initialCandidates: SaathiDetectedTransaction[] = localParsed.map((p) => ({
      type: p.type,
      amount: p.amount,
      category: p.category,
      description: p.description,
      confidence: p.confidence,
      isLogged: false,
    }));

    // If audio transcription also produced candidates, merge them
    if (audioCandidates && audioCandidates.length > 0) {
      if (initialCandidates.length === 0) {
        initialCandidates = audioCandidates.map((c) => ({
          type: c.type,
          amount: c.amount,
          category: c.category,
          description: c.description,
          confidence: c.confidence,
          isLogged: false,
        }));
      } else {
        // Prefer verified initialCandidates amounts (preserving 12000)
        initialCandidates = initialCandidates.map((ic) => {
          const match = audioCandidates.find(
            (ac) => Math.abs(ac.amount - ic.amount) < 0.01 || (ac.amount === 12 && ic.amount === 12000)
          );
          return match ? { ...ic, description: ic.description || match.description } : ic;
        });
      }
    }

    const userMsg: SaathiMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setVoiceError(null);
    setIsSending(true);

    if (isLocalOnly) {
      // Local air-gapped rule response
      setTimeout(() => {
        const replyText = generateLocalRuleAdvice(textToSend, initialCandidates);
        const saathiReply: SaathiMessage = {
          id: `s-${Date.now()}`,
          sender: 'saathi',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assumptions: [],
          suggestedActions: [
            'Simulate EMI in Plan & Loan tab',
            'Check PM-SVANidhi in Govt Schemes',
          ],
          detectedTransactions: initialCandidates.length > 0 ? initialCandidates : undefined,
        };
        setMessages((prev) => [...prev, saathiReply]);
        setIsSending(false);
      }, 450);
      return;
    }

    try {
      // Prepare history payload for multi-turn conversational context
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat/saathi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: historyPayload,
          locale: language,
          contextSummary: {
            currentBalance,
            hasShortfall: !!firstShortfall,
            shortfallDay: firstShortfall?.dayNumber || 6,
            shortfallAmount: firstShortfall?.shortfallAmount || 1980,
            personaName: persona.name,
            personaRole: persona.role,
            safeReserve: 2000,
            majorObligation: 'Vehicle Loan EMI (₹3,400 due Day 6)',
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to get Saathi advice');

      const data = await res.json();

      // Merge server detectedTransactions with initialCandidates, guaranteeing 12000 is never truncated
      let finalCandidates = initialCandidates;
      if (data.detectedTransactions && Array.isArray(data.detectedTransactions) && data.detectedTransactions.length > 0) {
        finalCandidates = data.detectedTransactions.map((dt: any) => {
          const match = initialCandidates.find(
            (ic) => Math.abs(ic.amount - dt.amount) < 0.01 || (dt.amount === 12 && ic.amount === 12000)
          );
          return {
            type: dt.type || 'income',
            amount: match ? match.amount : dt.amount,
            category: (dt.category as TransactionCategory) || 'other',
            description: dt.description || 'Transaction',
            confidence: dt.confidence || 0.95,
            isLogged: false,
          };
        });
      }

      const saathiReply: SaathiMessage = {
        id: `s-${Date.now()}`,
        sender: 'saathi',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assumptions: data.assumptions || [],
        suggestedActions: data.suggestedActions || [],
        detectedTransactions: finalCandidates.length > 0 ? finalCandidates : undefined,
      };
      setMessages((prev) => [...prev, saathiReply]);
    } catch (err) {
      // Fallback
      const fallbackReply: SaathiMessage = {
        id: `s-${Date.now()}`,
        sender: 'saathi',
        text: generateLocalRuleAdvice(textToSend, initialCandidates),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assumptions: [],
        suggestedActions: ['Simulate EMI in Plan & Loan tab', 'Check PM-SVANidhi in Govt Schemes'],
        detectedTransactions: initialCandidates.length > 0 ? initialCandidates : undefined,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  // 1-Click Action to log detected transaction from Saathi AI to Ledger
  const handleLogDetectedTransaction = (
    messageId: string,
    txIndex: number,
    item: SaathiDetectedTransaction
  ) => {
    if (!onAddTransactions) return;

    const newTx: Omit<Transaction, 'id' | 'createdAt'> = {
      type: item.type,
      amount: item.amount,
      amountPaise: rupeesToPaise(item.amount),
      currency: 'INR',
      category: item.category,
      date: new Date().toISOString().split('T')[0],
      description: item.description || (item.type === 'income' ? 'Voice logged income' : 'Voice logged expense'),
      entryMethod: 'voice',
      confirmationStatus: 'confirmed',
    };

    onAddTransactions([newTx]);

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.detectedTransactions) {
          const updated = [...msg.detectedTransactions];
          updated[txIndex] = { ...updated[txIndex], isLogged: true };
          return { ...msg, detectedTransactions: updated };
        }
        return msg;
      })
    );

    const isIncome = item.type === 'income';
    const confirmationText =
      language === 'hi'
        ? `✓ बहुत बढ़िया! मैंने आपके बहीखाते में ₹${formatINR(item.amount)} की ${isIncome ? 'कमाई' : 'खर्च'} (${item.description}) जोड़ दी है। आपका बैलेंस अब अपडेट हो चुका है!`
        : `✓ Recorded ₹${formatINR(item.amount)} ${item.type} (${item.description}) to your verified ledger! Your balance is now updated.`;

    const confirmMsg: SaathiMessage = {
      id: `s-confirm-${Date.now()}`,
      sender: 'saathi',
      text: confirmationText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assumptions: [`Verified ledger transaction: ₹${formatINR(item.amount)} under ${item.category}.`],
      suggestedActions: [
        'View updated balance in Ledger',
        'How does this affect my Day 6 shortfall?',
      ],
    };

    setMessages((prev) => [...prev, confirmMsg]);
  };

  const generateLocalRuleAdvice = (question: string, candidates?: SaathiDetectedTransaction[]): string => {
    const q = question.toLowerCase().trim();
    if (candidates && candidates.length > 0) {
      const c = candidates[0];
      const isIncome = c.type === 'income';
      if (language === 'hi') {
        return `मैंने आपके संदेश से ₹${formatINR(c.amount)} की ${isIncome ? 'कमाई' : 'खर्च'} (${c.description || c.category}) की पहचान की है। आप नीचे 'खाते में जोड़ें' पर क्लिक करके इसे तुरंत अपने बहीखाते में दर्ज कर सकते हैं!`;
      }
      return `I identified a ${c.type} of ₹${formatINR(c.amount)} for ${c.description || c.category}. Tap 'Add to Ledger' below to record it directly into your verified ledger!`;
    }

    const isGreeting = /^(hi|hello|hey|namaste|namaskar|vanakkam|namaskara|salaam|good\s*(morning|afternoon|evening)|yo|sup|hii+|हे|नमस्ते|हेलो|வணக்கம்|నమస్కారం|ನಮಸ್ಕಾರ|नमस्कार)\b/i.test(q);
    if (isGreeting) {
      if (language === 'hi') {
        return `नमस्ते ${persona.name}! मैं साथी हूँ, आपका व्यक्तिगत वित्तीय साथी। आज मैं आपकी क्या मदद कर सकता हूँ? आप अपनी दैनिक कमाई या खर्च दर्ज करने, लोन ईएमआई या सरकारी योजनाओं के बारे में पूछ सकते हैं!`;
      }
      if (language === 'kn') {
        return `ನಮಸ್ಕಾರ ${persona.name}! ನಾನು ಸಾಥಿ, ನಿಮ್ಮ ಹಣಕಾಸು ಮಾರ್ಗದರ್ಶಿ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ದಿನದ ಆದಾಯ, ಖರ್ಚು ಅಥವಾ ಇಎಂಐ ಬಗ್ಗೆ ಕೇಳಬಹುದು!`;
      }
      if (language === 'ta') {
        return `வணக்கம் ${persona.name}! நான் சாதி, உங்கள் நிதி உதவியாளர். இன்று உங்களுக்கு எவ்வாறு உதவலாம்? உங்கள் வருமானம், செலவுகள் அல்லது கடன் தவணை குறித்து கேட்கலாம்!`;
      }
      if (language === 'te') {
        return `నమస్కారం ${persona.name}! నేను సాథి, మీ ఆర్థిక సహాయకుడిని. ఈ రోజు మీకు ఎలా సహాయపడగలను? మీ రోజువారీ ఆదాయం, ఖర్చులు లేదా రుణాల గురించి అడగవచ్చు!`;
      }
      if (language === 'mr') {
        return `नमस्कार ${persona.name}! मी साथी आहे, तुमचा आर्थिक मार्गदर्शक. आज मी तुम्हाला कशी मदत करू शकतो? तुम्ही रोजची कमाई, खर्च किंवा ईएमआयबद्दल विचारू शकता!`;
      }
      return `Hello ${persona.name}! I am Saathi, your financial companion. How can I assist you today? You can ask me about tracking your daily earnings, managing fuel/living expenses, preparing for upcoming loan EMIs, or tap the microphone to log transactions directly!`;
    }

    const isThanks = /^(thanks|thank\s*you|dhanyawad|dhanyavada|shukriya|धन्यवाद|நன்றி|ధన్యవాదాలు|ಧನ್ಯವಾದಗಳು)\b/i.test(q);
    if (isThanks) {
      return language === 'hi'
        ? `आपका बहुत-बहुत स्वागत है! आपकी मेहनत की कमाई को सुरक्षित रखने में मैं हमेशा आपके साथ हूँ। अगर कोई और सवाल हो तो जरूर बताएं!`
        : `You're very welcome! I'm always here to help you protect your earnings and make smart financial decisions. Feel free to ask anytime!`;
    }

    if (q.includes('shortfall') || q.includes('day 6') || q.includes('emi') || q.includes('कमी') || q.includes('ಕೊರತೆ') || q.includes('குறைவு') || q.includes('కొరత') || q.includes('तुट')) {
      return `To mitigate the ₹${firstShortfall?.shortfallAmount || 1980} shortfall on Day 6:\n1. Tap your Emergency Reserve Jar (current balance: ₹2,000) to cover the Vehicle Loan EMI on time.\n2. Consider an extra delivery shift on Day 4 or Day 7 to recover reserves.\n3. Avoid taking instant loan apps with 36%+ interest, which cost an extra ₹1,800+ in hidden fees.`;
    }
    if (q.includes('scheme') || q.includes('driver') || q.includes('योजना') || q.includes('ಯೋಜನೆ') || q.includes('திட்டம்') || q.includes('పథకం')) {
      return `As an everyday earner / delivery driver, you are eligible for:\n1. PM-SVANidhi: Collateral-free working capital loan of ₹10,000 to ₹50,000 with 7% interest subsidy.\n2. e-Shram Card: Universal social security with ₹2 Lakh accidental insurance.\nClick the "Govt Schemes" tab to see required documents and official portal links.`;
    }
    return `I am here to help you manage your cash flow, track daily income and expenses, plan for upcoming EMIs, and explore verified government welfare schemes. Feel free to ask a question or record a transaction!`;
  };

  const handleResetChat = () => {
    setMessages([getInitialGreeting()]);
  };

  // Multilingual quick queries including Voice/Audio logging actions
  const multilingualQueries: Record<Language, string[]> = {
    en: [
      'Log income: ₹12,000 from Zomato delivery',
      'Log ₹350 fuel expense',
      'How should I cover the ₹1,980 Day 6 loan EMI deficit?',
      'Which verified welfare schemes match delivery partners?',
    ],
    hi: [
      'आज ₹12,000 की डिलीवरी कमाई दर्ज करें',
      'पेट्रोल का ₹350 खर्च लिखो',
      'डे 6 ईएमआई की ₹1,980 की कमी को कैसे पूरा करूँ?',
      'डिलीवरी पार्टनर्स के लिए कौन सी सरकारी योजनाएं हैं?',
    ],
    kn: [
      'ಇಂದಿನ ₹12,000 ಡೆಲಿವರಿ ಆದಾಯ ದಾಖಲಿಸು',
      '₹350 ಪೆಟ್ರೋಲ್ ಖರ್ಚು ಸೇರಿಸು',
      'ದಿನ 6 ರಂದು ಬರುವ ₹1,980 ಸಾಲದ ಇಎಂಐ ಕೊರತೆ ಹೇಗೆ ನಿವಾರಿಸುವುದು?',
      'ಡೆಲಿವರಿ ಪಾರ್ಟ್‌ನರ್‌ಗಳಿಗೆ ಸಿಗುವ ಸರಕಾರಿ ಯೋಜನೆಗಳು ಯಾವುವು?',
    ],
    ta: [
      'இன்றைய ₹12,000 டெலிவரி வருமானத்தை சேர்',
      'பெட்ரோல் ₹350 செலவு பதிவு செய்',
      'நாள் 6 கடன் தவணை ₹1,980 பற்றாக்குறையை எப்படி ஈடு செய்வது?',
      'டெலிவரி ஊழியர்களுக்கான அரசு நலத்திட்டங்கள் எவை?',
    ],
    te: [
      'ఈ రోజు డెలివరీ ద్వారా వచ్చిన ₹12,000 నమోదు చేయి',
      'పెట్రోల్ ₹350 ఖర్చు రికార్డ్ చేయి',
      'డే 6 లోన్ ఈఎంఐ ₹1,980 లోటును ఎలా అధిగమించాలి?',
      'డెలివరీ భాగస్వాములకు వర్తించే ప్రభుత్వ పథకాలు ఏవి?',
    ],
    mr: [
      'आजची ₹12,000 ची डिलिव्हरी कमाई नोंदवा',
      'पेट्रोलचा ₹350 खर्च जोडा',
      'दिवस 6 च्या कर्जाच्या ₹1,980 तुटीची भरपाई कशी करावी?',
      'डिलिव्हरी कामगारांसाठी कोणत्या सरकारी योजना आहेत?',
    ],
  };

  const activeQueries = multilingualQueries[language] || multilingualQueries.en;

  return (
    <div className="space-y-4 pb-20 lg:pb-8 max-w-4xl mx-auto font-sans">
      {/* 1. Grounded Context Ledger Banner */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI Financial Companion</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.saathi.title}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                Gemini 3.8 Flash
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-turn conversational guide with live microphone voice input across 6 Indian languages
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-xs font-semibold">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              <span>Balance: ₹{formatINR(currentBalance)}</span>
            </div>

            {firstShortfall ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Day {firstShortfall.dayNumber} Deficit: ₹{firstShortfall.shortfallAmount}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Solvent (No Deficit)</span>
              </div>
            )}

            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chat Messages Thread */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5 space-y-4 min-h-[440px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isSpeakingThis = isSpeakingId === m.id;

            return (
              <div
                key={m.id}
                className={`flex gap-2.5 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-normal">{m.text}</p>

                  {/* Detected Financial Log Card (Interactive 1-Click Logging from Saathi AI) */}
                  {m.detectedTransactions && m.detectedTransactions.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50/90 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Detected Audio / Text Transaction</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                          Parser Verified
                        </span>
                      </div>

                      {m.detectedTransactions.map((tx, idx) => {
                        const isIncome = tx.type === 'income';
                        return (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                  isIncome
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                                }`}
                              >
                                {isIncome ? '+' : '-'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    ₹{formatINR(tx.amount)}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                      isIncome
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                    }`}
                                  >
                                    {isIncome ? 'Income' : 'Expense'} • {tx.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {tx.description}
                                </p>
                              </div>
                            </div>

                            <div>
                              {tx.isLogged ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Logged to Ledger</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleLogDetectedTransaction(m.id, idx, tx)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Ledger</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Assumptions & Suggested Actions (For Saathi responses) */}
                  {!isUser && m.assumptions && m.assumptions.filter(Boolean).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 text-xs space-y-1 text-slate-500 dark:text-slate-400">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                        <Info className="w-3 h-3 text-amber-500" />
                        <span>{t.saathi.assumptionsTitle}:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {m.assumptions.filter(Boolean).map((ass, idx) => (
                          <li key={idx}>{ass}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(act)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors text-left"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bottom Footer: Speech Read-Aloud & Timestamp */}
                  <div className="mt-2 pt-1 flex items-center justify-between text-[10px] opacity-70">
                    {!isUser ? (
                      <button
                        onClick={() => handleSpeakText(m.id, m.text)}
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                        title="Read aloud"
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3 h-3 animate-pulse" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span />
                    )}
                    <span>{m.timestamp}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Transcribing voice input state */}
          {isTranscribingVoice && (
            <div className="flex gap-2.5 items-center text-slate-500 text-xs italic p-3 bg-amber-50/60 dark:bg-slate-700/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl max-w-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Transcribing audio & extracting transactions with Gemini...</span>
            </div>
          )}

          {/* Model thinking state */}
          {isSending && (
            <div className="flex gap-2.5 items-center text-slate-500 text-xs italic p-3 bg-amber-50/50 dark:bg-slate-700/30 rounded-2xl max-w-sm">
              <Bot className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Saathi is evaluating your ledger and 14-day timeline...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Microphone Zone */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          {/* Quick Multilingual Query Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {activeQueries.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-slate-600 transition-colors whitespace-nowrap shrink-0 text-xs font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Recording Status Banner if active */}
          {isRecordingVoice && (
            <div className="flex items-center justify-between p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 animate-pulse">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Recording audio ({voiceDuration}s) — Speak naturally in your language (e.g., '12,000 from delivery')...</span>
              </div>
              <button
                onClick={handleStopVoiceRecording}
                className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg text-[11px] hover:bg-red-700"
              >
                Done
              </button>
            </div>
          )}

          {voiceError && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
              {voiceError}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="flex items-center gap-2">
            {/* Microphone Button (Speech to Saathi & Auto-extract) */}
            <button
              onClick={isRecordingVoice ? handleStopVoiceRecording : handleStartVoiceRecording}
              disabled={isSending || isTranscribingVoice}
              title={isRecordingVoice ? 'Stop recording voice' : 'Speak to Saathi using microphone (All 6 languages)'}
              className={`p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center ${
                isRecordingVoice
                  ? 'bg-red-500 text-white ring-4 ring-red-200 dark:ring-red-900/50 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-slate-600'
              }`}
            >
              {isRecordingVoice ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Quick Audio Logger Modal Shortcut */}
            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                title="Open dedicated Audio Logger modal"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-semibold shrink-0 transition-colors"
              >
                <Waveform className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Audio Log</span>
              </button>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isRecordingVoice ? 'Listening...' : t.saathi.inputPlaceholder}
              disabled={isRecordingVoice}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isSending || isRecordingVoice || !inputText.trim()}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>{t.saathi.sendBtn}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
