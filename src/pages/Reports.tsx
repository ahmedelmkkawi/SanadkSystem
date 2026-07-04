import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useAppSelector } from '../store';
import {
  FileText,
  Download,
  BarChart2,
  CheckCircle2,
  UserCheck,
  DollarSign,
  Trash2,
  Upload,
  X,
  Search,
  Clock,
  FileDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const {
    leads,
    tasks,
    financeRecords,
    campaigns,
    uploadedReports,
    addUploadedReport,
    deleteUploadedReport
  } = useAppStore();

  const { user } = useAppSelector((state) => state.auth);

  const [selectedReport, setSelectedReport] = useState<'crm' | 'marketing' | 'tasks' | 'finance'>('crm');

  // System Report Filters State
  const [crmGovernorate, setCrmGovernorate] = useState<string>('All');
  const [crmStatus, setCrmStatus] = useState<string>('All');
  const [mktPlatform, setMktPlatform] = useState<string>('All');
  const [mktStatus, setMktStatus] = useState<string>('All');
  const [taskPriority, setTaskPriority] = useState<string>('All');
  const [taskAssignee, setTaskAssignee] = useState<string>('All');
  const [finCategory, setFinCategory] = useState<string>('All');
  const [finType, setFinType] = useState<string>('All');

  // Uploaded Reports List Filters
  const [searchUploader, setSearchUploader] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const getMappedDept = (dept: string | undefined, rtl: boolean) => {
    if (!dept) return rtl ? 'المبيعات' : 'Sales';
    if (rtl) {
      if (dept === 'Software Development') return 'تطوير البرمجيات';
      if (dept === 'Training') return 'التدريب';
      if (dept === 'Sales') return 'المبيعات';
      if (dept === 'Marketing') return 'التسويق';
      if (dept === 'HR') return 'الموارد البشرية';
      if (dept === 'Finance') return 'الإدارة المالية';
      if (dept === 'Operations') return 'التشغيل';
      if (dept === 'IT') return 'IT';
      return dept;
    } else {
      if (dept === 'تطوير البرمجيات') return 'Software Development';
      if (dept === 'التدريب') return 'Training';
      if (dept === 'المبيعات') return 'Sales';
      if (dept === 'التسويق') return 'Marketing';
      if (dept === 'الموارد البشرية') return 'HR';
      if (dept === 'الإدارة المالية') return 'Finance';
      if (dept === 'التشغيل') return 'Operations';
      return dept;
    }
  };

  // Upload Report Form State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState(user?.name || '');
  const [department, setDepartment] = useState(() => getMappedDept(user?.department, isRtl));
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [serverTime, setServerTime] = useState<string>('');

  // Keep a live clock in upload modal showing server time
  useEffect(() => {
    if (uploadOpen) {
      const updateTime = () => {
        const now = new Date();
        const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
        setServerTime(timeStr);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [uploadOpen]);

  const handleExport = () => {
    toast.success(isRtl ? 'تم تصدير التقرير بنجاح بصيغة PDF / Excel!' : 'Report exported successfully to PDF / Excel!');
  };

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error(isRtl ? 'يرجى اختيار ملف تقرير بصيغة PDF أولاً!' : 'Please select a PDF report file first!');
      return;
    }

    if (!pdfFile.name.toLowerCase().endsWith('.pdf') && pdfFile.type !== 'application/pdf') {
      toast.error(isRtl ? 'الرجاء رفع ملف بصيغة PDF فقط!' : 'Please upload a PDF file only!');
      return;
    }

    const fileSizeFormatted = pdfFile.size > 1024 * 1024
      ? `${(pdfFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(pdfFile.size / 1024).toFixed(0)} KB`;

    addUploadedReport({
      fileName: pdfFile.name,
      fileSize: fileSizeFormatted,
      uploaderName,
      department
    });

    toast.success(isRtl ? 'تم رفع التقرير بنجاح!' : 'Report uploaded successfully!');
    setUploadOpen(false);
    setPdfFile(null);
  };

  // Filtered lists for System Reports
  const filteredLeads = leads.filter((l) => {
    if (crmGovernorate !== 'All' && l.governorate !== crmGovernorate) return false;
    if (crmStatus !== 'All' && l.status !== crmStatus) return false;
    return true;
  });

  const filteredCampaigns = campaigns.filter((c) => {
    if (mktPlatform !== 'All' && !c.platform.includes(mktPlatform)) return false;
    if (mktStatus !== 'All' && c.status !== mktStatus) return false;
    return true;
  });

  const filteredTasks = tasks.filter((t) => {
    if (taskPriority !== 'All' && t.priority !== taskPriority) return false;
    if (taskAssignee !== 'All' && t.assignee !== taskAssignee) return false;
    return true;
  });

  const filteredFinance = financeRecords.filter((r) => {
    if (finCategory !== 'All' && r.category !== finCategory) return false;
    if (finType !== 'All' && r.type !== finType) return false;
    return true;
  });

  // Filtered list for Uploaded Team Reports
  const filteredUploadedReports = (uploadedReports || []).filter((r) => {
    if (searchUploader.trim() && !r.uploaderName.toLowerCase().includes(searchUploader.toLowerCase())) {
      return false;
    }
    if (filterDept !== 'All' && r.department !== filterDept) {
      return false;
    }
    return true;
  });

  const uniqueDepartments = Array.from(
    new Set((uploadedReports || []).map((r) => r.department))
  );

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight m-0">{t('reports')}</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'مركز التقارير الموحد: توليد واستخراج الإحصائيات الكاملة لجميع أقسام النظام.' : 'Unified report center for downloading statements.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (user) {
                setUploaderName(user.name);
                setDepartment(getMappedDept(user.department, isRtl));
              }
              setUploadOpen(true);
            }}
            className="w-full sm:w-auto custom-btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>{isRtl ? 'رفع تقرير PDF' : 'Upload PDF Report'}</span>
          </button>
          
          <button
            onClick={handleExport}
            className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{isRtl ? 'تصدير التقرير' : 'Export Statement'}</span>
          </button>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedReport('crm')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'crm' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <BarChart2 className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'تقرير المبيعات والعملاء' : 'CRM Leads Report'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{leads.length} {isRtl ? 'سجل عميل فعال' : 'records'}</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedReport('marketing')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'marketing' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <CheckCircle2 className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'تقرير الأداء التسويقي' : 'Marketing Report'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{campaigns.length} {isRtl ? 'حملات إعلانية' : 'campaigns'}</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedReport('tasks')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'tasks' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <UserCheck className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'تقرير إنجاز المهام' : 'Tasks Summary'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{tasks.length} {isRtl ? 'إجمالي المهام' : 'tasks'}</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedReport('finance')}
          className={`custom-card p-5 cursor-pointer text-center flex flex-col items-center gap-3 border-t-4 transition-all ${
            selectedReport === 'finance' ? 'border-t-red-600 bg-red-50/10' : 'border-t-gray-100 hover:border-t-red-200'
          }`}
        >
          <DollarSign className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{isRtl ? 'التقرير المالي العام' : 'Financial Statement'}</h4>
            <p className="text-[9px] text-gray-400 mt-0.5">{financeRecords.length} {isRtl ? 'عملية مقيدة' : 'entries'}</p>
          </div>
        </div>
      </div>

      {/* Selected Report details render */}
      <div className="custom-card p-6">
        <h3 className="font-black text-sm text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-600" />
          <span>
            {selectedReport === 'crm' && (isRtl ? 'مسودة تقرير العملاء والمبيعات' : 'CRM Leads Performance Statement')}
            {selectedReport === 'marketing' && (isRtl ? 'مسودة تقرير الحملات الإعلانية' : 'Marketing Ad Campaigns Audit')}
            {selectedReport === 'tasks' && (isRtl ? 'تقرير نسب إنجاز المهام والإنتاجية' : 'Productivity & Tasks Completion Summary')}
            {selectedReport === 'finance' && (isRtl ? 'التقرير المالي التفصيلي للأرباح والخسائر' : 'Financial Revenue & Expenses Ledger')}
          </span>
        </h3>

        {/* Dynamic Filters for Active System Report */}
        <div className="bg-red-50/10 border border-red-100/55 rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            {isRtl ? 'تصفية بيانات التقرير:' : 'Filter Report Data:'}
          </span>

          {selectedReport === 'crm' && (
            <>
              <select
                value={crmGovernorate}
                onChange={(e) => setCrmGovernorate(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-36"
              >
                <option value="All">{isRtl ? 'كل المحافظات' : 'All Governorates'}</option>
                {Array.from(new Set(leads.map((l) => l.governorate))).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select
                value={crmStatus}
                onChange={(e) => setCrmStatus(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-32"
              >
                <option value="All">{isRtl ? 'كل الحالات' : 'All Statuses'}</option>
                {Array.from(new Set(leads.map((l) => l.status))).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </>
          )}

          {selectedReport === 'marketing' && (
            <>
              <select
                value={mktPlatform}
                onChange={(e) => setMktPlatform(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-32"
              >
                <option value="All">{isRtl ? 'كل المنصات' : 'All Platforms'}</option>
                {Array.from(new Set(campaigns.flatMap((c) => c.platform))).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={mktStatus}
                onChange={(e) => setMktStatus(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-32"
              >
                <option value="All">{isRtl ? 'كل الحالات' : 'All Statuses'}</option>
                {Array.from(new Set(campaigns.map((c) => c.status))).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </>
          )}

          {selectedReport === 'tasks' && (
            <>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-32"
              >
                <option value="All">{isRtl ? 'كل الأولويات' : 'All Priorities'}</option>
                <option value="High">{t('high')}</option>
                <option value="Medium">{t('medium')}</option>
                <option value="Low">{t('low')}</option>
              </select>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-36"
              >
                <option value="All">{isRtl ? 'كل الموظفين' : 'All Employees'}</option>
                {Array.from(new Set(tasks.map((t) => t.assignee))).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </>
          )}

          {selectedReport === 'finance' && (
            <>
              <select
                value={finType}
                onChange={(e) => setFinType(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-32"
              >
                <option value="All">{isRtl ? 'كل العمليات' : 'All Types'}</option>
                <option value="Revenue">{isRtl ? 'إيرادات' : 'Revenue'}</option>
                <option value="Expense">{isRtl ? 'مصروفات' : 'Expense'}</option>
              </select>
              <select
                value={finCategory}
                onChange={(e) => setFinCategory(e.target.value)}
                className="custom-input py-1 px-2 text-[10px] bg-white border border-gray-200 rounded-xl w-36"
              >
                <option value="All">{isRtl ? 'كل التصنيفات' : 'All Categories'}</option>
                {Array.from(new Set(financeRecords.map((r) => r.category))).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </>
          )}

          {/* Reset Filters Button */}
          {(crmGovernorate !== 'All' || crmStatus !== 'All' || mktPlatform !== 'All' || mktStatus !== 'All' || taskPriority !== 'All' || taskAssignee !== 'All' || finCategory !== 'All' || finType !== 'All') && (
            <button
              onClick={() => {
                setCrmGovernorate('All');
                setCrmStatus('All');
                setMktPlatform('All');
                setMktStatus('All');
                setTaskPriority('All');
                setTaskAssignee('All');
                setFinCategory('All');
                setFinType('All');
              }}
              className="text-[10px] text-red-600 font-bold hover:underline ms-auto flex items-center gap-1"
            >
              <span>{isRtl ? 'إعادة التعيين' : 'Reset'}</span>
            </button>
          )}
        </div>

        {/* Dynamic preview text */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-xs text-gray-600 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200/50">
            <div>
              <span className="block text-gray-400 font-semibold mb-0.5">{isRtl ? 'مستخرج التقرير' : 'Generated by'}</span>
              <span className="font-bold text-gray-900">{isRtl ? 'مدير النظام' : 'System Admin'}</span>
            </div>
            <div>
              <span className="block text-gray-400 font-semibold mb-0.5">{isRtl ? 'تاريخ التوليد' : 'Generation Date'}</span>
              <span className="font-bold text-gray-900 font-mono">{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 mb-2">{isRtl ? 'ملخص إحصائيات التقرير:' : 'Summary statistics:'}</h4>
            {selectedReport === 'crm' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي العملاء المصفين: ' : 'Total Leads: '} {filteredLeads.length}</li>
                <li>{isRtl ? 'العملاء المكتملون بنجاح: ' : 'Won Leads: '} {filteredLeads.filter(l => l.status === 'Won').length}</li>
                <li>{isRtl ? 'معدل نجاح إتمام الصفقات: ' : 'Deal conversion rate: '} {filteredLeads.length > 0 ? ((filteredLeads.filter(l => l.status === 'Won').length / filteredLeads.length) * 100).toFixed(0) : 0}%</li>
              </ul>
            )}
            {selectedReport === 'marketing' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي الحملات النشطة: ' : 'Active Campaigns: '} {filteredCampaigns.filter(c => c.status === 'Active').length}</li>
                <li>{isRtl ? 'الميزانية التسويقية الإجمالية: ' : 'Total marketing budget: '} {filteredCampaigns.reduce((acc, c) => acc + c.budget, 0).toLocaleString()} ج.م</li>
                <li>{isRtl ? 'العائد المالي العام المحقق: ' : 'Total sales revenue: '} {filteredCampaigns.reduce((acc, c) => acc + c.revenueGenerated, 0).toLocaleString()} ج.م</li>
              </ul>
            )}
            {selectedReport === 'tasks' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي المهام المصفاة: ' : 'Total scheduled tasks: '} {filteredTasks.length}</li>
                <li>{isRtl ? 'المهام المكتملة بنجاح: ' : 'Completed tasks: '} {filteredTasks.filter(t => t.status === 'Completed').length}</li>
                <li>{isRtl ? 'المهام قيد التنفيذ: ' : 'Tasks in progress: '} {filteredTasks.filter(t => t.status === 'In Progress').length}</li>
              </ul>
            )}
            {selectedReport === 'finance' && (
              <ul className="list-disc list-inside space-y-1">
                <li>{isRtl ? 'إجمالي الإيرادات المسجلة: ' : 'Revenues: '} {filteredFinance.filter(r => r.type === 'Revenue').reduce((acc, c) => acc + c.amount, 0).toLocaleString()} ج.م</li>
                <li>{isRtl ? 'إجمالي المصروفات التشغيلية: ' : 'Expenses: '} {filteredFinance.filter(r => r.type === 'Expense').reduce((acc, c) => acc + c.amount, 0).toLocaleString()} ج.م</li>
                <li>{isRtl ? 'صافي الربح قبل الضرائب: ' : 'Net Profit: '} {(filteredFinance.filter(r => r.type === 'Revenue').reduce((acc, c) => acc + c.amount, 0) - filteredFinance.filter(r => r.type === 'Expense').reduce((acc, c) => acc + c.amount, 0)).toLocaleString()} ج.م</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Team Reports list section */}
      <div className="custom-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-black text-sm text-gray-950 flex items-center gap-2">
              <Upload className="w-5 h-5 text-red-600" />
              <span>{t('uploadedReportsList')}</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">
              {isRtl
                ? 'التقارير التي تم رفعها يدوياً بواسطة أعضاء الفريق بصيغة PDF فقط موثقاً بالقسم وتاريخ الرفع.'
                : 'PDF reports uploaded manually by the team, marked with names, departments, and server times.'}
            </p>
          </div>
        </div>

        {/* Uploaded Reports Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-6">
          {/* Uploader Name Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchUploader}
              onChange={(e) => setSearchUploader(e.target.value)}
              placeholder={isRtl ? 'ابحث باسم رافع التقرير...' : 'Search by uploader...'}
              className="
                w-full
                h-9
                rounded-xl
                border
                border-gray-200
                bg-white
                ps-9
                pe-9
                text-xs
                placeholder:text-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-red-500/10
                focus:border-red-500
              "
            />
            {searchUploader && (
              <button
                onClick={() => setSearchUploader('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-0.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="min-w-[150px]">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500"
            >
              <option value="All">{t('allDepartments')}</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchUploader !== '' || filterDept !== 'All') && (
            <button
              onClick={() => {
                setSearchUploader('');
                setFilterDept('All');
              }}
              className="px-3 h-9 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-100/50 transition-all"
            >
              {t('resetFilters')}
            </button>
          )}
        </div>

        {/* Uploaded Reports Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/10 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'اسم ملف التقرير' : 'Report File Name'}</th>
                <th className="p-4 text-start">{isRtl ? 'اسم الموظف' : 'Employee'}</th>
                <th className="p-4 text-start">{t('department')}</th>
                <th className="p-4 text-start">{isRtl ? 'وقت الرفع (السيرفر)' : 'Upload Time (Server)'}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUploadedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                        PDF
                      </span>
                      <div>
                        <span className="block truncate max-w-[200px]" title={report.fileName}>
                          {report.fileName}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{report.fileSize}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">{report.uploaderName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700">
                      {report.department}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono">{report.uploadTime}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <button
                        onClick={() => {
                          toast.success(isRtl ? 'جاري تحميل ملف التقرير...' : 'Downloading report file...');
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title={isRtl ? 'تحميل' : 'Download'}
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteUploadedReport(report.id);
                          toast.success(isRtl ? 'تم حذف التقرير بنجاح!' : 'Report deleted successfully!');
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUploadedReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 text-xs">
                    {isRtl ? 'لا توجد تقارير مرفوعة تطابق خيارات التصفية.' : 'No uploaded reports match your filter options.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setUploadOpen(false)} />
          <form
            onSubmit={handleUploadReport}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setUploadOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-red-600" />
              <span>{isRtl ? 'رفع تقرير PDF جديد' : 'Upload New PDF Report'}</span>
            </h3>

            {/* Server Time Display */}
            <div className="mb-4 bg-red-50/30 border border-red-100/30 rounded-xl p-3 flex items-center justify-between text-xs text-red-800">
              <span className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600 animate-spin-slow" />
                {t('serverTime')}
              </span>
              <span className="font-mono font-bold tracking-wider">{serverTime}</span>
            </div>

            <div className="space-y-4">
              {/* Uploader Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  {isRtl ? 'اسم الموظف المرفق (مطلوب)' : 'Uploader Name (Required)'}
                </label>
                <input
                  type="text"
                  required
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder={isRtl ? 'أدخل اسمك كاملاً' : 'Enter uploader name'}
                  className="custom-input text-xs"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('department')}</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="custom-input text-xs"
                >
                  <option value={isRtl ? 'المبيعات' : 'Sales'}>{isRtl ? 'المبيعات' : 'Sales'}</option>
                  <option value={isRtl ? 'التسويق' : 'Marketing'}>{isRtl ? 'التسويق' : 'Marketing'}</option>
                  <option value={isRtl ? 'الموارد البشرية' : 'HR'}>{isRtl ? 'الموارد البشرية' : 'HR'}</option>
                  <option value={isRtl ? 'الإدارة المالية' : 'Finance'}>{isRtl ? 'الإدارة المالية' : 'Finance'}</option>
                  <option value={isRtl ? 'التشغيل' : 'Operations'}>{isRtl ? 'التشغيل' : 'Operations'}</option>
                  <option value={isRtl ? 'IT' : 'IT'}>{isRtl ? 'تكنولوجيا المعلومات (IT)' : 'IT'}</option>
                  <option value={isRtl ? 'تطوير البرمجيات' : 'Software Development'}>{isRtl ? 'تطوير البرمجيات (Software Development)' : 'Software Development'}</option>
                  <option value={isRtl ? 'التدريب' : 'Training'}>{isRtl ? 'التدريب (Training)' : 'Training'}</option>
                </select>
              </div>

              {/* File Input */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  {isRtl ? 'ملف التقرير (PDF فقط)' : 'Report File (PDF only)'}
                </label>
                <div className="relative border-2 border-dashed border-gray-200 hover:border-red-400 rounded-xl p-4 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                          toast.error(isRtl ? 'يسمح بملفات PDF فقط!' : 'PDF files only are allowed!');
                          e.target.value = '';
                          setPdfFile(null);
                        } else {
                          setPdfFile(file);
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-[11px] text-gray-600 font-bold text-center">
                    {pdfFile ? pdfFile.name : t('dragOrSelectPdf')}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1">{t('pdfOnly')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {t('save')}
              </button>
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
