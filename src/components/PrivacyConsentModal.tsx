import React from 'react';
import { Language } from '../types';
import { translations } from '../services/i18n';
import { ShieldCheck, Lock, EyeOff, Check, Cpu } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAcceptCloud: () => void;
  onChooseLocalOnly: () => void;
  language: Language;
}

export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  onAcceptCloud,
  onChooseLocalOnly,
  language,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.privacy.consentTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Responsible AI & Financial Data Minimization
            </p>
          </div>
        </div>

        <div className="py-4 space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>{t.privacy.consentDesc}</p>

          <div className="bg-slate-50 dark:bg-slate-700/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Zero Server Storage:</strong> Your
                full financial transactions, bank balances, and personal notes live strictly in your
                browser's local storage.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <EyeOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Data Minimization:</strong> When you
                ask Saathi a question, only anonymized aggregates (like approx. monthly income) are
                forwarded—never payee names or historical timestamps.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Cpu className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Air-Gapped Option:</strong> You can
                run 100% offline using our local rule-based heuristic engines without sending any data over the network.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onChooseLocalOnly}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {t.privacy.switchLocalBtn}
          </button>
          <button
            onClick={onAcceptCloud}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t.privacy.agreeBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
