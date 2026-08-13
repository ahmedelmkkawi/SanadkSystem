import { create } from 'zustand';

export type DevRole = 
  | 'CEO' 
  | 'Tech Lead' 
  | 'Department Manager' 
  | 'Account Manager' 
  | 'Web Team Leader' 
  | 'Mobile Team Leader' 
  | 'Automation Team Leader' 
  | 'Team Manager' 
  | 'Developer' 
  | 'Client' 
  | 'Sales Manager' 
  | 'Sales Employee' 
  | 'Training Manager' 
  | 'Instructor';

export interface DevInterview {
  id: string;
  candidateName: string;
  candidateRole: string;
  interviewStage: '1st Interview' | '2nd Interview';
  conductedBy: string;
  interviewDate: string;
  notes: string;
  rating: number;
  status: 'Passed' | 'Rejected' | 'Pending Decision';
  sentToTechLead: boolean;
}

export interface DevClientData {
  id: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  projectTitle: string;
  requirements: string;
  submittedBy: string;
  submittedTo: string;
  submissionDate: string;
  status: 'Pending Review' | 'Accepted' | 'In Progress';
  attachedFiles: Array<{
    name: string;
    type: 'word' | 'excel' | 'pdf';
    size: string;
  }>;
}

export interface DevAttendance {
  id: string;
  employeeName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  takenBy: string;
  syncedToTechLead: boolean;
}

export interface DevTeamSubmission {
  id: string;
  teamType: 'Web' | 'Mobile Application' | 'Automation & Data Analysis' | 'Department Management' | 'Client Success';
  teamLeaderName: string;
  uploaderRole?: string;
  taskTitle: string;
  description: string;
  fileName: string;
  fileType: 'word' | 'excel' | 'pdf';
  fileSize: string;
  submissionDate: string;
  submittedTo: string;
  forwardedToTechLead?: boolean;
  forwardedDate?: string;
}

export interface DevDepartmentMember {
  id: string;
  name: string;
  roleTitle: string;
  team: 'Web' | 'Mobile Application' | 'Automation & Data Analysis' | 'Management' | 'Client Success';
  workNature: string;
  rating: number;
  performanceNote?: string;
  attendanceRate: number;
  activeTasks: number;
}

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
  
  // New Programming Department Data
  interviews: DevInterview[];
  clientSubmissions: DevClientData[];
  attendanceRecords: DevAttendance[];
  teamSubmissions: DevTeamSubmission[];
  departmentMembers: DevDepartmentMember[];

  // Actions
  setRole: (role: DevRole) => void;
  
  // Department Actions
  addInterview: (interview: Omit<DevInterview, 'id' | 'sentToTechLead'>) => void;
  addClientData: (data: Omit<DevClientData, 'id' | 'submissionDate' | 'status'>) => void;
  takeAttendance: (records: Array<Omit<DevAttendance, 'id' | 'syncedToTechLead'>>) => void;
  submitTeamDeliverable: (submission: Omit<DevTeamSubmission, 'id' | 'submissionDate'> & { forwardedToTechLead?: boolean }) => void;
  forwardDeliverableToTechLead: (id: string) => void;
  evaluateMember: (id: string, rating: number, note: string) => void;
  
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

