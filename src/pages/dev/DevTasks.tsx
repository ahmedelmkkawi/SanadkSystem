import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevModuleStore, type DevTask } from '../../store/devModuleStore';
import { useDevTranslation } from './hooks/useDevTranslation';
import { 
  Plus, CheckSquare, Clock, AlertCircle, X, ArrowRightLeft,
  ShieldAlert
} from 'lucide-react';

export const DevTasks: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tasks, projects, developers, addTask, updateTaskStatus, transferTask, currentRole 
  } = useDevModuleStore();

  const { t, lang } = useDevTranslation();

  const [viewType, setViewType] = useState<'kanban' | 'list'>('kanban');

  // Modal controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Active target tasks for modals
  const [selectedTask, setSelectedTask] = useState<DevTask | null>(null);

  // New task form state
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProject, setNewTaskProject] = useState(projects[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState<DevTask['priority']>('Medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-07-15');
  const [newTaskHours, setNewTaskHours] = useState(20);

  // Transfer form state
  const [transferNewAssignee, setTransferNewAssignee] = useState('');
  const [transferReason, setTransferReason] = useState('High Workload');

  // Block reason state
  const [blockedReason, setBlockedReason] = useState<DevTask['blockedReason']>('Waiting For API');
  const [blockedDetails, setBlockedDetails] = useState('');

  // Kanban Columns
  const columns: { id: DevTask['status']; label: string; bg: string }[] = [
    { id: 'To Do', label: t('To Do (قيد الانتظار)'), bg: 'bg-slate-100 border-slate-200' },
    { id: 'In Progress', label: t('In Progress (قيد التنفيذ)'), bg: 'bg-blue-50/50 border-blue-100' },
    { id: 'Blocked', label: t('Blocked (معطل)'), bg: 'bg-red-50/50 border-red-100' },
    { id: 'Code Review', label: t('Code Review (مراجعة الكود)'), bg: 'bg-yellow-50/50 border-yellow-100' },
    { id: 'Testing', label: t('Testing (مرحلة الاختبار)'), bg: 'bg-purple-50/50 border-purple-100' },
    { id: 'Done', label: t('Done (مكتمل)'), bg: 'bg-green-50/50 border-green-100' }
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName) return;

    // Availability validation before assignment
    const dev = developers.find(d => d.name === newTaskAssignee);
    if (dev && dev.availability !== 'Available') {
      const confirmAssign = window.confirm(
        lang === 'en'
          ? `Warning: Developer ${newTaskAssignee} is not currently available (status: ${dev.availability === 'On Leave' ? 'On Leave' : 'Busy'}). Do you want to proceed?`
          : `تنبيه: المطور ${newTaskAssignee} غير متاح حالياً (الحالة: ${dev.availability === 'On Leave' ? 'في إجازة' : 'مشغول'}). هل تريد الاستمرار في التعيين؟`
      );
      if (!confirmAssign) return;
    }

    addTask({
      projectId: newTaskProject,
      sprintId: '',
      name: newTaskName,
      description: newTaskDesc,
      priority: newTaskPriority,
      status: 'To Do',
      assigneeName: newTaskAssignee || (lang === 'en' ? 'Unassigned' : 'غير معين'),
      deadline: newTaskDeadline,
      estimatedHours: Number(newTaskHours)
    });

    setIsCreateModalOpen(false);
    setNewTaskName('');
    setNewTaskDesc('');
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask && transferNewAssignee) {
      // Availability warning
      const dev = developers.find(d => d.name === transferNewAssignee);
      if (dev && dev.availability !== 'Available') {
        const confirmAssign = window.confirm(
          lang === 'en'
            ? `Warning: Developer ${transferNewAssignee} is not currently available (status: ${dev.availability === 'On Leave' ? 'On Leave' : 'Busy'}). Do you want to proceed?`
            : `تنبيه: المطور ${transferNewAssignee} غير متاح حالياً (الحالة: ${dev.availability === 'On Leave' ? 'في إجازة' : 'مشغول'}). هل تريد الاستمرار في التعيين؟`
        );
        if (!confirmAssign) return;
      }

      transferTask(selectedTask.id, transferNewAssignee, transferReason);
      setIsTransferModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask && blockedReason) {
      updateTaskStatus(selectedTask.id, 'Blocked', blockedReason, blockedDetails);
      setIsBlockModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleStatusChangeClick = (task: DevTask, newStatus: DevTask['status']) => {
    // Restricted approval workflow validation
    if (newStatus === 'Done' && currentRole === 'Developer') {
      alert(
        lang === 'en'
          ? 'Error: Developers cannot close tasks or move them to Done directly. Please move to Code Review and request manager approval.'
          : 'خطأ: المطور لا يمكنه إغلاق المهام أو نقلها إلى مكتملة مباشرة. يرجى نقلها إلى Code Review ومطالبة مدير الفريق باعتمادها.'
      );
      return;
    }

    if (newStatus === 'Blocked') {
      setSelectedTask(task);
      setIsBlockModalOpen(true);
    } else {
      updateTaskStatus(task.id, newStatus);
    }
  };

  // Render priority color tag
  const getPrioColor = (prio: string) => {
    switch (prio) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Check role actions
  const canAssign = currentRole === 'CEO' || currentRole === 'Tech Lead' || currentRole === 'Team Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950">{t('إدارة المهام البرمجية')}</h1>
          <p className="text-xs text-gray-400">{t('تابع تقدم المهام وسبرنتات العمل عبر لوحة كانبان التفاعلية')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View switcher */}
          <div className="bg-white border border-gray-100 p-1 rounded-xl flex gap-1 shadow-sm">
            <button
              onClick={() => setViewType('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewType === 'kanban' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t('لوحة كانبان')}
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewType === 'list' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t('جدول المهام')}
            </button>
          </div>

          {canAssign && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg transition-all text-xs"
            >
              <Plus className="w-4 h-4" />
              {t('إسناد مهمة جديدة')}
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewType === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
          {columns.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className={`p-4 rounded-2xl border min-w-[250px] w-72 shrink-0 space-y-3 ${col.bg}`}>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-[10px] font-black text-gray-900">{col.label}</span>
                  <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded-full text-[10px] font-black font-mono">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {columnTasks.map(task => {
                    const dev = developers.find(d => d.name === task.assigneeName);
                    return (
                      <div key={task.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-2.5 relative group hover:border-red-100 transition-all">
                        {/* Title & priority */}
                        <div className="flex justify-between items-start gap-1">
                          <span
                            onClick={() => navigate(`/dev/tasks/${task.id}`)}
                            className="text-xs font-bold text-gray-950 hover:underline cursor-pointer line-clamp-2"
                          >
                            {task.name}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black shrink-0 ${getPrioColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Deadlines & Hours */}
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-red-500" />
                            {task.deadline}
                          </span>
                          <span>{t('التقدير:')} {task.estimatedHours}{t('س')}</span>
                        </div>

                        {/* Assignee and Actions */}
                        <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-[9px] font-black">
                              {task.assigneeName.substring(0, 2)}
                            </div>
                            <div>
                              <span className="text-[9px] font-extrabold text-gray-800 block">{task.assigneeName}</span>
                              {dev && (
                                <span className={`px-1 py-0.5 rounded text-[8px] font-black ${
                                  dev.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {dev.availability === 'On Leave' ? t('في إجازة') : dev.availability === 'Busy' ? t('مشغول') : t('متاح')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick status change buttons */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'Done' && (
                              <select
                                onChange={(e) => handleStatusChangeClick(task, e.target.value as any)}
                                value={task.status}
                                className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9px] font-bold focus:outline-none"
                              >
                                <option disabled value="">{t('الحالة')}</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Code Review">Review</option>
                                <option value="Testing">Testing</option>
                                <option value="Done">Done</option>
                              </select>
                            )}

                            {canAssign && (
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setTransferNewAssignee('');
                                  setIsTransferModalOpen(true);
                                }}
                                className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                title={t('نقل وإعادة تعيين المهمة')}
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Blocked details overlay inside card */}
                        {task.status === 'Blocked' && (
                          <div className="mt-2 p-1.5 bg-red-50 border border-red-100 text-red-700 rounded text-[9px] flex items-start gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{t('عطل:')} {task.blockedDetails}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {columnTasks.length === 0 && (
                    <div className="py-8 text-center text-[10px] text-gray-400 bg-white/20 border border-dashed border-gray-200 rounded-2xl">
                      {t('لا توجد مهام حالياً.')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List/Table View
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold">
                <th className="p-4 text-start">{t('اسم المهمة')}</th>
                <th className="p-4 text-start">{t('الأولوية')}</th>
                <th className="p-4 text-start">{t('الحالة')}</th>
                <th className="p-4 text-start">{t('المسؤول')}</th>
                <th className="p-4 text-start">{t('تاريخ التسليم')}</th>
                <th className="p-4 text-start">{t('التقدير (ساعة)')}</th>
                <th className="p-4 text-center">{t('الإجراءات')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50/30">
                  <td className="p-4">
                    <span onClick={() => navigate(`/dev/tasks/${task.id}`)} className="font-extrabold text-gray-900 hover:underline cursor-pointer">
                      {task.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${getPrioColor(task.priority)}`}>
                      {t(task.priority.toLowerCase())}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                      {t(task.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-700">{task.assigneeName}</td>
                  <td className="p-4 text-gray-400 font-mono">{task.deadline}</td>
                  <td className="p-4 text-gray-500 font-mono font-bold">{task.estimatedHours}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => navigate(`/dev/tasks/${task.id}`)}
                      className="px-2.5 py-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg text-[10px] font-bold"
                    >
                      {t('عرض التفاصيل')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-red-600" />
                {t('إسناد مهمة برمجية جديدة')}
              </span>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('اسم المهمة')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('مثال: برمجة شاشة التحقق بخطوتين')}
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('المشروع البرمجي المرتبط')}</label>
                <select
                  required
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                >
                  <option value="">{t('اختر المشروع')}</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('تفاصيل ووصف المهمة')}</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder={t('وصف المطلوب للبرمجة والملاحظات الفنية...')}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('المطور المسؤول')}</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="">{t('اختر المطور')}</option>
                    {developers.map(dev => (
                      <option key={dev.id} value={dev.name}>
                        {dev.name} ({dev.availability === 'On Leave' ? t('في إجازة') : dev.availability === 'Busy' ? t('مشغول') : t('متاح')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('الأولوية')}</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('ساعات العمل المقدرة (Est Hours)')}</label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('تاريخ التسليم النهائي')}</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  {t('إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  {t('إسناد وتكليف')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Task Modal */}
      {isTransferModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                {t('نقل وإعادة تعيين المهمة')}
              </span>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('المهمة المراد نقلها')}</label>
                <input
                  type="text"
                  disabled
                  value={selectedTask.name}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-100 text-gray-500 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('المطور الجديد')}</label>
                <select
                  required
                  value={transferNewAssignee}
                  onChange={(e) => setTransferNewAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
                >
                  <option value="">{t('اختر المطور الجديد')}</option>
                  {developers.map(dev => (
                    <option key={dev.id} value={dev.name}>
                      {dev.name} ({dev.availability === 'On Leave' ? t('في إجازة') : dev.availability === 'Busy' ? t('مشغول') : t('متاح')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('سبب التحويل')}</label>
                <select
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
                >
                  <option value="High Workload">{t('ضغط عمل مرتفع (High Workload)')}</option>
                  <option value="Developer Leave">{t('إجازة سنوية / مرضية للمطور')}</option>
                  <option value="Skill Requirement">{t('تطلب مهارات فنية محددة')}</option>
                  <option value="Priority Change">{t('تغير في أولويات الإدارة')}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  {t('إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  {t('إتمام التحويل')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Task Modal */}
      {isBlockModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {t('تعطيل المهمة البرمجية (Block Task)')}
              </span>
              <button onClick={() => setIsBlockModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBlockSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('سبب التعطيل الرئيسي')}</label>
                <select
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
                >
                  <option value="Waiting For Design">{t('في انتظار تصاميم UI/UX')}</option>
                  <option value="Waiting For API">{t('في انتظار واجهة برمجة التطبيقات (API)')}</option>
                  <option value="Waiting For Approval">{t('في انتظار اعتماد الإدارة المالية/العامة')}</option>
                  <option value="Waiting For Requirements">{t('توضيح متطلبات العميل')}</option>
                  <option value="External Dependency">{t('اعتماد على جهة خارجية (External)')}</option>
                  <option value="Other">{t('أسباب فنية أخرى')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('وصف تفصيلي للتعطيل')}</label>
                <textarea
                  required
                  placeholder={t('اكتب بالتفصيل المشكلة لحل التعطيل...')}
                  value={blockedDetails}
                  onChange={(e) => setBlockedDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none h-20"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  {t('إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  {t('تأكيد التعطيل')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTasks;
