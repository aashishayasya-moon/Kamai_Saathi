import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode, Language } from '../types';
import { translations } from '../services/i18n';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  language?: Language;
  variant?: 'icon' | 'pill' | 'button';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggleTheme,
  language = 'en',
  variant = 'icon',
  className = '',
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const label = isDark
    ? t.theme?.lightMode || 'Light Mode'
    : t.theme?.darkMode || 'Dark Mode';
  const tooltip = isDark
    ? t.theme?.toggleTheme || 'Switch to Light Mode'
    : t.theme?.toggleTheme || 'Switch to Dark Mode';

  if (variant === 'pill') {
    return (
      <button
        onClick={onToggleTheme}
        title={tooltip}
        aria-label={tooltip}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
          isDark
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-amber-400/40 shadow-xs'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300 shadow-xs'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-amber-600 transition-transform hover:-rotate-12" />
        )}
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={onToggleTheme}
        title={tooltip}
        aria-label={tooltip}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
          isDark
            ? 'bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700'
            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
        <span>{label}</span>
      </button>
    );
  }

  // Default: Compact icon button
  return (
    <button
      onClick={onToggleTheme}
      title={tooltip}
      aria-label={tooltip}
      className={`p-2 rounded-xl transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-amber-400/40 hover:text-amber-200 shadow-xs'
          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 shadow-xs'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-200 hover:rotate-90 text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12 text-slate-700" />
      )}
    </button>
  );
};
