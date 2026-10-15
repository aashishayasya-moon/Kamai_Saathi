import React, { useState } from 'react';
import { Language, Transaction, TransactionCategory } from '../types';
import { translations } from '../services/i18n';
import { formatINR, rupeesToPaise } from '../services/calculator';
import {
  Plus,
  Trash2,
  Download,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Mic,
  Check,
  X,
} from 'lucide-react';

interface LedgerViewProps {
  transactions: Transaction[];
  currentBalance: number;
  language: Language;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenVoiceModal: () => void;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  transactions,
  currentBalance,
  language,
  onAddTransaction,
  onDeleteTransaction,
  onOpenVoiceModal,
}) => {
  const t = translations[language];

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Add Form State
  const [manualType, setManualType] = useState<'income' | 'expense'>('expense');
  const [manualAmount, setManualAmount] = useState('');
  const [manualCategory, setManualCategory] = useState<TransactionCategory>('fuel');
  const [manualDesc, setManualDesc] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);

  // Categories list
  const categories: { id: TransactionCategory; label: string }[] = [
    { id: 'delivery', label: 'Delivery' },
    { id: 'trips', label: 'Trips / Auto' },
    { id: 'salary', label: 'Salary / Stipend' },
    { id: 'sales', label: 'Customer Sales' },
    { id: 'fuel', label: 'Fuel / Petrol' },
    { id: 'groceries', label: 'Groceries' },
    { id: 'food', label: 'Food / Mess' },
    { id: 'rent', label: 'Rent / Room' },
    { id: 'emi', label: 'Loan EMI' },
    { id: 'medical', label: 'Medical / Clinic' },
    { id: 'utilities', label: 'Utilities / Bills' },
    { id: 'education', label: 'Education' },
    { id: 'other', label: 'Other' },
  ];

  // Filtering
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q)
      );
    }
    return true;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(manualAmount);
    if (isNaN(num) || num <= 0) return;

    onAddTransaction({
      type: manualType,
      amount: num,
      amountPaise: rupeesToPaise(num),
      currency: 'INR',
      category: manualCategory,
      date: manualDate,
      description: manualDesc.trim() || `${manualCategory} ${manualType}`,
      entryMethod: 'manual',
      confirmationStatus: 'confirmed',
    });

    setManualAmount('');
    setManualDesc('');
    setIsManualModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount (INR)', 'Category', 'Date', 'Description', 'Method', 'Status'];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.amount,
      t.category,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.entryMethod,
      t.confirmationStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kamai_saathi_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.ledger.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.ledger.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-700 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual</span>
          </button>

          <button
            onClick={onOpenVoiceModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition-colors border border-amber-200 dark:border-amber-800/60"
          >
            <Mic className="w-4 h-4" />
            <span>{t.actions.voiceLog}</span>
          </button>

          <button
            onClick={handleExportCSV}
            title="Download CSV report"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Type Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl w-full md:w-auto">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize ${
                filterType === type
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {type === 'all' ? t.ledger.all : type === 'income' ? t.ledger.income : t.ledger.expense}
            </button>
          ))}
        </div>

        {/* Category & Search Input */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.ledger.searchPlaceholder}
              className="w-full text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">{t.ledger.entryDate}</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">{t.ledger.category}</th>
                <th className="py-3 px-4">{t.ledger.method}</th>
                <th className="py-3 px-4 text-right">{t.ledger.amount}</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {tx.description}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 capitalize whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                          {tx.entryMethod === 'voice' && <Mic className="w-3 h-3 text-amber-500" />}
                          {tx.entryMethod}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatINR(tx.amount, true)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Ledger Entry
              </h2>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 mt-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => setManualType('expense')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    manualType === 'expense'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setManualType('income')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    manualType === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Income</span>
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount in Rupees (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 500"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full text-lg font-mono font-bold px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as TransactionCategory)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Petrol for Bangalore delivery shift"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-sm"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
