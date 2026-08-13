import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDevModuleStore } from '../../store/devModuleStore';
import type { DevTeamSubmission, DevDepartmentMember } from '../../store/devModuleStore';
import { 
  Briefcase, CheckCircle, Clock, AlertTriangle, Play,
  Users, ShieldAlert, Activity,
  FileText, FileSpreadsheet, FileCode, Star, Send,
  UserPlus, Globe, Smartphone, Cpu, Eye, UploadCloud,
  CheckCircle2, FileCheck
} from 'lucide-react';

export const DevDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { 
    projects, tasks, currentRole,
    interviews, clientSubmissions, attendanceRecords, teamSubmissions, departmentMembers,
    addInterview, addClientData, takeAttendance, submitTeamDeliverable, forwardDeliverableToTechLead, evaluateMember
  } = useDevModuleStore();

  // Local Tab States
  const [techLeadTab, setTechLeadTab] = useState<'overview' | 'files' | 'members' | 'interviews' | 'attendance'>('overview');
  const [deptManagerTab, setDeptManagerTab] = useState<'forward_tasks' | 'evaluation' | 'interview2' | 'attendance_take' | 'team_submissions' | 'client_data'>('attendance_take');
  const [accountManagerTab, setAccountManagerTab] = useState<'clients' | 'handover' | 'interview1'>('clients');
  const [teamLeaderTab, setTeamLeaderTab] = useState<'my_tasks' | 'submit_deliverable'>('submit_deliverable');

  useEffect(() => {
    if (!tabParam) return;
    if (currentRole === 'Tech Lead' && ['overview', 'files', 'members', 'interviews', 'attendance'].includes(tabParam)) {
      setTechLeadTab(tabParam as any);
    }
    if (currentRole === 'Department Manager' && ['attendance_take', 'forward_tasks', 'interview2', 'evaluation', 'team_submissions', 'client_data'].includes(tabParam)) {
      setDeptManagerTab(tabParam as any);
    }
    if (currentRole === 'Account Manager' && ['clients', 'handover', 'interview1'].includes(tabParam)) {
      setAccountManagerTab(tabParam as any);
    }
    if (['Web Team Leader', 'Mobile Team Leader', 'Automation Team Leader'].includes(currentRole) && ['my_tasks', 'submit_deliverable'].includes(tabParam)) {
      setTeamLeaderTab(tabParam as any);
    }
  }, [tabParam, currentRole]);

  // Modals & Form States
  const [selectedFileModal, setSelectedFileModal] = useState<DevTeamSubmission | null>(null);
  const [evaluatingMember, setEvaluatingMember] = useState<DevDepartmentMember | null>(null);
  const [memberRatingInput, setMemberRatingInput] = useState<number>(5);
  const [memberNoteInput, setMemberNoteInput] = useState<string>('');

  // Form: 1st / 2nd Interview Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateRole, setCandidateRole] = useState('');
  const [interviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [interviewNotes, setInterviewNotes] = useState('');
  const [interviewRating, setInterviewRating] = useState(5);
  const [interviewStatus, setInterviewStatus] = useState<'Passed' | 'Rejected' | 'Pending Decision'>('Passed');

  // Form: Client Data Handover State
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [clientFileName, setClientFileName] = useState('');
  const [clientFileType, setClientFileType] = useState<'word' | 'excel' | 'pdf'>('word');

  // Form: Team Leader Deliverable State
  const [taskTitleInput, setTaskTitleInput] = useState('');
  const [taskDescInput, setTaskDescInput] = useState('');
  const [deliverableFileName, setDeliverableFileName] = useState('');
  const [deliverableFileType, setDeliverableFileType] = useState<'word' | 'excel' | 'pdf'>('word');
  const [deliverableFileSize] = useState('2.5 MB');

  // Form: Attendance Form State
  const [attendanceForm, setAttendanceForm] = useState<Record<string, { status: 'Present' | 'Absent' | 'Late' | 'On Leave'; time: string; notes: string }>>(() => {
    const init: Record<string, { status: 'Present' | 'Absent' | 'Late' | 'On Leave'; time: string; notes: string }> = {};
    departmentMembers.forEach(m => {
      const existing = attendanceRecords.find(a => a.employeeName.includes(m.name) && a.date === new Date().toISOString().split('T')[0]);
      init[m.id] = {
        status: existing ? existing.status : 'Present',
        time: existing?.checkInTime || '09:00 AM',
        notes: existing?.notes || ''
      };
    });
    return init;
  });

  // Success Notification banner
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Math Stats
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const delayedProjects = projects.filter(p => p.status === 'Blocked' || p.health === 'Critical').length;
  const completedProjects = projects.filter(p => p.status === 'Done').length;

  // Action Handlers
  const handleSaveInterview = (stage: '1st Interview' | '2nd Interview') => {
    if (!candidateName || !candidateRole || !interviewNotes) {
      alert('يرجى ملء جميع الحقول المطلوبة للمقابلة.');
      return;
    }
    const conductedBy = stage === '1st Interview' 
      ? 'رانيا مجدي (Account Manager)' 
      : 'د. حاتم الشريف (Department Manager)';

    addInterview({
      candidateName,
      candidateRole,
      interviewStage: stage,
      conductedBy,
      interviewDate,
      notes: interviewNotes,
      rating: Number(interviewRating),
      status: interviewStatus
    });

    setCandidateName('');
    setCandidateRole('');
    setInterviewNotes('');
    showToast(`تم حفظ وتكليف نتائج ${stage === '1st Interview' ? 'المقابلة الأولى' : 'المقابلة الثانية'} وإرسال التفاصيل فوراً للـ Tech Lead`);
  };

  const handleSaveClientHandover = () => {
    if (!clientName || !companyName || !projectTitle || !requirementsText) {
      alert('يرجى إدخال اسم العميل والشركة وعنوان المشروع والاشتراطات.');
      return;
    }
    addClientData({
      clientName,
      companyName,
      phone: clientPhone || '+20 100 000 0000',
      email: clientEmail || 'client@company.com',
      projectTitle,
      requirements: requirementsText,
      submittedBy: 'رانيا مجدي (Account Manager)',
      submittedTo: 'د. حاتم الشريف (Department Manager)',
      attachedFiles: clientFileName ? [{ name: clientFileName, type: clientFileType, size: '3.1 MB' }] : []
    });

    if (clientFileName) {
      submitTeamDeliverable({
        teamType: 'Client Success',
        teamLeaderName: 'رانيا مجدي (Account Manager)',
        uploaderRole: 'Account Manager',
        taskTitle: `داتا وااشتراطات العميل: ${clientName} - ${companyName}`,
        description: requirementsText,
        fileName: clientFileName,
        fileType: clientFileType,
        fileSize: '3.1 MB',
        submittedTo: 'أنس العمري (Tech Lead)',
        forwardedToTechLead: true
      });
    }

    setClientName('');
    setCompanyName('');
    setClientPhone('');
    setClientEmail('');
    setProjectTitle('');
    setRequirementsText('');
    setClientFileName('');
    showToast('تم تسليم داتا العميل واشتراطات المشروع وإرسال المرفقات للـ Tech Lead بنجاح!');
  };

  const handleSaveDeptManagerDeliverable = () => {
    if (!taskTitleInput || !taskDescInput || !deliverableFileName) {
      alert('يرجى إدخال عنوان المهمة والتفاصيل واسم الملف المرفق.');
      return;
    }
    submitTeamDeliverable({
      teamType: 'Department Management',
      teamLeaderName: 'د. حاتم الشريف (Department Manager)',
      uploaderRole: 'Department Manager',
      taskTitle: taskTitleInput,
      description: taskDescInput,
      fileName: deliverableFileName,
      fileType: deliverableFileType,
      fileSize: deliverableFileSize,
      submittedTo: 'أنس العمري (Tech Lead)',
      forwardedToTechLead: true
    });

    setTaskTitleInput('');
    setTaskDescInput('');
    setDeliverableFileName('');
    showToast(`تم رفع الملف (${deliverableFileType.toUpperCase()}) وإرساله فوراً للـ Tech Lead!`);
  };

  const handleSaveDeliverable = (teamType: 'Web' | 'Mobile Application' | 'Automation & Data Analysis') => {
    if (!taskTitleInput || !taskDescInput || !deliverableFileName) {
      alert('يرجى إدخال عنوان المهمة، الوصف، واسم الملف المرفق.');
      return;
    }
    let leaderName = 'م. إسلام عادل (Web Team Leader)';
    let roleTitle = 'Web Team Leader';
    if (teamType === 'Mobile Application') {
      leaderName = 'م. حسام السيد (Mobile Team Leader)';
      roleTitle = 'Mobile Team Leader';
    }
    if (teamType === 'Automation & Data Analysis') {
      leaderName = 'م. دينا فتحي (Automation TL)';
      roleTitle = 'Automation Team Leader';
    }

    submitTeamDeliverable({
      teamType,
      teamLeaderName: leaderName,
      uploaderRole: roleTitle,
      taskTitle: taskTitleInput,
      description: taskDescInput,
      fileName: deliverableFileName,
      fileType: deliverableFileType,
      fileSize: deliverableFileSize,
      submittedTo: 'د. حاتم الشريف (Department Manager)',
      forwardedToTechLead: true
    });

    setTaskTitleInput('');
    setTaskDescInput('');
    setDeliverableFileName('');
    showToast(`تم إرسال المهمة والمرفق (${deliverableFileType.toUpperCase()}) بنجاح للـ Tech Lead ومدير القسم!`);
  };

  const handleSaveAttendanceRecords = () => {
    const records = departmentMembers.map(m => {
      const stateItem = attendanceForm[m.id] || { status: 'Present', time: '09:00 AM', notes: '' };
      return {
        employeeName: `${m.name} (${m.roleTitle.split(' (')[0]})`,
        date: new Date().toISOString().split('T')[0],
        status: stateItem.status,
        checkInTime: stateItem.time,
        notes: stateItem.notes,
        takenBy: 'د. حاتم الشريف (Department Manager)'
      };
    });

    takeAttendance(records);
    showToast('تم تسجيل الغياب والحضور وتحديث شاشة الـ Tech Lead الحية فوراً!');
  };

  const handleSaveEvaluation = () => {
    if (!evaluatingMember) return;
    evaluateMember(evaluatingMember.id, memberRatingInput, memberNoteInput);
    setEvaluatingMember(null);
    showToast(`تم تحديث تقييم ${evaluatingMember.name} وإرسال الملاحظات بنجاح.`);
  };

  // Render File Icon Helper
  const getFileBadge = (fileType: string) => {
    if (fileType === 'word' || fileType?.endsWith('.doc') || fileType?.endsWith('.docx')) {
      return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200"><FileText className="w-3.5 h-3.5" /> Word (.docx)</span>;
    }
    if (fileType === 'excel' || fileType?.endsWith('.xls') || fileType?.endsWith('.xlsx')) {
      return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold border border-emerald-200"><FileSpreadsheet className="w-3.5 h-3.5" /> Excel (.xlsx)</span>;
    }
    return <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-bold border border-rose-200"><FileCode className="w-3.5 h-3.5" /> PDF (.pdf)</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-extrabold">{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 p-6 rounded-3xl text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/30 border border-red-500/40 rounded-2xl">
              <Activity className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                قسم البرمجة وتطوير الأنظمة
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-medium mt-0.5">
                منظومة إدارة المهام، الملفات المرفقة، المقابلات، والغياب والحضور المتزامن
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TECH LEAD ROLE VIEW                                                    */}
      {/* ========================================================================= */}
      {currentRole === 'Tech Lead' && (
        <div className="space-y-6">
          {/* Tech Lead Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {[
              { key: 'overview', label: '🌐 تفاصيل الموقع والأنظمة', count: projects.length },
              { key: 'files', label: '📁 الملفات والمرفقات المستلمة (Word/Excel/PDF)', count: teamSubmissions.filter(s => s.forwardedToTechLead).length },
              { key: 'members', label: '👥 أشخاص القسم وطبيعة شغل كل شخص', count: departmentMembers.length },
              { key: 'interviews', label: '📝 سجل اجتماعات ومقابلات العملاء (1st & 2nd Meetings)', count: interviews.filter(i => i.sentToTechLead).length },
              { key: 'attendance', label: '⏱️ جدول الغياب والحضور المتزامن', count: attendanceRecords.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setTechLeadTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                  techLeadTab === tab.key
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  techLeadTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* TAB 1: Overview & Site Details */}
          {techLeadTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">المشاريع المكتملة</span>
                    <span className="text-2xl font-black text-gray-900">{completedProjects}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Play className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">مشاريع قيد التنفيذ</span>
                    <span className="text-2xl font-black text-gray-900">{activeProjects}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">مشاريع في خطر/حرجة</span>
                    <span className="text-2xl font-black text-gray-900">{delayedProjects}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">إجمالي قادة الفرق والأعضاء</span>
                    <span className="text-2xl font-black text-gray-900">{departmentMembers.length}</span>
                  </div>
                </div>
              </div>

              {/* Site Details & Tech Stack Overview */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-600" />
                  تفاصيل ومعمارية الموقع والأنظمة الحالية (Full Tech Specs)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500">منصة الويب الرئيسية (Web App)</span>
                    <p className="font-black text-gray-900 text-sm mt-1">React 18 + TypeScript + Vite</p>
                    <p className="text-xs text-gray-500 mt-2">خادم الاستضافة: AWS EC2 / NGINX | حالة السيرفر: <span className="text-emerald-600 font-bold">100% يعمل</span></p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500">تطبيقات الهواتف الذكية (Mobile Apps)</span>
                    <p className="font-black text-gray-900 text-sm mt-1">Flutter Multi-platform (iOS & Android)</p>
                    <p className="text-xs text-gray-500 mt-2">الإصدار النشط: v2.4.1 على App Store & Google Play</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-500">الأوتوميشن وتحليل البيانات</span>
                    <p className="font-black text-gray-900 text-sm mt-1">Python Automation + Selenium + PostgreSQL</p>
                    <p className="text-xs text-gray-500 mt-2">معدل الدقة واختبارات الأداء: <span className="text-emerald-600 font-bold">99.4%</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Tech Lead Files & Attachments Inbox */}
          {techLeadTab === 'files' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" />
                    المرفقات والملفات المستلمة من كافة أدوار قسم البرمجة (Word, Excel, PDF)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">يستعرض الـ Tech Lead جميع الملفات والمستندات التقنية المرفوعة من مدير القسم، قادة الفرق، ومدير الحسابات</p>
                </div>
                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-black rounded-xl border border-red-100 flex items-center gap-1">
                  <UploadCloud className="w-4 h-4 text-red-600" />
                  إجمالي المرفقات: {teamSubmissions.filter(s => s.forwardedToTechLead).length} ملفات
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamSubmissions.filter(s => s.forwardedToTechLead).map(sub => (
                  <div key={sub.id} className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200/60 hover:border-red-500/40 hover:shadow-md transition flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[11px] font-black text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                          {sub.uploaderRole || sub.teamType}
                        </span>
                        {getFileBadge(sub.fileType)}
                      </div>
                      <h4 className="font-black text-gray-900 text-sm mt-3 leading-snug">{sub.taskTitle}</h4>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{sub.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200/80 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <span className="font-black text-gray-900 block">{sub.teamLeaderName}</span>
                          <span className="text-[10px] text-gray-400 font-mono block">حجم الملف: {sub.fileSize} | {sub.submissionDate}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedFileModal(sub)}
                        className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-red-600 transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>معاينة واستعراض الملف</span>
                      </button>
                    </div>
                  </div>
                ))}
                {teamSubmissions.filter(s => s.forwardedToTechLead).length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-400 text-xs">لا توجد ملفات محولة حالياً للـ Tech Lead.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Tech Lead - Department Personnel & Work Nature */}
          {techLeadTab === 'members' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  عرض كروت أشخاص قسم البرمجة وطبيعة شغل كل شخص (Staff Overview & Nature of Work)
                </h3>
                <p className="text-xs text-gray-500 mt-1">يستعرض هذا القسم تخصصات ووظائف جميع الكوادر التابعة لقسم البرمجة بالتفصيل</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departmentMembers.map(member => (
                  <div key={member.id} className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-black text-gray-900 text-base">{member.name}</h4>
                          <span className="text-xs font-bold text-red-600 block mt-0.5">{member.roleTitle}</span>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-black rounded-lg border border-gray-200">
                          فريق {member.team}
                        </span>
                      </div>

                      {/* Nature of Work Box */}
                      <div className="mt-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                        <span className="text-[11px] font-black text-red-800 block mb-1">طبيعة شغل وطريقة عمل الشخص:</span>
                        <p className="text-xs text-gray-700 leading-relaxed">{member.workNature}</p>
                      </div>

                      {member.performanceNote && (
                        <p className="text-[11px] text-gray-500 mt-2 italic">"{member.performanceNote}"</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{member.rating} / 5</span>
                      </div>
                      <div className="text-gray-500 font-mono text-[11px]">
                        <span>نسبة الحضور: <strong className="text-emerald-600">{member.attendanceRate}%</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Tech Lead - Client Meetings Feed (1st & 2nd Client Meetings) */}
          {techLeadTab === 'interviews' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-red-600" />
                  تفاصيل وملاحظات اجتماعات العملاء الواردة (1st Client Meeting & 2nd Technical Meeting Feed)
                </h3>
                <p className="text-xs text-gray-500 mt-1">يستلم الـ Tech Lead تفاصيل اجتماعات العملاء وملاحظات تحديد ميزات ومتطلبات الموقع/التطبيق من مدير الحسابات ومدير القسم</p>
              </div>

              <div className="space-y-4">
                {interviews.filter(i => i.sentToTechLead).map(interview => (
                  <div key={interview.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 text-xs font-black rounded-lg ${
                          interview.interviewStage === '1st Interview' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {interview.interviewStage === '1st Interview' ? 'الاجتماع الأول مع العميل (Account Manager)' : 'الاجتماع التقني الثاني مع العميل (Dept Manager)'}
                        </span>
                        <h4 className="font-black text-gray-900 text-base">{interview.candidateName}</h4>
                        <span className="text-xs text-gray-500 font-bold">({interview.candidateRole})</span>
                      </div>
                      
                      <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 space-y-1">
                        <span className="font-bold text-gray-900 block">تفاصيل ما قيل في اجتماع العميل والاشتراطات المحددة:</span>
                        <p className="leading-relaxed">{interview.notes}</p>
                      </div>
                      
                      <p className="text-[11px] text-gray-400">القائم بالاجتماع مع العميل: <strong>{interview.conductedBy}</strong> | التاريخ: {interview.interviewDate}</p>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-end shrink-0 gap-2">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>تقييم الأولوية: {interview.rating}/5</span>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                        interview.status === 'Passed' ? 'bg-green-100 text-green-700' :
                        interview.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {interview.status === 'Passed' ? 'اعتماد نطاق العمل (Approved Scope)' : interview.status === 'Rejected' ? 'نطاق غير متاح' : 'قيد الدراسة والمراجعة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Tech Lead - Live Attendance Monitor */}
          {techLeadTab === 'attendance' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    جدول الغياب والحضور الحقيقي (Live Sync Attendance Log)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">يأخذ مدير القسم الغياب والحضور ويسمع هنا مباشرة لحظة بلحظة</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  متزامن مع مدير القسم مباشرة
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-black border-b border-gray-200">
                    <tr>
                      <th className="p-3">اسم الموظف والتخصص</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">حالة الحضور</th>
                      <th className="p-3">وقت الدخول</th>
                      <th className="p-3">ملاحظات وتسجيل مدير القسم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendanceRecords.map(att => (
                      <tr key={att.id} className="hover:bg-gray-50/80">
                        <td className="p-3 font-extrabold text-gray-900">{att.employeeName}</td>
                        <td className="p-3 text-gray-500 font-mono">{att.date}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-lg font-black text-[11px] ${
                            att.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            att.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                            att.status === 'Absent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {att.status === 'Present' ? 'حاضر' : att.status === 'Late' ? 'متأخر' : att.status === 'Absent' ? 'غائب' : 'في إجازة'}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-gray-700">{att.checkInTime || '-'}</td>
                        <td className="p-3 text-gray-600">{att.notes || 'لا يوجد ملاحظات مدونة'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEPARTMENT MANAGER ROLE VIEW                                          */}
      {/* ========================================================================= */}
      {currentRole === 'Department Manager' && (
        <div className="space-y-6">
          {/* Department Manager Sub-Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {[
              { key: 'attendance_take', label: '🕒 أخذ الغياب والحضور وتسميعه عند الـ Tech Lead' },
              { key: 'forward_tasks', label: '📤 تسليم التاسكات والملفات للـ Tech Lead' },
              { key: 'interview2', label: '🤝 المقابلة التقنية الثانية مع العميل (2nd Client Meeting)' },
              { key: 'evaluation', label: '📊 متابعة الشغل وتقييم الأعضاء' },
              { key: 'team_submissions', label: '📥 تسليمات تيم ليدرز الفرق (Web/Mobile/Auto)' },
              { key: 'client_data', label: '💼 داتا العملاء الواردة من مدير الحسابات' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setDeptManagerTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${
                  deptManagerTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Department Manager - Take Attendance */}
          {deptManagerTab === 'attendance_take' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  دفتر أخذ الغياب والحضور اليومي لأعضاء قسم البرمجة (Attendance Register)
                </h3>
                <p className="text-xs text-gray-500 mt-1">عند حفظ الغياب والحضور هنا يسمع تلقائياً وفورياً في شاشة الـ Tech Lead</p>
              </div>

              <div className="space-y-3">
                {departmentMembers.map(member => {
                  const stateItem = attendanceForm[member.id] || { status: 'Present', time: '09:00 AM', notes: '' };
                  return (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">{member.name}</h4>
                        <span className="text-xs text-gray-500 font-bold">{member.roleTitle}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                          value={stateItem.status}
                          onChange={(e) => setAttendanceForm({
                            ...attendanceForm,
                            [member.id]: { ...stateItem, status: e.target.value as any }
                          })}
                          className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-black text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Present">حاضر (Present)</option>
                          <option value="Late">متأخر (Late)</option>
                          <option value="Absent">غائب (Absent)</option>
                          <option value="On Leave">في إجازة (On Leave)</option>
                        </select>

                        <input
                          type="text"
                          placeholder="وقت الدخول e.g. 09:00 AM"
                          value={stateItem.time}
                          onChange={(e) => setAttendanceForm({
                            ...attendanceForm,
                            [member.id]: { ...stateItem, time: e.target.value }
                          })}
                          className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono w-32 outline-none"
                        />

                        <input
                          type="text"
                          placeholder="ملاحظات الحضور..."
                          value={stateItem.notes}
                          onChange={(e) => setAttendanceForm({
                            ...attendanceForm,
                            [member.id]: { ...stateItem, notes: e.target.value }
                          })}
                          className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs flex-1 md:w-48 outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveAttendanceRecords}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Send className="w-4 h-4" />
                  حفظ الحضور والغياب وإرساله للتزامن الحقيقي مع الـ Tech Lead
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Department Manager - Forward Tasks & Direct File Upload */}
          {deptManagerTab === 'forward_tasks' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  إدارة التسليمات والمرفقات الخاصة بمدير القسم وقادة الفرق
                </h3>
                <p className="text-xs text-gray-500 mt-1">رفع ملفات جديدة خاصة بمدير القسم أو تحويل وتسليم ملفات قادة الفرق للـ Tech Lead</p>
              </div>

              {/* Department Manager Direct File Upload Box */}
              <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-4">
                <h4 className="font-black text-blue-900 text-sm flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  رفع وتسليم ملف/مهمة جديدة خاصة بمدير القسم للـ Tech Lead (Word / Excel / PDF)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">عنوان المهمة / التسليم</label>
                    <input
                      type="text"
                      placeholder="e.g. تقرير معمارية سيرفرات وقواعد البيانات Q3"
                      value={taskTitleInput}
                      onChange={(e) => setTaskTitleInput(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">اسم الملف المرفق</label>
                    <input
                      type="text"
                      placeholder="e.g. Dept_Manager_Database_Architecture.pdf"
                      value={deliverableFileName}
                      onChange={(e) => setDeliverableFileName(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-gray-300 text-xs font-mono outline-none"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="text-xs font-bold text-gray-700 block mb-1">تفاصيل وملاحظات التسليم</label>
                    <textarea
                      rows={2}
                      placeholder="اكتب تفاصيل التقرير والنتائج البرمجية..."
                      value={taskDescInput}
                      onChange={(e) => setTaskDescInput(e.target.value)}
                      className="w-full p-2.5 bg-white rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">نوع المستند (Word / Excel / PDF)</label>
                    <select
                      value={deliverableFileType}
                      onChange={(e) => setDeliverableFileType(e.target.value as any)}
                      className="w-full p-2.5 bg-white rounded-xl border border-gray-300 text-xs font-bold outline-none"
                    >
                      <option value="word">Word Document (.docx)</option>
                      <option value="excel">Excel Spreadsheet (.xlsx)</option>
                      <option value="pdf">PDF Document (.pdf)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSaveDeptManagerDeliverable}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                    >
                      <UploadCloud className="w-4 h-4" />
                      رفع المستند وإرساله فوراً للـ Tech Lead
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Leaders Submissions Review */}
              <div className="space-y-3 pt-2">
                <h4 className="font-black text-gray-900 text-sm">تسليمات ومستندات تيم ليدرز الفرق:</h4>
                {teamSubmissions.map(sub => (
                  <div key={sub.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-300 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {sub.uploaderRole || sub.teamType}
                        </span>
                        {getFileBadge(sub.fileType)}
                        <span className="font-bold text-xs text-gray-700">{sub.fileName}</span>
                      </div>
                      <h4 className="font-black text-gray-900 text-sm">{sub.taskTitle}</h4>
                      <p className="text-xs text-gray-500">{sub.description}</p>
                      <span className="text-[10px] text-gray-400 block">بواسطة: {sub.teamLeaderName} | {sub.submissionDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedFileModal(sub)}
                        className="px-3.5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة واستعراض الملف</span>
                      </button>
                      {sub.forwardedToTechLead ? (
                        <span className="px-3.5 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-extrabold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          تم التحويل للـ Tech Lead
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            forwardDeliverableToTechLead(sub.id);
                            showToast(`تم تحويل المهمة "${sub.taskTitle}" وتسليمها فوراً للـ Tech Lead.`);
                          }}
                          className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition shadow"
                        >
                          تحويل وتسليم للـ Tech Lead
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Department Manager - Conduct 2nd Client Meeting */}
          {deptManagerTab === 'interview2' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  إجراء وتدوين المقابلة التقنية الثانية مع العميل (2nd Technical Client Meeting) وإرسال التفاصيل للـ Tech Lead
                </h3>
                <p className="text-xs text-gray-500 mt-1">سجل ما قيل في الاجتماع التقني المعمق مع العميل والمعمارية المقترحة للموقع/التطبيق ليرسل تلقائياً للـ Tech Lead</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم العميل / الشركة</label>
                  <input
                    type="text"
                    placeholder="e.g. د. طارق مراد (شركة تكنو سوفت)"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم المشروع / التطبيق المطلوب</label>
                  <input
                    type="text"
                    placeholder="e.g. تطبيق محفظة الدفع الذكية والولاء"
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-700 block mb-1">تفاصيل وملاحظات الاجتماع التقني (إيه اللي اتقال في الاجتماع الثاني مع العميل والحلول التقنية)</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب بالتفصيل النقاط الفنية والمعمارية والحلول التي تم مناقشتها والاتفاق عليها مع العميل..."
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">تقييم الجاهزية الفنية (من 5)</label>
                  <select
                    value={interviewRating}
                    onChange={(e) => setInterviewRating(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none font-bold"
                  >
                    <option value={5}>5 / 5 - جاهزية واضحة وممتازة</option>
                    <option value={4}>4 / 5 - جيد جداً</option>
                    <option value={3}>3 / 5 - يتطلب إيضاحات إضافية</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">حالة اعتماد النطاق الفني</label>
                  <select
                    value={interviewStatus}
                    onChange={(e) => setInterviewStatus(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none font-bold"
                  >
                    <option value="Passed">اعتماد النطاق الفني (Approved Scope)</option>
                    <option value="Pending Decision">معلق لحين مراجعة الـ Tech Lead</option>
                    <option value="Rejected">طلب تعديل جوهري من العميل</option>
                  </select>
                </div>

                <div className="col-span-full flex justify-end">
                  <button
                    onClick={() => handleSaveInterview('2nd Interview')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    حفظ وإرسال تفاصيل الاجتماع التقني الثاني مع العميل للـ Tech Lead
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Department Manager - Evaluate Members */}
          {deptManagerTab === 'evaluation' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  متابعة الشغل وتقييم أداء أعضاء قسم البرمجة (Member Evaluation)
                </h3>
                <p className="text-xs text-gray-500 mt-1">إمكانية التقييم بالنجوم إضافة إلى ملاحظات الأداء الإدارية والتقنية</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departmentMembers.map(m => (
                  <div key={m.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{m.name}</h4>
                      <span className="text-xs text-gray-500 block">{m.roleTitle}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>التقييم الحالي: {m.rating} / 5</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEvaluatingMember(m);
                        setMemberRatingInput(m.rating);
                        setMemberNoteInput(m.performanceNote || '');
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                    >
                      تقييم العضو
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5 & 6: Department Manager - Team Submissions & Client Data */}
          {(deptManagerTab === 'team_submissions' || deptManagerTab === 'client_data') && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-black text-base text-gray-900">
                {deptManagerTab === 'team_submissions' ? 'تسليمات وتاسكات تيم ليدرز الفرق' : 'داتا العملاء المحولة من مدير الحسابات'}
              </h3>
              {deptManagerTab === 'client_data' ? (
                <div className="space-y-3">
                  {clientSubmissions.map(cli => (
                    <div key={cli.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-gray-900 text-sm">{cli.clientName} - {cli.companyName}</h4>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{cli.projectTitle}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{cli.requirements}</p>
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 pt-2 border-t border-gray-200">
                        <span>الهاتف: {cli.phone}</span> | <span>البريد: {cli.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {teamSubmissions.map(sub => (
                    <div key={sub.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-300 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {sub.uploaderRole || sub.teamType}
                          </span>
                          {getFileBadge(sub.fileType)}
                          <span className="font-bold text-xs text-gray-700">{sub.fileName}</span>
                        </div>
                        <h4 className="font-black text-gray-900 text-sm">{sub.taskTitle}</h4>
                        <p className="text-xs text-gray-500">{sub.description}</p>
                        <span className="text-[10px] text-gray-400 block">بواسطة: {sub.teamLeaderName} | {sub.submissionDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedFileModal(sub)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>معاينة واستعراض الملف</span>
                        </button>
                        {sub.forwardedToTechLead && (
                          <span className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            مُحول للـ Tech Lead
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACCOUNT MANAGER ROLE VIEW                                              */}
      {/* ========================================================================= */}
      {currentRole === 'Account Manager' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {[
              { key: 'clients', label: '🤝 متابعة العملاء والطلبات' },
              { key: 'handover', label: '📩 تسليم داتا العميل لمدير القسم (Word/Excel/PDF)' },
              { key: 'interview1', label: '🎙️ المقابلة الأولى مع العميل (1st Client Meeting)' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setAccountManagerTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${
                  accountManagerTab === tab.key
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Client Follow-ups */}
          {accountManagerTab === 'clients' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                سجل متابعة طلبات العملاء والمشاريع المقترحة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientSubmissions.map(cli => (
                  <div key={cli.id} className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">{cli.clientName}</h4>
                        <span className="text-xs text-gray-500 font-bold">{cli.companyName}</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg">
                        {cli.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">المشروع: <strong>{cli.projectTitle}</strong></p>
                    <p className="text-xs text-gray-500">{cli.requirements}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Hand Over Client Data to Department Manager */}
          {accountManagerTab === 'handover' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600" />
                  نموذج تسليم داتا العميل لمدير القسم (Hand Over Client Specifications)
                </h3>
                <p className="text-xs text-gray-500 mt-1">قم بتعبئة بيانات العميل والمواصفات وإرفاق الملفات المحفوطة لمدير القسم</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم العميل</label>
                  <input
                    type="text"
                    placeholder="e.g. أ. خالد التميمي"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم الشركة / المؤسسة</label>
                  <input
                    type="text"
                    placeholder="e.g. مجموعة الصاوي العقارية"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    placeholder="+20 100 234 5678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="khaled@alsawy.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-700 block mb-1">عنوان المشروع المطلوب</label>
                  <input
                    type="text"
                    placeholder="e.g. منصة سندك العقارية وبوابة الحجز الفوري"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-700 block mb-1">تفاصيل وااشتراطات المشروع</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب كامل المتطلبات والجدول الزمني المحدد مع العميل..."
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم الملف المرفق (مستند الشروط)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sawy_RealEstate_Specs.docx"
                    value={clientFileName}
                    onChange={(e) => setClientFileName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نوع الملف (Word / Excel / PDF)</label>
                  <select
                    value={clientFileType}
                    onChange={(e) => setClientFileType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                  >
                    <option value="word">Word document (.docx)</option>
                    <option value="excel">Excel spreadsheet (.xlsx)</option>
                    <option value="pdf">PDF document (.pdf)</option>
                  </select>
                </div>

                <div className="col-span-full flex justify-end">
                  <button
                    onClick={handleSaveClientHandover}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Send className="w-4 h-4" />
                    تسليم داتا العميل لمدير القسم (Department Manager)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1st Client Discovery Meeting Recording & Send to Tech Lead */}
          {accountManagerTab === 'interview1' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  إجراء وتدوين المقابلة الأولى مع العميل (1st Client Meeting) وإرسال التفاصيل للـ Tech Lead
                </h3>
                <p className="text-xs text-gray-500 mt-1">سجل تفاصيل ما قيل في الاجتماع الأول مع العميل واشتراطات المشروع المبدئية لترسل فوراً للـ Tech Lead</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم العميل / الشركة</label>
                  <input
                    type="text"
                    placeholder="e.g. أ. خالد التميمي (مجموعة الصاوي)"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم المشروع / التطبيق المطلوبة</label>
                  <input
                    type="text"
                    placeholder="e.g. منصة سندك العقارية وبوابة الحجز"
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-700 block mb-1">تفاصيل ما قيل في الاجتماع الأول مع العميل والاشتراطات المبدئية</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب بالتفصيل رؤية العميل والخدمات والميزات التي يرغب في توفرها بالمنصة أو التطبيق..."
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">تقييم جدية العميل (من 5)</label>
                  <select
                    value={interviewRating}
                    onChange={(e) => setInterviewRating(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none font-bold"
                  >
                    <option value={5}>5 / 5 - عميل جاد فرصة مؤكدة</option>
                    <option value={4}>4 / 5 - جيد جداً</option>
                    <option value={3}>3 / 5 - استكشافي فقط</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">التوصية ونطاق العمل</label>
                  <select
                    value={interviewStatus}
                    onChange={(e) => setInterviewStatus(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none font-bold"
                  >
                    <option value="Passed">تحويل للاجتماع التقني الثاني مع مدير القسم (Passed)</option>
                    <option value="Pending Decision">قيد الدراسة والدراسة المالية</option>
                    <option value="Rejected">استبعاد / عدم التوافق (Rejected)</option>
                  </select>
                </div>

                <div className="col-span-full flex justify-end">
                  <button
                    onClick={() => handleSaveInterview('1st Interview')}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Send className="w-4 h-4" />
                    تسليم تفاصيل الاجتماع الأول مع العميل للـ Tech Lead
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TEAM LEADERS ROLE VIEW (Web, Mobile, Automation & Data Analysis)      */}
      {/* ========================================================================= */}
      {(currentRole === 'Web Team Leader' || currentRole === 'Mobile Team Leader' || currentRole === 'Automation Team Leader' || currentRole === 'Team Manager') && (
        <div className="space-y-6">
          {/* Dynamic Team Header Badge */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-500 block">نطاق عمل التيم ليدر الحالي:</span>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mt-0.5">
                {currentRole === 'Web Team Leader' && <><Globe className="w-5 h-5 text-purple-600" /> تيم ليدر الويب (Web Team Leader)</>}
                {currentRole === 'Mobile Team Leader' && <><Smartphone className="w-5 h-5 text-pink-600" /> تيم ليدر الموبايل ابليكيشن (Mobile Application TL)</>}
                {currentRole === 'Automation Team Leader' && <><Cpu className="w-5 h-5 text-cyan-600" /> تيم ليدر الأوتوميشن والداتا اناليسيز (Automation & Data Analysis TL)</>}
                {currentRole === 'Team Manager' && <><Users className="w-5 h-5 text-blue-600" /> قائد فريق التطوير البرمجي العام</>}
              </h3>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-black rounded-xl">
              إرسال مباشر إلى Department Manager
            </span>
          </div>

          <div className="flex gap-2 border-b border-gray-200 pb-3">
            {[
              { key: 'submit_deliverable', label: '📝 إرسال تاسك ومرفق (Word / Excel / PDF) إلى مدير القسم' },
              { key: 'my_tasks', label: '🎯 مهام وتاسكات الفريق الخاصة' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setTeamLeaderTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${
                  teamLeaderTab === tab.key
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Submit Deliverables & Attachments to Department Manager */}
          {teamLeaderTab === 'submit_deliverable' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-purple-600" />
                  نموذج إرسال وتكليف المهمة والمرفقات لمدير القسم (Department Manager)
                </h3>
                <p className="text-xs text-gray-500 mt-1">أرفق ملفات التيم (Word, Excel, PDF) وسيتم تسليمها تلقائياً لمدير القسم</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-700 block mb-1">عنوان المهمة أو مخرج المشروع</label>
                  <input
                    type="text"
                    placeholder="e.g. تسليم وثيقة معمارية الموقع الإلكتروني ولوحة الإدارة"
                    value={taskTitleInput}
                    onChange={(e) => setTaskTitleInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                  />
                </div>

                <div className="col-span-full">
                  <label className="text-xs font-bold text-gray-700 block mb-1">شرح وتفاصيل التسليم</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب شرحاً مختصراً لما تم إنجازه في هذا التسليم..."
                    value={taskDescInput}
                    onChange={(e) => setTaskDescInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">اسم الملف المرفق (Word / Excel / PDF)</label>
                  <input
                    type="text"
                    placeholder="e.g. Web_Architecture_Specification.docx"
                    value={deliverableFileName}
                    onChange={(e) => setDeliverableFileName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نوع المرفق كـ (Word / Excel / PDF)</label>
                  <select
                    value={deliverableFileType}
                    onChange={(e) => setDeliverableFileType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                  >
                    <option value="word">Word document (.docx / .doc)</option>
                    <option value="excel">Excel spreadsheet (.xlsx / .xls)</option>
                    <option value="pdf">PDF document (.pdf)</option>
                  </select>
                </div>

                <div className="col-span-full flex justify-end">
                  <button
                    onClick={() => {
                      const tType = currentRole === 'Mobile Team Leader' ? 'Mobile Application' :
                                   currentRole === 'Automation Team Leader' ? 'Automation & Data Analysis' : 'Web';
                      handleSaveDeliverable(tType);
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs hover:bg-purple-700 transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
                  >
                    <Send className="w-4 h-4" />
                    إرسال التاسك والمرفق للـ Department Manager
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Team Tasks */}
          {teamLeaderTab === 'my_tasks' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-black text-base text-gray-900">جدول متابعة مهام الفريق الحالية</h3>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{task.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      <span className="text-[10px] text-gray-400 block mt-1">المسؤول: {task.assigneeName} | التسليم: {task.deadline}</span>
                    </div>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-xs font-extrabold">{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CEO EXECUTIVE VIEW                                                    */}
      {/* ========================================================================= */}
      {currentRole === 'CEO' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">المشاريع المكتملة</span>
                <span className="text-2xl font-black text-gray-900">{completedProjects}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">مشاريع قيد التنفيذ</span>
                <span className="text-2xl font-black text-gray-900">{activeProjects}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">مشاريع في خطر</span>
                <span className="text-2xl font-black text-gray-900">{projects.filter(p => p.health === 'At Risk').length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-semibold">مشاريع حرجة جداً</span>
                <span className="text-2xl font-black text-gray-900">{projects.filter(p => p.health === 'Critical').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FILE PREVIEW (Tech Lead / Dept Manager)                           */}
      {/* ========================================================================= */}
      {selectedFileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-3xl shadow-2xl space-y-4 animate-in fade-in zoom-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-red-600" />
                معاينة مستند وداتا المرفق المحول للـ Tech Lead
              </h3>
              <button 
                onClick={() => setSelectedFileModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">اسم صاحب الملف/الرافع:</span>
                <span className="text-xs font-black text-gray-900">{selectedFileModal.teamLeaderName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">الدور/الصفة البرمجية:</span>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-lg text-xs font-black">
                  {selectedFileModal.uploaderRole || selectedFileModal.teamType}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">عنوان المهمة / التسليم:</span>
                <span className="text-xs font-black text-gray-900">{selectedFileModal.taskTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">نوع الملف المرفق:</span>
                {getFileBadge(selectedFileModal.fileType)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">اسم المستند:</span>
                <span className="text-xs font-mono font-bold text-blue-700">{selectedFileModal.fileName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">الحجم والتاريخ:</span>
                <span className="text-xs font-mono text-gray-600">{selectedFileModal.fileSize} | {selectedFileModal.submissionDate}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-500 block mb-1">تفاصيل ووصف المرفق:</span>
                <p className="text-xs text-gray-800 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">{selectedFileModal.description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`تم فتح وتحميل مستند "${selectedFileModal.fileName}" بنجاح.`);
                  setSelectedFileModal(null);
                }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>تحميل المستند (.docx / .xlsx / .pdf)</span>
              </button>
              <button
                onClick={() => {
                  showToast(`تم اعتماد وتوثيق تسليم "${selectedFileModal.taskTitle}" من قبل الـ Tech Lead!`);
                  setSelectedFileModal(null);
                }}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد التسليم</span>
              </button>
              <button
                onClick={() => setSelectedFileModal(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MEMBER EVALUATION (Department Manager)                             */}
      {/* ========================================================================= */}
      {evaluatingMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">تقييم العضو: {evaluatingMember.name}</h3>
              <button onClick={() => setEvaluatingMember(null)} className="w-8 h-8 rounded-full bg-gray-100 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">التقييم بالنجوم (من 1 إلى 5)</label>
                <select
                  value={memberRatingInput}
                  onChange={(e) => setMemberRatingInput(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs font-bold outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) - ممتاز جداً</option>
                  <option value={4.5}>⭐⭐⭐⭐⭐ (4.5/5) - ممتاز</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) - جيد جداً</option>
                  <option value={3.5}>⭐⭐⭐ (3.5/5) - جيد</option>
                  <option value={3}>⭐⭐⭐ (3/5) - متوسط</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">ملاحظات وتقييم الأداء</label>
                <textarea
                  rows={3}
                  value={memberNoteInput}
                  onChange={(e) => setMemberNoteInput(e.target.value)}
                  placeholder="أدخل تقييم الأداء والالتزام بالتسليمات..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleSaveEvaluation}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition"
              >
                حفظ التقييم
              </button>
              <button
                onClick={() => setEvaluatingMember(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevDashboard;
