import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, type UserRole as AuthUserRole, rolePermissions } from '../store/authSlice';
import { markNotificationRead } from '../store/notificationsSlice';
import { useDevModuleStore } from '../store/devModuleStore';
import { isModuleAllowed, type UserRole } from '../utils/permissionSystem';
import logo from '../assets/logo.webp';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Briefcase,
  TrendingUp,
  DollarSign,
  Megaphone,
  Bell,
  BarChart3,
  Globe,
  Menu,
  X,
  ChevronRight,
  Settings,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  BookOpen
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('sidebar-collapsed', String(next));
        return next;
      });
    }
  };

  const { user } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.notifications);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const { currentRole } = useDevModuleStore();
  const activeRole: UserRole = currentRole || (user?.role as UserRole) || 'Employee';

  // Map sandbox roles to Redux equivalent roles for permission calculations
  const mappedRole = activeRole === 'Team Manager' ? 'Team Leader' : 
                     activeRole === 'Sales Employee' ? 'Employee' : 
                     activeRole;

  const activePermissions = (user && rolePermissions[mappedRole as AuthUserRole]) || [];

  // Navigation Items defined dynamically based on user permissions
  const navItems = [];

  // Dashboard - always visible
  navItems.push({ path: '/', label: t('dashboard'), icon: LayoutDashboard });

  // CRM Module
  if (isModuleAllowed(activeRole, 'CRM') && (activePermissions.includes('VIEW_LEADS') || mappedRole === 'Client')) {
    const crmSubItems = [];
    if (mappedRole !== 'Client') {
      crmSubItems.push({ path: '/crm/leads', label: t('leads') });
      crmSubItems.push({ path: '/crm/pipeline', label: t('pipeline') });
      crmSubItems.push({ path: '/crm/communication', label: t('communication') });
    } else {
      crmSubItems.push({ path: '/crm/communication', label: 'المحادثات / Chats' });
    }
    
    navItems.push({
      label: t('crm'),
      icon: Users,
      subItems: crmSubItems
    });
  }

  // Tasks Module
  if (isModuleAllowed(activeRole, 'Tasks') && mappedRole !== 'Client') {
    navItems.push({ path: '/tasks', label: t('tasks'), icon: CheckSquare });
  }

  // Employees Module
  if (isModuleAllowed(activeRole, 'Employees') && mappedRole !== 'Client') {
    const employeeSubItems = [];
    
    // Only HR, CEO, GM can see full employee list
    if (activePermissions.includes('VIEW_EMPLOYEES')) {
      employeeSubItems.push({ path: '/employees', label: t('employeeList') });
    }
    
    employeeSubItems.push({ path: '/employees/attendance', label: t('attendance') });
    employeeSubItems.push({ path: '/employees/leaves', label: t('leaveRequests') });
    
    navItems.push({
      label: t('employees'),
      icon: Briefcase,
      subItems: employeeSubItems
    });
  }

  // KPI Module (requires VIEW_KPI permission)
  if (isModuleAllowed(activeRole, 'KPI') && activePermissions.includes('VIEW_KPI')) {
    const kpiSub = [];
    if (activePermissions.includes('MANAGE_KPI')) {
      kpiSub.push({ path: '/kpi/templates', label: t('kpiBuilder') });
    }
    kpiSub.push({ path: '/kpi/evaluations', label: t('evaluationFlow') });
    kpiSub.push({ path: '/kpi/dashboard', label: t('kpiDashboard') });

    navItems.push({
      label: t('kpi'),
      icon: TrendingUp,
      subItems: kpiSub
    });
  }

  // Finance Module (requires VIEW_FINANCE permission)
  if (isModuleAllowed(activeRole, 'Finance') && activePermissions.includes('VIEW_FINANCE')) {
    const financeSub = [];
    financeSub.push({ path: '/finance/revenues', label: t('revenues') });
    financeSub.push({ path: '/finance/expenses', label: t('expenses') });
    financeSub.push({ path: '/finance/reports', label: t('financialReports') });

    navItems.push({
      label: t('finance'),
      icon: DollarSign,
      subItems: financeSub
    });
  }

  // Marketing Module (requires VIEW_MARKETING permission)
  if (isModuleAllowed(activeRole, 'Marketing') && activePermissions.includes('VIEW_MARKETING')) {
    navItems.push({
      label: t('marketing'),
      icon: Megaphone,
      subItems: [
        { path: '/marketing/campaigns', label: t('campaigns') },
        { path: '/marketing/results', label: t('results') }
      ]
    });
  }


  // Training Module
  if (isModuleAllowed(activeRole, 'Training')) {
    navItems.push({ path: '/training', label: t('trainingNav'), icon: BookOpen });
  }

  // Software Development Module
  if (isModuleAllowed(activeRole, 'SoftwareDevelopment')) {
    if (mappedRole !== 'Client') {
      navItems.push({
        label: t('devDeptNav'),
        icon: Briefcase,
        subItems: [
          { path: '/dev/dashboard', label: t('devDashboard') },
          { path: '/dev/projects', label: t('devProjects') },
          { path: '/dev/tasks', label: t('devTasks') },
          { path: '/dev/teams', label: t('devTeams') },
          { path: '/dev/workload', label: t('devWorkload') },
          { path: '/dev/bugs', label: t('devBugs') },
          { path: '/dev/change-requests', label: t('devChangeRequests') },
          { path: '/dev/reports', label: t('devReports') },
          { path: '/dev/developer-dashboard', label: t('devDeveloperDashboard') }
        ]
      });
    } else {
      // Client Portal
      navItems.push({
        label: t('clientPortalNav'),
        icon: Briefcase,
        subItems: [
          { path: '/dev/client-portal', label: t('devProjectProgress') }
        ]
      });
    }
  }

  // Reports
  if (isModuleAllowed(activeRole, 'Reports') && activePermissions.includes('VIEW_REPORTS')) {
    navItems.push({ path: '/reports', label: t('reports'), icon: BarChart3 });
  }

  // Settings (requires MANAGE_SETTINGS permission)
  if (isModuleAllowed(activeRole, 'Settings') && activePermissions.includes('MANAGE_SETTINGS')) {
    navItems.push({ path: '/settings', label: t('settingsNav'), icon: Settings });
  }



  const isActive = (path?: string, subItems?: { path: string }[]) => {
    if (path && location.pathname === path) return true;
    if (subItems && subItems.some((item) => location.pathname === item.path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-outfit text-gray-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle (Universal) */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
            aria-label="Toggle Sidebar"
          >
            <Menu className="md:hidden w-6 h-6" />
            {isCollapsed ? (
              <PanelLeft className="hidden md:block w-6 h-6" />
            ) : (
              <PanelLeftClose className="hidden md:block w-6 h-6" />
            )}
          </button>

          {/* Top Navbar Logo & App Name */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Company Logo"
              className="w-12  object-contain bg-red-500 rounded-full border border-red-100 shadow-sm"
            />
             <span className="font-extrabold text-sm text-gray-900 tracking-tight">
                Sanadk
              </span>
           
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2.5 rounded-xl border border-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-1.5 text-sm font-medium"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* User Profile Info & Role Badge */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex flex-col text-end">
              <span className="text-xs font-bold text-gray-950">{user?.name}</span>
              <span className="text-[9px] text-gray-400 font-mono">{user?.email}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-red-100 text-red-600 bg-red-50/50 text-xs font-black select-none">
              <span>{activeRole}</span>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl border border-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 rtl:left-1.5 rtl:right-auto w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-1">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{t('notifications')}</span>
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          dispatch(markNotificationRead(n.id));
                        }}
                        className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors ${
                          !n.read ? 'bg-red-50/20 hover:bg-red-50/40 border-s-4 border-red-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-bold text-xs text-gray-900">{n.title}</span>
                          <span className="text-[10px] text-gray-400">{new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-xs text-gray-400">
                        لا توجد إشعارات جديدة
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl border border-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 start-0 z-30 bg-white border-e border-gray-100 pt-16 md:pt-2 transform transition-all duration-300 ease-in-out md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full md:rtl:translate-x-0'
          } ${isCollapsed ? 'w-64 md:w-20' : 'w-64 md:w-[280px]'}`}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 end-4 p-2 rounded-xl text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          <nav className={`space-y-1 h-full overflow-y-auto pb-20 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            {navItems.map((item, idx) => {
              const Icon = item.icon!;
              const isParentActive = item.subItems 
                ? item.subItems.some(sub => isActive(sub.path))
                : isActive(item.path);

              if (item.subItems) {
                // Has sub-items
                return (
                  <div key={idx} className="relative group">
                    {/* Desktop/Tablet view */}
                    <div className="hidden md:block">
                      {isCollapsed ? (
                        <div
                          className={`flex items-center justify-center p-3 text-sm font-semibold rounded-xl transition-all duration-200 relative ${
                            isParentActive
                              ? 'bg-red-600 text-white shadow-sm shadow-red-100 font-bold'
                              : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          <Link
                            to={item.subItems[0].path}
                            className="flex items-center justify-center w-full h-full text-current focus:outline-none"
                            title={item.label}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                          </Link>
                          
                          {/* Dropdown Tooltip on hover */}
                          <div className="absolute start-[72px] top-0 z-50 hidden group-hover:flex flex-col bg-white border border-gray-100 shadow-xl rounded-2xl p-2 w-48 text-start text-gray-800">
                            <div className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                              {item.label}
                            </div>
                            {item.subItems.map((sub, subIdx) => {
                              const active = isActive(sub.path);
                              return (
                                <Link
                                  key={subIdx}
                                  to={sub.path}
                                  className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                                    active
                                      ? 'bg-red-600 text-white shadow-sm'
                                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl text-gray-400 uppercase tracking-wider mt-4 first:mt-0">
                            <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          <div className="ps-4 space-y-1">
                            {item.subItems.map((sub, subIdx) => {
                              const active = isActive(sub.path);
                              return (
                                <Link
                                  key={subIdx}
                                  to={sub.path}
                                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    active
                                      ? 'bg-red-600 text-white shadow-sm shadow-red-100 font-bold'
                                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                                  }`}
                                >
                                  <span>{sub.label}</span>
                                  {active && <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile View (always expanded) */}
                    <div className="md:hidden space-y-1">
                      <div className="flex items-center gap-3 px-3.5 py-3 text-sm font-semibold rounded-xl text-gray-400 uppercase tracking-wider mt-4 first:mt-0">
                        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <div className="ps-4 space-y-1">
                        {item.subItems.map((sub, subIdx) => {
                          const active = isActive(sub.path);
                          return (
                            <Link
                              key={subIdx}
                              to={sub.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                active
                                  ? 'bg-red-600 text-white shadow-sm shadow-red-100 font-bold'
                                  : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                              <span>{sub.label}</span>
                              {active && <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Without sub-items
              return (
                <div key={idx} className="relative group">
                  {/* Desktop/Tablet view */}
                  <div className="hidden md:block">
                    {isCollapsed ? (
                      <Link
                        to={item.path!}
                        className={`flex items-center justify-center p-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          isParentActive
                            ? 'bg-red-600 text-white shadow-sm shadow-red-100 font-bold'
                            : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <div className="absolute start-[72px] top-1/2 -translate-y-1/2 z-50 hidden group-hover:block bg-gray-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-md">
                          {item.label}
                        </div>
                      </Link>
                    ) : (
                      <Link
                        to={item.path!}
                        className={`flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          isParentActive
                            ? 'bg-red-600 text-white shadow-sm shadow-red-100 font-bold'
                            : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {isParentActive && <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
                      </Link>
                    )}
                  </div>

                  {/* Mobile view (always expanded) */}
                  <Link
                    to={item.path!}
                    onClick={() => setSidebarOpen(false)}
                    className={`md:hidden flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isParentActive
                        ? 'bg-red-600 text-white shadow-sm shadow-red-100 font-bold'
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {isParentActive && <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
                  </Link>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 md:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
