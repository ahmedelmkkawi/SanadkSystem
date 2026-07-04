import React from 'react';
import { useDevModuleStore } from '../../store/devModuleStore';
import { useDevTranslation } from './hooks/useDevTranslation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Briefcase, CheckCircle, Clock, AlertTriangle, Play, RefreshCw,
  Users, UserCheck, ShieldAlert, ArrowRightLeft, Activity
} from 'lucide-react';

export const DevDashboard: React.FC = () => {
  const { 
    projects, tasks, teams, developers,
    currentRole 
  } = useDevModuleStore();

  const { t } = useDevTranslation();

  // Colors
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const HEALTH_COLORS = {
    Healthy: '#10B981',
    'At Risk': '#F59E0B',
    Critical: '#EF4444'
  };

  // Math stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const delayedProjects = projects.filter(p => p.status === 'Blocked' || p.health === 'Critical').length;
  const completedProjects = projects.filter(p => p.status === 'Done').length;
  const testingProjects = projects.filter(p => p.stages.some(s => s.name === 'Testing' && s.status === 'In Progress')).length;
  const maintenanceProjects = projects.filter(p => p.stages.some(s => s.name === 'Maintenance' && s.status === 'In Progress')).length;

  // Chart Data: Project Status Distribution
  const statusData = [
    { name: 'To Do', value: projects.filter(p => p.status === 'To Do').length },
    { name: 'In Progress', value: activeProjects },
    { name: 'Blocked', value: projects.filter(p => p.status === 'Blocked').length },
    { name: 'Testing/Review', value: projects.filter(p => p.status === 'Testing' || p.status === 'Code Review').length },
    { name: 'Completed', value: completedProjects }
  ].filter(d => d.value > 0);

  // Chart Data: Team Workload (Developers vs Estimated Hours)
  const teamPerformanceData = teams.map(team => {
    const teamDevs = developers.filter(d => team.developers.includes(d.name));
    const totalEst = teamDevs.reduce((acc, curr) => acc + curr.estimatedHours, 0);
    const totalAct = teamDevs.reduce((acc, curr) => acc + curr.actualHours, 0);
    return {
      name: team.name.split(' - ')[0],
      'Estimated Hours': totalEst,
      'Actual Hours': totalAct
    };
  });

  // Chart Data: Resource Utilization
  const resourceData = developers.map(dev => {
    const activeTasksCount = tasks.filter(t => t.assigneeName === dev.name && t.status !== 'Done').length;
    const utilization = dev.availability === 'On Leave' ? 0 : Math.min(100, Math.round((dev.estimatedHours / 160) * 100));
    return {
      name: dev.name,
      'Utilization %': utilization,
      'Active Tasks': activeTasksCount
    };
  });

  // Project Health Distribution
  const healthData = [
    { name: 'Healthy', value: projects.filter(p => p.health === 'Healthy').length },
    { name: 'At Risk', value: projects.filter(p => p.health === 'At Risk').length },
    { name: 'Critical', value: projects.filter(p => p.health === 'Critical').length }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Activity className="text-red-600 w-7 h-7" />
            {currentRole === 'CEO' ? t('ceoDashboard') : t('devDashboard')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentRole === 'CEO' 
              ? t('ceoSubtitle') 
              : t('devSubtitle')}
          </p>
        </div>
        <div className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm">
          {t('الدور النشط الحالي:')} <span className="text-red-600 font-bold font-mono">{t(currentRole)}</span>
        </div>
      </div>

      {/* CEO Executive View vs Tech Lead View */}
      {currentRole === 'CEO' ? (
        // ==========================================
        // CEO EXECUTIVE VIEW
        // ==========================================
        <div className="space-y-6">
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">{t('completedProjects')}</span>
                <span className="text-2xl font-black text-gray-900">{completedProjects}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">{t('inProgressProjects')}</span>
                <span className="text-2xl font-black text-gray-900">{activeProjects}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">{t('atRiskProjects')}</span>
                <span className="text-2xl font-black text-gray-900">{projects.filter(p => p.health === 'At Risk').length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">{t('criticalProjects')}</span>
                <span className="text-2xl font-black text-gray-900">{projects.filter(p => p.health === 'Critical').length}</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Health Distribution Pie */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-sm text-gray-900 mb-4">{t('توزيع سلامة المشاريع البرمجية')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={HEALTH_COLORS[entry.name as keyof typeof HEALTH_COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resource Utilization Bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-sm text-gray-900 mb-4">{t('نسب استغلال المطورين والقدرة الاستيعابية')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Bar dataKey="Utilization %" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                      {resourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry['Utilization %'] > 90 ? '#EF4444' : '#8B5CF6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom CEO Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overloaded Teams widget */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm col-span-1">
              <h3 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Users className="text-red-500 w-4 h-4" />
                {t('فرق عمل تجاوزت 90% استغلال')}
              </h3>
              <div className="space-y-3">
                {developers.filter(d => d.estimatedHours > 140).map(dev => (
                  <div key={dev.id} className="flex justify-between items-center p-3 bg-red-50/50 border border-red-100 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{dev.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{t('المهام:')} {tasks.filter(t => t.assigneeName === dev.name && t.status !== 'Done').length} {t('مهمة')}</span>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-black bg-red-600 text-white rounded-lg">
                      {Math.round((dev.estimatedHours / 160) * 100)}% {t('حمولة')}
                    </span>
                  </div>
                ))}
                {developers.filter(d => d.estimatedHours > 140).length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400">{t('لا توجد فرق عمل محملة فوق طاقتها حالياً.')}</div>
                )}
              </div>
            </div>

            {/* Critical Projects widget */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm col-span-2">
              <h3 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <ShieldAlert className="text-red-600 w-4 h-4" />
                {t('مشروعات حرجة تتطلب تدخل الإدارة')}
              </h3>
              <div className="space-y-3">
                {projects.filter(p => p.health === 'Critical' || p.health === 'At Risk').map(proj => (
                  <div key={proj.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 border border-gray-100 rounded-xl gap-2">
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">{proj.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t('العميل:')} {proj.clientName} | {t('المدير:')} {proj.teamManagerName}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 font-mono">{proj.progress}%</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        proj.health === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {proj.health === 'Critical' ? t('حرجة جداً') : t('في خطر')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // TECH LEAD & MANAGER VIEW
        // ==========================================
        <div className="space-y-6">
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 block font-semibold">{t('totalProjects')}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-black text-gray-900">{totalProjects}</span>
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 block font-semibold">{t('inProgress')}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-black text-blue-600">{activeProjects}</span>
                <Play className="w-5 h-5 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 block font-semibold">{t('delayedProjects')}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-black text-red-600">{delayedProjects}</span>
                <Clock className="w-5 h-5 text-red-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 block font-semibold">{t('completedProjects')}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-black text-green-600">{completedProjects}</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 block font-semibold">{t('inTesting')}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-black text-yellow-600">{testingProjects}</span>
                <RefreshCw className="w-5 h-5 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 block font-semibold">{t('inMaintenance')}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-black text-purple-600">{maintenanceProjects}</span>
                <UserCheck className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-sm text-gray-900 mb-4">{t('حالة المشاريع البرمجية')}</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm col-span-2">
              <h3 className="font-extrabold text-sm text-gray-900 mb-4">{t('ساعات العمل التقديرية مقابل الفعلية للفرق')}</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Estimated Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Actual Hours" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity Logs & Transfers row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blocked Tasks Widget */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-sm text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('المهمات المعطلة حالياً (Blocked)')}
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {tasks.filter(t => t.status === 'Blocked').map(task => (
                  <div key={task.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-900 line-clamp-1">{task.name}</span>
                      <span className="px-1.5 py-0.5 text-[8px] bg-red-100 text-red-700 font-extrabold rounded">
                        {task.blockedReason}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{task.blockedDetails}</p>
                    <div className="flex justify-between items-center mt-2 text-[9px] text-gray-400">
                      <span>{t('المسؤول:')} {task.assigneeName}</span>
                      <span>{t('تاريخ التسليم:')} {task.deadline}</span>
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === 'Blocked').length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400">{t('لا توجد أي مهمات معطلة!')}</div>
                )}
              </div>
            </div>

            {/* Recent Task Transfers */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                {t('آخر عمليات نقل وتدوير المهام')}
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {tasks.flatMap(t => t.transferHistory.map(tr => ({ ...tr, taskName: t.name }))).map((tr, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <span className="text-[10px] font-extrabold text-gray-800 block line-clamp-1">{tr.taskName}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-semibold">{tr.from}</span>
                      <span className="text-[9px] text-gray-400">←</span>
                      <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">{tr.to}</span>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1.5">{t('السبب:')} {tr.reason}</p>
                  </div>
                ))}
                {tasks.flatMap(t => t.transferHistory).length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400">{t('لم يتم نقل أي مهام مؤخراً.')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevDashboard;
