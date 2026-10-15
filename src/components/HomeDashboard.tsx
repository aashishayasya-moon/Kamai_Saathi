import React from 'react';
import {
  ForecastDay,
  Language,
  Persona,
  Transaction,
} from '../types';
import { translations } from '../services/i18n';
import { formatINR } from '../services/calculator';
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Mic,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Info,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface HomeDashboardProps {
  currentBalance: number;
  transactions: Transaction[];
  forecast: ForecastDay[];
  language: Language;
  persona: Persona;
  onOpenVoiceModal: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSchemesModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentBalance,
  transactions,
  forecast,
  language,
  persona,
  onOpenVoiceModal,
  onNavigateTab,
  onOpenSchemesModal,
}) => {
  const t = translations[language];

  // Identify first shortfall day if any
  const firstShortfall = forecast.find((f) => f.isShortfall);

  // Calculate 7-day projected inflow
  const sevenDayInflow = forecast
    .slice(0, 7)
    .reduce((acc, f) => acc + f.daytimeIncome, 0);

  // Calculate 7-day scheduled obligations
  const sevenDayOutflow = forecast
    .slice(0, 7)
    .reduce((acc, f) => acc + f.scheduledDebits, 0);

  const confirmedTransactions = transactions
    .filter((tx) => tx.confirmationStatus === 'confirmed')
    .slice(-4)
    .reverse();

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* 1. Persona Spotlight & Context Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <TrendingUp className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <span>Earner Profile</span>
              <span aria-hidden="true">·</span>
              <span>{persona.location}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {persona.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {persona.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow transition-colors whitespace-nowrap"
            >
              <Mic className="w-4 h-4 text-slate-900" />
              <span>{t.actions.voiceLog}</span>
            </button>
            <button
              onClick={() => onNavigateTab('planner')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl transition-colors whitespace-nowrap"
            >
              <span>{t.actions.simulate}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Metric Strip: Balance, 7-Day Inflow, Upcoming Outflows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Recorded Balance */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{t.dashboard.recordedBalance}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Verified Ledger</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatINR(currentBalance, true)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Strict deterministic ledger math</span>
          </div>
        </div>

        {/* Metric 2: 7-Day Expected Inflow */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{t.dashboard.sevenDayInflow}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Projected</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            +{formatINR(sevenDayInflow)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Based on {persona.workingDaysWeeklyIncome > 0 ? `₹${persona.workingDaysWeeklyIncome}/day` : 'past averages'}</span>
          </div>
        </div>

        {/* Metric 3: Upcoming 7-Day Obligations */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{t.dashboard.upcomingObligations}</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Next 7 Days</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-800 dark:text-slate-100">
            -{formatINR(sevenDayOutflow)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Includes mandatory loan EMI & rent</span>
          </div>
        </div>
      </div>

      {/* 3. Shortfall Alert Banner or Safe Outlook */}
      {firstShortfall ? (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-red-950 dark:text-red-200">
                  {t.dashboard.shortfallAlertTitle}: Deficit of {formatINR(firstShortfall.shortfallAmount)} on {firstShortfall.dateString}
                </h2>
                <span className="text-xs font-bold text-red-700 dark:text-red-400 px-2.5 py-0.5 bg-red-100 dark:bg-red-900/60 rounded-md whitespace-nowrap self-start">
                  High Priority
                </span>
              </div>

              <p className="text-sm text-red-900 dark:text-red-300 mt-1.5 leading-relaxed">
                {t.dashboard.shortfallAlertDesc}
              </p>

              {/* Actionable Next Steps */}
              <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-900/60 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateTab('planner')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm transition-colors"
                >
                  Simulate EMI Adjustment
                </button>
                <button
                  onClick={onOpenSchemesModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-red-900 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg transition-colors"
                >
                  Check PM-SVANidhi Loan Scheme
                </button>
                <button
                  onClick={() => onNavigateTab('saathi')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Ask Saathi Coach →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
              {t.dashboard.noShortfallTitle}
            </h2>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-0.5">
              {t.dashboard.noShortfallDesc}
            </p>
          </div>
        </div>
      )}

      {/* 4. Two-Column Desktop Section: Recent Transactions + Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.dashboard.recentActivity}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Confirmed entries touching your official ledger
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('ledger')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
            >
              <span>{t.dashboard.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {confirmedTransactions.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-500 text-sm">
              <p>{t.dashboard.emptyTransactions}</p>
              <button
                onClick={onOpenVoiceModal}
                className="mt-3 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
              >
                {t.actions.voiceLog}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {confirmedTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                          {tx.description}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="capitalize">{tx.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-bold font-mono tabular-nums ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatINR(tx.amount, true)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Quick Feature Cards */}
        <div className="space-y-4">
          {/* Scam Shield Card */}
          <div
            onClick={() => onNavigateTab('safety')}
            className="group cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  {t.nav.safety}
                </h3>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Threat & Fraud Analysis
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Scan suspicious WhatsApp loan messages or UPI claim links to identify red flags before losing money.
            </p>
          </div>

          {/* Government Welfare Schemes Card */}
          <div
            onClick={onOpenSchemesModal}
            className="group cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-emerald-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {t.nav.schemes}
                </h3>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  PM-SVANidhi & e-Shram
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore 4 verified central worker benefit schemes with official portal links and quick eligibility checkers.
            </p>
          </div>

          {/* Saathi AI Assistant Quick Chat */}
          <div
            onClick={() => onNavigateTab('saathi')}
            className="group cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Saathi Coach
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                Privacy-Guarded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              “How can I prepare for the ₹4,200 Two-Wheeler EMI on Day 6?”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
