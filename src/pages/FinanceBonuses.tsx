import React, { useState } from 'react';
import { useAppStore, type BonusRecord } from '../store/useAppStore';
import {
  Gift,
  Plus,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Building2,
  Award,
  Sparkles,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export const FinanceBonuses: React.FC = () => {
  const { bonusRecords, addBonusRecord, disburseBonusRecord, deleteBonusRecord } = useAppStore();

  // Active Department Filter
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal Form State
  const [formOpen, setFormOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [department, setDepartment] = useState('SoftwareDevelopment');
  const [amount, setAmount] = useState<number>(2000);
  const [bonusType, setBonusType] = useState('حافز أداء ممتاز');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [autoDisburse, setAutoDisburse] = useState(true);

  // Departments List with Icons and Colors
  const deptConfigs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    SoftwareDevelopment: { label: 'قسم البرمجة وتطوير الأنظمة', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    Training: { label: 'قسم التدريب والتعليم', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Sales: { label: 'قسم المبيعات والتسويق', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    HR: { label: 'قسم الموارد البشرية', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Operations: { label: 'قسم العمليات والإدارة', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };

  const getDeptBadge = (deptKey: string) => {
    const cfg = deptConfigs[deptKey] || { label: deptKey, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
        <Building2 className="w-3.5 h-3.5" />
        {cfg.label}
      </span>
    );
  };

  // Filtered List
  const filteredBonuses = bonusRecords.filter(b => {
    const matchesDept = selectedDept === 'ALL' || b.department === selectedDept;
    const matchesSearch = !searchQuery || 
      b.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.employeeRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // KPI Computations
  const disbursedTotal = bonusRecords
    .filter(b => b.status === 'Disbursed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingTotal = bonusRecords
    .filter(b => b.status !== 'Disbursed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const uniqueBeneficiaries = new Set(bonusRecords.map(b => b.employeeName)).size;

  // Department with maximum bonuses
  const deptCounts: Record<string, number> = {};
  bonusRecords.forEach(b => {
    deptCounts[b.department] = (deptCounts[b.department] || 0) + b.amount;
  });
  let topDeptKey = 'SoftwareDevelopment';
  let maxDeptVal = 0;
  Object.entries(deptCounts).forEach(([k, val]) => {
    if (val > maxDeptVal) {
      maxDeptVal = val;
      topDeptKey = k;
    }
  });

  // Handle Create Bonus
  const handleCreateBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !employeeRole || !reason || amount <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة بمبالغ صحيحة.');
      return;
    }

    addBonusRecord({
      employeeName,
      employeeRole,
      department,
      amount: Number(amount),
      bonusType,
      date,
      reason,
      approvedBy: 'مدير المالية (Finance Manager)',
      status: autoDisburse ? 'Disbursed' : 'Approved'
    });

    setFormOpen(false);
    setEmployeeName('');
    setEmployeeRole('');
    setReason('');
    toast.success(`تم تسجيل واعتماد الحافز بقيمة ${amount.toLocaleString()} ج.م للموظف (${employeeName}) بنجاح!`);
  };

  const handleDisburseClick = (b: BonusRecord) => {
    disburseBonusRecord(b.id);
    toast.success(`تم صرف الحافز (${b.amount.toLocaleString()} ج.م) للموظف ${b.employeeName} وإدراجه في المصروفات بنجاح.`);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا الحافز؟')) {
      deleteBonusRecord(id);
      toast.success('تم حذف سجل الحافز بنجاح.');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-cairo">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 p-6 rounded-3xl text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-2xl">
              <Gift className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                نظام إدارة الحوافز والمكافآت والعمولات
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/80 font-medium mt-0.5">
                متابعة واعتماد وصرف مكافآت التميز والعمولات لكافة موظفي وأعضاء الأقسام المختلفة
              </p>
            </div>
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="px-5 py-3 bg-amber-500 text-amber-950 rounded-2xl font-black text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-900/40 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>صرف / منح حافز ومكافأة جديدة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-semibold">إجمالي الحوافز المصروفة</span>
            <span className="text-xl font-black text-gray-900">{disbursedTotal.toLocaleString()} ج.م</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-semibold">حوافز معلقة قيد الصرف</span>
            <span className="text-xl font-black text-gray-900">{pendingTotal.toLocaleString()} ج.م</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-semibold">عدد الموظفين المكافئين</span>
            <span className="text-xl font-black text-gray-900">{uniqueBeneficiaries} موظف</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-semibold">الأكثر استحقاقاً للحوافز</span>
            <span className="text-xs font-black text-purple-700 block truncate">{deptConfigs[topDeptKey]?.label.split(' ')[1] || 'قسم البرمجة'}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Department Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedDept('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedDept === 'ALL'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🏢 كافة الأقسام ({bonusRecords.length})
          </button>
          {Object.entries(deptConfigs).map(([key, cfg]) => {
            const count = bonusRecords.filter(b => b.department === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedDept(key)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedDept === key
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cfg.label.split(' ')[0]} {cfg.label.split(' ')[1]} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="بحث باسم الموظف أو السبب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-bold"
          />
        </div>
      </div>

      {/* Data Table / Cards List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            سجل ومستحقات الحوافز والمكافآت ({filteredBonuses.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredBonuses.map((b) => (
            <div key={b.id} className="p-5 hover:bg-gray-50/80 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getDeptBadge(b.department)}
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-lg text-xs font-black border border-amber-200">
                    {b.bonusType}
                  </span>
                  {b.status === 'Disbursed' ? (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      صُرفت بنجاح
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-black flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      معتمدة قيد الصرف
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <h4 className="font-black text-gray-900 text-base">{b.employeeName}</h4>
                  <span className="text-xs text-gray-500 font-bold">({b.employeeRole})</span>
                </div>

                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200/60 max-w-2xl">
                  <span className="font-bold text-gray-700">سبب المكافأة والإنجاز: </span>
                  {b.reason}
                </p>

                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-3 pt-1">
                  <span>تاريخ الاستحقاق: {b.date}</span>
                  <span>|</span>
                  <span>معتمد بواسطة: {b.approvedBy}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-between items-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-left">
                  <span className="text-xs text-gray-400 block font-semibold">قيمة المكافأة</span>
                  <span className="text-2xl font-black text-emerald-600">{b.amount.toLocaleString()} ج.م</span>
                </div>

                <div className="flex items-center gap-2">
                  {b.status !== 'Disbursed' && (
                    <button
                      onClick={() => handleDisburseClick(b)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1 shadow-md shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>صرف الحافز الآن</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(b.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredBonuses.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <Gift className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-500">لا توجد سجلات مكافآت مطابقة للفلتر المحدد.</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE BONUS MODAL */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-3xl shadow-2xl space-y-5 animate-in fade-in zoom-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                منح وصرف مكافأة / حافز جديد لموظف
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBonus} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم الموظف المستحق</label>
                  <input
                    type="text"
                    placeholder="e.g. م. إسلام عادل"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Team Leader"
                    value={employeeRole}
                    onChange={(e) => setEmployeeRole(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">القسم التابع له الموظف</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold outline-none"
                  >
                    {Object.entries(deptConfigs).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نوع المكافأة / الحافز</label>
                  <select
                    value={bonusType}
                    onChange={(e) => setBonusType(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="حافز أداء ممتاز">حافز أداء ممتاز</option>
                    <option value="مكافأة تميز">مكافأة تميز في مشروع</option>
                    <option value="عمولة مبيعات">عمولة مبيعات وتعاقدات</option>
                    <option value="بدل إضافي واجتهاد">بدل إضافي واجتهاد</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">قيمة المكافأة (بالجنيه EGP)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">سبب ومبرر الإنجاز المباشر للمكافأة</label>
                <textarea
                  rows={3}
                  placeholder="اكتب تفاصيل المجهود أو الإنجاز الاستثنائي..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="autoDisburse"
                  checked={autoDisburse}
                  onChange={(e) => setAutoDisburse(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <label htmlFor="autoDisburse" className="text-xs font-bold text-amber-900 cursor-pointer">
                  صرف الحافز فوراً وتسجيله كبند مصروفات مرتبات تلقائي في قسم المالية
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-black text-xs hover:bg-amber-700 transition flex items-center gap-2 shadow-lg shadow-amber-600/30"
                >
                  <Gift className="w-4 h-4" />
                  اعتماد وإدراج الحافز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceBonuses;
