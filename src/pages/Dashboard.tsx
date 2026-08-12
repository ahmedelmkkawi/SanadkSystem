import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store';
import { type UserRole } from '../store/authSlice';
import { useAppStore } from '../store/useAppStore';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useDevModuleStore } from '../store/devModuleStore';
import toast from 'react-hot-toast';
import { KPICard } from '../components/KPICard';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Calendar,
  CheckSquare,
  DollarSign,
  Megaphone,
  UserPlus,
  FileText,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  Code,
  ArrowUpRight,
  GraduationCap,
  Users
} from 'lucide-react';

// Sales Manager Inbox Component (Lead Intake & Distribution Layer)
const SalesManagerInbox: React.FC<{ isRtl: boolean }> = ({ isRtl }) => {
  const { leads, assignLead } = useAppStore();
  const unassignedLeads = leads.filter((l) => !l.assignedTo);

  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-50">
        <div>
          <h4 className="font-extrabold text-sm text-gray-900">
            📥 {isRtl ? 'صندوق وارد العملاء الجدد (غير معينين)' : 'New Leads Inbox (Unassigned)'}
          </h4>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {isRtl ? 'العملاء القادمون من الحملات والمواقع الإلكترونية بانتظار التوزيع.' : 'Incoming leads from external campaigns pending agent assignment.'}
          </p>
        </div>
        <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
          {unassignedLeads.length} {isRtl ? 'عميل' : 'Leads'}
        </span>
      </div>

      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
        {unassignedLeads.map((lead) => (
          <div key={lead.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <p className="font-bold text-xs text-gray-900">{lead.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {lead.company} | {lead.source} | {lead.governorate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={lead.assignedTo || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    assignLead(lead.id, e.target.value);
                  }
                }}
                className="custom-input py-1 px-2 text-[10px] w-40"
              >
                <option value="">👤 {isRtl ? 'تعيين لموظف...' : 'Assign Agent...'}</option>
                <option value="محمد حسن (Employee)">محمد حسن (Employee)</option>
                <option value="محمود عبد السلام">محمود عبد السلام</option>
              </select>
            </div>
          </div>
        ))}
        {unassignedLeads.length === 0 && (
          <div className="py-8 text-center text-xs text-gray-400">
            🎉 {isRtl ? 'تم توزيع جميع العملاء بنجاح!' : 'All leads successfully distributed!'}
          </div>
        )}
      </div>
    </div>
  );
};

