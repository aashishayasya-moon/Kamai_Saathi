import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, Persona } from '../types';
import { UserProfile } from '../services/authService';
import { translations } from '../services/i18n';
import { Globe, Users, PlusCircle, ShieldAlert, LogOut, User as UserIcon, Home } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  activePersona: Persona;
  allPersonas: Persona[];
  onSelectPersona: (p: Persona) => void;
  onOpenVoiceModal: () => void;
  onOpenSchemesModal: () => void;
  isLocalOnly: boolean;
  onToggleLocalOnly: () => void;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
  onViewLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  activePersona,
  allPersonas,
  onSelectPersona,
  onOpenVoiceModal,
  onOpenSchemesModal,
  isLocalOnly,
  onToggleLocalOnly,
  currentUser,
  onSignOut,
  onViewLanding,
}) => {
  const t = translations[language];

  const languageLabels: Record<Language, string> = {
    en: 'English',
    hi: 'हिन्दी',
    kn: 'ಕನ್ನಡ',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    mr: 'मराठी',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              <BrandLogo size="md" showTagline={false} />
            </button>

            {/* Privacy Mode Badge */}
            <button
              onClick={onToggleLocalOnly}
              title={isLocalOnly ? 'Running in strict local offline mode' : 'Cloud AI enabled with privacy minimization'}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                isLocalOnly
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLocalOnly ? 'bg-slate-400' : 'bg-emerald-500'
                }`}
              />
              <span className="whitespace-nowrap">
                {isLocalOnly ? 'Local-Only' : 'AI Shield Active'}
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { id: 'home', label: t.nav.home },
              { id: 'ledger', label: t.nav.ledger },
              { id: 'planner', label: t.nav.planner },
              { id: 'safety', label: t.nav.safety },
              { id: 'saathi', label: t.nav.saathi },
            ].map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={onOpenSchemesModal}
              className="px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.schemes}
            </button>
          </nav>

          {/* Zone 3: Actions (Language, Persona, Quick Log) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-500 mr-1.5 hidden sm:inline" />
              <select
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value as Language)}
                className="text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                aria-label="Select Interface Language"
              >
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <option key={lang} value={lang}>
                    {languageLabels[lang]}
                  </option>
                ))}
              </select>
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative flex items-center">
              <Users className="w-4 h-4 text-slate-500 mr-1.5 hidden sm:inline" />
              <select
                value={activePersona.id}
                onChange={(e) => {
                  const found = allPersonas.find((p) => p.id === e.target.value);
                  if (found) onSelectPersona(found);
                }}
                className="text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
                aria-label="Select Demo Persona"
              >
                {allPersonas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Log CTA */}
            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.actions.quickLog}</span>
            </button>

            {/* User Account / Sign Out */}
            {currentUser && (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                <div
                  title={`Signed in as ${currentUser.displayName || currentUser.email}`}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs uppercase shrink-0"
                >
                  {(currentUser.displayName || currentUser.email || 'U')[0]}
                </div>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    title="Sign Out to Landing Page"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
