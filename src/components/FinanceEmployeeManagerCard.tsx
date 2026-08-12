import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { updateUserDepartment } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Users, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

export const FinanceEmployeeManagerCard: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const dispatch = useAppDispatch();

  const { registeredUsers, user: currentUser } = useAppSelector((state) => state.auth);

  // Check if current user is Finance Manager or CEO or GM
  const canManage = currentUser?.role === 'Finance Manager' || currentUser?.role === 'CEO' || currentUser?.role === 'General Manager';

  // Filter finance employees
  const financeEmployees = registeredUsers.filter((u) => u.role === 'Finance Employee');

  const departmentOptions = [
    { value: 'SoftwareDevelopment', labelAr: 'قسم البرمجة والتطوير', labelEn: 'Software Development' },
    { value: 'Training', labelAr: 'قسم التدريب والتعليم', labelEn: 'Training Department' },
    { value: 'Marketing', labelAr: 'قسم التسويق', labelEn: 'Marketing Department' }
  ];

  const getDeptLabel = (deptVal?: string) => {
    const found = departmentOptions.find((d) => d.value === deptVal);
    if (!found) return deptVal || (isRtl ? 'غير محدد' : 'Unassigned');
    return isRtl ? found.labelAr : found.labelEn;
  };

  const handleDeptChange = (userId: string, userName: string, newDept: string) => {
    dispatch(updateUserDepartment({ id: userId, department: newDept }));
    const deptObj = departmentOptions.find((d) => d.value === newDept);
    const deptName = isRtl ? deptObj?.labelAr : deptObj?.labelEn;
    toast.success(
      isRtl
        ? `✓ تم تحديث اختصاص الموظف (${userName}) ليكون مسؤولاً عن إيرادات ومصروفات: ${deptName}`
        : `✓ Updated (${userName}) scope to department: ${deptName}`
    );
  };

  if (!canManage) return null;

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <span>{isRtl ? 'إدارة موظفي المالية وتخصيص الأقسام' : 'Finance Employees Department Assignment'}</span>
              <span className="bg-red-50 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-red-100">
                {financeEmployees.length} {isRtl ? 'موظف مالية' : 'Employees'}
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {isRtl
                ? 'لوحة المدير المالي لتوزيع موظفي المالية الـ 3 على أقسام (البرمجة، التدريب، التسويق) وضبط صلاحيات الإيرادات والمصروفات.'
                : 'Finance Manager panel to assign 3 Finance Employees to Software Development, Training, or Marketing.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-xl border border-emerald-200/80 font-bold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isRtl ? 'صلاحيات المدير المالي (Finance Manager Control)' : 'Finance Manager Scope'}</span>
        </div>
      </div>

      {/* Employees Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financeEmployees.map((emp) => {
          return (
            <div key={emp.id} className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-4 space-y-3 hover:border-red-300 transition-all shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xs">{emp.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{emp.email}</p>
                </div>
                <span className="bg-red-100/80 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-200">
                  Finance Employee
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-bold text-gray-600 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{isRtl ? 'القسم والتبعية المالية المسندة:' : 'Assigned Department:'}</span>
                </label>
                <select
                  value={emp.department || 'SoftwareDevelopment'}
                  onChange={(e) => handleDeptChange(emp.id, emp.name, e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg text-xs font-extrabold text-gray-900 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs"
                >
                  {departmentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {isRtl ? opt.labelAr : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200/70 text-[11px] text-gray-600 flex items-center justify-between font-mono">
                <span className="text-[10px] text-gray-400">{isRtl ? 'الحالة الحالية:' : 'Current Scope:'}</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{getDeptLabel(emp.department)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinanceEmployeeManagerCard;
