import React, { useState } from 'react';
import { ForecastDay, Language, Persona } from '../types';
import { translations } from '../services/i18n';
import { calculateLoanEmi, formatINR } from '../services/calculator';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Info,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface PlannerViewProps {
  forecast: ForecastDay[];
  language: Language;
  persona: Persona;
  includeShock: boolean;
  onToggleShock: () => void;
  onApplyEmergencyReserve: () => void;
  hasAppliedEmergencyReserve: boolean;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  forecast,
  language,
  persona,
  includeShock,
  onToggleShock,
  onApplyEmergencyReserve,
  hasAppliedEmergencyReserve,
}) => {
  const t = translations[language];

  // Loan Simulator State (Defaults to instant loan app offer from test vector 2)
  const [principal, setPrincipal] = useState<number>(10000);
  const [annualRate, setAnnualRate] = useState<number>(36);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [processingFee, setProcessingFee] = useState<number>(800);

  const loanResult = calculateLoanEmi(principal, annualRate, tenureMonths, processingFee);

  const firstShortfall = forecast.find((f) => f.isShortfall);

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* 1. Header Strip */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.planner.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.planner.subtitle}
          </p>
        </div>

        {/* Shock Injection Toggle for Ideathon Demo */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 shrink-0">
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Simulate Rain Shock
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {includeShock ? 'Day 5 Rain & Clinic Expense Active' : 'Normal Regular Earnings'}
            </div>
          </div>
          <button
            onClick={onToggleShock}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              includeShock ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
            aria-label="Toggle weather shock simulation"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                includeShock ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. 14-Day Cash-Flow Forecast Section */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>{t.planner.timeline14Day}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deterministic rolling projection with daytime earnings and end-of-day obligations
            </p>
          </div>

          {/* Emergency Reserve Action */}
          <div className="flex items-center gap-2">
            {firstShortfall && !hasAppliedEmergencyReserve && (
              <button
                onClick={onApplyEmergencyReserve}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300 dark:border-emerald-800"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tap Emergency Reserve (₹2,000)</span>
              </button>
            )}
            {hasAppliedEmergencyReserve && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Reserve Applied: Shortfall Mitigated!
              </span>
            )}
          </div>
        </div>

        {/* Shortfall Summary Banner */}
        {firstShortfall && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <div className="text-xs sm:text-sm text-red-950 dark:text-red-200">
                <span className="font-bold">Projected Shortfall on {firstShortfall.dateString}:</span>{' '}
                Deficit of <span className="font-mono font-bold">{formatINR(firstShortfall.shortfallAmount)}</span> due to mandatory Vehicle Loan EMI.
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded shrink-0">
              Day 6 Deficit
            </span>
          </div>
        )}

        {/* 14-Day Timeline Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3 text-right">Start Bal</th>
                <th className="py-2.5 px-3 text-right">Daily Inflow</th>
                <th className="py-2.5 px-3">Scheduled Debits</th>
                <th className="py-2.5 px-3 text-right">End Bal</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {forecast.map((day) => {
                const isDeficit = day.isShortfall;
                return (
                  <tr
                    key={day.dayNumber}
                    className={`transition-colors ${
                      isDeficit
                        ? 'bg-red-50/70 dark:bg-red-950/30 font-semibold'
                        : day.dayNumber === 5 && includeShock
                        ? 'bg-amber-50/60 dark:bg-amber-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {day.dateString}
                      </span>
                      {day.notes.length > 0 && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400">
                          {day.notes.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {formatINR(day.openingBalance)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                      {day.daytimeIncome > 0 ? `+${formatINR(day.daytimeIncome)}` : '₹0'}
                    </td>
                    <td className="py-2.5 px-3">
                      {day.debitItems.length === 0 ? (
                        <span className="text-slate-400 text-xs">—</span>
                      ) : (
                        <div className="space-y-0.5">
                          {day.debitItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                                {item.title}
                              </span>
                              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                -{formatINR(item.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                        isDeficit
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {formatINR(day.closingBalance)}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {isDeficit ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded-md">
                          Shortfall
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Loan True-Cost & Predatory Loan Simulator */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span>What-If Decision Simulator</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t.planner.loanSimulatorTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.planner.loanSimulatorSubtitle}
          </p>
        </div>

        {/* Presets Quick Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Presets:</span>
          <button
            onClick={() => {
              setPrincipal(10000);
              setAnnualRate(36);
              setTenureMonths(6);
              setProcessingFee(800);
            }}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Instant Loan App (36% APR, ₹800 Fee)
          </button>
          <button
            onClick={() => {
              setPrincipal(10000);
              setAnnualRate(12);
              setTenureMonths(6);
              setProcessingFee(100);
            }}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            PM-SVANidhi Fair Micro-Credit (12% APR, ₹100 Fee)
          </button>
        </div>

        {/* Two-Column: Sliders & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Controls */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Principal Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>{t.planner.principalLabel}</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {formatINR(principal)}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={50000}
                step={1000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Annual Rate Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>{t.planner.rateLabel}</span>
                <span className={`font-mono font-bold ${annualRate >= 30 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                  {annualRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={48}
                step={1}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>{t.planner.tenureLabel}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {tenureMonths} Months
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Upfront Processing Fee */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>{t.planner.processingFeeLabel}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatINR(processingFee)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                step={100}
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 font-medium">{t.planner.monthlyEmi}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-0.5">
                    {formatINR(loanResult.monthlyEmi, true)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-medium">{t.planner.totalInterest}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-200 mt-0.5">
                    {formatINR(loanResult.totalInterest, true)}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Total Borrowing Cost:</div>
                  <div className="font-bold font-mono text-slate-200 mt-0.5 text-sm">
                    {formatINR(loanResult.totalBorrowingCost, true)}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400">Net Disbursed Cash:</div>
                  <div className="font-bold font-mono text-emerald-400 mt-0.5 text-sm">
                    {formatINR(loanResult.netDisbursed, true)}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.planner.effectiveRate}:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {loanResult.effectiveRatePercent}%
                </span>
              </div>
            </div>

            {/* Predatory Warning Banner */}
            {loanResult.isPredatory && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 p-4 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-900 dark:text-red-200">
                  <div className="font-bold mb-0.5">Predatory Credit Warning</div>
                  <p className="leading-relaxed">
                    {t.planner.predatoryWarning}
                  </p>
                  {loanResult.fairAlternativeDiff > 0 && (
                    <p className="font-bold mt-1 text-red-700 dark:text-red-300">
                      {t.planner.fairSavingsNote} {formatINR(loanResult.fairAlternativeDiff)}!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
