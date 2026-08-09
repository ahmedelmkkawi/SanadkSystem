import { useApp } from '../../context/AppContext';
import type { Role } from '../../types';

interface HeaderProps {
  onOpenApplicationModal: () => void;
}

const pillRoles: { role: Role; label: string }[] = [
  { role: 'recruiter', label: 'مسؤول التدريب (Training Manager)' },
  { role: 'instructor', label: 'المحاضر (Instructor)' },
  { role: 'admin', label: 'الرواتب والإحصائيات' },
];

const roleLabelMap: Record<Role, { en: string; ar: string }> = {
  recruiter: { en: 'TRAINING MANAGER', ar: 'مسؤول التدريب' },
  instructor: { en: 'INSTRUCTOR SCHEDULE', ar: 'جدول المحاضرات للانستراكتور' },
  student: { en: 'STUDENT PORTAL', ar: 'بوابة الطالب' },
  admin: { en: 'FINANCE & ADMIN', ar: 'الرواتب والإحصائيات' },
};

export default function Header({ onOpenApplicationModal: _onOpenApplicationModal }: HeaderProps) {
  const { role, lang, switchRole, toggleLang } = useApp();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-6">
        {/* Role switcher pills */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100/70 p-1.5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 px-3 py-1">تجربة أدوار المستخدمين:</span>
          {pillRoles.map(p => (
            <button
              key={p.role}
              onClick={() => switchRole(p.role)}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                role === p.role
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0A18.015 18.015 0 0110 14.5M10 14.5a18.397 18.397 0 01-5 3.5m5-3.5a18.106 18.106 0 005-3.5M10.5 9h-4" />
          </svg>
          <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        <div className="flex items-center gap-2 border-s border-gray-200 ps-4">
          <span className="text-xs font-black tracking-wider text-brand-600 uppercase flex items-center gap-1.5 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
            <span>{lang === 'ar' ? roleLabelMap[role].ar : roleLabelMap[role].en}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
