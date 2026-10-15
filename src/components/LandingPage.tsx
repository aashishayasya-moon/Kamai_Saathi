import React, { useState } from 'react';
import { BrandLogo, BrandEmblem } from './BrandLogo';
import { Language } from '../types';
import { sampleVoiceScenarios } from '../services/i18n';
import {
  Mic,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  Globe,
  Zap,
  Play,
  Volume2,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [activeAudioLang, setActiveAudioLang] = useState<Language>('hi');

  const activeChip =
    sampleVoiceScenarios.find((s) => s.language === activeAudioLang) ||
    sampleVoiceScenarios[1];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo size="md" />

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value as Language)}
                className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 border-none focus:outline-none cursor-pointer"
                aria-label="Choose Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            <button
              onClick={onExploreDemo}
              className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Demo Preview
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-400/20 via-emerald-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>LG Ideathon 2026 · IIT Bombay</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Money clarity. <br />
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
              Safer choices for everyday earners.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The intelligent, inclusive financial companion built for gig delivery partners, auto drivers, home artisans, and students navigating irregular daily income.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              Explore Ramesh's Demo (Auto Partner)
            </button>
          </div>

          {/* Highlights Mini Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Voice logging in 6 Indian languages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Deterministic minor-unit math</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero-server data storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Signature Value Pillars */}
      <section className="py-16 bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Engineered for Real-World Financial Vulnerabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Voice & Audio Logging */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multilingual Audio & Voice Logging
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Speak or record audio in English, Kannada, Hindi, Tamil, Telugu, or Marathi. AI transcribes and proposes ledger entries for user review before committing.
              </p>
            </div>

            {/* Card 2: 14-Day Shortfall Forecaster */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                14-Day Shortfall Forecaster
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Anticipate cash deficits 6 days before loan EMIs and rent debits occur. Simulates weather shocks and tests emergency reserve taps deterministically.
              </p>
            </div>

            {/* Card 3: Scam Shield Threat Analyzer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Scam Shield Threat Intelligence
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Paste suspicious WhatsApp, SMS, or Telegram loan offers. Detects fake APK links, advance fee demands, and UPI collect traps with official RBI Sachet verification.
              </p>
            </div>

            {/* Card 4: Verified Government Welfare */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Verified Welfare Schemes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Access curated eligibility criteria and document preparation lists for PM-SVANidhi, e-Shram, PMSYM, and PMJJBY with official central portal links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Multilingual Audio Preview Strip */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Globe className="w-4 h-4" />
              <span>Inclusive Digital Accessibility</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Experience Multilingual Speech & Audio Transcription
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Tap a language to see how Kamai Saathi transcribes informal regional speech into structured financial ledger records:
            </p>
          </div>

          {/* Language Selector Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिन्दी' },
              { id: 'kn', label: 'ಕನ್ನಡ' },
              { id: 'ta', label: 'தமிழ்' },
              { id: 'te', label: 'తెలుగు' },
              { id: 'mr', label: 'मराठी' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveAudioLang(lang.id as Language)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  activeAudioLang === lang.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Interactive Player Mock Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Volume2 className="w-4 h-4 text-amber-500" />
                <span>Audio Note ({activeChip.languageLabel}):</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                AI Transcribed
              </span>
            </div>

            <blockquote className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-sm font-semibold text-slate-900 dark:text-white border-l-4 border-amber-500">
              {activeChip.audioSimText}
            </blockquote>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 mb-2">
                Structured Extraction Output:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeChip.parsedResult.map((res, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {res.description}
                      </span>
                      <span className="text-[10px] text-slate-500 block capitalize">
                        {res.category} ({res.type})
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        res.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {res.type === 'income' ? '+' : '-'}₹{res.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Privacy Section */}
      <section className="py-14 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Built on Financial Dignity & Privacy by Design
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Your transactions and balances reside exclusively on your device. We do not sell personal financial data or store personal bank balances on remote servers.
          </p>

          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 text-sm font-bold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 rounded-xl shadow transition-colors"
            >
              Launch Your Financial Companion →
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" />
          <div>
            LG Ideathon 2026 · IIT Bombay Prototype · Designed for Financial Inclusion
          </div>
        </div>
      </footer>
    </div>
  );
};
