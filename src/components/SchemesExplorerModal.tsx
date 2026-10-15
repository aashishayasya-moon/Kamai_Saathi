import React, { useState } from 'react';
import { GovScheme, Language } from '../types';
import { verifiedGovernmentSchemes } from '../services/schemesData';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileText,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SchemesExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SchemesExplorerModal: React.FC<SchemesExplorerModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    verifiedGovernmentSchemes[0].id
  );
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentScheme =
    verifiedGovernmentSchemes.find((s) => s.id === selectedSchemeId) ||
    verifiedGovernmentSchemes[0];

  const toggleCheck = (qId: string) => {
    setCheckedAnswers((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const isEligible = currentScheme.checkQuestions.every(
    (q) => checkedAnswers[`${currentScheme.id}-${q.id}`]
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Verified Worker Schemes</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Government Benefits Navigator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scheme Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-700">
          {verifiedGovernmentSchemes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSchemeId(s.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                selectedSchemeId === s.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {s.name.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Scheme Details */}
        <div className="py-4 space-y-5">
          {/* Title & Badge */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentScheme.name}
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Verified: {currentScheme.lastVerifiedDate}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
              {currentScheme.officialNameHindi}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {currentScheme.benefitSummary}
            </p>
          </div>

          {/* Maximum Benefit Banner */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Primary Benefit:
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {currentScheme.maxBenefitAmount}
            </span>
          </div>

          {/* Quick Eligibility Questionnaire */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Quick Eligibility Questionnaire (Tap to Check)
            </h4>
            <div className="space-y-1.5">
              {currentScheme.checkQuestions.map((q) => {
                const key = `${currentScheme.id}-${q.id}`;
                const checked = !!checkedAnswers[key];
                return (
                  <button
                    key={q.id}
                    onClick={() => toggleCheck(q.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-colors ${
                      checked
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{q.question}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {checked && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Preliminary Assessment Result */}
            <div className="mt-2 text-xs">
              {isEligible ? (
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 rounded-lg flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Preliminary Assessment: You meet the key baseline criteria for this scheme!</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">
                  Check all boxes above to verify your preliminary eligibility match.
                </div>
              )}
            </div>
          </div>

          {/* Required Documents List */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Documents to Prepare</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              {currentScheme.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/40 p-2 rounded-lg">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer with Official Portal Redirect */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Rules version: {currentScheme.ruleVersion}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
            >
              Close
            </button>
            <a
              href={currentScheme.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
            >
              <span>Visit Official Govt Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
