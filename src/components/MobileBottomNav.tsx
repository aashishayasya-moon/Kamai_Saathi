import React from 'react';
import { Home, Wallet, Mic, TrendingUp, ShieldCheck, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onOpenVoiceModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  onOpenVoiceModal,
}) => {
  const t = translations[language];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] py-1 transition-colors ${
            currentTab === 'home'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none truncate">{t.nav.home}</span>
        </button>

        {/* 2. My Money (Ledger) */}
        <button
          onClick={() => onSelectTab('ledger')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] py-1 transition-colors ${
            currentTab === 'ledger'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none truncate">{t.nav.ledger}</span>
        </button>

        {/* 3. Center Elevated Voice FAB Button */}
        <div className="flex flex-col items-center justify-center flex-1 h-full min-w-[56px] -mt-4">
          <button
            onClick={onOpenVoiceModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Speak to log transaction"
          >
            <Mic className="w-6 h-6" />
          </button>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
            {t.actions.voiceLog}
          </span>
        </div>

        {/* 4. Plan & Loan */}
        <button
          onClick={() => onSelectTab('planner')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] py-1 transition-colors ${
            currentTab === 'planner'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none truncate">{t.nav.planner}</span>
        </button>

        {/* 5. Safety (Scam Shield) */}
        <button
          onClick={() => onSelectTab('safety')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-w-[48px] py-1 transition-colors ${
            currentTab === 'safety'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none truncate">{t.nav.safety}</span>
        </button>
      </div>
    </div>
  );
};