const initialInterviews: DevInterview[] = [
  {
    id: 'int-1',
    candidateName: 'أ. خالد التميمي (مجموعة الصاوي العقارية)',
    candidateRole: 'منصة سندك العقارية وبوابة الحجز الفوري',
    interviewStage: '1st Interview',
    conductedBy: 'رانيا مجدي (Account Manager)',
    interviewDate: '2026-08-10',
    notes: 'تم عقد الاجتماع الأول مع العميل وفهم الرؤية العامة للمشروع. العميل يرغب في منصة ويب سريعة جداً تدعم الدفع بالفيزا والمحافظ الإلكترونية، مع إمكانية التوسع لاحقاً لتطبيق موبايل.',
    rating: 5,
    status: 'Passed',
    sentToTechLead: true
  },
  {
    id: 'int-2',
    candidateName: 'د. طارق مراد (شركة تكنو سوفت الشرق الأوسط)',
    candidateRole: 'تطبيق محفظة الدفع الذكية والولاء للمستخدمين',
    interviewStage: '2nd Interview',
    conductedBy: 'د. حاتم الشريف (Department Manager)',
    interviewDate: '2026-08-12',
    notes: 'تم إجراء الاجتماع التقني المعمق الثاني مع العميل والاتفاق على معمارية Clean Architecture وتأمين المعاملات بسيرفرات PostgreSQL مشفرة وتوفير APIs سريعة للاستجابة.',
    rating: 4.8,
    status: 'Passed',
    sentToTechLead: true
  },
  {
    id: 'int-3',
    candidateName: 'م. عمرو حسني (شركة النور للاستيراد)',
    candidateRole: 'سيستم إدارة علاقات العملاء والمبيعات (CRM)',
    interviewStage: '1st Interview',
    conductedBy: 'رانيا مجدي (Account Manager)',
    interviewDate: '2026-08-13',
    notes: 'اجتماع مبدئي لاستكشاف متطلبات الربط مع المخازن وفواتير المبيعات. تم تسجيل الرغبة في نظام تقارير تفاعلي.',
    rating: 4,
    status: 'Pending Decision',
    sentToTechLead: true
  }
];

const initialClientSubmissions: DevClientData[] = [
  {
    id: 'cli-sub-1',
    clientName: 'أ. خالد التميمي',
    companyName: 'مجموعة الصاوي العقارية',
    phone: '+20 100 234 5678',
    email: 'khaled@alsawy.com',
    projectTitle: 'منصة سندك العقارية وبوابة الحجز الفوري',
    requirements: 'مطلوب لوحة تحكم ذكية للعملاء مع دعم بوابات الدفع الإلكتروني وتكامل مع سيستم CRM.',
    submittedBy: 'رانيا مجدي (Account Manager)',
    submittedTo: 'د. حاتم الشريف (Department Manager)',
    submissionDate: '2026-08-11',
    status: 'In Progress',
    attachedFiles: [
      { name: 'Sawy_RealEstate_Specs.docx', type: 'word', size: '2.4 MB' },
      { name: 'Financial_Projections_Budget.xlsx', type: 'excel', size: '1.1 MB' }
    ]
  },
  {
    id: 'cli-sub-2',
    clientName: 'د. طارق مراد',
    companyName: 'شركة تكنو سوفت الشرق الأوسط',
    phone: '+20 111 888 9900',
    email: 'tarek@technosoft.io',
    projectTitle: 'تطبيق محفظة الدفع الذكية والولاء للمستخدمين',
    requirements: 'تطبيق موحد للآيفون والأندرويد للتحويلات المالية الفورية وإرسال إشعارات PUSH.',
    submittedBy: 'رانيا مجدي (Account Manager)',
    submittedTo: 'د. حاتم الشريف (Department Manager)',
    submissionDate: '2026-08-12',
    status: 'Pending Review',
    attachedFiles: [
      { name: 'Payment_App_Scope_Doc.pdf', type: 'pdf', size: '4.8 MB' }
    ]
  }
];

const initialAttendance: DevAttendance[] = [
  {
    id: 'att-1',
    employeeName: 'م. إسلام عادل (Web Team Leader)',
    date: '2026-08-13',
    status: 'Present',
    checkInTime: '08:55 AM',
    checkOutTime: '05:00 PM',
    notes: 'حضور منتظم ومباشرة سبرنت الويب',
    takenBy: 'د. حاتم الشريف (Department Manager)',
    syncedToTechLead: true
  },
  {
    id: 'att-2',
    employeeName: 'م. حسام السيد (Mobile Team Leader)',
    date: '2026-08-13',
    status: 'Present',
    checkInTime: '09:05 AM',
    checkOutTime: '05:30 PM',
    notes: 'حضور ومباشرة بناء النسخة التجريبية للموبايل',
    takenBy: 'د. حاتم الشريف (Department Manager)',
    syncedToTechLead: true
  },
  {
    id: 'att-3',
    employeeName: 'م. دينا فتحي (Automation TL)',
    date: '2026-08-13',
    status: 'Present',
    checkInTime: '09:00 AM',
    checkOutTime: '05:15 PM',
    notes: 'حضور وتنسيق اختبارات الضغط والأوتوميشن',
    takenBy: 'د. حاتم الشريف (Department Manager)',
    syncedToTechLead: true
  },
  {
    id: 'att-4',
    employeeName: 'زياد عمرو (Senior Backend Developer)',
    date: '2026-08-13',
    status: 'Late',
    checkInTime: '09:40 AM',
    notes: 'تأخير بعلم المدير لتسليم شفت مسائي سابق',
    takenBy: 'د. حاتم الشريف (Department Manager)',
    syncedToTechLead: true
  },
  {
    id: 'att-5',
    employeeName: 'ليلى مراد (UI/UX Designer)',
    date: '2026-08-13',
    status: 'Present',
    checkInTime: '08:50 AM',
    notes: 'حضور مبكر',
    takenBy: 'د. حاتم الشريف (Department Manager)',
    syncedToTechLead: true
  }
];

