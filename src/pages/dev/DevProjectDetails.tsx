import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDevModuleStore } from '../../store/devModuleStore';
import { useAppSelector } from '../../store';
import { 
  ArrowLeft, Info, Calendar, DollarSign, Users, CheckSquare,
  RefreshCw, AlertOctagon, CheckCircle2, Play, AlertCircle, Trash,
  UserPlus, Save
} from 'lucide-react';

export const DevProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    projects, tasks, developers, bugs, changeRequests,
    addBug, addChangeRequest, updateProject, currentRole
  } = useDevModuleStore();

  const { user: loggedInUser } = useAppSelector((state) => state.auth);

  const project = projects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'team' | 'tasks' | 'cr' | 'bugs'>('overview');

  const [localDevs, setLocalDevs] = useState<string[]>([]);
  const [selectedDevToAdd, setSelectedDevToAdd] = useState('');

  useEffect(() => {
    if (project) {
      setLocalDevs(project.assignedDevelopers);
    }
  }, [project]);

  const cleanLoggedInName = (loggedInUser?.name || '').split(' (')[0].trim();
  const cleanProjectTechLead = (project?.techLeadName || '').split(' (')[0].trim();
  const isAssignedTechLead = cleanProjectTechLead && cleanProjectTechLead === cleanLoggedInName;
  
  const canManageTeam = 
    currentRole === 'CEO' || 
    currentRole === 'Team Manager' || 
    (currentRole === 'Tech Lead' && isAssignedTechLead);

  const isChanged = project ? JSON.stringify(localDevs) !== JSON.stringify(project.assignedDevelopers) : false;

  const handleAddMember = () => {
    if (selectedDevToAdd && !localDevs.includes(selectedDevToAdd)) {
      setLocalDevs([...localDevs, selectedDevToAdd]);
      setSelectedDevToAdd('');
    }
  };

  const handleRemoveMember = (nameToRemove: string) => {
    setLocalDevs(localDevs.filter(name => name !== nameToRemove));
  };

  const handleReplaceMember = (oldName: string, newName: string) => {
    if (newName) {
      setLocalDevs(localDevs.map(name => name === oldName ? newName : name));
    }
  };

  const handleCancelChanges = () => {
    if (project) {
      setLocalDevs(project.assignedDevelopers);
    }
  };

  const handleSaveChanges = () => {
    if (!project) return;
    if (!canManageTeam) {
      alert('خطأ في الصلاحيات: غير مصرح لك بتعديل أعضاء فريق هذا المشروع.');
      return;
    }
    updateProject({
      ...project,
      assignedDevelopers: localDevs
    });
    alert('تم حفظ تشكيل الفريق بنجاح!');
  };

  // Modal control states
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isCRModalOpen, setIsCRModalOpen] = useState(false);

  // New bug state
  const [bugTitle, setBugTitle] = useState('');
  const [bugSeverity, setBugSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [bugAssignee, setBugAssignee] = useState('');

  // New CR state
  const [crTitle, setCrTitle] = useState('');
  const [crDesc, setCrDesc] = useState('');
  const [crCost, setCrCost] = useState(5000);
  const [crTime, setCrTime] = useState('5 Days');

  if (!project) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-center space-y-3">
        <AlertOctagon className="w-8 h-8 mx-auto text-red-600" />
        <h3 className="font-extrabold text-sm">المشروع غير موجود!</h3>
        <button onClick={() => navigate('/dev/projects')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">
          العودة للمشاريع
        </button>
      </div>
    );
  }

  // Get tasks for this project
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  // Get bugs for this project
  const projectBugs = bugs.filter(b => b.projectId === project.id);
  // Get CRs for this project
  const projectCRs = changeRequests.filter(cr => cr.projectId === project.id);



  const handleAddBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle) return;
    addBug({
      title: bugTitle,
      severity: bugSeverity,
      status: 'Open',
      assignedTo: bugAssignee || 'غير معين',
      projectId: project.id,
      projectName: project.name
    });
    setBugTitle('');
    setIsBugModalOpen(false);
  };

  const handleAddCRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitle) return;
    addChangeRequest({
      projectId: project.id,
      projectName: project.name,
      requestTitle: crTitle,
      description: crDesc,
      costImpact: Number(crCost),
      timeImpact: crTime
    });
    setCrTitle('');
    setCrDesc('');
    setIsCRModalOpen(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'At Risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200 font-extrabold animate-pulse';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'In Progress': return <Play className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'Delayed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dev/projects')}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </button>
        <div>
          <span className="text-[10px] text-red-600 font-black tracking-widest uppercase">تفاصيل المشروع البرمجي</span>
          <h1 className="text-xl font-black text-gray-950 flex items-center gap-2">
            {project.name}
            <span className={`px-2 py-0.5 rounded-full text-[9px] border font-bold ${getHealthColor(project.health)}`}>
              {project.health === 'Healthy' ? 'سليم' : project.health === 'At Risk' ? 'في خطر' : 'حرج جداً'}
            </span>
          </h1>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-100 overflow-x-auto gap-2 bg-white p-1 rounded-xl shadow-sm">
        {(
          [
            { id: 'overview', label: 'نظرة عامة', icon: Info },
            { id: 'stages', label: 'مراحل المشروع', icon: RefreshCw },
            { id: 'team', label: 'أعضاء الفريق', icon: Users },
            { id: 'tasks', label: 'المهمات البرمجية', icon: CheckSquare },
            { id: 'cr', label: 'طلبات التعديل (CR)', icon: RefreshCw },
            { id: 'bugs', label: 'البلاغات والأخطاء (Bugs)', icon: AlertOctagon }
          ] as const
        ).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-2">
                <Info className="w-4 h-4 text-red-600" />
                معلومات المشروع الأساسية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">اسم العميل</span>
                  <span className="text-xs font-extrabold text-gray-800">{project.clientName}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">ميزانية المشروع البرمجي</span>
                  <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" />
                    {project.budget.toLocaleString()} USD
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">تاريخ البدء</span>
                  <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {project.startDate}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">تاريخ التسليم النهائي</span>
                  <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    {project.deadline}
                  </span>
                </div>
              </div>

              {/* Progress Panel */}
              <div className="p-4 border border-gray-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-700">نسبة تقدم المشروع الإجمالية</span>
                  <span className="text-red-600 font-mono">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-4 border-t md:border-t-0 md:border-s border-gray-100 pt-4 md:pt-0 md:ps-6">
              <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                هيكل ومسؤولي العمل
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50/30 border border-red-100 rounded-xl">
                  <span className="text-[9px] text-gray-400 block font-semibold">مدير الفريق (Team Manager)</span>
                  <span className="text-xs font-extrabold text-red-600">{project.teamManagerName}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[9px] text-gray-400 block font-semibold">المطورون المسند إليهم العمل</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.assignedDevelopers.map(dev => (
                      <span key={dev} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded text-[10px] font-bold">
                        {dev}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Stages */}
        {activeTab === 'stages' && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-sm text-gray-950 mb-4">الخط الزمني لمراحل الهندسة والبرمجة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.stages.map((stage, index) => (
                <div key={index} className="p-4 border border-gray-100 hover:border-red-100 rounded-xl flex items-start gap-4 transition-all">
                  <div className="mt-1">{getStageStatusIcon(stage.status)}</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-gray-900">{stage.name}</h4>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        stage.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        stage.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        stage.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {stage.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>المالك: {stage.owner}</span>
                      <span className="font-mono">{stage.startDate} - {stage.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div className="bg-red-600 h-1 rounded-full" style={{ width: `${stage.progress}%` }}></div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-500 font-bold">{stage.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Team Members */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-sm text-gray-900">أعضاء الفريق والتحميل الحالي للعمل</h3>
            </div>

            {canManageTeam && (
              <div className="bg-red-50/20 border border-red-100/50 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-red-950">إدارة أعضاء الفريق (صلاحية تعديل)</h4>
                  <p className="text-[10px] text-gray-500">يمكنك إضافة، إزالة، أو استبدال المطورين في هذا المشروع.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDevToAdd}
                    onChange={(e) => setSelectedDevToAdd(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:outline-none"
                  >
                    <option value="">اختر مطوراً لإضافته...</option>
                    {developers
                      .filter(d => !localDevs.includes(d.name))
                      .map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.role === 'QA Engineer' ? 'مهندس جودة' : 'مطور برمجيات'})</option>
                      ))}
                  </select>
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedDevToAdd}
                    className="flex items-center gap-1 px-3 py-2 bg-red-600 disabled:bg-gray-300 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    إضافة عضو
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Manager card */}
              <div className="p-4 bg-red-50/20 border border-red-100 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center">
                  PM
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">{project.teamManagerName}</h4>
                  <span className="text-[9px] text-gray-400 block mt-0.5">مدير الفريق المسؤول</span>
                </div>
              </div>

              {/* Developer cards */}
              {localDevs.map(devName => {
                const dev = developers.find(d => d.name === devName);
                const workload = dev ? Math.round((dev.estimatedHours / 160) * 100) : 60;
                return (
                  <div key={devName} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl flex items-center justify-center">
                          DEV
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-gray-900">{devName}</h4>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{dev?.role === 'QA Engineer' ? 'مهندس جودة' : 'مطور برمجيات'}</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="text-[9px] text-gray-400 block">ضغط العمل</span>
                        <span className={`text-xs font-black ${workload > 90 ? 'text-red-600' : 'text-gray-900'}`}>
                          {workload}%
                        </span>
                      </div>
                    </div>

                    {canManageTeam && (
                      <div className="flex items-center gap-1.5 border-t border-gray-100 pt-3 mt-3 justify-end">
                        <select
                          onChange={(e) => handleReplaceMember(devName, e.target.value)}
                          defaultValue=""
                          className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none"
                        >
                          <option value="" disabled>تغيير العضو...</option>
                          {developers
                            .filter(d => !localDevs.includes(d.name))
                            .map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                        <button
                          onClick={() => handleRemoveMember(devName)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-all"
                          title="إزالة العضو"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {canManageTeam && isChanged && (
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                <button
                  onClick={handleCancelChanges}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  حفظ التعديلات
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <h3 className="font-extrabold text-sm text-gray-900">مهمات المشروع البرمجي</h3>
              <button
                onClick={() => navigate('/dev/tasks')}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                لوحة كانبان المهام
              </button>
            </div>
            <div className="space-y-2">
              {projectTasks.map(task => (
                <div key={task.id} className="p-3 border border-gray-100 hover:border-red-100 rounded-xl flex justify-between items-center gap-3 transition-colors">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900 hover:underline cursor-pointer" onClick={() => navigate(`/dev/tasks/${task.id}`)}>
                      {task.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">المسؤول: {task.assigneeName} | الأولوية: {task.priority}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      task.status === 'Done' ? 'bg-green-100 text-green-700' :
                      task.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono font-bold">{task.progress}%</span>
                  </div>
                </div>
              ))}
              {projectTasks.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">لا توجد أي مهمات برمجية مضافة حالياً.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 7: Change Requests */}
        {activeTab === 'cr' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <h3 className="font-extrabold text-sm text-gray-900">طلبات التعديل والتغيير (Change Requests)</h3>
              <button
                onClick={() => setIsCRModalOpen(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                تقديم طلب تعديل
              </button>
            </div>
            <div className="space-y-3">
              {projectCRs.map(cr => (
                <div key={cr.id} className="p-4 border border-gray-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-extrabold text-gray-900">{cr.requestTitle}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                      cr.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      cr.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {cr.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600">{cr.description}</p>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                    <span>التأثير المالي: +{cr.costImpact} USD</span>
                    <span>التأثير الزمني: +{cr.timeImpact}</span>
                  </div>
                </div>
              ))}
              {projectCRs.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">لا توجد طلبات تعديل لهذا المشروع.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Bugs & Issues */}
        {activeTab === 'bugs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <h3 className="font-extrabold text-sm text-gray-900">البلاغات والأخطاء التقنية المكتشفة</h3>
              <button
                onClick={() => setIsBugModalOpen(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                تسجيل بلاغ خطأ
              </button>
            </div>
            <div className="space-y-2">
              {projectBugs.map(bug => (
                <div key={bug.id} className="p-3 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900">{bug.title}</h4>
                    <p className="text-[9px] text-gray-400 mt-0.5">مسؤول الحل: {bug.assignedTo} | تاريخ البلاغ: {bug.createdDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                      bug.severity === 'Critical' ? 'bg-red-600 text-white' :
                      bug.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {bug.severity}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">{bug.status}</span>
                  </div>
                </div>
              ))}
              {projectBugs.length === 0 && (
                <div className="text-center py-8 text-xs text-gray-400">لا توجد بلاغات مسجلة للمشروع. هنيئاً لك!</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Bug Modal */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900">تسجيل بلاغ خطأ جديد</span>
              <button onClick={() => setIsBugModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Trash className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBugSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المشكلة</label>
                <input
                  type="text"
                  required
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                  placeholder="مثال: انهيار التطبيق عند الدخول لصفحة الدفع"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الخطورة</label>
                <select
                  value={bugSeverity}
                  onChange={(e) => setBugSeverity(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical (حرج ويعطل التشغيل)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">المسؤول عن الحل</label>
                <select
                  value={bugAssignee}
                  onChange={(e) => setBugAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                >
                  <option value="">اختر المطور</option>
                  {project.assignedDevelopers.map(dev => (
                    <option key={dev} value={dev}>{dev}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBugModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
                >
                  تسجيل البلاغ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add CR Modal */}
      {isCRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900">تقديم طلب تغيير / تعديل</span>
              <button onClick={() => setIsCRModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Trash className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCRSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">عنوان طلب التعديل</label>
                <input
                  type="text"
                  required
                  value={crTitle}
                  onChange={(e) => setCrTitle(e.target.value)}
                  placeholder="مثال: تعديل لغة شاشات واجهة المستخدم"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">تفاصيل طلب التعديل</label>
                <textarea
                  value={crDesc}
                  onChange={(e) => setCrDesc(e.target.value)}
                  placeholder="وصف تفصيلي للمطلوب والأسباب..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">التكلفة المالية الإضافية ($)</label>
                  <input
                    type="number"
                    value={crCost}
                    onChange={(e) => setCrCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">التأثير الزمني المتوقع</label>
                  <input
                    type="text"
                    value={crTime}
                    onChange={(e) => setCrTime(e.target.value)}
                    placeholder="مثال: 5 Days"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCRModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
                >
                  تقديم الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevProjectDetails;
