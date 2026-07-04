import React, { useState } from 'react';
import { useDevModuleStore } from '../../store/devModuleStore';
import { useDevTranslation } from './hooks/useDevTranslation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  BarChart3, AlertTriangle
} from 'lucide-react';

export const DevReports: React.FC = () => {
  const { t } = useDevTranslation();
  const { projects, tasks, developers, teams } = useDevModuleStore();
  const [reportType, setReportType] = useState<'project' | 'team' | 'productivity' | 'delayed'>('project');

  // Project Report Data
  const projectReportData = projects.map(p => ({
    name: p.name.split(' - ')[0],
    'Progress %': p.progress,
    'Budget ($)': p.budget
  }));

  // Team Workload
  const teamReportData = teams.map(t => {
    const activeTasks = tasks.filter(task => t.developers.includes(task.assigneeName) && task.status !== 'Done');
    const completedTasks = tasks.filter(task => t.developers.includes(task.assigneeName) && task.status === 'Done');
    return {
      name: t.name.split(' - ')[0],
      'Active Tasks': activeTasks.length,
      'Completed Tasks': completedTasks.length
    };
  });

  // Developer Productivity (Estimated vs Actual hours)
  const developerData = developers.map(dev => ({
    name: dev.name,
    'Estimated Hours': dev.estimatedHours,
    'Actual Hours': dev.actualHours
  }));

  // Delayed Projects Report
  const delayedProjects = projects.filter(p => p.status === 'Blocked' || p.health === 'Critical');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 flex items-center gap-2">
          <BarChart3 className="text-red-600 w-7 h-7" />
          {t('مركز التقارير الفنية (Technical Reports)')}
        </h1>
        <p className="text-xs text-gray-400">{t('تقارير تحليلية متقدمة لأداء المطورين، المشروعات، ومعدلات التسليم')}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-2 bg-white p-1 rounded-xl shadow-sm overflow-x-auto">
        <button
          onClick={() => setReportType('project')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'project' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t('تقارير المشاريع')}
        </button>
        <button
          onClick={() => setReportType('team')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'team' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t('أداء الفرق')}
        </button>
        <button
          onClick={() => setReportType('productivity')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'productivity' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t('إنتاجية المطورين')}
        </button>
        <button
          onClick={() => setReportType('delayed')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'delayed' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {t('المشاريع المتأخرة')}
        </button>
      </div>

      {/* Report View Box */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {reportType === 'project' && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-sm text-gray-950">{t('تقرير تقدم المشاريع مقابل الميزانية')}</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectReportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" unit="%" />
                  <YAxis yAxisId="right" orientation="right" unit="$" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Progress %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="Budget ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'team' && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-sm text-gray-950">{t('تقرير أداء فرق العمل (النشطة مقابل المنجزة)')}</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamReportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Active Tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed Tasks" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'productivity' && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-sm text-gray-950">{t('تقرير إنتاجية المطورين (تقديري مقابل فعلي)')}</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={developerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Estimated Hours" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Actual Hours" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'delayed' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {t('المشروعات المتأخرة أو المعطلة حالياً')}
            </h3>
            <div className="space-y-2">
              {delayedProjects.map(proj => (
                <div key={proj.id} className="p-4 border border-red-100 bg-red-50/20 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-gray-900 block">{proj.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t('العميل:')} {proj.clientName} | {t('المدير:')} {proj.teamManagerName}</span>
                  </div>
                  <div className="text-end">
                    <span className="px-2.5 py-1 text-[9px] bg-red-600 text-white font-black rounded-lg inline-block">
                      {proj.status}
                    </span>
                    <span className="block mt-1 font-mono font-bold text-gray-500">{t('التقدم:')} {proj.progress}%</span>
                  </div>
                </div>
              ))}
              {delayedProjects.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">{t('لا توجد أي مشروعات متأخرة حالياً. عمل مذهل!')}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevReports;
