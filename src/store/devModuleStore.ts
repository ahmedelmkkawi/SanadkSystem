import { create } from 'zustand';

export type DevRole = 'CEO' | 'Tech Lead' | 'Team Manager' | 'Developer' | 'Client' | 'Sales Manager' | 'Sales Employee' | 'Training Manager' | 'Instructor' | 'Student';

export interface ProjectStage {
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  progress: number;
  owner: string;
  startDate: string;
  endDate: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'Active' | 'Completed';
  projectId: string;
}

export interface DevProject {
  id: string;
  name: string;
  clientName: string;
  teamManagerId: string;
  teamManagerName: string;
  techLeadName?: string; // assigned Tech Leader
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Blocked' | 'Code Review' | 'Testing' | 'Done';
  progress: number;
  startDate: string;
  deadline: string;
  budget: number;
  health: 'Healthy' | 'At Risk' | 'Critical';
  template: 'Website' | 'E-Commerce' | 'CRM' | 'ERP' | 'Mobile Application' | 'Landing Page';
  stages: ProjectStage[];
  assignedDevelopers: string[]; // names or IDs
}

export interface Subtask {
  id: string;
  name: string;
  assigneeName: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface TaskFile {
  id: string;
  name: string;
  category: 'Documents' | 'Design' | 'Development' | 'Deployment';
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface WorkLog {
  id: string;
  hours: number;
  description: string;
  date: string;
  developer: string;
}

export interface TransferLog {
  from: string;
  to: string;
  transferredBy: string;
  reason: string;
  date: string;
}

export interface ApprovalLog {
  reviewer: string;
  action: 'Approve' | 'Reject' | 'Request Review';
  comments: string;
  date: string;
}

export interface DevTask {
  id: string;
  projectId: string;
  sprintId: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Blocked' | 'Code Review' | 'Testing' | 'Done';
  assigneeName: string;
  deadline: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  blockedReason?: 'Waiting For Design' | 'Waiting For API' | 'Waiting For Approval' | 'Waiting For Requirements' | 'External Dependency' | 'Other';
  blockedDetails?: string;
  dependencies: string[]; // array of DevTask IDs
  subtasks: Subtask[];
  comments: TaskComment[];
  files: TaskFile[];
  workLogs: WorkLog[];
  transferHistory: TransferLog[];
  approvalHistory: ApprovalLog[];
}

export interface DevTeam {
  id: string;
  name: string;
  type: 'Frontend Team' | 'Backend Team' | 'Full Stack Team' | 'QA Team';
  teamManagerName: string;
  developers: string[]; // developer names
  activeProjectsCount: number;
  completedProjectsCount: number;
}

export interface DevDeveloper {
  id: string;
  name: string;
  role: 'Developer' | 'QA Engineer';
  teamId: string;
  availability: 'Available' | 'On Leave' | 'Busy';
  estimatedHours: number;
  actualHours: number;
}

export interface BugIssue {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  projectId: string;
  projectName: string;
  createdDate: string;
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  projectName: string;
  requestTitle: string;
  description: string;
  costImpact: number;
  timeImpact: string; // e.g. "10 days"
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  dateCreated: string;
}

export interface TechnicalLog {
  id: string;
  user: string;
  dateTime: string;
  action: string;
  entityType: 'Project' | 'Team' | 'Task' | 'Sprint' | 'File' | 'Bug' | 'Change Request';
  entityName: string;
  oldValue: string;
  newValue: string;
}

export interface DevNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  date: string;
  read: boolean;
}

interface DevModuleState {
  currentRole: DevRole;
  projects: DevProject[];
  sprints: Sprint[];
  tasks: DevTask[];
  teams: DevTeam[];
  developers: DevDeveloper[];
  bugs: BugIssue[];
  changeRequests: ChangeRequest[];
  technicalLogs: TechnicalLog[];
  notifications: DevNotification[];
  
  // Actions
  setRole: (role: DevRole) => void;
  
