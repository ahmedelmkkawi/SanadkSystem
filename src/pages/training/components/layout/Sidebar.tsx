import { useApp } from '../../context/AppContext';
import type { Role } from '../../types';
import { useAppSelector } from '../../../../store';

interface SidebarProps {
  onOpenApplicationModal: () => void;
}

const ChevronDownIcon = () => (
  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const navGroups = [
  {
    labelKey: 'navInstructor',
    items: [
      { role: 'instructor' as Role, labelKey: 'instructorWorkspace', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    ],
  },
  {
    labelKey: 'navFinance',
    items: [
      { role: 'admin' as Role, labelKey: 'financeStats', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },
];

export default function Sidebar({ onOpenApplicationModal: _onOpenApplicationModal }: SidebarProps) {
  const { role, switchRole, t } = useApp();

  return (
    <aside id="sidebar" className="w-72 bg-white border-e border-gray-200 flex-shrink-0 flex flex-col z-20 transition-all duration-300 h-screen shadow-lg">
      {/* Logo */}
      <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center shadow-lg shadow-brand-600/30 border border-brand-400/20">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-zinc-900 tracking-tight leading-none" style={{ textShadow: '0 0 8px rgba(239,68,68,0.4)' }}>Sanadak</h1>
            <p className="text-[11px] font-bold text-brand-600 mt-1">{t('platformSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.labelKey} className="space-y-2">
            <div className="flex items-center justify-between px-3 text-[12px] font-extrabold text-zinc-400 uppercase tracking-wider">
              <span>{t(group.labelKey)}</span>
              <ChevronDownIcon />
            </div>
            <div className="space-y-1">
              {group.items.map(item => (
                <button
                  key={item.role}
                  onClick={() => switchRole(item.role)}
                  className={`sidebar-link w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                    role === item.role
                      ? 'bg-brand-50/60 text-brand-600 border-e-4 border-brand-500'
                      : 'text-zinc-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{t(item.labelKey)}</span>
                  </div>
                  {role === item.role && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-md shadow-brand-500/50 animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {(() => {
        const { user } = useAppSelector((state) => state.auth);
        const displayName = user ? user.name : 'Eng. Mohamed';
        const displayEmail = user ? user.email : 'admin@sanadak.com';
        const initial = displayName.charAt(0).toUpperCase();
        return (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-sm font-bold text-brand-600 shadow-sm">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                <p className="text-[11px] text-gray-400 truncate">{displayEmail}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </aside>
  );
}
