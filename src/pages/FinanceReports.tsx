import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type FinancialRecord } from '../store/useAppStore';
import { useDevModuleStore } from '../store/devModuleStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Filter,
  RefreshCw,
  Printer,
  Bookmark,
  Trash2,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  FileSpreadsheet,
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  SlidersHorizontal,
  FolderKanban,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

// Report Views Types
type ReportType =
  | 'summary'
  | 'income'
  | 'expense'
  | 'department'
  | 'profitability'
  | 'cashflow'
  | 'receivables'
  | 'payables'
  | 'transactions';

// Period Comparison Option
type CompareOption = 'none' | 'previous_period' | 'previous_month' | 'same_period_last_year';

// Filter State Interface
interface ReportFilterState {
  dateRange: 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'previous_month' | 'this_quarter' | 'this_year' | 'custom';
  fromDate: string;
  toDate: string;
  department: string;
  type: string;
  category: string;
  account: string;
  projectId: string;
  customerName: string;
  supplierName: string;
  status: string;
}

// Saved Configuration Interface
interface SavedReportConfig {
  id: string;
  name: string;
  reportType: ReportType;
  filters: ReportFilterState;
  createdAt: string;
}

export const FinanceReports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { financeRecords } = useAppStore();
  const { projects } = useDevModuleStore();

  // Active Report View
  const [reportType, setReportType] = useState<ReportType>('summary');

  // Period Comparison
  const [compareOption, setCompareOption] = useState<CompareOption>('none');

  // Filter Bar Visibility
  const [filterBarOpen, setFilterBarOpen] = useState(true);

  // Filters State
  const initialFilters: ReportFilterState = {
    dateRange: 'all',
    fromDate: '',
    toDate: '',
    department: 'all',
    type: 'all',
    category: 'all',
    account: 'all',
    projectId: 'all',
    customerName: 'all',
    supplierName: 'all',
    status: 'all'
  };

  const [filters, setFilters] = useState<ReportFilterState>(initialFilters);

  // Search & Pagination State for Transactions Table
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof FinancialRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Drill-down Modal State
  const [selectedTxDetail, setSelectedTxDetail] = useState<FinancialRecord | null>(null);

  // Saved Views State
  const [savedConfigs, setSavedConfigs] = useState<SavedReportConfig[]>([]);
  const [newConfigName, setNewConfigName] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Load Saved Report Configs from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_finance_reports');
      if (stored) {
        setSavedConfigs(JSON.parse(stored));
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  const handleSort = (field: keyof FinancialRecord) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const saveCurrentConfig = () => {
    if (!newConfigName.trim()) {
      toast.error(isRtl ? 'يرجى إدخال اسم للتقرير المحفوظ' : 'Please enter a configuration name');
      return;
    }
    const newConfig: SavedReportConfig = {
      id: 'cfg-' + Date.now(),
      name: newConfigName.trim(),
      reportType,
      filters: { ...filters },
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newConfig, ...savedConfigs];
    setSavedConfigs(updated);
    localStorage.setItem('saved_finance_reports', JSON.stringify(updated));
    toast.success(isRtl ? 'تم حفظ التكوين المالي بنجاح' : 'Report configuration saved');
    setNewConfigName('');
    setSaveModalOpen(false);
  };

  const deleteConfig = (id: string) => {
    const updated = savedConfigs.filter(c => c.id !== id);
    setSavedConfigs(updated);
    localStorage.setItem('saved_finance_reports', JSON.stringify(updated));
    toast.success(isRtl ? 'تم حذف التكوين المحفوظ' : 'Configuration deleted');
  };

  const applySavedConfig = (cfg: SavedReportConfig) => {
    setReportType(cfg.reportType);
    setFilters(cfg.filters);
    toast.success(isRtl ? `تم تطبيق التقرير: ${cfg.name}` : `Applied config: ${cfg.name}`);
  };

  // Interconnected / Dependent Filters Logic
  const availableProjects = useMemo(() => {
    if (filters.department === 'all') return projects;
    if (filters.department === 'SoftwareDevelopment' || filters.department === 'البرمجة والتطوير') {
      return projects;
    }
    return [];
  }, [filters.department, projects]);

  const availableCustomers = useMemo(() => {
    const list = new Set<string>();
    financeRecords.forEach(r => {
      if (r.customerName) list.add(r.customerName);
    });
    return Array.from(list);
  }, [financeRecords]);

  const availableSuppliers = useMemo(() => {
    const list = new Set<string>();
    financeRecords.forEach(r => {
      if (r.supplierName) list.add(r.supplierName);
    });
    return Array.from(list);
  }, [financeRecords]);

  const availableAccounts = useMemo(() => {
    const list = new Set<string>();
    financeRecords.forEach(r => {
      if (r.account) list.add(r.account);
    });
    return Array.from(list);
  }, [financeRecords]);

  const availableCategories = useMemo(() => {
    const list = new Set<string>();
    financeRecords.forEach(r => {
      if (r.category) list.add(r.category);
    });
    return Array.from(list);
  }, [financeRecords]);

  // Master Filter Function
  const filteredRecords = useMemo(() => {
    return financeRecords.filter(r => {
      // 1. Date Range
      if (filters.dateRange === 'today') {
        const today = new Date().toISOString().split('T')[0];
        if (r.date !== today) return false;
      } else if (filters.dateRange === 'this_month') {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        if (!r.date.startsWith(`${year}-${month}`)) return false;
      } else if (filters.dateRange === 'previous_month') {
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        if (!r.date.startsWith(`${year}-${month}`)) return false;
      } else if (filters.dateRange === 'custom') {
        if (filters.fromDate && r.date < filters.fromDate) return false;
        if (filters.toDate && r.date > filters.toDate) return false;
      }

      // 2. Department
      if (filters.department !== 'all') {
        const deptNorm = (r.department || '').toLowerCase();
        const targetNorm = filters.department.toLowerCase();
        if (!deptNorm.includes(targetNorm) && targetNorm !== 'all') {
          // Normalize Arabic/English department names
          const isDeptMatch =
            (filters.department === 'Marketing' && (r.department === 'Marketing' || r.department === 'التسويق')) ||
            (filters.department === 'Training' && (r.department === 'Training' || r.department === 'التدريب')) ||
            (filters.department === 'SoftwareDevelopment' && (r.department === 'SoftwareDevelopment' || r.department === 'البرمجة والسيستم')) ||
            (filters.department === 'Administration' && (r.department === 'Administration' || r.department === 'الإدارة العامة' || r.department === 'Finance' || r.department === 'HR'));
          if (!isDeptMatch) return false;
        }
      }

      // 3. Type
      if (filters.type !== 'all' && r.type !== filters.type) return false;

      // 4. Category
      if (filters.category !== 'all' && r.category !== filters.category) return false;

      // 5. Account
      if (filters.account !== 'all' && r.account !== filters.account) return false;

      // 6. Project
      if (filters.projectId !== 'all' && r.projectId !== filters.projectId) return false;

      // 7. Customer
      if (filters.customerName !== 'all' && r.customerName !== filters.customerName) return false;

      // 8. Supplier
      if (filters.supplierName !== 'all' && r.supplierName !== filters.supplierName) return false;

      // 9. Status
      if (filters.status !== 'all' && (r.status || 'Completed') !== filters.status) return false;

      return true;
    });
  }, [financeRecords, filters]);

  // Aggregated Financial Metrics
  const summaryMetrics = useMemo(() => {
    let rev = 0;
    let exp = 0;
    let receipts = 0;
    let payments = 0;
    let receivables = 0;
    let payables = 0;

    filteredRecords.forEach(r => {
      if (r.type === 'Revenue') rev += r.amount;
      if (r.type === 'Expense') exp += r.amount;
      if (r.type === 'Receipt' || r.type === 'Revenue') receipts += (r.paidAmount ?? r.amount);
      if (r.type === 'Payment' || r.type === 'Expense') payments += (r.paidAmount ?? r.amount);
      if (r.remainingAmount && r.remainingAmount > 0) {
        if (r.type === 'Revenue' || r.type === 'Receipt') receivables += r.remainingAmount;
        if (r.type === 'Expense' || r.type === 'Payment') payables += r.remainingAmount;
      }
    });

    const profit = rev - exp;
    const margin = rev > 0 ? (profit / rev) * 100 : 0;

    return {
      totalRevenue: rev,
      totalExpenses: exp,
      netProfit: profit,
      netMargin: margin,
      totalReceipts: receipts,
      totalPayments: payments,
      receivables,
      payables
    };
  }, [filteredRecords]);

  // Period Comparison Metrics (Mocked baseline for previous period calculation)
  const comparisonMetrics = useMemo(() => {
    if (compareOption === 'none') return null;
    const prevRev = Math.round(summaryMetrics.totalRevenue * 0.88);
    const prevExp = Math.round(summaryMetrics.totalExpenses * 0.92);
    const prevProfit = prevRev - prevExp;

    const revDiff = summaryMetrics.totalRevenue - prevRev;
    const revPct = prevRev > 0 ? (revDiff / prevRev) * 100 : 0;

    const expDiff = summaryMetrics.totalExpenses - prevExp;
    const expPct = prevExp > 0 ? (expDiff / prevExp) * 100 : 0;

    const profitDiff = summaryMetrics.netProfit - prevProfit;
    const profitPct = prevProfit !== 0 ? (profitDiff / Math.abs(prevProfit)) * 100 : 0;

    return {
      prevRev,
      revDiff,
      revPct,
      prevExp,
      expDiff,
      expPct,
      prevProfit,
      profitDiff,
      profitPct
    };
  }, [compareOption, summaryMetrics]);

  // Department Breakdown Calculation
  const departmentBreakdown = useMemo(() => {
    const depts = ['SoftwareDevelopment', 'Training', 'Marketing', 'Administration', 'Sales', 'HR'];
    return depts.map(d => {
      const records = filteredRecords.filter(r => (r.department || 'Administration') === d);
      const rev = records.filter(r => r.type === 'Revenue').reduce((acc, curr) => acc + curr.amount, 0);
      const exp = records.filter(r => r.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
      const net = rev - exp;
      return {
        departmentKey: d,
        departmentLabel:
          d === 'SoftwareDevelopment' ? (isRtl ? 'البرمجة والتطوير' : 'Programming & Dev') :
          d === 'Training' ? (isRtl ? 'التدريب والتعليم' : 'Training Dept') :
          d === 'Marketing' ? (isRtl ? 'التسويق والإعلانات' : 'Marketing') :
          d === 'Sales' ? (isRtl ? 'المبيعات والعملاء' : 'Sales & CRM') :
          d === 'HR' ? (isRtl ? 'الموارد البشرية' : 'Human Resources') :
          (isRtl ? 'الإدارة العامة والمالية' : 'Administration & Finance'),
        revenue: rev,
        expenses: exp,
        netResult: net,
        count: records.length
      };
    });
  }, [filteredRecords, isRtl]);

  // Expense Categories Breakdown
  const expenseCategoriesBreakdown = useMemo(() => {
    const expRecords = filteredRecords.filter(r => r.type === 'Expense');
    const totalExp = expRecords.reduce((acc, curr) => acc + curr.amount, 0);
    const catMap = new Map<string, { amount: number; count: number }>();

    expRecords.forEach(r => {
      const cat = r.category || 'Operations';
      const prev = catMap.get(cat) || { amount: 0, count: 0 };
      catMap.set(cat, { amount: prev.amount + r.amount, count: prev.count + 1 });
    });

    return Array.from(catMap.entries()).map(([cat, data]) => ({
      category: cat,
      amount: data.amount,
      pct: totalExp > 0 ? (data.amount / totalExp) * 100 : 0,
      count: data.count
    }));
  }, [filteredRecords]);

  // Project Profitability Breakdown
  const projectProfitability = useMemo(() => {
    return projects.map(proj => {
      const projRecords = filteredRecords.filter(r => r.projectId === proj.id || r.projectName === proj.name);
      const rev = projRecords.filter(r => r.type === 'Revenue').reduce((a, b) => a + b.amount, 0);
      const exp = projRecords.filter(r => r.type === 'Expense').reduce((a, b) => a + b.amount, 0);
      const net = rev - exp;
      const margin = rev > 0 ? (net / rev) * 100 : 0;
      const remaining = projRecords.reduce((a, b) => a + (b.remainingAmount || 0), 0);

      return {
        id: proj.id,
        name: proj.name,
        clientName: proj.clientName,
        revenue: rev,
        expenses: exp,
        netProfit: net,
        margin,
        outstanding: remaining
      };
    });
  }, [projects, filteredRecords]);

  // Receivables & Payables Breakdown
  const receivablesList = useMemo(() => {
    return filteredRecords.filter(r => (r.type === 'Revenue' || r.type === 'Receipt') && (r.remainingAmount ?? 0) >= 0);
  }, [filteredRecords]);

  const payablesList = useMemo(() => {
    return filteredRecords.filter(r => (r.type === 'Expense' || r.type === 'Payment') && (r.remainingAmount ?? 0) >= 0);
  }, [filteredRecords]);

  // Cash Flow Calculations
  const cashFlowSummary = useMemo(() => {
    const openingBalance = 100000;
    let inflows = 0;
    let outflows = 0;

    filteredRecords.forEach(r => {
      if (r.type === 'Revenue' || r.type === 'Receipt') {
        inflows += (r.paidAmount ?? r.amount);
      } else if (r.type === 'Expense' || r.type === 'Payment') {
        outflows += (r.paidAmount ?? r.amount);
      }
    });

    const netFlow = inflows - outflows;
    const closingBalance = openingBalance + netFlow;

    return {
      openingBalance,
      inflows,
      outflows,
      netFlow,
      closingBalance
    };
  }, [filteredRecords]);

  // Sorted and Searched Table Transactions
  const processedTransactions = useMemo(() => {
    let list = [...filteredRecords];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.department && r.department.toLowerCase().includes(q)) ||
        (r.account && r.account.toLowerCase().includes(q)) ||
        (r.customerName && r.customerName.toLowerCase().includes(q)) ||
        (r.supplierName && r.supplierName.toLowerCase().includes(q)) ||
        (r.invoiceId && r.invoiceId.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [filteredRecords, searchTerm, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(start, start + itemsPerPage);
  }, [processedTransactions, currentPage, itemsPerPage]);

  // Exporting Logic
  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Department', 'Account', 'Customer/Supplier', 'Status'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.date,
      r.type,
      r.category,
      `"${r.title.replace(/"/g, '""')}"`,
      r.amount,
      r.department || '',
      r.account || '',
      `"${(r.customerName || r.supplierName || '').replace(/"/g, '""')}"`,
      r.status || 'Completed'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isRtl ? 'تم تصدير التقرير المالي بملف CSV بنجاح' : 'Exported to CSV successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  // Reset Filters Action
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm('');
    setCurrentPage(1);
    toast.success(isRtl ? 'تم إعادة ضبط جميع الفلاتر' : 'Filters reset to default');
  };

  return (
    <div className="space-y-6 font-outfit pb-12">
      {/* 1. Header & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-950 tracking-tight m-0">{t('financialReports')}</h1>
            <span className="bg-red-50 text-red-700 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-red-150">
              {isRtl ? 'منظومة المحاسب المالي' : 'Accountant Audit Module'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isRtl
              ? 'مساحة العمل والتدقيق المالي الشاملة للمحاسب: تحليلات الإيرادات، المصروفات، التدفقات النقدية، وربحية الأقسام والمشاريع.'
              : 'Complete financial accounting & reporting workspace for auditor role.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Bar Toggle */}
          <button
            onClick={() => setFilterBarOpen(!filterBarOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filterBarOpen ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الفلاتر المتقدمة' : 'Filter Controls'}</span>
          </button>

          {/* Save Configuration Button */}
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1.5 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-red-600" />
            <span>{isRtl ? 'حفظ التكوين الحالي' : 'Save Config'}</span>
          </button>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={exportToCSV}
              className="custom-btn-primary py-2 px-3 text-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تصدير Excel/CSV' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="custom-btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isRtl ? 'طباعة / PDF' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Report Type Selector Bar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-155 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'summary', label: isRtl ? 'الملخص المالي العام' : 'Financial Summary', icon: Layers },
            { id: 'income', label: isRtl ? 'تقرير الإيرادات والدخل' : 'Income Report', icon: TrendingUp },
            { id: 'expense', label: isRtl ? 'تقرير المصروفات' : 'Expense Report', icon: TrendingDown },
            { id: 'department', label: isRtl ? 'التحليل المالي للأقسام' : 'Department Analysis', icon: Building2 },
            { id: 'profitability', label: isRtl ? 'ربحية المشاريع' : 'Project Profitability', icon: FolderKanban },
            { id: 'cashflow', label: isRtl ? 'التدفقات النقدية' : 'Cash Flow', icon: DollarSign },
            { id: 'receivables', label: isRtl ? 'المستحقات (الذمم المدينة)' : 'Receivables', icon: ArrowUpRight },
            { id: 'payables', label: isRtl ? 'الالتزامات (الذمم الدائنة)' : 'Payables', icon: ArrowDownRight },
            { id: 'transactions', label: isRtl ? 'سجل المعاملات التفصيلي' : 'Transaction Details', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as ReportType)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 ${
                  active
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Comprehensive Accountant Filter Bar */}
      {filterBarOpen && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'خيارات الفلترة والتصفية المحاسبية' : 'ACCOUNTING REPORT FILTERS'}</span>
            </h4>

            {/* Saved Configurations Chips */}
            {savedConfigs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">{isRtl ? 'التقارير المحفوظة:' : 'Saved Views:'}</span>
                {savedConfigs.map(cfg => (
                  <div key={cfg.id} className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-150 px-2.5 py-1 rounded-xl text-xs font-bold text-gray-700 transition-all border border-gray-200">
                    <button onClick={() => applySavedConfig(cfg)} className="hover:text-red-600 transition-colors">
                      {cfg.name}
                    </button>
                    <button onClick={() => deleteConfig(cfg.id)} title={isRtl ? 'حذف' : 'Delete'} className="text-gray-400 hover:text-red-600 transition-colors ms-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Filter 1: Date Range Preset */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'الفترة الزمنية' : 'Date Range'}</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'كل الفترات' : 'All Dates'}</option>
                <option value="today">{isRtl ? 'اليوم' : 'Today'}</option>
                <option value="this_week">{isRtl ? 'هذا الأسبوع' : 'This Week'}</option>
                <option value="this_month">{isRtl ? 'هذا الشهر (يونيو)' : 'This Month'}</option>
                <option value="previous_month">{isRtl ? 'الشهر السابق (مايو)' : 'Previous Month'}</option>
                <option value="this_quarter">{isRtl ? 'الربع الحالي (Q2)' : 'This Quarter'}</option>
                <option value="custom">{isRtl ? 'فترة مخصصة' : 'Custom Range'}</option>
              </select>
            </div>

            {/* Custom From Date */}
            {filters.dateRange === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'من تاريخ' : 'From Date'}</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>
            )}

            {/* Custom To Date */}
            {filters.dateRange === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'إلى تاريخ' : 'To Date'}</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>
            )}

            {/* Filter 2: Department */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'القسم / الإدارة' : 'Department'}</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value, projectId: 'all' })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع الأقسام' : 'All Departments'}</option>
                <option value="SoftwareDevelopment">{isRtl ? 'قسم البرمجة والتطوير' : 'Programming & Dev'}</option>
                <option value="Training">{isRtl ? 'قسم التدريب والتعليم' : 'Training Department'}</option>
                <option value="Marketing">{isRtl ? 'قسم التسويق والإعلانات' : 'Marketing'}</option>
                <option value="Sales">{isRtl ? 'قسم المبيعات والعملاء' : 'Sales & CRM'}</option>
                <option value="Administration">{isRtl ? 'الإدارة العامة والمالية' : 'Administration'}</option>
                <option value="HR">{isRtl ? 'الموارد البشرية' : 'HR'}</option>
              </select>
            </div>

            {/* Filter 3: Transaction Type */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'نوع العملية المالية' : 'Transaction Type'}</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'الكل (جميع الأنواع)' : 'All Types'}</option>
                <option value="Revenue">{isRtl ? 'إيراد (Revenue)' : 'Revenue'}</option>
                <option value="Expense">{isRtl ? 'مصروف (Expense)' : 'Expense'}</option>
                <option value="Receipt">{isRtl ? 'مقبوضات (Receipt)' : 'Receipt'}</option>
                <option value="Payment">{isRtl ? 'مدفوعات (Payment)' : 'Payment'}</option>
              </select>
            </div>

            {/* Filter 4: Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'التصنيف المالي' : 'Expense Category'}</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filter 5: Account / Payment Method */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'الحساب / طريقة الدفع' : 'Account / Payment Method'}</label>
              <select
                value={filters.account}
                onChange={(e) => setFilters({ ...filters, account: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع الحسابات' : 'All Accounts'}</option>
                {availableAccounts.map(acc => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>

            {/* Filter 6: Project */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'المشروع المرتبط' : 'Project'}</label>
              <select
                value={filters.projectId}
                onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع المشاريع' : 'All Projects'}</option>
                {availableProjects.map(proj => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </div>

            {/* Filter 7: Customer */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'العميل' : 'Customer'}</label>
              <select
                value={filters.customerName}
                onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع العملاء' : 'All Customers'}</option>
                {availableCustomers.map(cust => (
                  <option key={cust} value={cust}>{cust}</option>
                ))}
              </select>
            </div>

            {/* Filter 8: Supplier */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'المورد / جهة الصرف' : 'Supplier'}</label>
              <select
                value={filters.supplierName}
                onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع الموردين' : 'All Suppliers'}</option>
                {availableSuppliers.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>

            {/* Filter 9: Status */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'حالة القيد المالي' : 'Transaction Status'}</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="custom-input text-xs"
              >
                <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="Completed">{isRtl ? 'مكتمل (Completed)' : 'Completed'}</option>
                <option value="Pending">{isRtl ? 'معلق (Pending)' : 'Pending'}</option>
                <option value="Overdue">{isRtl ? 'متأخر (Overdue)' : 'Overdue'}</option>
              </select>
            </div>

            {/* Filter 10: Period Comparison */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'مقارنة الفترات' : 'Compare With'}</label>
              <select
                value={compareOption}
                onChange={(e) => setCompareOption(e.target.value as CompareOption)}
                className="custom-input text-xs bg-red-50/30"
              >
                <option value="none">{isRtl ? 'بدون مقارنة (None)' : 'None'}</option>
                <option value="previous_period">{isRtl ? 'الفترة السابقة' : 'Previous Period'}</option>
                <option value="previous_month">{isRtl ? 'الشهر السابق' : 'Previous Month'}</option>
                <option value="same_period_last_year">{isRtl ? 'نفس الفترة العام الماضي' : 'Same Period Last Year'}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-mono">
              {isRtl ? `نتائج الفلترة: ${filteredRecords.length} معاملة مالية` : `Filtered results: ${filteredRecords.length} entries`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Dense Financial Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Card 1: Revenue */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'إجمالي الإيرادات' : 'Total Revenue'}</span>
          <h4 className="text-lg font-black text-gray-950 mt-1 font-mono">{summaryMetrics.totalRevenue.toLocaleString()} ج.م</h4>
          {comparisonMetrics && (
            <div className="mt-2 text-[10px] flex items-center gap-1 font-mono">
              <span className={comparisonMetrics.revDiff >= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                {comparisonMetrics.revDiff >= 0 ? '+' : ''}{comparisonMetrics.revPct.toFixed(1)}%
              </span>
              <span className="text-gray-400">({comparisonMetrics.prevRev.toLocaleString()})</span>
            </div>
          )}
        </div>

        {/* Card 2: Expenses */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'إجمالي المصروفات' : 'Total Expenses'}</span>
          <h4 className="text-lg font-black text-gray-950 mt-1 font-mono">{summaryMetrics.totalExpenses.toLocaleString()} ج.م</h4>
          {comparisonMetrics && (
            <div className="mt-2 text-[10px] flex items-center gap-1 font-mono">
              <span className={comparisonMetrics.expDiff <= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                {comparisonMetrics.expDiff >= 0 ? '+' : ''}{comparisonMetrics.expPct.toFixed(1)}%
              </span>
              <span className="text-gray-400">({comparisonMetrics.prevExp.toLocaleString()})</span>
            </div>
          )}
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-white p-3.5 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between bg-red-50/10">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{isRtl ? 'صافي الربح' : 'Net Profit'} ({summaryMetrics.netMargin.toFixed(0)}%)</span>
          <h4 className="text-lg font-black text-red-600 mt-1 font-mono">{summaryMetrics.netProfit.toLocaleString()} ج.م</h4>
          {comparisonMetrics && (
            <div className="mt-2 text-[10px] flex items-center gap-1 font-mono">
              <span className={comparisonMetrics.profitDiff >= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                {comparisonMetrics.profitDiff >= 0 ? '+' : ''}{comparisonMetrics.profitPct.toFixed(1)}%
              </span>
              <span className="text-gray-400">({comparisonMetrics.prevProfit.toLocaleString()})</span>
            </div>
          )}
        </div>

        {/* Card 4: Receipts */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'المقبوضات النقدية' : 'Total Receipts'}</span>
          <h4 className="text-lg font-black text-emerald-600 mt-1 font-mono">{summaryMetrics.totalReceipts.toLocaleString()} ج.م</h4>
          <span className="text-[10px] text-gray-400 mt-1">{isRtl ? 'محصل فعلي' : 'Collected'}</span>
        </div>

        {/* Card 5: Payments */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'المدفوعات النقدية' : 'Total Payments'}</span>
          <h4 className="text-lg font-black text-gray-900 mt-1 font-mono">{summaryMetrics.totalPayments.toLocaleString()} ج.م</h4>
          <span className="text-[10px] text-gray-400 mt-1">{isRtl ? 'مدفوع فعلي' : 'Disbursed'}</span>
        </div>

        {/* Card 6: Receivables */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'المستحقات (ذمم مدينة)' : 'Receivables'}</span>
          <h4 className="text-lg font-black text-amber-600 mt-1 font-mono">{summaryMetrics.receivables.toLocaleString()} ج.م</h4>
          <span className="text-[10px] text-gray-400 mt-1">{isRtl ? 'مستحق لدى العملاء' : 'Pending Client'}</span>
        </div>

        {/* Card 7: Payables */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'الالتزامات (ذمم دائنة)' : 'Payables'}</span>
          <h4 className="text-lg font-black text-red-600 mt-1 font-mono">{summaryMetrics.payables.toLocaleString()} ج.م</h4>
          <span className="text-[10px] text-gray-400 mt-1">{isRtl ? 'مستحق للموردين' : 'Pending Vendor'}</span>
        </div>
      </div>

      {/* 5. DYNAMIC REPORT VIEW RENDERER */}
      {reportType === 'summary' && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm lg:col-span-2">
              <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'منحنى الإيرادات والمصروفات الشهري' : 'Monthly Financial Flow'}</h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: isRtl ? 'يناير' : 'Jan', revenue: 40000, expense: 24000, profit: 16000 },
                    { month: isRtl ? 'فبراير' : 'Feb', revenue: 45000, expense: 28000, profit: 17000 },
                    { month: isRtl ? 'مارس' : 'Mar', revenue: 50000, expense: 32000, profit: 18000 },
                    { month: isRtl ? 'أبريل' : 'Apr', revenue: 48000, expense: 29000, profit: 19000 },
                    { month: isRtl ? 'مايو' : 'May', revenue: 58000, expense: 35000, profit: 23000 },
                    { month: isRtl ? 'يونيو' : 'Jun', revenue: summaryMetrics.totalRevenue, expense: summaryMetrics.totalExpenses, profit: summaryMetrics.netProfit },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name={t('revenues')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name={t('expenses')} fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
              <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'توزيع المصروفات حسب التصنيف' : 'Expense Category Share'}</h4>
              <div className="space-y-3.5">
                {expenseCategoriesBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600">{item.category}</span>
                      <span className="text-gray-900 font-mono font-bold">{item.amount.toLocaleString()} ج.م ({item.pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profit & Loss Table */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest">{isRtl ? 'جدول حساب الأرباح والخسائر للربع الحالي' : 'Profit & Loss Statement'}</h4>
            </div>
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-4 text-start">{isRtl ? 'البند المالي' : 'Financial Line Item'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المبلغ الإجمالي' : 'Gross Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                <tr>
                  <td className="p-4 text-gray-900 font-bold">{isRtl ? 'إجمالى إيرادات النشاط التجميعية' : 'Gross Operating Revenues'}</td>
                  <td className="p-4 text-end text-emerald-600 font-mono font-bold">+{summaryMetrics.totalRevenue.toLocaleString()} ج.م</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-600 ps-8">{isRtl ? '- عقود البرمجيات والتطوير' : 'Contracts Share'}</td>
                  <td className="p-4 text-end text-gray-600 font-mono">
                    {filteredRecords.filter(r => r.category === 'Contract').reduce((a, b) => a + b.amount, 0).toLocaleString()} ج.م
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-900 font-bold">{isRtl ? 'إجمالي التكاليف والمصروفات التشغيلية' : 'Total Operating Expenses'}</td>
                  <td className="p-4 text-end text-red-600 font-mono font-bold">-{summaryMetrics.totalExpenses.toLocaleString()} ج.م</td>
                </tr>
                <tr className="bg-red-50/10 font-bold">
                  <td className="p-4 text-gray-950 text-sm font-black">{isRtl ? 'صافي الربح / الخسارة الصافية قبل الضرائب' : 'Net Operating Profit'}</td>
                  <td className="p-4 text-end text-red-600 text-sm font-black font-mono">{summaryMetrics.netProfit.toLocaleString()} ج.م</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report View 2: Income / Revenue Analysis */}
      {reportType === 'income' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تحليل الإيرادات والدخل المالي حسب المصدر' : 'Revenue & Income Analysis'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-xs text-gray-600 mb-3">{isRtl ? 'الإيرادات حسب القسم' : 'Revenue by Department'}</h5>
                <div className="space-y-3">
                  {departmentBreakdown.map(d => (
                    <div key={d.departmentKey} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <span className="font-bold text-xs text-gray-900">{d.departmentLabel}</span>
                        <span className="text-[10px] text-gray-400 block">{d.count} {isRtl ? 'عملية مقيدة' : 'entries'}</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-emerald-600">+{d.revenue.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-gray-600 mb-3">{isRtl ? 'الإيرادات حسب العميل' : 'Revenue by Customer'}</h5>
                <div className="space-y-3">
                  {availableCustomers.map(cust => {
                    const rev = filteredRecords.filter(r => r.customerName === cust && r.type === 'Revenue').reduce((a, b) => a + b.amount, 0);
                    return (
                      <div key={cust} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="font-bold text-xs text-gray-900">{cust}</span>
                        <span className="font-mono font-bold text-xs text-emerald-600">+{rev.toLocaleString()} ج.م</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report View 3: Expense Analysis */}
      {reportType === 'expense' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تحليل هيكل المصروفات والنفقات' : 'Expense Hierarchy Breakdown'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-xs text-gray-600 mb-3">{isRtl ? 'المصروفات حسب التصنيف' : 'Expenses by Category'}</h5>
                <div className="space-y-3">
                  {expenseCategoriesBreakdown.map(cat => (
                    <div key={cat.category} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-900">{cat.category}</span>
                        <span className="text-red-600 font-mono">-{cat.amount.toLocaleString()} ج.م ({cat.pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full rounded-full" style={{ width: `${cat.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-gray-600 mb-3">{isRtl ? 'المصروفات حسب المورد / جهة الصرف' : 'Expenses by Supplier'}</h5>
                <div className="space-y-3">
                  {availableSuppliers.map(sup => {
                    const exp = filteredRecords.filter(r => r.supplierName === sup && r.type === 'Expense').reduce((a, b) => a + b.amount, 0);
                    return (
                      <div key={sup} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="font-bold text-xs text-gray-900">{sup}</span>
                        <span className="font-mono font-bold text-xs text-red-600">-{exp.toLocaleString()} ج.م</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report View 4: Department Financial Analysis */}
      {reportType === 'department' && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden space-y-4 p-5">
          <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'مقارنة وتقييم الأداء المالي للأقسام' : 'Departmental Financial Comparison'}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-4 text-start">{isRtl ? 'القسم / الإدارة' : 'Department'}</th>
                  <th className="p-4 text-end">{isRtl ? 'الإيرادات' : 'Revenue'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المصروفات' : 'Expenses'}</th>
                  <th className="p-4 text-end">{isRtl ? 'صافي النتيجة' : 'Net Result'}</th>
                  <th className="p-4 text-center">{isRtl ? 'عدد المعاملات' : 'Tx Count'}</th>
                  <th className="p-4 text-center">{isRtl ? 'التفاصيل' : 'Drilldown'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {departmentBreakdown.map(d => (
                  <tr key={d.departmentKey} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{d.departmentLabel}</td>
                    <td className="p-4 text-end font-mono text-emerald-600">+{d.revenue.toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono text-red-600">-{d.expenses.toLocaleString()} ج.م</td>
                    <td className={`p-4 text-end font-mono font-bold ${d.netResult >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {d.netResult.toLocaleString()} ج.م
                    </td>
                    <td className="p-4 text-center font-mono">{d.count}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setFilters({ ...filters, department: d.departmentKey });
                          setReportType('transactions');
                          toast.success(isRtl ? `تمت التصفية حسب قسم: ${d.departmentLabel}` : `Filtered by ${d.departmentLabel}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold"
                      >
                        {isRtl ? 'عرض القيود' : 'View Ledger'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report View 5: Project Profitability Report */}
      {reportType === 'profitability' && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden space-y-4 p-5">
          <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تقرير ربحية المشاريع البرمجية والهندسية' : 'Project Profitability Report'}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-4 text-start">{isRtl ? 'اسم المشروع' : 'Project Name'}</th>
                  <th className="p-4 text-start">{isRtl ? 'العميل' : 'Client'}</th>
                  <th className="p-4 text-end">{isRtl ? 'إجمالي الإيرادات' : 'Total Revenue'}</th>
                  <th className="p-4 text-end">{isRtl ? 'إجمالي المصروفات' : 'Total Expenses'}</th>
                  <th className="p-4 text-end">{isRtl ? 'صافي الربح' : 'Net Profit'}</th>
                  <th className="p-4 text-center">{isRtl ? 'هامش الربح %' : 'Margin %'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المستحق المتبقي' : 'Outstanding'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {projectProfitability.map(proj => (
                  <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{proj.name}</td>
                    <td className="p-4 text-gray-500">{proj.clientName}</td>
                    <td className="p-4 text-end font-mono text-emerald-600">+{proj.revenue.toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono text-red-600">-{proj.expenses.toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono font-bold text-gray-900">{proj.netProfit.toLocaleString()} ج.م</td>
                    <td className="p-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        proj.margin >= 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {proj.margin.toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-4 text-end font-mono text-amber-600">{proj.outstanding.toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report View 6: Cash Flow Report */}
      {reportType === 'cashflow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{isRtl ? 'الرصيد الافتتاحي' : 'Opening Balance'}</span>
              <h4 className="text-base font-black text-gray-900 mt-1 font-mono">{cashFlowSummary.openingBalance.toLocaleString()} ج.م</h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{isRtl ? 'التدفقات الداخلة (+)' : 'Cash Inflows'}</span>
              <h4 className="text-base font-black text-emerald-600 mt-1 font-mono">+{cashFlowSummary.inflows.toLocaleString()} ج.م</h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{isRtl ? 'التدفقات الخارجة (-)' : 'Cash Outflows'}</span>
              <h4 className="text-base font-black text-red-600 mt-1 font-mono">-{cashFlowSummary.outflows.toLocaleString()} ج.م</h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{isRtl ? 'صافي التدفق النقدي' : 'Net Cash Flow'}</span>
              <h4 className={`text-base font-black mt-1 font-mono ${cashFlowSummary.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {cashFlowSummary.netFlow.toLocaleString()} ج.م
              </h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm bg-red-50/10">
              <span className="text-[10px] font-bold text-red-600 uppercase">{isRtl ? 'الرصيد الختامي' : 'Closing Balance'}</span>
              <h4 className="text-base font-black text-red-600 mt-1 font-mono">{cashFlowSummary.closingBalance.toLocaleString()} ج.م</h4>
            </div>
          </div>
        </div>
      )}

      {/* Report View 7: Receivables (الذمم المدينة) */}
      {reportType === 'receivables' && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden p-5 space-y-4">
          <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تقرير المستحقات والذمم المدينة لدى العملاء' : 'Accounts Receivable Ledger'}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-4 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                  <th className="p-4 text-start">{isRtl ? 'المشروع' : 'Project'}</th>
                  <th className="p-4 text-end">{isRtl ? 'إجمالي الفاتورة' : 'Total Invoiced'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المحين المندفع' : 'Paid'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المتبقي المستحق' : 'Remaining'}</th>
                  <th className="p-4 text-start">{isRtl ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                  <th className="p-4 text-center">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {receivablesList.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{rec.customerName || 'عميل عام'}</td>
                    <td className="p-4 text-gray-500">{rec.projectName || 'خدمات عامة'}</td>
                    <td className="p-4 text-end font-mono">{rec.amount.toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono text-emerald-600">{(rec.paidAmount ?? rec.amount).toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono text-red-600 font-bold">{(rec.remainingAmount ?? 0).toLocaleString()} ج.م</td>
                    <td className="p-4 text-gray-500 font-mono">{rec.dueDate || rec.date}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'Overdue' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {rec.status === 'Overdue' ? (isRtl ? 'متأخر ⚠️' : 'Overdue') : (isRtl ? 'قيد التحصيل' : 'Pending')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report View 8: Payables (الذمم الدائنة) */}
      {reportType === 'payables' && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden p-5 space-y-4">
          <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تقرير الالتزامات والذمم الدائنة للموردين' : 'Accounts Payable Ledger'}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-4 text-start">{isRtl ? 'المورد / جهة الصرف' : 'Supplier'}</th>
                  <th className="p-4 text-start">{isRtl ? 'التصنيف' : 'Category'}</th>
                  <th className="p-4 text-end">{isRtl ? 'إجمالي المطالبة' : 'Total Amount'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المدفوع' : 'Paid'}</th>
                  <th className="p-4 text-end">{isRtl ? 'المتبقي' : 'Remaining'}</th>
                  <th className="p-4 text-start">{isRtl ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                  <th className="p-4 text-center">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {payablesList.map(pay => (
                  <tr key={pay.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{pay.supplierName || 'مورد عام'}</td>
                    <td className="p-4 text-gray-500">{pay.category}</td>
                    <td className="p-4 text-end font-mono">{pay.amount.toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono text-emerald-600">{(pay.paidAmount ?? pay.amount).toLocaleString()} ج.م</td>
                    <td className="p-4 text-end font-mono text-red-600 font-bold">{(pay.remainingAmount ?? 0).toLocaleString()} ج.م</td>
                    <td className="p-4 text-gray-500 font-mono">{pay.dueDate || pay.date}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pay.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {pay.status === 'Pending' ? (isRtl ? 'مستحق الصرف' : 'Due') : (isRtl ? 'مسدد بالكامل' : 'Paid')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report View 9: Transaction Details Ledger (Standard & Full Audit Table) */}
      {(reportType === 'transactions' || reportType === 'summary') && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest">{isRtl ? 'سجل القيد المحاسبي المالي التفصيلي' : 'FINANCIAL TRANSACTIONS AUDIT LEDGER'}</h4>
              <span className="text-[10px] text-gray-400">{isRtl ? 'دفتر الأستاذ العام للقيود المقيدة والمعتمدة' : 'General ledger transaction history'}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute top-3 start-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={isRtl ? 'بحث في البيان، الحساب، العميل...' : 'Search description, account...'}
                  className="custom-input ps-9 py-1.5 text-xs w-full"
                />
              </div>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="custom-input py-1.5 text-xs w-20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                  <th className="p-3.5 text-start cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleSort('date')}>
                    {t('date')} {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-3.5 text-start">{isRtl ? 'معرف القيد' : 'Tx ID'}</th>
                  <th className="p-3.5 text-start cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleSort('title')}>
                    {isRtl ? 'البيان / الوصف' : 'Description'} {sortField === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-3.5 text-start cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleSort('type')}>
                    {isRtl ? 'النوع' : 'Type'} {sortField === 'type' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-3.5 text-start cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleSort('category')}>
                    {isRtl ? 'التصنيف' : 'Category'} {sortField === 'category' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="p-3.5 text-start">{isRtl ? 'القسم' : 'Department'}</th>
                  <th className="p-3.5 text-start">{isRtl ? 'الحساب / طريقة الدفع' : 'Account'}</th>
                  <th className="p-3.5 text-end cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleSort('amount')}>
                    {isRtl ? 'مدين (Debit)' : 'Debit'}
                  </th>
                  <th className="p-3.5 text-end cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleSort('amount')}>
                    {isRtl ? 'دائن (Credit)' : 'Credit'}
                  </th>
                  <th className="p-3.5 text-center">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-3.5 text-center">{isRtl ? 'تفاصيل' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTransactions.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors font-semibold">
                    <td className="p-3.5 text-gray-500 font-mono">{r.date}</td>
                    <td className="p-3.5 font-mono text-[10px] text-gray-400">{r.id}</td>
                    <td className="p-3.5 font-bold text-gray-900 max-w-xs truncate">{r.title}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.type === 'Revenue' || r.type === 'Receipt' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-600">{r.category}</td>
                    <td className="p-3.5 text-gray-500">{r.department || 'Administration'}</td>
                    <td className="p-3.5 text-gray-500">{r.account || 'CIB Main Account'}</td>
                    <td className="p-3.5 text-end font-mono text-red-600">
                      {r.debit && r.debit > 0 ? `-${r.debit.toLocaleString()} ج.م` : '-'}
                    </td>
                    <td className="p-3.5 text-end font-mono text-emerald-600">
                      {r.credit && r.credit > 0 ? `+${r.credit.toLocaleString()} ج.م` : (r.type === 'Revenue' ? `+${r.amount.toLocaleString()} ج.م` : '-')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Completed' || !r.status ? 'bg-emerald-50 text-emerald-600' :
                        r.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {r.status || 'Completed'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedTxDetail(r)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-12 text-center text-gray-400">
                      {isRtl ? 'لا يوجد قيود مالية تطابق خيارات التصفية والبحث الحالية' : 'No financial records match the active filter options.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {isRtl
                  ? `عرض الصفحة ${currentPage} من ${totalPages} (${processedTransactions.length} قيد مالي)`
                  : `Page ${currentPage} of ${totalPages} (${processedTransactions.length} records)`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Drill-down Transaction Audit Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedTxDetail(null)} />
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-150 space-y-4">
            <button
              onClick={() => setSelectedTxDetail(null)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-extrabold text-sm text-gray-950">{isRtl ? 'تفاصيل وتدقيق القيد المالي' : 'Transaction Audit Detail'}</h3>
                <span className="text-[10px] text-gray-400 font-mono">{selectedTxDetail.id} | {selectedTxDetail.invoiceId || 'N/A'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] block">{isRtl ? 'البيان الرئيسي' : 'Description'}</span>
                <span className="font-bold text-gray-900">{selectedTxDetail.title}</span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] block">{isRtl ? 'المبلغ القائم' : 'Amount'}</span>
                <span className="font-mono font-bold text-red-600 text-sm">{selectedTxDetail.amount.toLocaleString()} ج.م</span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] block">{isRtl ? 'نوع القيد والتصنيف' : 'Type & Category'}</span>
                <span className="font-semibold text-gray-800">{selectedTxDetail.type} ({selectedTxDetail.category})</span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] block">{isRtl ? 'القسم المسؤول' : 'Department'}</span>
                <span className="font-semibold text-gray-800">{selectedTxDetail.department || 'Administration'}</span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] block">{isRtl ? 'الحساب / طريقة التقديم' : 'Account'}</span>
                <span className="font-semibold text-gray-800">{selectedTxDetail.account || 'CIB Account'}</span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-400 text-[10px] block">{isRtl ? 'تاريخ القيد الاستحقاق' : 'Date & Due'}</span>
                <span className="font-mono text-gray-700">{selectedTxDetail.date} ({selectedTxDetail.dueDate || 'Immediate'})</span>
              </div>

              {selectedTxDetail.customerName && (
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 col-span-2">
                  <span className="text-gray-400 text-[10px] block">{isRtl ? 'العميل المستفيد' : 'Customer'}</span>
                  <span className="font-bold text-gray-900">{selectedTxDetail.customerName}</span>
                </div>
              )}

              {selectedTxDetail.supplierName && (
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 col-span-2">
                  <span className="text-gray-400 text-[10px] block">{isRtl ? 'المورد / جهة الاستحقاق' : 'Supplier'}</span>
                  <span className="font-bold text-gray-900">{selectedTxDetail.supplierName}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="w-full custom-btn-secondary py-2 text-xs"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Save Configuration Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSaveModalOpen(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-150 space-y-4">
            <button
              onClick={() => setSaveModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm">{isRtl ? 'حفظ إعدادات التقرير الحالي' : 'Save Report View Configuration'}</h3>
            <p className="text-xs text-gray-500">
              {isRtl
                ? 'سيتم حفظ خيارات التصفية ونوع التقرير المحدد لاستعادتها بسرعة لاحقاً.'
                : 'Preserve date range, department, categories and filters as a saved view.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{isRtl ? 'عنوان التقرير المحفوظ' : 'Configuration Title'}</label>
              <input
                type="text"
                required
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
                placeholder={isRtl ? 'مثال: مصروفات قسم البرمجة لشهر يونيو' : 'e.g. Monthly Programming Dept Expenses'}
                className="custom-input text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveCurrentConfig}
                className="flex-1 custom-btn-primary py-2 text-xs"
              >
                {isRtl ? 'حفظ التكوين' : 'Save View'}
              </button>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="flex-1 custom-btn-secondary py-2 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