  // Projects
  addProject: (project: Omit<DevProject, 'id' | 'stages' | 'progress' | 'status'>) => void;
  updateProject: (project: DevProject) => void;
  
  // Sprints
  addSprint: (sprint: Omit<Sprint, 'id'>) => void;
  updateSprintStatus: (id: string, status: Sprint['status']) => void;
  
  // Tasks
  addTask: (task: Omit<DevTask, 'id' | 'comments' | 'files' | 'workLogs' | 'transferHistory' | 'approvalHistory' | 'progress' | 'actualHours' | 'dependencies' | 'subtasks'>) => void;
  updateTaskStatus: (taskId: string, status: DevTask['status'], blockedReason?: DevTask['blockedReason'], blockedDetails?: string) => void;
  assignTask: (taskId: string, assigneeName: string) => void;
  transferTask: (taskId: string, newAssignee: string, reason: string) => void;
  approveTaskCompletion: (taskId: string, reviewer: string, comments: string, approved: boolean) => void;
  addSubtask: (taskId: string, name: string, assigneeName: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addTaskComment: (taskId: string, text: string) => void;
  addTaskFile: (taskId: string, file: Omit<TaskFile, 'id' | 'uploadDate' | 'uploadedBy'>) => void;
  addWorkLog: (taskId: string, log: Omit<WorkLog, 'id' | 'date' | 'developer'>) => void;
  deleteTask: (taskId: string) => void;
  
  // Bugs
  addBug: (bug: Omit<BugIssue, 'id' | 'createdDate'>) => void;
  updateBugStatus: (bugId: string, status: BugIssue['status']) => void;
  
  // Change Requests
  addChangeRequest: (cr: Omit<ChangeRequest, 'id' | 'status' | 'dateCreated'>) => void;
  updateChangeRequestStatus: (crId: string, status: ChangeRequest['status']) => void;
  
  // Developers leave
  updateDeveloperAvailability: (devId: string, availability: DevDeveloper['availability']) => void;
  
  // Notifications
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

// Initial Mock Data
const initialProjects: DevProject[] = [
  {
    id: 'proj-1',
    name: 'تطبيق الهواتف الذكية - سندك كاش',
    clientName: 'مجموعة الصاوي العقارية',
    teamManagerId: 'mgr-1',
    teamManagerName: 'طارق حامد',
    techLeadName: 'أنس العمري',
    priority: 'Critical',
    status: 'In Progress',
    progress: 45,
    startDate: '2026-05-10',
    deadline: '2026-08-30',
    budget: 95000,
    health: 'Healthy',
    template: 'Mobile Application',
    assignedDevelopers: ['زياد عمرو', 'ليلى مراد', 'خالد منصور'],
    stages: [
      { name: 'Requirements Analysis', status: 'Completed', progress: 100, owner: 'طارق حامد', startDate: '2026-05-10', endDate: '2026-05-20' },
      { name: 'UI/UX Design', status: 'Completed', progress: 100, owner: 'ليلى مراد', startDate: '2026-05-21', endDate: '2026-06-10' },
      { name: 'Development', status: 'In Progress', progress: 35, owner: 'زياد عمرو', startDate: '2026-06-11', endDate: '2026-08-10' },
      { name: 'Testing', status: 'Not Started', progress: 0, owner: 'خالد منصور', startDate: '2026-08-11', endDate: '2026-08-20' },
      { name: 'Deployment', status: 'Not Started', progress: 0, owner: 'طارق حامد', startDate: '2026-08-21', endDate: '2026-08-25' },
      { name: 'Maintenance', status: 'Not Started', progress: 0, owner: 'زياد عمرو', startDate: '2026-08-26', endDate: '2026-11-26' }
    ]
  },
  {
    id: 'proj-2',
    name: 'الموقع الإلكتروني والمنصة التعليمية',
    clientName: 'النور للاستيراد والتصدير',
    teamManagerId: 'mgr-2',
    teamManagerName: 'رنا سليم',
    techLeadName: 'أنس العمري',
    priority: 'High',
    status: 'In Progress',
    progress: 75,
    startDate: '2026-04-01',
    deadline: '2026-06-28',
    budget: 40000,
    health: 'At Risk',
    template: 'Website',
    assignedDevelopers: ['يوسف شريف', 'سمر صلاح'],
    stages: [
      { name: 'Requirements Analysis', status: 'Completed', progress: 100, owner: 'رنا سليم', startDate: '2026-04-01', endDate: '2026-04-10' },
      { name: 'UI/UX Design', status: 'Completed', progress: 100, owner: 'رنا سليم', startDate: '2026-04-11', endDate: '2026-04-25' },
      { name: 'Development', status: 'Completed', progress: 100, owner: 'يوسف شريف', startDate: '2026-04-26', endDate: '2026-06-05' },
      { name: 'Testing', status: 'In Progress', progress: 50, owner: 'سمر صلاح', startDate: '2026-06-06', endDate: '2026-06-20' },
      { name: 'Deployment', status: 'Not Started', progress: 0, owner: 'رنا سليم', startDate: '2026-06-21', endDate: '2026-06-25' },
      { name: 'Maintenance', status: 'Not Started', progress: 0, owner: 'يوسف شريف', startDate: '2026-06-26', endDate: '2026-09-26' }
    ]
  },
  {
    id: 'proj-3',
    name: 'نظام إدارة علاقات العملاء الداخلي',
    clientName: 'تكنو سوفت',
    teamManagerId: 'mgr-1',
    teamManagerName: 'طارق حامد',
    techLeadName: 'طارق حامد', // Not assigned to Tech Lead أنس العمري
    priority: 'Medium',
    status: 'Blocked',
    progress: 15,
    startDate: '2026-06-01',
    deadline: '2026-09-15',
    budget: 65000,
    health: 'Critical',
    template: 'CRM',
    assignedDevelopers: ['خالد منصور', 'زياد عمرو'],
    stages: [
      { name: 'Requirements Analysis', status: 'Completed', progress: 100, owner: 'طارق حامد', startDate: '2026-06-01', endDate: '2026-06-12' },
      { name: 'UI/UX Design', status: 'In Progress', progress: 20, owner: 'ليلى مراد', startDate: '2026-06-13', endDate: '2026-06-30' },
      { name: 'Development', status: 'Not Started', progress: 0, owner: 'خالد منصور', startDate: '2026-07-01', endDate: '2026-08-30' },
      { name: 'Testing', status: 'Not Started', progress: 0, owner: 'سمر صلاح', startDate: '2026-09-01', endDate: '2026-09-10' },
      { name: 'Deployment', status: 'Not Started', progress: 0, owner: 'طارق حامد', startDate: '2026-09-11', endDate: '2026-09-15' },
      { name: 'Maintenance', status: 'Not Started', progress: 0, owner: 'خالد منصور', startDate: '2026-09-16', endDate: '2026-12-16' }
    ]
  }
];

const initialSprints: Sprint[] = [
  {
    id: 'spr-1',
    name: 'سبرنت التأسيس والـ UI',
    goal: 'تصميم الواجهات وبناء هيكل التطبيق الأساسي',
    startDate: '2026-05-10',
    endDate: '2026-05-30',
    status: 'Completed',
    projectId: 'proj-1'
  },
  {
    id: 'spr-2',
    name: 'سبرنت الحسابات والتحويلات',
    goal: 'ربط واجهات الدفع الخلفية وبناء العمليات المالية الأساسية',
    startDate: '2026-06-01',
    endDate: '2026-06-25',
    status: 'Active',
    projectId: 'proj-1'
  },
  {
    id: 'spr-3',
    name: 'سبرنت الاختبارات النهائية للموقع',
    goal: 'إصلاح جميع ثغرات ومشاكل الموقع وإطلاقه بنجاح',
    startDate: '2026-06-06',
    endDate: '2026-06-22',
    status: 'Active',
    projectId: 'proj-2'
  }
];

const initialDevelopers: DevDeveloper[] = [
  { id: 'dev-1', name: 'زياد عمرو', role: 'Developer', teamId: 'team-1', availability: 'Available', estimatedHours: 120, actualHours: 85 },
  { id: 'dev-2', name: 'ليلى مراد', role: 'Developer', teamId: 'team-4', availability: 'Available', estimatedHours: 80, actualHours: 72 },
  { id: 'dev-3', name: 'خالد منصور', role: 'Developer', teamId: 'team-1', availability: 'On Leave', estimatedHours: 40, actualHours: 40 },
  { id: 'dev-4', name: 'يوسف شريف', role: 'Developer', teamId: 'team-3', availability: 'Busy', estimatedHours: 160, actualHours: 145 },
  { id: 'dev-5', name: 'سمر صلاح', role: 'QA Engineer', teamId: 'team-2', availability: 'Available', estimatedHours: 90, actualHours: 60 }
];

const initialTeams: DevTeam[] = [
  {
    id: 'team-1',
    name: 'فريق التطوير الخلفي - Backend Devs',
    type: 'Backend Team',
    teamManagerName: 'طارق حامد',
    developers: ['زياد عمرو', 'خالد منصور'],
    activeProjectsCount: 2,
    completedProjectsCount: 5
  },
  {
    id: 'team-2',
    name: 'فريق الجودة واختبار البرمجيات - QA Quality',
    type: 'QA Team',
    teamManagerName: 'رنا سليم',
    developers: ['سمر صلاح'],
    activeProjectsCount: 1,
    completedProjectsCount: 8
  },
  {
    id: 'team-3',
    name: 'فريق التطوير الشامل - FullStack Group',
    type: 'Full Stack Team',
    teamManagerName: 'رنا سليم',
    developers: ['يوسف شريف'],
    activeProjectsCount: 1,
    completedProjectsCount: 3
  },
  {
    id: 'team-4',
    name: 'فريق التصاميم والـ UI/UX Design',
    type: 'Frontend Team',
    teamManagerName: 'طارق حامد',
    developers: ['ليلى مراد'],
    activeProjectsCount: 2,
    completedProjectsCount: 10
  }
];

const initialTasks: DevTask[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    sprintId: 'spr-2',
    name: 'تصميم وبناء قاعدة بيانات المعاملات المالية',
    description: 'إنشاء جداول المعاملات والمحافظ وتأمين العمليات الرياضية على مستوى قاعدة البيانات.',
    priority: 'Critical',
    status: 'In Progress',
    assigneeName: 'زياد عمرو',
    deadline: '2026-06-24',
    estimatedHours: 40,
    actualHours: 32,
    progress: 75,
    dependencies: [],
    subtasks: [
      { id: 'sub-1', name: 'تصميم هيكل الجدول (ERD)', assigneeName: 'زياد عمرو', completed: true },
      { id: 'sub-2', name: 'إنشاء الدوال المخزنة (Stored Procedures)', assigneeName: 'زياد عمرو', completed: false }
    ],
    comments: [
      { id: 'c-1', author: 'طارق حامد', text: 'يرجى مراجعة المعايير الأمنية قبل البدء.', date: '2026-06-12 10:00' }
    ],
    files: [
      { id: 'f-1', name: 'schema_v1.png', category: 'Design', size: '320 KB', uploadDate: '2026-06-12', uploadedBy: 'زياد عمرو' }
    ],
    workLogs: [
      { id: 'wl-1', hours: 8, description: 'كتابة وتصميم الجداول الأساسية', date: '2026-06-18', developer: 'زياد عمرو' }
    ],
    transferHistory: [],
    approvalHistory: []
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    sprintId: 'spr-2',
    name: 'برمجة واجهة برمجة تطبيقات تحويل الأموال',
    description: 'تطوير API للتحويل بين الحسابات والتأكد من إرسال الإشعارات الفورية.',
    priority: 'High',
    status: 'Blocked',
    assigneeName: 'زياد عمرو',
    deadline: '2026-06-25',
    estimatedHours: 30,
    actualHours: 5,
    progress: 10,
    blockedReason: 'Waiting For API',
    blockedDetails: 'في انتظار توثيق API الخاص ببوابة الدفع الخارجية من قبل البنك.',
    dependencies: ['task-1'],
    subtasks: [],
    comments: [
      { id: 'c-2', author: 'زياد عمرو', text: 'تم التواصل مع الدعم الفني للبنك وفي انتظار الرد.', date: '2026-06-15 14:30' }
    ],
    files: [],
    workLogs: [],
    transferHistory: [
      { from: 'خالد منصور', to: 'زياد عمرو', transferredBy: 'طارق حامد', reason: 'إجازة المطور خالد منصور الطارئة', date: '2026-06-14' }
    ],
    approvalHistory: []
  },
  {
    id: 'task-3',
    projectId: 'proj-2',
    sprintId: 'spr-3',
    name: 'مراجعة واختبار عملية الدفع الإلكتروني بالموقع',
    description: 'اختبار تكامل سلة المشتريات وبوابة الدفع للتأكد من خلوها من أي مشاكل برمجية.',
    priority: 'Critical',
    status: 'Code Review',
    assigneeName: 'يوسف شريف',
    deadline: '2026-06-20',
    estimatedHours: 24,
    actualHours: 20,
    progress: 90,
    dependencies: [],
    subtasks: [],
    comments: [],
    files: [],
    workLogs: [],
    transferHistory: [],
    approvalHistory: [
      { reviewer: 'يوسف شريف', action: 'Request Review', comments: 'تم الانتهاء ويرجى مراجعة الكود للتأكد من جاهزيته.', date: '2026-06-19' }
    ]
  }
];

const initialBugs: BugIssue[] = [
  {
    id: 'bug-1',
    title: 'تأخر في استجابة شاشة تسجيل الدخول',
    severity: 'High',
    status: 'In Progress',
    assignedTo: 'زياد عمرو',
    projectId: 'proj-1',
    projectName: 'تطبيق الهواتف الذكية - سندك كاش',
    createdDate: '2026-06-15'
  },
  {
    id: 'bug-2',
    title: 'خطأ إملائي في نص واجهة المستخدم الرئيسية',
    severity: 'Low',
    status: 'Resolved',
    assignedTo: 'ليلى مراد',
    projectId: 'proj-1',
    projectName: 'تطبيق الهواتف الذكية - سندك كاش',
    createdDate: '2026-06-18'
  }
];

const initialChangeRequests: ChangeRequest[] = [
  {
    id: 'cr-1',
    projectId: 'proj-1',
    projectName: 'تطبيق الهواتف الذكية - سندك كاش',
    requestTitle: 'إضافة خاصية سحب الأموال عبر المحافظ الإلكترونية المحتلفة',
    description: 'طلب العميل توفير إمكانية سحب الرصيد مباشرة لفودافون كاش واتصالات كاش بدلاً من التحويل البنكي فقط.',
    costImpact: 15000,
    timeImpact: '15 Days',
    status: 'Pending',
    dateCreated: '2026-06-12'
  }
];

const initialLogs: TechnicalLog[] = [
  {
    id: 'log-1',
    user: 'أنس العمري (Tech Lead)',
    dateTime: '2026-06-10 09:30',
    action: 'Project Created',
    entityType: 'Project',
    entityName: 'تطبيق الهواتف الذكية - سندك كاش',
    oldValue: '',
    newValue: 'Mobile Application template initiated with budget 95000.'
  },
  {
    id: 'log-2',
    user: 'طارق حامد (Team Manager)',
    dateTime: '2026-06-14 11:15',
    action: 'Task Assigned',
    entityType: 'Task',
    entityName: 'برمجة واجهة برمجة تطبيقات تحويل الأموال',
    oldValue: 'خالد منصور',
    newValue: 'زياد عمرو'
  }
];

const initialNotifications: DevNotification[] = [
  {
    id: 'n-1',
    title: 'إسناد مهمة جديدة',
    message: 'تم إسناد مهمة "تصميم وبناء قاعدة بيانات المعاملات المالية" إليك.',
    type: 'info',
    date: '2026-06-10T09:40:00',
    read: false
  },
  {
    id: 'n-2',
    title: 'تنبيه: مهمة متأخرة!',
    message: 'المهمة "مراجعة واختبار عملية الدفع الإلكتروني بالموقع" تقترب من الموعد النهائي.',
    type: 'warning',
    date: '2026-06-20T10:00:00',
    read: false
  }
];

const getInitialRole = (): DevRole => {
  const userJson = localStorage.getItem('auth_user');
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      if (user.role) {
        if (user.role === 'Employee') return 'Sales Employee';
        if (user.role === 'Team Leader') return 'Team Manager';
        return user.role as DevRole;
      }
    } catch {
      // Ignore
    }
  }
  return 'Tech Lead';
};

