import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { updateUserDepartment } from '../store/authSlice';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  Code,
  GraduationCap,
  Megaphone,
  UserCheck,
  Mail
} from 'lucide-react';

export const FinanceStaffAssignments: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const dispatch = useAppDispatch();

  const { registeredUsers } = useAppSelector((state) => state.auth);
  const { financeRecords } = useAppStore();

  const financeEmployees = registeredUsers.filter((u) => u.role === 'Finance Employee');

  const departmentOptions = [
    { value: 'SoftwareDevelopment', labelAr: 'قسم البرمجة والتطوير', labelEn: 'Software Development', icon: Code, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { value: 'Training', labelAr: 'قسم التدريب والتعليم', labelEn: 'Training Department', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { value: 'Marketing', labelAr: 'قسم التسويق والإعلانات', labelEn: 'Marketing Department', icon: Megaphone, color: 'text-purple-600 bg-purple-50 border-purple-200' }
  ];

  const getDeptObj = (deptVal?: string) => {
    return departmentOptions.find((d) => d.value === deptVal) || departmentOptions[0];
  };

  const handleDeptChange = (userId: string, userName: string, newDept: string) => {
    dispatch(updateUserDepartment({ id: userId, department: newDept }));
    const deptObj = departmentOptions.find((d) => d.value === newDept);
    const deptName = isRtl ? deptObj?.labelAr : deptObj?.labelEn;
    toast.success(
      isRtl
        ? `✓ تم تحديث اختصاص الموظف (${userName}) ليكون مسؤولاً عن إيرادات ومصروفات: ${deptName}`
        : `✓ Scoped (${userName}) to department: ${deptName}`
    );
  };

  // Calculate statistics per department
  const getDeptStats = (deptVal: string) => {
    const deptRecords = financeRecords.filter((r) => r.department === deptVal);
    const revenues = deptRecords.filter((r) => r.type === 'Revenue').reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = deptRecords.filter((r) => r.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
    return {
      revenueCount: deptRecords.filter((r) => r.type === 'Revenue').length,
      expenseCount: deptRecords.filter((r) => r.type === 'Expense').length,
      totalRevenue: revenues,
      totalExpense: expenses,
      net: revenues - expenses
    };
  };

  return (
    <div className="space-y-6 font-outfit pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-950 tracking-tight m-0">
              {isRtl ? 'إدارة موظفي المالية وتخصيص الأقسام' : 'Finance Staff Department Assignments'}
            </h1>
            <span className="bg-red-50 text-red-700 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-red-150">
              {isRtl ? 'لوحة التوزيع الهيكلي' : 'Department Scoping Module'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isRtl
              ? 'شاشة مخصصة لإدارة موظفي المالية الـ 3، وتحديد القسم المسؤول عنه كل موظف (البرمجة والتطوير، التدريب، التسويق).'
              : 'Dedicated management console to assign the 3 Finance Employees to Software Development, Training, or Marketing.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2 rounded-xl border border-emerald-200 font-extrabold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isRtl ? 'صلاحيات المدير المالي والـ CEO' : 'Finance Manager / CEO Access'}</span>
        </div>
      </div>

      {/* 2. Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departmentOptions.map((opt) => {
          const Icon = opt.icon;
          const assignedEmp = financeEmployees.find((u) => u.department === opt.value);
          const stats = getDeptStats(opt.value);

          return (
            <div key={opt.value} className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl border ${opt.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-gray-400 font-mono">
                  {assignedEmp ? (isRtl ? 'معيّن حالياً' : 'Assigned') : (isRtl ? 'شاغر' : 'Vacant')}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-gray-900">{isRtl ? opt.labelAr : opt.labelEn}</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>{assignedEmp ? assignedEmp.name : (isRtl ? 'لم يتم تعيين موظف بعد' : 'No employee assigned')}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 block font-bold">{isRtl ? 'المقبوضات' : 'Revenues'}</span>
                  <span className="font-black text-emerald-800 text-sm">+{stats.totalRevenue.toLocaleString()} ج.م</span>
                </div>
                <div className="bg-red-50/60 p-2.5 rounded-xl border border-red-100">
                  <span className="text-[10px] text-red-700 block font-bold">{isRtl ? 'المصروفات' : 'Expenses'}</span>
                  <span className="font-black text-red-800 text-sm">-{stats.totalExpense.toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Finance Employees Assignment Table */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">
                {isRtl ? 'قائمة موظفي المالية وتعديل التخصيص' : 'Finance Employees & Scopes'}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                {isRtl
                  ? 'اختر من القائمة المنسدلة القسم المالي المسند لكل موظف، ليتم حصر صلاحياته وإحصائياته في ذلك القسم فقط.'
                  : 'Assign department scope for each Finance Employee using the dropdown selectors.'}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-gray-700 font-extrabold uppercase">
                <th className="p-4 text-start">{isRtl ? 'اسم الموظف والبيانات' : 'Employee Details'}</th>
                <th className="p-4 text-start">{isRtl ? 'الرول والمستوى' : 'Role'}</th>
                <th className="p-4 text-start">{isRtl ? 'القسم والتبعية المالية الحالية' : 'Assigned Department'}</th>
                <th className="p-4 text-center">{isRtl ? 'تعديل التخصيص' : 'Change Assignment'}</th>
                <th className="p-4 text-center">{isRtl ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {financeEmployees.map((emp) => {
                const currentDeptObj = getDeptObj(emp.department);
                const DeptIcon = currentDeptObj.icon;

                return (
                  <tr key={emp.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center font-black text-sm shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900 text-sm">{emp.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-lg border border-red-200 inline-block text-[11px]">
                        Finance Employee
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg border ${currentDeptObj.color}`}>
                          <DeptIcon className="w-4 h-4" />
                        </span>
                        <span className="font-extrabold text-gray-900">
                          {isRtl ? currentDeptObj.labelAr : currentDeptObj.labelEn}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={emp.department || 'SoftwareDevelopment'}
                        onChange={(e) => handleDeptChange(emp.id, emp.name, e.target.value)}
                        className="bg-white border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 px-3.5 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs cursor-pointer"
                      >
                        {departmentOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {isRtl ? opt.labelAr : opt.labelEn}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isRtl ? 'نشط ومعيّن' : 'Active'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceStaffAssignments;