// Sales Agent Leads Component (Execution Layer)
const SalesAgentLeadsList: React.FC<{ isRtl: boolean }> = ({ isRtl }) => {
  const { leads } = useAppStore();
  // Filter leads assigned specifically to this sales agent
  const personalLeads = leads.filter((l) => l.assignedTo === 'محمد حسن (Employee)');

  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-50">
        <div>
          <h4 className="font-extrabold text-sm text-gray-900">
            🎯 {isRtl ? 'عملائي المعينين للمتابعة' : 'My Assigned Leads'}
          </h4>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {isRtl ? 'العملاء المعينين إليك مباشرة لمتابعة عملية المبيعات.' : 'Leads assigned to you for execution and follow-ups.'}
          </p>
        </div>
        <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          {personalLeads.length} {isRtl ? 'عميل' : 'Leads'}
        </span>
      </div>

      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
        {personalLeads.map((lead) => (
          <div key={lead.id} className="py-2.5 flex justify-between items-center">
            <div>
              <p className="font-bold text-xs text-gray-900">{lead.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {lead.company} | {lead.phone}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
              lead.status === 'Contacted' ? 'bg-purple-50 text-purple-600' :
              'bg-yellow-50 text-yellow-600'
            }`}>
              {lead.status}
            </span>
          </div>
        ))}
        {personalLeads.length === 0 && (
          <div className="py-8 text-center text-xs text-gray-400">
            {isRtl ? 'لا يوجد عملاء معينين حالياً.' : 'No assigned leads found.'}
          </div>
        )}
      </div>
    </div>
  );
};

// Personal Tasks List for Agents
const PersonalTasksList: React.FC<{ isRtl: boolean }> = ({ isRtl }) => {
  const { tasks } = useAppStore();

  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-50">
        <div>
          <h4 className="font-extrabold text-sm text-gray-900">
            ✅ {isRtl ? 'مهامي اليومية ومتابعاتي' : 'My Daily Tasks & Follow-ups'}
          </h4>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {isRtl ? 'قائمة المهام المطلوب إنجازها اليوم.' : 'Tasks assigned to you for execution.'}
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <div key={task.id} className="py-2.5 flex justify-between items-center">
            <div>
              <p className="font-bold text-xs text-gray-900">{task.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {isRtl ? `تاريخ الاستحقاق: ${task.dueDate}` : `Due: ${task.dueDate}`}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
            }`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const location = useLocation();

  const user = useAppSelector((state) => state.auth.user);
  const { currentRole: storeRole } = useDevModuleStore();
  const activeRole = storeRole || user?.role || 'Employee';

  // Role dashboard slugs
  const getRoleUrlSlug = (role: string | undefined): string => {
    switch (role) {
      case 'CEO': return 'ceo';
      case 'General Manager': return 'gm';
      case 'HR Manager': return 'hr';
      case 'Finance Manager': return 'finance';
      case 'Marketing Manager': return 'marketing';
      case 'Sales Manager': return 'sales-manager';
      case 'Team Leader': return 'team-leader';
      case 'Employee': return 'employee';
      case 'Client': return 'client';
      default: return 'employee';
    }
  };

  // State for Date Filter
  const [filter, setFilter] = useState<string>('This Month');
  const [customRange, setCustomRange] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Fetch Dashboard Stats via Hook
  const { data, loading, error, refetch } = useDashboardStats(filter);

  // Root path '/' redirect logic
  if (location.pathname === '/') {
    if (activeRole === 'Tech Lead' || activeRole === 'Team Manager') {
      return <Navigate to="/dev/dashboard" replace />;
    }
    if (activeRole === 'Developer') {
      return <Navigate to="/dev/developer-dashboard" replace />;
    }
    if (activeRole === 'Client') {
      return <Navigate to="/dev/client-portal" replace />;
    }
    const targetRole = activeRole === 'Sales Employee' ? 'Employee' : activeRole;
    return <Navigate to={`/dashboard/${getRoleUrlSlug(targetRole)}`} replace />;
  }

  // Mapped role for standard dashboard layout logic & allowed metric IDs
  const currentRole: UserRole = 
    activeRole === 'Sales Employee' ? 'Employee' : 
    activeRole === 'Team Manager' ? 'Team Leader' : 
    activeRole === 'Tech Lead' ? 'Team Leader' : 
    activeRole === 'Developer' ? 'Employee' : 
    activeRole as UserRole;

  // Quick Action Handlers
  const handleActionClick = (actionName: string) => {
    toast.success(
      isRtl
        ? `تم تشغيل إجراء: ${actionName} (حالة التجربة)`
        : `Triggered quick action: ${actionName} (Demo Mode)`
    );
  };

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      setFilter(`Custom: ${startDate} to ${endDate}`);
      setCustomRange(false);
    }
  };

  // Recharts color palettes
  const COLORS = ['#ef4444', '#f87171', '#dc2626', '#b91c1c', '#7f1d1d'];
  const GRADIENTS = {
    revenue: '#ef4444',
    expenses: '#9ca3af'
  };

  // Get allowed KPI metrics based on active role
  const getAllowedMetricIds = (role: string): string[] => {
    switch (role) {
      case 'CEO':
        return [
          'total_leads', 'new_leads', 'active_leads', 'revenue', 'expenses',
          'net_profit', 'roi', 'roas', 'staff_perf', 'dept_perf', 'overdue_tasks', 'kpi_achievement'
        ];
      case 'General Manager':
        return [
          'total_leads', 'new_leads', 'active_leads', 'staff_perf', 'dept_perf',
          'overdue_tasks', 'kpi_achievement'
        ];
      case 'Sales Manager':
        return ['total_leads', 'new_leads', 'active_leads', 'overdue_tasks'];
      case 'Employee':
        return ['active_leads', 'overdue_tasks', 'staff_perf'];
      case 'HR Manager':
        return ['staff_perf', 'dept_perf', 'kpi_achievement', 'overdue_tasks'];
      case 'Finance Manager':
        return ['revenue', 'expenses', 'net_profit', 'roi', 'roas'];
      case 'Marketing Manager':
        return ['total_leads', 'new_leads', 'roi', 'roas', 'kpi_achievement'];
      case 'Team Leader':
        return ['active_leads', 'staff_perf', 'overdue_tasks'];
      case 'Client':
        return ['kpi_achievement'];
      default:
        return ['overdue_tasks'];
    }
  };

  // Layout Role Flags
  const isCEO = currentRole === 'CEO';
  const isGM = currentRole === 'General Manager';
  const isSalesManager = currentRole === 'Sales Manager';
  const isEmployee = currentRole === 'Employee'; // Sales Agent
  const isHR = currentRole === 'HR Manager';
  const isFinance = currentRole === 'Finance Manager';
  const isMarketing = currentRole === 'Marketing Manager';
  const isTeamLeader = currentRole === 'Team Leader';
  const isClient = currentRole === 'Client';

  return (
    <div className="space-y-6 pb-12 font-outfit">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight m-0">
            {t('dashboard')} - <span className="text-red-600">{currentRole}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRtl
              ? `مرحباً، ${user?.name || ''}. واجهة مخصصة وفقاً لصلاحيات دورك الرقابي والعملي.`
              : `Hello, ${user?.name || ''}. Dynamic dashboard context loaded for your specific security profile.`}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-500">
          <Calendar className="w-4 h-4 text-red-600" />
          <span>{new Date().toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* DASHBOARD DATE FILTERS */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCustomRange(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setCustomRange(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              customRange
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {isRtl ? 'تاريخ مخصص' : 'Custom Range'}
          </button>
        </div>

        {/* Custom Date Picker Popup Form */}
        {customRange && (
          <form onSubmit={handleCustomDateSubmit} className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="custom-input py-1 text-xs w-32"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="custom-input py-1 text-xs w-32"
            />
            <button type="submit" className="custom-btn-primary py-1 px-3 text-xs">
              Apply
            </button>
          </form>
        )}

        <div className="text-xs text-gray-400 font-mono italic shrink-0 self-center">
          {isRtl ? `الفترة النشطة: ${filter}` : `Filter: ${filter}`}
        </div>
      </div>

      {/* QUICK ACTIONS PANEL (Allowed for managers only) */}
      {!isEmployee && !isClient && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-3.5">
            🚀 {isRtl ? 'لوحة الإجراءات السريعة' : 'QUICK ACTIONS PANEL'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => handleActionClick('Add Lead')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 text-xs font-bold text-gray-700 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'إضافة عميل مهتم' : 'Add Lead'}</span>
            </button>
            <button
              onClick={() => handleActionClick('Create Task')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 text-xs font-bold text-gray-700 transition-all duration-200"
            >
              <CheckSquare className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'إنشاء مهمة' : 'Create Task'}</span>
            </button>
            <button
              onClick={() => handleActionClick('Add Expense')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 text-xs font-bold text-gray-700 transition-all duration-200"
            >
              <DollarSign className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'إضافة مصروف' : 'Add Expense'}</span>
            </button>
            <button
              onClick={() => handleActionClick('Create Campaign')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 text-xs font-bold text-gray-700 transition-all duration-200"
            >
              <Megaphone className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'حملة تسويقية' : 'Create Campaign'}</span>
            </button>
            <button
              onClick={() => handleActionClick('Add Employee')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 text-xs font-bold text-gray-700 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'إضافة موظف' : 'Add Employee'}</span>
            </button>
            <button
              onClick={() => handleActionClick('Generate Report')}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/20 text-xs font-bold text-gray-700 transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span>{isRtl ? 'إصدار تقرير' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SKELETON LOADING STATE */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 h-28 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-1/2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="w-9 h-9 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-2 bg-gray-50 rounded mt-4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto animate-bounce" />
          <h3 className="font-extrabold text-base text-gray-950">{isRtl ? 'فشل تحميل بيانات لوحة التحكم' : 'Failed to load dashboard data'}</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => refetch()}
            className="custom-btn-primary px-6 py-2.5 text-xs inline-flex items-center gap-1.5"
          >
            <span>{isRtl ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && (!data || data.metrics.length === 0) && (
        <div className="p-12 bg-white border border-gray-100 rounded-2xl text-center space-y-4">
          <Clock className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-extrabold text-base text-gray-950">{isRtl ? 'لا توجد بيانات متاحة' : 'No data available'}</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {isRtl ? 'لا توجد سجلات متوفرة لهذه الفترة المحددة.' : 'There are no active metrics found for this selected period.'}
          </p>
        </div>
      )}

      {/* DASHBOARD DATA RENDER */}
      {!loading && !error && data && (
        <div className="space-y-6">
          {/* ROLE-FILTERED KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.metrics
              .filter((m) => getAllowedMetricIds(currentRole).includes(m.id))
              .map((metric) => (
                <KPICard key={metric.id} metric={metric} />
              ))}
          </div>
          {/* EXECUTIVE DEPARTMENTAL CONTROL HUB (CEO ONLY) */}
          {isCEO && (
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 p-6 rounded-2xl text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-700/60 pb-4">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                    <span>{isRtl ? 'مركز التحكم الشامل للأقسام (CEO Executive Hub)' : 'Executive Departmental Control Hub'}</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    {isRtl ? 'متابعة لحظية ومباشرة لكافة بيانات وإحصائيات أقسام الشركة الرئيسية' : 'Real-time overview & instant access to key operational departments'}
                  </p>
                </div>
                <span className="bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold px-3 py-1 rounded-xl">
                  {isRtl ? 'صلاحيات المدير العام Full Access' : 'CEO Full Access'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {/* 1. Sales & CRM Department Card */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                      </div>
                      <Link
                        to="/crm/leads"
                        className="text-xs font-bold bg-white/10 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>{isRtl ? 'عرض القسم' : 'Open'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <h4 className="font-extrabold text-sm text-white">{isRtl ? 'قسم المبيعات والعملاء' : 'Sales & CRM'}</h4>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      {isRtl ? 'متابعة العملاء المحتملين، توزيع الفرص، خط سير المبيعات وإتاحة صفقات البيع.' : 'Leads pipeline, sales opportunities, assignment & deals.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <span>{isRtl ? '48 عميل محتمل' : '48 Active Leads'}</span>
                    <span className="text-emerald-300 font-bold">{isRtl ? 'نسبة إغلاق 78%' : '78% Win Rate'}</span>
                  </div>
                </div>

                {/* 2. Training Department Card */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <Link
                        to="/training"
                        className="text-xs font-bold bg-white/10 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>{isRtl ? 'عرض القسم' : 'Open'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <h4 className="font-extrabold text-sm text-white">{isRtl ? 'قسم التدريب والتعليم' : 'Training Department'}</h4>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      {isRtl ? 'إدارة البرامج التدريبية، جدول المحاضرات، تقييم المحاضرين والطلاب.' : 'Courses, lecture schedules, trainer stats and student records.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <span>{isRtl ? '12 دورة تدريبية' : '12 Active Courses'}</span>
                    <span className="text-emerald-400 font-bold">{isRtl ? 'محتوى مكتمل 94%' : '94% On Track'}</span>
                  </div>
                </div>

                {/* 3. Software Development Card */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Code className="w-6 h-6" />
                      </div>
                      <Link
                        to="/dev/dashboard"
                        className="text-xs font-bold bg-white/10 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>{isRtl ? 'عرض القسم' : 'Open'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <h4 className="font-extrabold text-sm text-white">{isRtl ? 'قسم البرمجة والتطوير' : 'Software Development'}</h4>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      {isRtl ? 'لوحة تحكم المشاريع البرمجية، توزيع المهام، أحمال المطورين والأخطاء.' : 'Project status, workload distribution, dev tasks and bug fixes.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <span>{isRtl ? '6 مشاريع برمجية' : '6 Active Projects'}</span>
                    <span className="text-blue-400 font-bold">{isRtl ? '24 مهمة نشطة' : '24 In Progress'}</span>
                  </div>
                </div>

                {/* 4. Marketing Department Card */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Megaphone className="w-6 h-6" />
                      </div>
                      <Link
                        to="/marketing/campaigns"
                        className="text-xs font-bold bg-white/10 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>{isRtl ? 'عرض القسم' : 'Open'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <h4 className="font-extrabold text-sm text-white">{isRtl ? 'قسم التسويق والإعلانات' : 'Marketing Department'}</h4>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      {isRtl ? 'متابعة الحملات الإعلانية، عائد الاستثمار ROI، وتحليلات القنوات.' : 'Ad campaigns, channel attribution, spend and return on investment.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                    <span>{isRtl ? '4 حملات ممولة' : '4 Active Campaigns'}</span>
                    <span className="text-amber-300 font-bold">{isRtl ? 'عائد ROI 285%' : 'ROI 285%'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC LEAD DISTRIBUTION LAYER (SALES MANAGER & CEO ONLY) */}
          {(isSalesManager || isCEO) && (
            <div className="grid grid-cols-1 gap-6">
              <SalesManagerInbox isRtl={isRtl} />
            </div>
          )}

          {/* DYNAMIC EXECUTION LAYER (SALES AGENT ONLY) */}
          {isEmployee && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesAgentLeadsList isRtl={isRtl} />
              <PersonalTasksList isRtl={isRtl} />
            </div>
          )}

          {/* ROLE-BASED WIDGETS SECTION */}
          <div className="space-y-6">
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Widget 1: Revenue vs Expenses Chart (CEO, Finance Manager only) */}
              {(isCEO || isFinance) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تحليل الإيرادات والمصروفات' : ' Revenue vs Expenses'}</h4>
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueVsExpenses} margin={{ top: 10, right: 10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={GRADIENTS.revenue} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={GRADIENTS.revenue} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={GRADIENTS.expenses} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={GRADIENTS.expenses} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Area type="monotone" dataKey="revenue" name={isRtl ? 'الإيرادات' : 'Revenue'} stroke={GRADIENTS.revenue} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="expenses" name={isRtl ? 'المصروفات' : 'Expenses'} stroke={GRADIENTS.expenses} strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Widget 2: Leads by Source (CEO, GM, Sales Manager, Marketing Manager only) */}
              {(isCEO || isGM || isSalesManager || isMarketing) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'قنوات جذب العملاء' : ' Leads by Source'}</h4>
                  <div className="h-52 flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.leadsBySource}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {data.leadsBySource.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-semibold">
                    {data.leadsBySource.map((entry, idx) => (
                      <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-gray-600 truncate">{entry.name}</span>
                        <span className="text-gray-400 font-mono">({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget 3: Leads by Governorate (CEO, GM, Sales Manager only) */}
              {(isCEO || isGM || isSalesManager) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'العملاء حسب المحافظة' : ' Leads by Governorate'}</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.leadsByGovernorate} layout="vertical" margin={{ top: 10, right: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="count" name={isRtl ? 'العملاء' : 'Leads'} fill="#ef4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* ROW 2 */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Widget 4: Monthly Profit Trend (CEO, Finance Manager only) */}
              {(isCEO || isFinance) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'منحنى الأرباح الشهرية' : ' Monthly Profit Trend'}</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.monthlyProfitTrend} margin={{ top: 10, right: 10,  bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="profit" name={isRtl ? 'الربح الصافي' : 'Net Profit'} stroke="#ef4444" strokeWidth={3} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Widget 5: Pipeline Funnel Flow (CEO, GM, Sales Manager, Sales Agent only) */}
              {(isCEO || isGM || isSalesManager || isEmployee) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'خط سير قنوات البيع' : ' Pipeline Funnel Flow'}</h4>
                  <div className="space-y-3 my-auto">
                    {data.pipelineFunnel.map((item, idx) => {
                      const maxVal = data.pipelineFunnel[0].value;
                      const percent = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                      return (
                        <div key={item.stage} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-600">{item.stage}</span>
                            <span className="text-red-600 font-mono">{item.value}</span>
                          </div>
                          <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                            <div
                              className="bg-red-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%`, opacity: 1 - idx * 0.12 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Widget 6: Marketing ROI (CEO, Marketing Manager only) */}
              {(isCEO || isMarketing) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'عائد الاستثمار للحملات' : ' Marketing ROI'}</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.marketingROI} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="campaign" stroke="#9ca3af" fontSize={9} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="roi" name="ROI %" fill="#9ca3af" radius={[4, 4, 0, 0]}>
                          {data.marketingROI.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.roi > 150 ? '#ef4444' : '#6b7280'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* ROW 3 */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Widget 7: KPI Achievement Trend (CEO, GM, HR Manager only) */}
              {(isCEO || isGM || isHR) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'منحنى تحقيق الأهداف الكلية' : ' KPI Achievement Trend'}</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.kpiAchievementTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" name={isRtl ? 'نسبة التحقيق الكلية' : 'Achievement %'} stroke="#ef4444" strokeWidth={2.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Widget 8: Department Performance Ranking (CEO, GM, HR Manager only) */}
              {(isCEO || isGM || isHR) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'تقييم كفاءة الأقسام' : ' Department Rankings'}</h4>
                  <div className="space-y-4 my-auto">
                    {data.departmentPerformance.map((dept) => (
                      <div key={dept.department} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-600">{dept.department}</span>
                          <span className="text-red-600 font-mono">{dept.score}%</span>
                        </div>
                        <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${dept.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget 9: Employee Performance Ranking (CEO, GM, HR Manager, Team Leader, Employee only) */}
              {(isCEO || isGM || isHR || isTeamLeader || isEmployee) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-4">{isRtl ? 'تقييم كفاءة الموظفين' : ' Employee Performance'}</h4>
                  <div className="space-y-4 my-auto">
                    {data.employeePerformance.slice(0, 5).map((emp) => (
                      <div key={emp.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-600">{emp.name} ({emp.department})</span>
                          <span className="text-red-600 font-mono">{emp.score}%</span>
                        </div>
                        <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${emp.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ROW 4 */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Widget 10: Top 5 Employees (CEO, GM, HR Manager, Team Leader only) */}
              {(isCEO || isGM || isHR || isTeamLeader) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-3">{isRtl ? 'أفضل 5 موظفين أداءً' : ' Top 5 Employees'}</h4>
                  <div className="divide-y divide-gray-50">
                    {data.topEmployees.map((emp, idx) => (
                      <div key={emp.name} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {emp.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-gray-900 truncate">{emp.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{emp.department}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                          #{idx + 1} | {emp.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget 11: Top 5 Departments (CEO, GM, HR Manager only) */}
              {(isCEO || isGM || isHR) && (
                <div className="flex-1 min-w-0 w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-3">{isRtl ? 'أداء الأقسام الكلي' : ' Top 5 Departments'}</h4>
                  <div className="divide-y divide-gray-50">
                    {data.topDepartments.map((dept) => (
                      <div key={dept.name} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-gray-900 truncate">{dept.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {isRtl ? `المهام المكتملة: ${dept.tasksCompleted}` : `Tasks: ${dept.tasksCompleted}`}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                          {dept.performance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget 12: Recent Activities (All users see activities filtered/unfiltered) */}
              <div className="flex-1 min-w-0 w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-extrabold text-sm text-gray-900">{isRtl ? 'آخر العمليات والتحديثات' : ' Recent Activities'}</h4>
                  <Activity className="w-4 h-4 text-red-600 animate-pulse" />
                </div>
                <div className="space-y-3 overflow-y-auto pr-1">
                  {data.recentActivities.map((act) => (
                    <div key={act.id} className="flex gap-2.5 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-700 leading-snug">
                          <span className="font-bold text-gray-900">{act.user}</span>{' '}
                          {isRtl ? act.actionAr : act.action}
                        </p>
                        <span className="text-[9px] text-gray-400 block mt-0.5">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
