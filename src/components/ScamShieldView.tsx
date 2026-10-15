import React, { useState } from 'react';
import { Language, ScamAssessment } from '../types';
import { translations } from '../services/i18n';
import { evaluateScamHeuristics, sampleScamScenarios } from '../services/scamRules';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  PhoneCall,
  Search,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

interface ScamShieldViewProps {
  language: Language;
  isLocalOnly: boolean;
}

export const ScamShieldView: React.FC<ScamShieldViewProps> = ({
  language,
  isLocalOnly,
}) => {
  const t = translations[language];

  const [messageInput, setMessageInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [assessment, setAssessment] = useState<ScamAssessment | null>(null);

  const handleScan = async (textToScan = messageInput) => {
    if (!textToScan.trim()) return;
    setIsScanning(true);

    if (isLocalOnly) {
      // Local Heuristic Mode (Air-gapped)
      const result = evaluateScamHeuristics(textToScan);
      setAssessment(result);
      setIsScanning(false);
      return;
    }

    try {
      const res = await fetch('/api/scam/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: textToScan }),
      });

      if (!res.ok) {
        throw new Error('AI Scan failed');
      }

      const data = await res.json();
      setAssessment(data);
    } catch (err) {
      // Offline fallback to deterministic heuristic rules
      const fallback = evaluateScamHeuristics(textToScan);
      setAssessment(fallback);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectSample = (scenario: (typeof sampleScamScenarios)[0]) => {
    setMessageInput(scenario.messageText);
    handleScan(scenario.messageText);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Strip */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>Financial Risk Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Scam Shield</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.safety.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.safety.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-2.5 rounded-xl shrink-0">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {isLocalOnly ? 'Offline Heuristic Engine' : 'AI Pattern Analysis'}
          </div>
        </div>
      </div>

      {/* Input Paste Card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste Message, SMS, or Telegram Text
        </label>
        <textarea
          rows={4}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={t.safety.pastePlaceholder}
          maxLength={2000}
          className="w-full text-xs sm:text-sm p-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            {messageInput.length} / 2000 characters
          </span>

          <button
            onClick={() => handleScan()}
            disabled={isScanning || !messageInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-700 active:bg-slate-950 rounded-xl shadow transition-colors disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{isScanning ? 'Analyzing Patterns...' : t.safety.analyzeBtn}</span>
          </button>
        </div>

        {/* Sample Scenarios Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            {t.safety.sampleScenarios}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleScamScenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectSample(sc)}
                className="text-left p-2.5 bg-slate-50 dark:bg-slate-700/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{sc.title}</span>
                  <span className="text-[10px] text-slate-500 font-normal">[{sc.source}]</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {sc.messageText}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Results Section */}
      {assessment && (
        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* Top Risk Header */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              assessment.riskLevel === 'HIGH_RISK'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/80'
                : assessment.riskLevel === 'CAUTION'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  assessment.riskLevel === 'HIGH_RISK'
                    ? 'bg-red-100 text-red-600'
                    : assessment.riskLevel === 'CAUTION'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {assessment.riskLevel === 'HIGH_RISK' ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              <div>
                <div
                  className={`text-sm sm:text-base font-bold ${
                    assessment.riskLevel === 'HIGH_RISK'
                      ? 'text-red-950 dark:text-red-200'
                      : assessment.riskLevel === 'CAUTION'
                      ? 'text-amber-950 dark:text-amber-200'
                      : 'text-emerald-950 dark:text-emerald-200'
                  }`}
                >
                  {assessment.riskLevel === 'HIGH_RISK'
                    ? 'CRITICAL THREAT: High-Risk Scam Indicators Detected'
                    : assessment.riskLevel === 'CAUTION'
                    ? 'CAUTION: Suspicious Financial Solicitations'
                    : 'Low Risk Indicators'}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    assessment.riskLevel === 'HIGH_RISK'
                      ? 'text-red-800 dark:text-red-300'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {assessment.summary}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Risk Score
              </span>
              <span
                className={`text-2xl font-mono font-bold ${
                  assessment.riskLevel === 'HIGH_RISK'
                    ? 'text-red-600'
                    : assessment.riskLevel === 'CAUTION'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {assessment.riskScore}/100
              </span>
            </div>
          </div>

          {/* Red Flags List */}
          {assessment.detectedRedFlags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{t.safety.evidenceFound} ({assessment.detectedRedFlags.length})</span>
              </h3>

              <div className="space-y-2.5">
                {assessment.detectedRedFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {flag.flag}
                      </span>
                      <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded">
                        {flag.severity}
                      </span>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px] bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-200 dark:border-slate-700">
                      “{flag.evidence}”
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Verification Steps */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.safety.safeStepsTitle}</span>
            </h3>

            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {assessment.safeVerificationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Helplines */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {t.safety.helplinesTitle}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {assessment.officialHelplines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate mr-2">
                    {line.title}
                  </span>
                  {line.url ? (
                    <a
                      href={line.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline flex items-center gap-1 font-mono font-bold shrink-0"
                    >
                      <span>{line.contact}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-mono font-bold text-red-600 shrink-0">
                      {line.contact}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-slate-500 italic">
            {t.safety.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
