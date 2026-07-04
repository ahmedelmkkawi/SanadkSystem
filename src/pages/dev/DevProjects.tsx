import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevModuleStore, type DevProject } from '../../store/devModuleStore';
import { useAppStore } from '../../store/useAppStore'; // import main store to access clients/leads
import { useDevTranslation } from './hooks/useDevTranslation';
import { 
  FolderPlus, Filter, Search, Eye, UserPlus, X, AlertCircle, HeartPulse
} from 'lucide-react';

export const DevProjects: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useDevTranslation();
  const { 
    projects, addProject, updateProject, currentRole 
  } = useDevModuleStore();

  // Read leads from the main store to integrate with existing customers
  const { leads } = useAppStore();
  const existingClients = leads.map(l => l.company || l.name);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');

  // Create Project Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjManager, setNewProjManager] = useState('طارق حامد');
  const [newProjPriority, setNewProjPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newProjTemplate, setNewProjTemplate] = useState<'Website' | 'E-Commerce' | 'CRM' | 'ERP' | 'Mobile Application' | 'Landing Page'>('Website');
  const [newProjBudget, setNewProjBudget] = useState(30000);
  const [newProjStartDate, setNewProjStartDate] = useState('2026-06-21');
  const [newProjDeadline, setNewProjDeadline] = useState('2026-09-30');

  // Assign Manager Modal State
  const [assigningProject, setAssigningProject] = useState<DevProject | null>(null);
  const [assignedManager, setAssignedManager] = useState('طارق حامد');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjClient) {
      alert('الرجاء إدخال اسم المشروع والعميل');
      return;
    }

    addProject({
      name: newProjName,
      clientName: newProjClient,
      teamManagerId: newProjManager === 'طارق حامد' ? 'mgr-1' : 'mgr-2',
      teamManagerName: newProjManager,
      priority: newProjPriority,
      budget: Number(newProjBudget),
      startDate: newProjStartDate,
      deadline: newProjDeadline,
      health: 'Healthy',
      template: newProjTemplate,
      assignedDevelopers: newProjManager === 'طارق حامد' ? ['زياد عمرو', 'خالد منصور'] : ['يوسف شريف', 'سمر صلاح']
    });

    setIsModalOpen(false);
    // Clear fields
    setNewProjName('');
    setNewProjClient('');
  };

  const handleAssignManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningProject) {
      updateProject({
        ...assigningProject,
        teamManagerName: assignedManager,
        teamManagerId: assignedManager === 'طارق حامد' ? 'mgr-1' : 'mgr-2'
      });
      setAssigningProject(null);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesPriority = priorityFilter ? p.priority === priorityFilter : true;
    const matchesManager = managerFilter ? p.teamManagerName === managerFilter : true;
    const matchesClient = clientFilter ? p.clientName === clientFilter : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesManager && matchesClient;
  });

  const getPriorityBadge = (prio: string) => {
    const classes = {
      Low: 'bg-gray-100 text-gray-700',
      Medium: 'bg-blue-100 text-blue-800',
      High: 'bg-yellow-100 text-yellow-800',
      Critical: 'bg-red-100 text-red-800 font-extrabold animate-pulse'
    };
    return classes[prio as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      'To Do': 'bg-gray-100 text-gray-600',
      'In Progress': 'bg-blue-500 text-white',
      'Blocked': 'bg-red-600 text-white',
      'Code Review': 'bg-yellow-400 text-gray-900',
      'Testing': 'bg-purple-500 text-white',
      'Done': 'bg-green-500 text-white'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  const getHealthBadge = (health: string) => {
    const classes = {
      Healthy: 'bg-green-50 border-green-200 text-green-700',
      'At Risk': 'bg-yellow-50 border-yellow-200 text-yellow-700',
      Critical: 'bg-red-50 border-red-200 text-red-700 font-black animate-pulse'
    };
    return classes[health as keyof typeof classes] || 'bg-gray-50 text-gray-700';
  };

  // Check permissions: only CEO and Tech Lead can create/assign
  const canModifyProjects = currentRole === 'CEO' || currentRole === 'Tech Lead';

  return (
    <div className="space-y-6">
      {/* Header and Quick Add */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950">{t('projectsTitle')}</h1>
          <p className="text-xs text-gray-400">{t('projectsDesc')}</p>
        </div>
        {canModifyProjects && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg transition-all duration-200 text-xs"
          >
            <FolderPlus className="w-4 h-4" />
            {t('newProjectBtn')}
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm border-b border-gray-50 pb-2">
          <Filter className="w-4 h-4 text-red-600" />
          {t('advancedFilters')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute start-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ps-9 pe-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
            />
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
          >
            <option value="">{t('allStatuses')}</option>
            <option value="To Do">{t('todo')}</option>
            <option value="In Progress">{t('inProgress')}</option>
            <option value="Blocked">{t('blocked')}</option>
            <option value="Testing">{t('testing')}</option>
            <option value="Done">{t('done')}</option>
          </select>

          {/* Priority selector */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
          >
            <option value="">{t('allPriorities')}</option>
            <option value="Low">{t('low')}</option>
            <option value="Medium">{t('medium')}</option>
            <option value="High">{t('high')}</option>
            <option value="Critical">{t('critical')}</option>
          </select>

          {/* Manager selector */}
          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
          >
            <option value="">{t('allManagers')}</option>
            <option value="طارق حامد">{t('طارق حامد')}</option>
            <option value="رنا سليم">{t('رنا سليم')}</option>
          </select>

          {/* Client selector (CRM integration) */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
          >
            <option value="">{t('allClients')}</option>
            {existingClients.map((client, idx) => (
              <option key={idx} value={client}>{t(client)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-extrabold">
                <th className="p-4 text-start">{t('projectTemplate')}</th>
                <th className="p-4 text-start">{t('client')}</th>
                <th className="p-4 text-start">{t('manager')}</th>
                <th className="p-4 text-start">{t('priority')}</th>
                <th className="p-4 text-start">{t('health')}</th>
                <th className="p-4 text-start">{t('status')}</th>
                <th className="p-4 text-start">{t('progress')}</th>
                <th className="p-4 text-start">{t('deadline')}</th>
                <th className="p-4 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <span className="font-extrabold text-gray-900 block">{t(proj.name)}</span>
                      <span className="text-[10px] text-red-600 font-mono mt-0.5">{proj.template} Template</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-700">{t(proj.clientName)}</td>
                  <td className="p-4 font-semibold text-gray-600">{t(proj.teamManagerName)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${getPriorityBadge(proj.priority)}`}>
                      {t(proj.priority.toLowerCase())}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border flex items-center gap-1 w-fit ${getHealthBadge(proj.health)}`}>
                      <HeartPulse className="w-3.5 h-3.5" />
                      {proj.health === 'Healthy' ? t('healthy') : proj.health === 'At Risk' ? t('atRisk') : t('critical')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(proj.status)}`}>
                      {t(proj.status === 'Done' ? 'done' : proj.status === 'In Progress' ? 'inProgress' : proj.status === 'Blocked' ? 'blocked' : proj.status === 'Testing' ? 'testing' : proj.status === 'Code Review' ? 'codeReview' : 'todo')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-gray-500">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 font-mono font-semibold">{proj.deadline}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dev/projects/${proj.id}`)}
                        className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-all"
                        title={t('viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canModifyProjects && (
                        <>
                          <button
                            onClick={() => {
                              setAssigningProject(proj);
                              setAssignedManager(proj.teamManagerName);
                            }}
                            className="p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-all"
                            title={t('assignManager')}
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    {t('noProjectsFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-red-600" />
                إنشاء مشروع جديد بالنموذج التلقائي
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم المشروع</label>
                  <input
                    type="text"
                    required
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="مثال: منصة التجارة الإلكترونية للمبيعات"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">العميل (من قائمة علاقات العملاء)</label>
                  <select
                    required
                    value={newProjClient}
                    onChange={(e) => setNewProjClient(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="">اختر العميل</option>
                    {existingClients.map((client, idx) => (
                      <option key={idx} value={client}>{client}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نموذج وهيكل المشروع</label>
                  <select
                    value={newProjTemplate}
                    onChange={(e) => setNewProjTemplate(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="Website">Website Project</option>
                    <option value="E-Commerce">E-Commerce Project</option>
                    <option value="CRM">CRM Project</option>
                    <option value="ERP">ERP Project</option>
                    <option value="Mobile Application">Mobile Application</option>
                    <option value="Landing Page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">مدير الفريق المسؤول</label>
                  <select
                    value={newProjManager}
                    onChange={(e) => setNewProjManager(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="طارق حامد">طارق حامد (Backend/Design)</option>
                    <option value="رنا سليم">رنا سليم (FullStack/QA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الأولوية</label>
                  <select
                    value={newProjPriority}
                    onChange={(e) => setNewProjPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الميزانية ($)</label>
                  <input
                    type="number"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ البدء</label>
                  <input
                    type="date"
                    value={newProjStartDate}
                    onChange={(e) => setNewProjStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ التسليم المتوقع</label>
                  <input
                    type="date"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[10px] leading-relaxed">
                  سيقوم النظام تلقائياً بإنشاء مراحل العمل المنهجية (Stages) والمهام الافتراضية المناسبة لنوع القالب المختار، لتسهيل العمل فوراً.
                </span>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  حفظ وإنشاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Manager Modal */}
      {assigningProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900">إعادة تعيين مدير الفريق</span>
              <button onClick={() => setAssigningProject(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignManagerSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم المشروع</label>
                <input
                  type="text"
                  disabled
                  value={assigningProject.name}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-100 text-gray-500 rounded-xl text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اختر مدير الفريق الجديد</label>
                <select
                  value={assignedManager}
                  onChange={(e) => setAssignedManager(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                >
                  <option value="طارق حامد">طارق حامد</option>
                  <option value="رنا سليم">رنا سليم</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setAssigningProject(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  حفظ وتأكيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevProjects;
