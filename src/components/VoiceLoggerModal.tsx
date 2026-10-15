import React, { useState, useEffect, useRef } from 'react';
import { Language, Transaction, TransactionCategory } from '../types';
import { translations, sampleVoiceScenarios } from '../services/i18n';
import { formatINR, rupeesToPaise } from '../services/calculator';
import { geminiAudioService, StructuredTransactionCandidate } from '../services/geminiAudioService';
import {
  parseFinancialSpeech,
  normalizeSpokenFinancialText,
} from '../services/financialSpeechParser';
import {
  Mic,
  MicOff,
  Square,
  X,
  Check,
  AlertCircle,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Volume2,
  Play,
  RotateCcw,
  AudioWaveform as Waveform,
  Globe,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface VoiceLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmTransactions: (
    items: Omit<Transaction, 'id' | 'createdAt'>[]
  ) => void;
  isLocalOnly: boolean;
}

export const VoiceLoggerModal: React.FC<VoiceLoggerModalProps> = ({
  isOpen,
  onClose,
  language,
  onConfirmTransactions,
  isLocalOnly,
}) => {
  const t = translations[language];

  // Selected language for speech & audio
  const [transcribeLang, setTranscribeLang] = useState<Language>(language);

  // States
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedCandidates, setParsedCandidates] = useState<StructuredTransactionCandidate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setTranscribeLang(language);
  }, [language]);

  // Initialize SpeechRecognition when modal opens or language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const localeMap: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
      };
      recognition.lang = localeMap[transcribeLang] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions or use the one-tap test scenarios below.');
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Microphone notice: ${event.error}. You can also type or use test chips.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setIsSpeechSupported(false);
    }

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // Ignored
      }
    };
  }, [transcribeLang, isOpen]);

  if (!isOpen) return null;

  // Toggle Live Speech Recording
  const handleToggleListening = () => {
    setErrorMessage(null);

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // Ignored
      }
      setIsListening(false);
      if (transcript.trim()) {
        handleParseText(transcript);
      }
    } else {
      setTranscript('');
      setParsedCandidates([]);
      try {
        recognitionRef.current?.start();
      } catch (err: any) {
        console.warn('Recognition start issue, falling back to MediaRecorder:', err);
        startMediaRecorderFallback();
      }
    }
  };

  // Fallback MediaRecorder if browser speech recognition is unavailable
  const startMediaRecorderFallback = async () => {
    try {
      await geminiAudioService.startRecording();
      setIsListening(true);
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage('Microphone is not accessible. Please type your transaction or tap a test chip below.');
    }
  };

  const handleStopRecordingFallback = async () => {
    setIsListening(false);
    setIsParsing(true);
    try {
      const blob = await geminiAudioService.stopRecording();
      const res = await geminiAudioService.transcribeAudioBlob(blob, transcribeLang);
      setTranscript(res.transcript);
      setParsedCandidates(res.candidates);
    } catch (err: any) {
      setErrorMessage('Could not process audio. Please enter your text or tap a test chip below.');
    } finally {
      setIsParsing(false);
    }
  };

  // Parse Text (whether spoken or typed) via local parser and server-side engine
  const handleParseText = async (textToParse = transcript) => {
    const rawText = textToParse.trim();
    if (!rawText) {
      setErrorMessage('Please speak or type a sentence with amounts and categories.');
      return;
    }

    setIsParsing(true);
    setErrorMessage(null);

    // 1. Instant deterministic local parse so 12000, 12,000 etc. are immediately parsed with 0 latency
    const localCandidates = parseFinancialSpeech(rawText, transcribeLang);
    if (localCandidates.length > 0) {
      const formatted: StructuredTransactionCandidate[] = localCandidates.map((c) => ({
        type: c.type,
        amount: c.amount,
        amountPaise: rupeesToPaise(c.amount),
        category: c.category,
        description: c.description,
        confidence: c.confidence,
      }));
      setParsedCandidates(formatted);
    }

    // 2. Call backend for server-side verification and multimodal enhancement
    try {
      const res = await fetch('/api/voice/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: rawText,
          locale: transcribeLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.candidates && data.candidates.length > 0) {
          const formatted: StructuredTransactionCandidate[] = data.candidates.map((c: any) => ({
            type: c.type === 'expense' ? 'expense' : 'income',
            amount: Math.abs(Number(c.amount) || 0),
            amountPaise: rupeesToPaise(Math.abs(Number(c.amount) || 0)),
            category: (c.category || 'delivery') as TransactionCategory,
            description: String(c.description || (c.type === 'expense' ? 'Daily Expense' : 'Daily Earnings')),
            confidence: Math.min(Math.max(Number(c.confidence) || 0.95, 0.5), 0.99),
          }));
          setParsedCandidates(formatted);
        }
      } else if (localCandidates.length === 0) {
        setErrorMessage('No distinct financial numbers were detected. (e.g. try: "Spent 250 on petrol and received 12000 from delivery")');
      }
    } catch (err) {
      // If server is unreachable, local parse already preserved the candidate
      if (localCandidates.length === 0) {
        setErrorMessage('Could not connect to financial parsing service. Please try again.');
      }
    } finally {
      setIsParsing(false);
    }
  };

  // 1-Tap 6 Native Language Test Scenario Trigger
  const handleSelectScenario = async (chip: (typeof sampleVoiceScenarios)[0]) => {
    setTranscribeLang(chip.language);
    const phrase = chip.audioSimText || chip.phrase;
    setTranscript(phrase);
    setErrorMessage(null);
    await handleParseText(phrase);
  };

  // Modify candidate item fields if user wants to adjust
  const handleUpdateCandidate = (
    index: number,
    field: keyof StructuredTransactionCandidate,
    value: any
  ) => {
    setParsedCandidates((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === 'amount') {
          updated.amountPaise = rupeesToPaise(Number(value) || 0);
        }
        return updated;
      })
    );
  };

  const handleRemoveCandidate = (index: number) => {
    setParsedCandidates((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Confirm and Save to deterministic ledger
  const handleConfirm = () => {
    if (parsedCandidates.length === 0) return;

    const itemsToSave = parsedCandidates.map((c) => ({
      type: c.type,
      amount: c.amount,
      amountPaise: c.amountPaise || rupeesToPaise(c.amount),
      currency: 'INR' as const,
      category: c.category,
      date: new Date().toISOString().split('T')[0],
      description: c.description,
      entryMethod: 'voice' as const,
      confirmationStatus: 'confirmed' as const,
    }));

    onConfirmTransactions(itemsToSave);
    onClose();
  };

  const languageLabels: Record<Language, string> = {
    en: 'English (Indian)',
    hi: 'हिन्दी (Hindi)',
    kn: 'ಕನ್ನಡ (Kannada)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    mr: 'मराठी (Marathi)',
  };

  const categories: TransactionCategory[] = [
    'delivery',
    'trips',
    'salary',
    'daily_wages',
    'sales',
    'fuel',
    'groceries',
    'food',
    'rent',
    'emi',
    'medical',
    'utilities',
    'education',
    'savings',
    'other',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.actions.voiceLog}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Live Voice
                </span>
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Speak earnings & expenses in any of the 6 Indian languages
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection Row */}
        <div className="mt-4 flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/80 dark:border-slate-600">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="w-4 h-4 text-amber-500" />
            <span>Spoken Language:</span>
          </div>
          <select
            value={transcribeLang}
            onChange={(e) => setTranscribeLang(e.target.value as Language)}
            className="text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
          >
            {(Object.keys(languageLabels) as Language[]).map((l) => (
              <option key={l} value={l}>
                {languageLabels[l]}
              </option>
            ))}
          </select>
        </div>

        {/* Recording Visualizer & Big Mic Button */}
        <div className="py-5 flex flex-col items-center text-center">
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-red-500/25 animate-ping pointer-events-none" />
            )}
            <button
              onClick={handleToggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white ring-8 ring-red-200 dark:ring-red-900/50 hover:bg-red-600 animate-pulse'
                  : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white ring-8 ring-amber-100 dark:ring-amber-950/40 hover:scale-105'
              }`}
              aria-label={isListening ? 'Stop Listening' : 'Start Microphone'}
            >
              {isListening ? <Square className="w-7 h-7 fill-white" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="mt-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {isListening ? `Listening in ${languageLabels[transcribeLang]}... (Tap to finish)` : 'Tap Microphone & Speak'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-0.5">
              Say your daily income or expenses naturally (e.g. "Got 1200 from trips and spent 250 on petrol")
            </p>
          </div>

          {isParsing && (
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-400 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Analyzing speech & extracting ledger entries...</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Editable Transcript Area */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Waveform className="w-3.5 h-3.5 text-amber-500" />
              <span>Spoken Transcript (Editable):</span>
            </div>
            {transcript && (
              <button
                onClick={() => handleParseText()}
                disabled={isParsing}
                className="text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-parse Text</span>
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              rows={2}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your live speech will appear here. You can also type or edit anytime..."
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* 6 Native Language Test Scenario Chips (Guaranteed Infallible Testing) */}
        <div className="border-t border-slate-100 dark:border-slate-700/60 pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Tap Test Voice Scenarios (All 6 Languages):</span>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Instant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {sampleVoiceScenarios.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleSelectScenario(chip)}
                disabled={isParsing || isListening}
                className="text-left p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-700 transition-all text-xs group disabled:opacity-50"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-0.5">
                  <span className="text-amber-600 dark:text-amber-400">{chip.languageLabel}</span>
                  <Play className="w-3 h-3 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                  "{chip.audioSimText || chip.phrase}"
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Proposed Transaction Review Card (Fully Editable) */}
        {parsedCandidates.length > 0 && (
          <div className="mt-5 border-t border-slate-100 dark:border-slate-700/60 pt-4 space-y-3 bg-amber-50/50 dark:bg-slate-700/30 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-5 sm:p-6 rounded-b-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Extracted Transactions Review
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verify or edit items below before adding to your ledger
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                {parsedCandidates.length} Item(s) Ready
              </span>
            </div>

            <div className="space-y-2.5">
              {parsedCandidates.map((item, idx) => {
                const isIncome = item.type === 'income';
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Type Toggle Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateCandidate(idx, 'type', isIncome ? 'expense' : 'income')
                          }
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          <span>{isIncome ? 'Income (+)' : 'Expense (-)'}</span>
                        </button>

                        {/* Category Dropdown */}
                        <select
                          value={item.category}
                          onChange={(e) =>
                            handleUpdateCandidate(idx, 'category', e.target.value as TransactionCategory)
                          }
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 border-none focus:ring-1 focus:ring-amber-500 cursor-pointer capitalize font-semibold"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveCandidate(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateCandidate(idx, 'description', e.target.value)}
                        placeholder="Description"
                        className="text-xs sm:text-sm font-semibold px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg flex-1 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">₹</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            handleUpdateCandidate(idx, 'amount', parseFloat(e.target.value) || 0)
                          }
                          className="w-28 sm:w-32 text-xs sm:text-sm font-bold font-mono px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 px-0.5">
                      <span className="font-medium">
                        Recognized Amount:{' '}
                        <strong className="text-slate-900 dark:text-white font-mono font-bold">
                          {formatINR(item.amountPaise || rupeesToPaise(item.amount))}
                        </strong>
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        Confidence {Math.round((item.confidence || 0.95) * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setParsedCandidates([])}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Add to Ledger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