const initialTeamSubmissions: DevTeamSubmission[] = [
  {
    id: 'sub-dept-1',
    teamType: 'Department Management',
    teamLeaderName: 'د. حاتم الشريف (Department Manager)',
    uploaderRole: 'Department Manager',
    taskTitle: 'مستند مراجعة هيكلة سيرفرات وسعة استضافة قسم البرمجة Q3',
    description: 'ملف تقييم احتياجات السيرفرات والبنية التحتية، وتحديد متطلبات توسعة قواعد البيانات والـ Load Balancers.',
    fileName: 'DeptManager_Infrastructure_Review_Q3.pdf',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    submissionDate: '2026-08-13 12:30',
    submittedTo: 'أنس العمري (Tech Lead)',
    forwardedToTechLead: true,
    forwardedDate: '2026-08-13 12:30'
  },
  {
    id: 'sub-acc-1',
    teamType: 'Client Success',
    teamLeaderName: 'رانيا مجدي (Account Manager)',
    uploaderRole: 'Account Manager',
    taskTitle: 'مستند الشروط الفنية والميزانية المقترحة لمشروع مجموعة الصاوي',
    description: 'تفاصيل جدول التسليم المعتمد مع العميل وميزانية مرحلة تطوير منصة الويب وتطبيق الهاتف.',
    fileName: 'Sawy_RealEstate_Specs.docx',
    fileType: 'word',
    fileSize: '2.4 MB',
    submissionDate: '2026-08-13 13:15',
    submittedTo: 'أنس العمري (Tech Lead)',
    forwardedToTechLead: true,
    forwardedDate: '2026-08-13 13:15'
  },
  {
    id: 'sub-web-1',
    teamType: 'Web',
    teamLeaderName: 'م. إسلام عادل (Web Team Leader)',
    uploaderRole: 'Web Team Leader',
    taskTitle: 'تسليم وثيقة معمارية الموقع الإلكتروني ولوحة الإدارة',
    description: 'تم الانتهاء من تخطيط الواجهات الأمامية والربط مع خدمات REST API وتجهيز ملف الشروط.',
    fileName: 'Web_Architecture_Specification.docx',
    fileType: 'word',
    fileSize: '3.5 MB',
    submissionDate: '2026-08-12 14:00',
    submittedTo: 'د. حاتم الشريف (Department Manager)',
    forwardedToTechLead: true,
    forwardedDate: '2026-08-12 15:30'
  },
  {
    id: 'sub-mob-1',
    teamType: 'Mobile Application',
    teamLeaderName: 'م. حسام السيد (Mobile Team Leader)',
    uploaderRole: 'Mobile Team Leader',
    taskTitle: 'تقرير نتائج اختبار أداء تطبيق سندك كاش الموبايل',
    description: 'تقرير شامل باستجابة التطبيق على أجهزة iOS وأندرويد المختلفة واستغلال الذاكرة.',
    fileName: 'Mobile_Performance_Audit_Report.xlsx',
    fileType: 'excel',
    fileSize: '2.1 MB',
    submissionDate: '2026-08-13 10:15',
    submittedTo: 'د. حاتم الشريف (Department Manager)',
    forwardedToTechLead: true,
    forwardedDate: '2026-08-13 11:00'
  },
  {
    id: 'sub-auto-1',
    teamType: 'Automation & Data Analysis',
    teamLeaderName: 'م. دينا فتحي (Automation TL)',
    uploaderRole: 'Automation Team Leader',
    taskTitle: 'سيناريوهات الاختبارات الآلية وتحليلات الأداء',
    description: 'ملف يحتوي على كود وسيناريوهات الفحص التلقائي ونسب النجاح والفشل للـ Endpoints.',
    fileName: 'Automation_Test_Execution_Results.pdf',
    fileType: 'pdf',
    fileSize: '5.2 MB',
    submissionDate: '2026-08-13 11:45',
    submittedTo: 'د. حاتم الشريف (Department Manager)',
    forwardedToTechLead: false
  }
];