export const useDevModuleStore = create<DevModuleState>((set) => ({
  currentRole: getInitialRole(),
  projects: initialProjects,
  sprints: initialSprints,
  tasks: initialTasks,
  teams: initialTeams,
  developers: initialDevelopers,
  bugs: initialBugs,
  changeRequests: initialChangeRequests,
  technicalLogs: initialLogs,
  notifications: initialNotifications,

  setRole: (role) => set({ currentRole: role }),

  addProject: (proj) => set((state) => {
    // Generate default stages and tasks based on template selection
    const defaultStages: ProjectStage[] = [
      { name: 'Requirements Analysis', status: 'In Progress', progress: 0, owner: proj.teamManagerName, startDate: proj.startDate, endDate: proj.startDate },
      { name: 'UI/UX Design', status: 'Not Started', progress: 0, owner: 'ليلى مراد', startDate: proj.startDate, endDate: proj.deadline },
      { name: 'Development', status: 'Not Started', progress: 0, owner: 'زياد عمرو', startDate: proj.startDate, endDate: proj.deadline },
      { name: 'Testing', status: 'Not Started', progress: 0, owner: 'سمر صلاح', startDate: proj.startDate, endDate: proj.deadline },
      { name: 'Deployment', status: 'Not Started', progress: 0, owner: proj.teamManagerName, startDate: proj.startDate, endDate: proj.deadline },
      { name: 'Maintenance', status: 'Not Started', progress: 0, owner: 'زياد عمرو', startDate: proj.deadline, endDate: proj.deadline }
    ];

    const newId = `proj-${state.projects.length + 1}`;
    const newProj: DevProject = {
      ...proj,
      id: newId,
      progress: 0,
      status: 'To Do',
      stages: defaultStages
    };

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Project Created',
      entityType: 'Project',
      entityName: proj.name,
      oldValue: '',
      newValue: `Selected template: ${proj.template}, Budget: ${proj.budget}`
    };

    // Auto seed some default tasks based on templates
    const seededTasks: DevTask[] = [
      {
        id: `task-gen-${Date.now()}-1`,
        projectId: newId,
        sprintId: '',
        name: `تجهيز وتحليل متطلبات مشروع ${proj.name}`,
        description: `جمع المتطلبات الأساسية ودراسة حالة الاستخدام مع العميل (${proj.clientName}).`,
        priority: 'High',
        status: 'To Do',
        assigneeName: proj.teamManagerName,
        deadline: proj.startDate,
        estimatedHours: 15,
        actualHours: 0,
        progress: 0,
        dependencies: [],
        subtasks: [],
        comments: [],
        files: [],
        workLogs: [],
        transferHistory: [],
        approvalHistory: []
      }
    ];

    return {
      projects: [...state.projects, newProj],
      tasks: [...state.tasks, ...seededTasks],
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  updateProject: (updatedProj) => set((state) => {
    const oldProj = state.projects.find(p => p.id === updatedProj.id);
    
    // BACKEND PERMISSION VALIDATION
    if (state.currentRole === 'Tech Lead') {
      const userJson = localStorage.getItem('auth_user');
      let loggedInName = '';
      if (userJson) {
        try {
          loggedInName = JSON.parse(userJson).name;
        } catch (e) {}
      }
      const cleanLoggedInName = loggedInName.split(' (')[0].trim();
      const cleanProjectTechLead = (oldProj?.techLeadName || '').split(' (')[0].trim();
      
      if (!cleanProjectTechLead || cleanProjectTechLead !== cleanLoggedInName) {
        alert('خطأ في الصلاحيات (الخلفية): لا يمكنك تعديل هذا المشروع لأنه غير مسند إليك كقائد تقني.');
        return {};
      }
    }

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Project Updated',
      entityType: 'Project',
      entityName: updatedProj.name,
      oldValue: oldProj ? oldProj.status : '',
      newValue: updatedProj.status
    };
    return {
      projects: state.projects.map(p => p.id === updatedProj.id ? updatedProj : p),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  addSprint: (sprint) => set((state) => {
    const newSprint: Sprint = {
      ...sprint,
      id: `spr-${state.sprints.length + 1}`
    };
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Sprint Created',
      entityType: 'Sprint',
      entityName: sprint.name,
      oldValue: '',
      newValue: `Status: Planned, Start: ${sprint.startDate}`
    };
    return {
      sprints: [...state.sprints, newSprint],
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  updateSprintStatus: (id, status) => set((state) => {
    const sprName = state.sprints.find(s => s.id === id)?.name || '';
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Sprint Updated',
      entityType: 'Sprint',
      entityName: sprName,
      oldValue: 'Previous Status',
      newValue: status
    };
    return {
      sprints: state.sprints.map(s => s.id === id ? { ...s, status } : s),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  addTask: (task) => set((state) => {
    const newId = `task-${state.tasks.length + 1}`;
    const newTask: DevTask = {
      ...task,
      id: newId,
      actualHours: 0,
      progress: 0,
      dependencies: [],
      subtasks: [],
      comments: [],
      files: [],
      workLogs: [],
      transferHistory: [],
      approvalHistory: []
    };
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Task Created',
      entityType: 'Task',
      entityName: task.name,
      oldValue: '',
      newValue: `Assignee: ${task.assigneeName}, Est Hours: ${task.estimatedHours}`
    };
    return {
      tasks: [newTask, ...state.tasks],
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  updateTaskStatus: (taskId, status, blockedReason, blockedDetails) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    // Validate dependency warning
    if (status === 'Done') {
      const activeDependencies = state.tasks.filter(t => task.dependencies.includes(t.id) && t.status !== 'Done');
      if (activeDependencies.length > 0) {
        alert(`تحذير: لا يمكن إكمال المهمة لوجود مهام معتمدة غير مكتملة: ${activeDependencies.map(d => d.name).join(', ')}`);
        return {};
      }
    }

    const oldStatus = task.status;
    const updatedTask: DevTask = {
      ...task,
      status,
      blockedReason: status === 'Blocked' ? blockedReason : undefined,
      blockedDetails: status === 'Blocked' ? blockedDetails : undefined,
      progress: status === 'Done' ? 100 : task.progress
    };

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Task Status Changed',
      entityType: 'Task',
      entityName: task.name,
      oldValue: oldStatus,
      newValue: status + (status === 'Blocked' ? ` (${blockedReason})` : '')
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  assignTask: (taskId, assigneeName) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const dev = state.developers.find(d => d.name === assigneeName);
    if (dev && dev.availability !== 'Available') {
      alert(`تحذير: المطور ${assigneeName} غير متاح حالياً (الحالة: ${dev.availability === 'On Leave' ? 'في إجازة' : 'مشغول'}).`);
    }

    const oldAssignee = task.assigneeName;
    const updatedTask: DevTask = {
      ...task,
      assigneeName
    };

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Task Assigned',
      entityType: 'Task',
      entityName: task.name,
      oldValue: oldAssignee,
      newValue: assigneeName
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  transferTask: (taskId, newAssignee, reason) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const oldAssignee = task.assigneeName;
    const transfer: TransferLog = {
      from: oldAssignee,
      to: newAssignee,
      transferredBy: 'Team Manager',
      reason,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedTask: DevTask = {
      ...task,
      assigneeName: newAssignee,
      transferHistory: [...task.transferHistory, transfer]
    };

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'Team Manager',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Task Reassigned',
      entityType: 'Task',
      entityName: task.name,
      oldValue: oldAssignee,
      newValue: `${newAssignee} (Reason: ${reason})`
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  approveTaskCompletion: (taskId, reviewer, comments, approved) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const approval: ApprovalLog = {
      reviewer,
      action: approved ? 'Approve' : 'Reject',
      comments,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedTask: DevTask = {
      ...task,
      status: approved ? 'Done' : 'In Progress',
      progress: approved ? 100 : 50,
      approvalHistory: [...task.approvalHistory, approval]
    };

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: reviewer,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Task Approved',
      entityType: 'Task',
      entityName: task.name,
      oldValue: task.status,
      newValue: approved ? 'Done (Approved)' : 'In Progress (Rejected)'
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  addSubtask: (taskId, name, assigneeName) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      name,
      assigneeName,
      completed: false
    };

    const updatedTask = {
      ...task,
      subtasks: [...task.subtasks, newSub]
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
    };
  }),

  toggleSubtask: (taskId, subtaskId) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const updatedSubtasks = task.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
    const completedCount = updatedSubtasks.filter(s => s.completed).length;
    const progress = task.subtasks.length > 0 ? Math.round((completedCount / task.subtasks.length) * 100) : task.progress;

    return {
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, subtasks: updatedSubtasks, progress } : t)
    };
  }),

  addTaskComment: (taskId, text) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      author: 'المستخدم الحالي',
      text,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t)
    };
  }),

  addTaskFile: (taskId, file) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const newFile: TaskFile = {
      ...file,
      id: `f-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'المستخدم الحالي'
    };

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'File Uploaded',
      entityType: 'File',
      entityName: file.name,
      oldValue: '',
      newValue: `Task: ${task.name}, Category: ${file.category}`
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, files: [...t.files, newFile] } : t),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  addWorkLog: (taskId, log) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return {};

    const newLog: WorkLog = {
      ...log,
      id: `wl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      developer: 'المستخدم الحالي'
    };

    const updatedTask = {
      ...task,
      actualHours: task.actualHours + log.hours,
      workLogs: [...task.workLogs, newLog]
    };

    return {
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
    };
  }),

  deleteTask: (taskId) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    const taskName = task ? task.name : '';
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'المستخدم الحالي',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Task Deleted',
      entityType: 'Task',
      entityName: taskName,
      oldValue: 'Existing Task',
      newValue: 'Removed'
    };
    return {
      tasks: state.tasks.filter(t => t.id !== taskId),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  addBug: (bug) => set((state) => {
    const newBug: BugIssue = {
      ...bug,
      id: `bug-${state.bugs.length + 1}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    return {
      bugs: [newBug, ...state.bugs]
    };
  }),

  updateBugStatus: (bugId, status) => set((state) => ({
    bugs: state.bugs.map(b => b.id === bugId ? { ...b, status } : b)
  })),

  addChangeRequest: (cr) => set((state) => {
    const newCR: ChangeRequest = {
      ...cr,
      id: `cr-${state.changeRequests.length + 1}`,
      status: 'Pending',
      dateCreated: new Date().toISOString().split('T')[0]
    };
    return {
      changeRequests: [newCR, ...state.changeRequests]
    };
  }),

  updateChangeRequestStatus: (crId, status) => set((state) => ({
    changeRequests: state.changeRequests.map(cr => cr.id === crId ? { ...cr, status } : cr)
  })),

  updateDeveloperAvailability: (devId, availability) => set((state) => {
    const dev = state.developers.find(d => d.id === devId);
    if (!dev) return {};

    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: 'HR / Manager',
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Developer Updated',
      entityType: 'Team',
      entityName: dev.name,
      oldValue: dev.availability,
      newValue: availability
    };

    return {
      developers: state.developers.map(d => d.id === devId ? { ...d, availability } : d),
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  }))
}));
