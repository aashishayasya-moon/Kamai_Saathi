import React, { useState, useEffect, useMemo } from 'react';
import {
  Language,
  Persona,
  Transaction,
  ScheduledObligation,
  ThemeMode,
} from './types';
import { personas } from './services/personas';
import { translations } from './services/i18n';
import {
  calculateLedgerBalance,
  generate14DayForecast,
  runCalculatorAcceptanceTests,
} from './services/calculator';
import { authService, UserProfile } from './services/authService';
import { firestoreService, validateFirestoreConnection } from './services/firebase';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { LedgerView } from './components/LedgerView';
import { PlannerView } from './components/PlannerView';
import { ScamShieldView } from './components/ScamShieldView';
import { SaathiChatView } from './components/SaathiChatView';
import { VoiceLoggerModal } from './components/VoiceLoggerModal';
import { SchemesExplorerModal } from './components/SchemesExplorerModal';
import { PrivacyConsentModal } from './components/PrivacyConsentModal';

export default function App() {
  // 1. Authentication & Page Journey State (Landing -> Auth -> App)
  const [authUser, setAuthUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'app'>(() => {
    return authService.getCurrentUser() ? 'app' : 'landing';
  });

  // 2. Language State (Defaults to English, persisted in localStorage)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kamai_saathi_lang');
    return (saved as Language) || 'en';
  });

  // 3. Active Persona (Defaults to Ramesh Kumar)
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);

  // 4. Transactions State (Persisted per persona)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const key = `kamai_saathi_txs_${personas[0].id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return personas[0].initialTransactions;
      }
    }
    return personas[0].initialTransactions;
  });

  // 5. Current Tab within the Main App
  const [currentTab, setCurrentTab] = useState<string>('home');

  // 6. Modals State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(() => {
    return !localStorage.getItem('kamai_saathi_consent');
  });

  // 7. Privacy & Offline Mode
  const [isLocalOnly, setIsLocalOnly] = useState(() => {
    return localStorage.getItem('kamai_saathi_consent') === 'local_only';
  });

  // 8. Planner Simulation States
  const [includeShock, setIncludeShock] = useState(true);
  const [hasAppliedEmergencyReserve, setHasAppliedEmergencyReserve] = useState(false);
  const [customObligations, setCustomObligations] = useState<ScheduledObligation[]>([]);

  // 9. Theme State (Dark / Light mode option, persisted in localStorage)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('kamai_saathi_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('kamai_saathi_theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0B132B' : '#F8FAFC');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Self-test audit check and Firestore connection test on boot
  useEffect(() => {
    const testResult = runCalculatorAcceptanceTests();
    if (!testResult.allPassed) {
      console.warn('Acceptance tests reported failures:', testResult.results);
    } else {
      console.log('Kamai Saathi: All deterministic mathematical acceptance tests PASSED.');
    }

    // Test Firestore connection as required by Firebase skill
    validateFirestoreConnection();

    // Subscribe to Firebase Auth state
    const unsubscribe = authService.subscribeAuthState((user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Save language
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('kamai_saathi_lang', lang);
  };

  // Switch persona
  const handleSelectPersona = (p: Persona) => {
    setActivePersona(p);
    const key = `kamai_saathi_txs_${p.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions(p.initialTransactions);
      }
    } else {
      setTransactions(p.initialTransactions);
    }
    setHasAppliedEmergencyReserve(false);
    setCustomObligations([]);
  };

  // Save transactions to localStorage
  useEffect(() => {
    const key = `kamai_saathi_txs_${activePersona.id}`;
    localStorage.setItem(key, JSON.stringify(transactions));
  }, [transactions, activePersona.id]);

  // Add confirmed transactions from manual entry or voice review with Firestore sync
  const handleAddTransactions = (items: Omit<Transaction, 'id' | 'createdAt'>[]) => {
    const newItems: Transaction[] = items.map((it, idx) => ({
      ...it,
      id: `tx-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString(),
    }));
    setTransactions((prev) => [...prev, ...newItems]);

    // Persist to Cloud Firestore if user is authenticated and not local-only
    if (authUser && !isLocalOnly && !authUser.isDemoUser) {
      firestoreService.saveTransactions(authUser.uid, newItems).catch((err) => {
        console.warn('Firestore transaction sync notice:', err);
      });
    }
  };

  const handleAddSingleTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    handleAddTransactions([tx]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (authUser && !isLocalOnly && !authUser.isDemoUser) {
      firestoreService.deleteTransaction(authUser.uid, id).catch((err) => {
        console.warn('Firestore transaction delete notice:', err);
      });
    }
  };

  // Calculate deterministic ledger totals
  const ledgerTotals = useMemo(() => {
    return calculateLedgerBalance(transactions, activePersona.initialBalance);
  }, [transactions, activePersona.initialBalance]);

  // Apply emergency reserve credit to mitigate Day 6 shortfall
  const handleApplyEmergencyReserve = () => {
    setHasAppliedEmergencyReserve(true);
    handleAddSingleTransaction({
      type: 'income',
      amount: 2000,
      amountPaise: 200000,
      currency: 'INR',
      category: 'savings',
      date: '2026-10-18', // Day 6 timing
      description: 'Emergency Reserve Jar Disbursed',
      entryMethod: 'preset',
      confirmationStatus: 'confirmed',
    });
  };

  // Generate 14-day cash-flow forecast
  const forecast = useMemo(() => {
    return generate14DayForecast(
      activePersona,
      ledgerTotals.balanceRupees,
      customObligations,
      includeShock
    );
  }, [activePersona, ledgerTotals.balanceRupees, customObligations, includeShock]);

  // Privacy handlers
  const handleAcceptCloudAI = () => {
    setIsLocalOnly(false);
    localStorage.setItem('kamai_saathi_consent', 'cloud_ai');
    setIsPrivacyModalOpen(false);
  };

  const handleChooseLocalOnly = () => {
    setIsLocalOnly(true);
    localStorage.setItem('kamai_saathi_consent', 'local_only');
    setIsPrivacyModalOpen(false);
  };

  const handleToggleLocalOnly = () => {
    const nextVal = !isLocalOnly;
    setIsLocalOnly(nextVal);
    localStorage.setItem('kamai_saathi_consent', nextVal ? 'local_only' : 'cloud_ai');
  };

  // Auth & Page Journey Actions
  const handleAuthSuccess = async (user: UserProfile) => {
    setAuthUser(user);
    setCurrentPage('app');
    if (!user.isDemoUser && !isLocalOnly) {
      try {
        const cloudTxs = await firestoreService.fetchTransactions(user.uid);
        if (cloudTxs && cloudTxs.length > 0) {
          setTransactions(cloudTxs);
        }
      } catch (err) {
        console.warn('Could not load remote transactions:', err);
      }
    }
  };

  const handleExploreDemo = () => {
    const user = authService.loginWithDemo();
    setAuthUser(user);
    setCurrentPage('app');
  };

  const handleSignOut = () => {
    authService.logout();
    setAuthUser(null);
    setCurrentPage('landing');
  };

  // 1. If currently on Landing Page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        selectedLanguage={language}
        onSelectLanguage={handleSelectLanguage}
        onGetStarted={() => setCurrentPage('auth')}
        onExploreDemo={handleExploreDemo}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // 2. If currently on Auth Page
  if (currentPage === 'auth') {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onBackToLanding={() => setCurrentPage('landing')}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // 3. Main Application Dashboard (Home, Ledger, Planner, Safety, Saathi AI)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900 transition-colors">
      {/* 1. Desktop & Mobile Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        activePersona={activePersona}
        allPersonas={personas}
        onSelectPersona={handleSelectPersona}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenSchemesModal={() => setIsSchemesModalOpen(true)}
        isLocalOnly={isLocalOnly}
        onToggleLocalOnly={handleToggleLocalOnly}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentUser={authUser}
        onSignOut={handleSignOut}
        onViewLanding={() => setCurrentPage('landing')}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <HomeDashboard
            currentBalance={ledgerTotals.balanceRupees}
            transactions={transactions}
            forecast={forecast}
            language={language}
            persona={activePersona}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onNavigateTab={setCurrentTab}
            onOpenSchemesModal={() => setIsSchemesModalOpen(true)}
          />
        )}

        {currentTab === 'ledger' && (
          <LedgerView
            transactions={transactions}
            currentBalance={ledgerTotals.balanceRupees}
            language={language}
            onAddTransaction={handleAddSingleTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentTab === 'planner' && (
          <PlannerView
            forecast={forecast}
            language={language}
            persona={activePersona}
            includeShock={includeShock}
            onToggleShock={() => setIncludeShock(!includeShock)}
            onApplyEmergencyReserve={handleApplyEmergencyReserve}
            hasAppliedEmergencyReserve={hasAppliedEmergencyReserve}
          />
        )}

        {currentTab === 'safety' && (
          <ScamShieldView language={language} isLocalOnly={isLocalOnly} />
        )}

        {currentTab === 'saathi' && (
          <SaathiChatView
            language={language}
            persona={activePersona}
            currentBalance={ledgerTotals.balanceRupees}
            forecast={forecast}
            isLocalOnly={isLocalOnly}
            onAddTransactions={handleAddTransactions}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* 4. Modals */}
      <VoiceLoggerModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        onConfirmTransactions={handleAddTransactions}
        isLocalOnly={isLocalOnly}
      />

      <SchemesExplorerModal
        isOpen={isSchemesModalOpen}
        onClose={() => setIsSchemesModalOpen(false)}
        language={language}
      />

      <PrivacyConsentModal
        isOpen={isPrivacyModalOpen}
        onAcceptCloud={handleAcceptCloudAI}
        onChooseLocalOnly={handleChooseLocalOnly}
        language={language}
      />
    </div>
  );
}