const initialDepartmentMembers: DevDepartmentMember[] = [
  {
    id: 'mem-1',
    name: 'أنس العمري',
    roleTitle: 'Tech Lead (الرئيس التقني والقائد العام للبرمجة)',
    team: 'Management',
    workNature: 'الإشراف العام على جميع تفاصيل الموقع، تحديد المعمارية التقنية للأنظمة، مراجعة الكود، واعتماد تسليمات مدير القسم وتيم ليدرز الفرق.',
    rating: 5,
    performanceNote: 'قيادة تقنية ممتازة ورؤية معمارية ثاقبة.',
    attendanceRate: 98,
    activeTasks: 4
  },
  {
    id: 'mem-2',
    name: 'د. حاتم الشريف',
    roleTitle: 'Department Manager (مدير قسم البرمجة)',
    team: 'Management',
    workNature: 'متابعة الشغل وتوزيع المهام، أخذ غياب وحضور أعضاء القسم يومياً، إجراء المقابلة الثانية للمتقدمين، وتقييم أداء الأعضاء وتسليم التقارير للـ Tech Lead.',
    rating: 4.9,
    performanceNote: 'متابعة حثيثة وإدارة دقيقة لكافة فرق القسم.',
    attendanceRate: 99,
    activeTasks: 6
  },
  {
    id: 'mem-3',
    name: 'رانيا مجدي',
    roleTitle: 'Account Manager (مدير الحسابات والتواصل مع العملاء)',
    team: 'Client Success',
    workNature: 'متابعة متطلبات العملاء، إعداد ملفات الشروط وتسليم داتا العملاء لمدير القسم، وإجراء المقابلة الأولى المبدئية وتسليم نتائجها للـ Tech Lead.',
    rating: 4.7,
    performanceNote: 'تواصل راقٍ مع العملاء وانتقاء ممتاز للكوادر.',
    attendanceRate: 95,
    activeTasks: 5
  },
  {
    id: 'mem-4',
    name: 'م. إسلام عادل',
    roleTitle: 'Web Team Leader (قائد فريق تطوير الويب)',
    team: 'Web',
    workNature: 'مسؤول عن تيم الويب الكامل (Frontend React/Next.js & Backend Serverless)، مراجعة كود التيم، وإرسال المرفقات والتاسكات لمدير القسم.',
    rating: 4.8,
    performanceNote: 'التزام تام بالمواعيد وجودة برمجية عالية.',
    attendanceRate: 97,
    activeTasks: 8
  },
  {
    id: 'mem-5',
    name: 'م. حسام السيد',
    roleTitle: 'Mobile Application Team Leader (قائد فريق الموبايل)',
    team: 'Mobile Application',
    workNature: 'مسؤول عن تيم تطبيقات الهواتف الذكية (Flutter, iOS Native, Android)، متابعة المتاجر وتحديثات التطبيق وتسليم الملفات لمدير القسم.',
    rating: 4.7,
    performanceNote: 'سرعة استجابة متميزة وأداء عالي للتطبيقات.',
    attendanceRate: 96,
    activeTasks: 7
  },
  {
    id: 'mem-6',
    name: 'م. دينا فتحي',
    roleTitle: 'Automation & Data Analysis Team Leader (قائد فريق الأوتوميشن وتحليل البيانات)',
    team: 'Automation & Data Analysis',
    workNature: 'مسؤولة عن كود الأوتوميشن، برامج الاختبارات التلقائية، تحليل داتا السيرفرات، وإعداد تقارير الأداء وتصدير ملفات PDF/Excel لمدير القسم.',
    rating: 4.9,
    performanceNote: 'دقة عالية جداً في سيناريوهات الأوتوميشن وتحليل البيانات.',
    attendanceRate: 98,
    activeTasks: 6
  },
  {
    id: 'mem-7',
    name: 'زياد عمرو',
    roleTitle: 'Senior Backend Developer (مطور قواعد بيانات وسيرفرات)',
    team: 'Web',
    workNature: 'بناء الـ APIs وتصميم قواعد البيانات الضخمة (PostgreSQL & Node.js)، وحل المشاكل التقنية والمعقدة.',
    rating: 4.6,
    performanceNote: 'خبرة قوية في الـ Backend وتأمين البيانات.',
    attendanceRate: 92,
    activeTasks: 5
  },
  {
    id: 'mem-8',
    name: 'ليلى مراد',
    roleTitle: 'UI/UX & Frontend Designer (مصممة مطورة واجهات)',
    team: 'Web',
    workNature: 'تصميم تجربة واجهة المستخدم وإعداد الفيجما وتحويلها إلى عناصر برمجية تفاعلية بـ React و Tailwind.',
    rating: 4.8,
    performanceNote: 'تصاميم جذابة وعصرية تمنح تجربة فخمة للمستخدم.',
    attendanceRate: 96,
    activeTasks: 4
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
  
  // Department Data State
  interviews: initialInterviews,
  clientSubmissions: initialClientSubmissions,
  attendanceRecords: initialAttendance,
  teamSubmissions: initialTeamSubmissions,
  departmentMembers: initialDepartmentMembers,

  setRole: (role) => set({ currentRole: role }),

  // Department Actions
  addInterview: (interviewData) => set((state) => {
    const newInterview: DevInterview = {
      ...interviewData,
      id: `int-${Date.now()}`,
      sentToTechLead: true
    };
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: interviewData.conductedBy,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Interview Recorded',
      entityType: 'Project',
      entityName: interviewData.candidateName,
      oldValue: interviewData.interviewStage,
      newValue: `Status: ${interviewData.status}, Rating: ${interviewData.rating}`
    };
    return {
      interviews: [newInterview, ...state.interviews],
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  addClientData: (data) => set((state) => {
    const newClientData: DevClientData = {
      ...data,
      id: `cli-sub-${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: data.submittedBy,
      dateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: 'Client Data Handed Over',
      entityType: 'Project',
      entityName: data.clientName,
      oldValue: '',
      newValue: `Project: ${data.projectTitle}`
    };
    return {
      clientSubmissions: [newClientData, ...state.clientSubmissions],
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  takeAttendance: (records) => set((state) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecords: DevAttendance[] = records.map(r => ({
      ...r,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: r.date || today,
      syncedToTechLead: true
    }));

    // Filter out existing records for today for these employees and append new ones
    const filteredExisting = state.attendanceRecords.filter(
      existing => !(existing.date === today && records.some(r => r.employeeName === existing.employeeName))
    );

    return {
      attendanceRecords: [...newRecords, ...filteredExisting]
    };
  }),

  submitTeamDeliverable: (submission) => set((state) => {
    const isForwarded = submission.forwardedToTechLead ?? false;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newSub: DevTeamSubmission = {
      ...submission,
      id: `sub-${submission.teamType.toLowerCase().substring(0, 3)}-${Date.now()}`,
      submissionDate: nowStr,
      forwardedToTechLead: isForwarded,
      forwardedDate: isForwarded ? nowStr : undefined
    };
    const newLog: TechnicalLog = {
      id: `log-${Date.now()}`,
      user: submission.teamLeaderName,
      dateTime: nowStr,
      action: 'Deliverable File Uploaded',
      entityType: 'File',
      entityName: submission.fileName,
      oldValue: submission.teamType,
      newValue: submission.taskTitle
    };
    return {
      teamSubmissions: [newSub, ...state.teamSubmissions],
      technicalLogs: [newLog, ...state.technicalLogs]
    };
  }),

  forwardDeliverableToTechLead: (id) => set((state) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    return {
      teamSubmissions: state.teamSubmissions.map(s => 
        s.id === id ? { ...s, forwardedToTechLead: true, forwardedDate: nowStr } : s
      )
    };
  }),

  evaluateMember: (id, rating, note) => set((state) => ({
    departmentMembers: state.departmentMembers.map(m => 
      m.id === id ? { ...m, rating, performanceNote: note } : m
    )
  })),

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
