import { create } from 'zustand';

// Types Definitions
export type UserRole = 'CEO' | 'Head' | 'Team Leader' | 'Employee';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  source: string;
  governorate: string;
  status: 'New' | 'Contacted' | 'Follow Up' | 'Meeting' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  notes: string;
  dateCreated: string;
  assignedTo?: string; // Sales Agent Name or ID
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignee: string; // Employee Name
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
}

export interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: number;
  delayMinutes: number;
  status?: 'Present' | 'Late' | 'Absent';
}

export interface LeaveRequest {
  id: string;
  type: string;
  fromDate: string;
  toDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  directManager: string;
  hireDate: string;
  salary: number;
  email: string;
  phone?: string;
  address?: string;
  username?: string;
  role?: string;
  status?: string;
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
}

export interface KPIItem {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage, e.g. 25
  target: number;
  actual: number;
  type: 'Number' | 'Percentage' | 'Currency' | 'Rating' | 'Boolean';
  source: 'Manual' | 'CRM' | 'Tasks' | 'Finance' | 'Attendance';
  selfScore?: number;
  managerScore?: number;
  finalScore?: number;
}

export interface KPITemplate {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  period: string; // e.g., "Q2 2026"
  items: KPIItem[];
}

export interface FinancialRecord {
  id: string;
  type: 'Revenue' | 'Expense' | 'Receipt' | 'Payment' | 'Transfer';
  category: string;
  title: string;
  amount: number;
  date: string;
  department?: string;
  account?: string;
  paymentMethod?: 'Cash' | 'InstaPay' | 'Bank Transfer' | 'E-Wallet' | 'Check' | string;
  transactionRef?: string;
  bankName?: string;
  walletType?: string;
  senderDetails?: string;
  projectId?: string;
  projectName?: string;
  customerName?: string;
  supplierName?: string;
  contractNumber?: string;
  invoiceId?: string;
  status?: 'Completed' | 'Pending' | 'Overdue' | 'Cancelled';
  totalInvoicedAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  dueDate?: string;
  collectionStatus?: 'Full' | 'Partial' | 'Credit' | string;
  attachments?: string[];
  recordedBy?: string;
  createdAt?: string;
  debit?: number;
  credit?: number;
  balance?: number;
}

export interface BonusRecord {
  id: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  amount: number;
  bonusType: 'حافز أداء ممتاز' | 'مكافأة تميز' | 'عمولة مبيعات' | 'بدل إضافي واجتهاد' | string;
  date: string;
  reason: string;
  approvedBy: string;
  status: 'Approved' | 'Disbursed' | 'Pending';
}

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  platform: string[];
  goal: string;
  status: 'Active' | 'Paused' | 'Completed';
  assignee: string;
  reach: number;
  clicks: number;
  leads: number;
  revenueGenerated: number;
  description?: string;
  notes?: string;
  roas?: number;
  roi?: number;
  viewAttendance?: number;
}

export interface LeadDeleteRequest {
  id: string;
  leadId: string;
  leadName: string;
  requestedBy: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  actionType: string;
  performedBy: string;
  timestamp: string;
  affectedEntity: 'lead' | 'campaign' | 'user' | 'attendance' | 'other';
  details?: string;
}

export interface SystemFile {
  id: string;
  name: string;
  category: 'Contracts' | 'Proposals' | 'Client Files' | 'Employee Files';
  size: string;
  uploadDate: string;
  type: string;
}

export interface UploadedReport {
  id: string;
  fileName: string;
  fileSize: string;
  uploaderName: string;
  department: string;
  uploadTime: string; // Server Time
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'client';
  text: string;
  time: string;
}

export interface ChatSession {
  id: string;
  clientName: string;
  clientPhone: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

interface AppState {
  currentRole: UserRole;
  leads: Lead[];
  tasks: Task[];
  employees: Employee[];
  kpiTemplates: KPITemplate[];
  financeRecords: FinancialRecord[];
  bonusRecords: BonusRecord[];
  campaigns: Campaign[];
  files: SystemFile[];
  notifications: Notification[];
  chats: ChatSession[];
  deleteRequests: LeadDeleteRequest[];
  activityLogs: ActivityLog[];
  uploadedReports: UploadedReport[];
  
  // Actions
  setRole: (role: UserRole) => void;
  addLead: (lead: Omit<Lead, 'id' | 'dateCreated'>, byUser?: string) => void;
  updateLead: (lead: Lead, byUser?: string) => void;
  deleteLead: (id: string, byUser?: string) => void;
  importLeads: (leads: Omit<Lead, 'id' | 'dateCreated'>[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'attendance' | 'leaves'>) => void;
  updateEmployee: (employee: Employee) => void;
  addAttendance: (empId: string, record: AttendanceRecord) => void;
  serverCheckIn: (empId: string) => { success: boolean; message: string };
  serverCheckOut: (empId: string) => { success: boolean; message: string };
  addLeaveRequest: (empId: string, request: Omit<LeaveRequest, 'id'>) => void;
  updateLeaveStatus: (empId: string, requestId: string, status: 'Approved' | 'Rejected') => void;
  addKpiTemplate: (template: KPITemplate) => void;
  updateKpiItemScore: (templateId: string, itemId: string, scores: Partial<Pick<KPIItem, 'selfScore' | 'managerScore' | 'finalScore'>>) => void;
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  updateFinancialRecord: (record: FinancialRecord) => void;
  deleteFinancialRecord: (id: string) => void;
  addBonusRecord: (bonus: Omit<BonusRecord, 'id'>) => void;
  updateBonusRecord: (bonus: BonusRecord) => void;
  disburseBonusRecord: (id: string) => void;
  deleteBonusRecord: (id: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'reach' | 'clicks' | 'leads' | 'revenueGenerated'>, byUser?: string) => void;
  updateCampaign: (campaign: Campaign, byUser?: string) => void;
  addFile: (file: Omit<SystemFile, 'id' | 'uploadDate'>) => void;
  deleteFile: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendChatMessage: (chatId: string, text: string) => void;
  assignLead: (leadId: string, agentName: string) => void;
  autoAssignLeads: (rule: 'workload' | 'performance' | 'location') => void;
  
  addUploadedReport: (report: Omit<UploadedReport, 'id' | 'uploadTime'>) => void;
  deleteUploadedReport: (id: string) => void;
  
  // Deletion requests actions
  requestDeleteLead: (leadId: string, leadName: string, requestedBy: string, reason: string) => void;
  cancelDeleteRequest: (requestId: string, byUser: string) => void;
  approveDeleteRequest: (requestId: string, byUser: string) => void;
  rejectDeleteRequest: (requestId: string, byUser: string) => void;
  
  // Logging action
  addActivityLog: (actionType: string, performedBy: string, affectedEntity: 'lead' | 'campaign' | 'user' | 'attendance' | 'other', details?: string) => void;
}

// Initial Mock Data
const mockLeads: Lead[] = [
  { id: '1', name: 'أحمد علي محمد', phone: '+20 1012345678', email: 'ahmed.ali@gmail.com', company: 'النور للاستيراد والتصدير', jobTitle: 'مدير المشتريات', source: 'Facebook Ads', governorate: 'القاهرة', status: 'New', notes: 'مهتم بالخدمات اللوجستية ويطلب عرض سعر.', dateCreated: '2026-06-10', assignedTo: '' },
  { id: '2', name: 'سارة خالد محمود', phone: '+20 1198765432', email: 'sara.khalid@gmail.com', company: 'تكنو سوفت', jobTitle: 'رئيس قسم الموارد البشرية', source: 'Google Ads', governorate: 'الجيزة', status: 'Contacted', notes: 'تم التواصل معها وطلب تفاصيل حول نظام إدارة الموظفين.', dateCreated: '2026-06-11', assignedTo: 'محمد حسن (Employee)' },
  { id: '3', name: 'محمد عبد الرحمن', phone: '+20 1234567890', email: 'm.abdulrahman@yahoo.com', company: 'ريد للمقاولات', jobTitle: 'المدير العام', source: 'Website Forms', governorate: 'الإسكندرية', status: 'Proposal Sent', notes: 'تم إرسال العرض المالي والفني وفي انتظار الرد.', dateCreated: '2026-06-08', assignedTo: '' },
  { id: '4', name: 'ليلى يوسف خليل', phone: '+20 1599988877', email: 'laila.youssef@outlook.com', company: 'ستار فودز', jobTitle: 'مديرة التسويق', source: 'WhatsApp Messages', governorate: 'القليوبية', status: 'Negotiation', notes: 'تفاوض على السعر النهائي وعدد الحسابات المطلوبة للموظفين.', dateCreated: '2026-06-05', assignedTo: 'محمد حسن (Employee)' },
  { id: '5', name: 'محمود الصاوي', phone: '+20 1022233344', email: 'm.sawi@sawi-group.com', company: 'مجموعة الصاوي العقارية', jobTitle: 'الرئيس التنفيذي', source: 'Landing Pages', governorate: 'الغربية', status: 'Won', notes: 'تم توقيع العقد وبدء مرحلة الإعداد والتنفيذ.', dateCreated: '2026-06-01', assignedTo: '' }
];

const mockTasks: Task[] = [
  { id: '1', name: 'تجهيز عرض السعر لشركة النور', description: 'إعداد ملف PDF متكامل بالأسعار والخدمات المطلوبة وإرساله للإيميل الخاص بهم.', priority: 'High', dueDate: '2026-06-15', assignee: 'أحمد علي محمد', status: 'In Progress' },
  { id: '2', name: 'مراجعة الميزانية التسويقية لشهر مايو', description: 'تحليل أداء الحملات ومطابقتها مع الإيرادات المحققة وحساب العائد على الاستثمار.', priority: 'Medium', dueDate: '2026-06-18', assignee: 'ياسر جلال', status: 'To Do' },
  { id: '3', name: 'تحديث عقود الموظفين الجدد', description: 'إضافة بنود العمل عن بعد وتحديث المرتبات والبدلات وتجهيزها للتوقيع.', priority: 'Low', dueDate: '2026-06-20', assignee: 'سارة خالد محمود', status: 'Review' },
  { id: '4', name: 'حل مشكلة تسجيل الحضور اليومي للموظفين', description: 'إصلاح الخلل في نظام الـ Check In التلقائي عبر تطبيق الجوال الخاص بالنظام.', priority: 'High', dueDate: '2026-06-12', assignee: 'كريم ممدوح', status: 'Completed' },
  { id: '5', name: 'إعداد تقرير أداء الـ KPIs للربع الأول', description: 'جمع تقييمات الموظفين وإصدار الدرجات النهائية والتقرير العام لمجلس الإدارة.', priority: 'High', dueDate: '2026-06-10', assignee: 'أحمد علي محمد', status: 'Cancelled' }
];

const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'محمود عبد السلام',
    department: 'المبيعات',
    jobTitle: 'مدير حسابات العملاء',
    directManager: 'ياسر جلال',
    hireDate: '2025-01-15',
    salary: 12000,
    email: 'm.abdelsalam@crm.com',
    attendance: [
      { date: '2026-06-11', checkIn: '09:00', checkOut: '17:00', workingHours: 8, delayMinutes: 0 },
      { date: '2026-06-12', checkIn: '09:15', checkOut: '17:30', workingHours: 8.25, delayMinutes: 15 },
      { date: '2026-06-13', checkIn: '08:55', checkOut: '17:00', workingHours: 8.08, delayMinutes: 0 },
    ],
    leaves: [
      { id: 'lv1', type: 'إجازة عارضة', fromDate: '2026-06-25', toDate: '2026-06-26', status: 'Pending' }
    ]
  },
  {
    id: 'emp2',
    name: 'دينا الشافعي',
    department: 'التسويق',
    jobTitle: 'أخصائي حملات إعلانية',
    directManager: 'ياسر جلال',
    hireDate: '2025-03-01',
    salary: 10000,
    email: 'dina.shafik@crm.com',
    attendance: [
      { date: '2026-06-11', checkIn: '09:05', checkOut: '17:00', workingHours: 7.9, delayMinutes: 5 },
      { date: '2026-06-12', checkIn: '09:00', checkOut: '17:00', workingHours: 8, delayMinutes: 0 },
      { date: '2026-06-13', checkIn: '09:30', checkOut: '17:00', workingHours: 7.5, delayMinutes: 30 },
    ],
    leaves: [
      { id: 'lv2', type: 'إجازة سنوية', fromDate: '2026-05-10', toDate: '2026-05-15', status: 'Approved' }
    ]
  },
  {
    id: 'emp3',
    name: 'شريف النجار',
    department: 'الموارد البشرية',
    jobTitle: 'مسؤول شؤون الموظفين',
    directManager: 'أحمد علي محمد (المدير العام)',
    hireDate: '2024-06-01',
    salary: 9500,
    email: 'sherif.naggar@crm.com',
    attendance: [
      { date: '2026-06-11', checkIn: '08:45', checkOut: '17:00', workingHours: 8.25, delayMinutes: 0 },
      { date: '2026-06-12', checkIn: '08:50', checkOut: '17:00', workingHours: 8.16, delayMinutes: 0 },
      { date: '2026-06-13', checkIn: '08:58', checkOut: '17:00', workingHours: 8.03, delayMinutes: 0 },
    ],
    leaves: []
  }
];

const mockKpiTemplates: KPITemplate[] = [
  {
    id: 'tpl1',
    name: 'تقييم الربع الثاني لقسم المبيعات',
    department: 'المبيعات',
    jobTitle: 'مدير حسابات العملاء',
    period: 'Q2 2026',
    items: [
      { id: 'kpi_it1', name: 'تحقيق المبيعات المستهدفة', description: 'الوصول إلى الحجم المالي المستهدف للمبيعات الجديدة.', weight: 40, target: 150000, actual: 125000, type: 'Currency', source: 'CRM', selfScore: 8, managerScore: 7, finalScore: 7.5 },
      { id: 'kpi_it2', name: 'تطوير قاعدة العملاء', description: 'تحويل عملاء محتملين جدد إلى مشترين فعليين.', weight: 30, target: 20, actual: 18, type: 'Number', source: 'CRM', selfScore: 9, managerScore: 8, finalScore: 8.5 },
      { id: 'kpi_it3', name: 'التسليم وإنهاء المهام', description: 'إتمام المهام البيانية والمتابعات في الموعد المحدد.', weight: 20, target: 95, actual: 92, type: 'Percentage', source: 'Tasks', selfScore: 9, managerScore: 9, finalScore: 9 },
      { id: 'kpi_it4', name: 'ساعات الانضباط والحضور', description: 'الالتزام بمواعيد الدوام الرسمية وعدم تسجيل ساعات تأخير.', weight: 10, target: 98, actual: 95, type: 'Percentage', source: 'Attendance', selfScore: 10, managerScore: 9, finalScore: 9.5 }
    ]
  }
];

const mockFinanceRecords: FinancialRecord[] = [
  {
    id: 'fin1',
    type: 'Revenue',
    category: 'Contract',
    title: 'عقد توريد برمجيات وتطبيقات - النور للاستيراد',
    amount: 45000,
    date: '2026-06-01',
    department: 'SoftwareDevelopment',
    account: 'الحساب البنكي الرئيسي - CIB',
    projectId: 'proj-2',
    projectName: 'الموقع الإلكتروني والمنصة التعليمية',
    customerName: 'النور للاستيراد والتصدير',
    status: 'Completed',
    debit: 0,
    credit: 45000,
    balance: 145000,
    invoiceId: 'INV-2026-001',
    dueDate: '2026-06-01',
    paidAmount: 45000,
    remainingAmount: 0
  },
  {
    id: 'fin2',
    type: 'Revenue',
    category: 'Subscription',
    title: 'اشتراك شهري نظام CRM سحابي - ريد للمقاولات',
    amount: 3500,
    date: '2026-06-05',
    department: 'Sales',
    account: 'محفظة فودافون كاش التجارية',
    customerName: 'ريد للمقاولات والهندسة',
    status: 'Completed',
    debit: 0,
    credit: 3500,
    balance: 148500,
    invoiceId: 'INV-2026-002',
    dueDate: '2026-06-05',
    paidAmount: 3500,
    remainingAmount: 0
  },
  {
    id: 'fin3',
    type: 'Revenue',
    category: 'Payment',
    title: 'دفعة ثانية استشارات تسويقية - شركة ستار فودز',
    amount: 12000,
    date: '2026-06-10',
    department: 'Marketing',
    account: 'الحساب البنكي الرئيسي - CIB',
    customerName: 'شركة ستار فودز',
    status: 'Completed',
    debit: 0,
    credit: 12000,
    balance: 160500,
    invoiceId: 'INV-2026-003',
    dueDate: '2026-06-10',
    paidAmount: 12000,
    remainingAmount: 0
  },
  {
    id: 'fin4',
    type: 'Expense',
    category: 'Salary',
    title: 'مرتبات الموظفين والمطورين لشهر مايو',
    amount: 31500,
    date: '2026-05-30',
    department: 'HR',
    account: 'الحساب البنكي الرئيسي - CIB',
    supplierName: 'إدارة الموارد البشرية والرواتب',
    status: 'Completed',
    debit: 31500,
    credit: 0,
    balance: 129000,
    invoiceId: 'PAY-2026-010',
    dueDate: '2026-05-30',
    paidAmount: 31500,
    remainingAmount: 0
  },
  {
    id: 'fin5',
    type: 'Expense',
    category: 'Ads',
    title: 'تمويل إعلانات فيسبوك وجوجل - مبيعات الربع الثاني',
    amount: 8000,
    date: '2026-06-03',
    department: 'Marketing',
    account: 'بطاقة ائتمان الشركة المباشرة',
    supplierName: 'Google Ads & Meta Inc',
    status: 'Completed',
    debit: 8000,
    credit: 0,
    balance: 121000,
    invoiceId: 'PAY-2026-011',
    dueDate: '2026-06-03',
    paidAmount: 8000,
    remainingAmount: 0
  },
  {
    id: 'fin6',
    type: 'Expense',
    category: 'Tools',
    title: 'اشتراكات سحابية وبرامج Zoom / Slack / Figma',
    amount: 1500,
    date: '2026-06-07',
    department: 'SoftwareDevelopment',
    account: 'بطاقة ائتمان الشركة المباشرة',
    projectId: 'proj-1',
    projectName: 'تطبيق الهواتف الذكية - سندك كاش',
    supplierName: 'Slack & Figma Inc',
    status: 'Completed',
    debit: 1500,
    credit: 0,
    balance: 119500,
    invoiceId: 'PAY-2026-012',
    dueDate: '2026-06-07',
    paidAmount: 1500,
    remainingAmount: 0
  },
  {
    id: 'fin7',
    type: 'Expense',
    category: 'Operations',
    title: 'إيجار المقر الإداري الشهري للشركة',
    amount: 10000,
    date: '2026-06-01',
    department: 'Administration',
    account: 'شيك بنكي مقبول الدفع',
    supplierName: 'شركة القاهرة للاستثمار العقاري',
    status: 'Completed',
    debit: 10000,
    credit: 0,
    balance: 109500,
    invoiceId: 'PAY-2026-013',
    dueDate: '2026-06-01',
    paidAmount: 10000,
    remainingAmount: 0
  },
  {
    id: 'fin8',
    type: 'Expense',
    category: 'Bills',
    title: 'فاتورة الكهرباء والإنترنت للمقر الإداري',
    amount: 2200,
    date: '2026-06-08',
    department: 'Administration',
    account: 'الخزينة النقدية الرئيسية',
    supplierName: 'شركة الكهرباء والمصرية للاتصالات',
    status: 'Completed',
    debit: 2200,
    credit: 0,
    balance: 107300,
    invoiceId: 'PAY-2026-014',
    dueDate: '2026-06-08',
    paidAmount: 2200,
    remainingAmount: 0
  },
  {
    id: 'fin9',
    type: 'Revenue',
    category: 'Contract',
    title: 'دفعة مقدمة - تطبيق الهواتف الذكية (سندك كاش)',
    amount: 42500,
    date: '2026-05-15',
    department: 'SoftwareDevelopment',
    account: 'الحساب البنكي الرئيسي - CIB',
    projectId: 'proj-1',
    projectName: 'تطبيق الهواتف الذكية - سندك كاش',
    customerName: 'مجموعة الصاوي العقارية',
    status: 'Completed',
    debit: 0,
    credit: 42500,
    balance: 149800,
    invoiceId: 'INV-2026-004',
    dueDate: '2026-05-15',
    paidAmount: 42500,
    remainingAmount: 52500
  },
  {
    id: 'fin10',
    type: 'Revenue',
    category: 'Subscription',
    title: 'رسوم التحاق الدفعة الصيفية - برنامج الدبلوم البرمجي',
    amount: 18500,
    date: '2026-06-12',
    department: 'Training',
    account: 'الخزينة النقدية الرئيسية',
    customerName: 'طلاب الدفعة الصيفية المتدربين',
    status: 'Completed',
    debit: 0,
    credit: 18500,
    balance: 168300,
    invoiceId: 'INV-2026-005',
    dueDate: '2026-06-12',
    paidAmount: 18500,
    remainingAmount: 0
  },
  {
    id: 'fin11',
    type: 'Expense',
    category: 'Salary',
    title: 'مكافآت وتكاليف المحاضرين الخارجيين - قسم التدريب',
    amount: 6500,
    date: '2026-06-14',
    department: 'Training',
    account: 'محفظة فودافون كاش التجارية',
    supplierName: 'محاضري الدورة التدريبية',
    status: 'Completed',
    debit: 6500,
    credit: 0,
    balance: 161800,
    invoiceId: 'PAY-2026-015',
    dueDate: '2026-06-14',
    paidAmount: 6500,
    remainingAmount: 0
  },
  {
    id: 'fin12',
    type: 'Receipt',
    category: 'Payment',
    title: 'مستحق آجل متأخر - توريد معدات وحلول برمجية',
    amount: 25000,
    date: '2026-05-20',
    department: 'SoftwareDevelopment',
    account: 'الحساب البنكي الرئيسي - CIB',
    customerName: 'مؤسسة الشروق الهندسية',
    status: 'Overdue',
    debit: 0,
    credit: 25000,
    balance: 161800,
    invoiceId: 'INV-2026-006',
    dueDate: '2026-06-01',
    paidAmount: 5000,
    remainingAmount: 20000
  },
  {
    id: 'fin13',
    type: 'Payment',
    category: 'Tools',
    title: 'مستحق للمورد - شراء أجهزة سيرفرات وتجهيزات قاعات التدريب',
    amount: 14000,
    date: '2026-05-25',
    department: 'Training',
    account: 'شيك بنكي مقبول الدفع',
    supplierName: 'شركة التكنولوجيا الرقمية للمعدات',
    status: 'Pending',
    debit: 14000,
    credit: 0,
    balance: 161800,
    invoiceId: 'PAY-2026-016',
    dueDate: '2026-06-25',
    paidAmount: 4000,
    remainingAmount: 10000
  }
];

const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'حملة ترويج نظام الـ CRM للمؤسسات', budget: 5000, platform: ['Facebook'], goal: 'Leads Generation', status: 'Active', assignee: 'دينا الشافعي', reach: 65000, clicks: 3200, leads: 145, revenueGenerated: 35000, roas: 7.0, roi: 600, viewAttendance: 12000 },
  { id: 'c2', name: 'حملة البحث وجوجل إعلانات Lead Gen', budget: 4000, platform: ['Google Ads'], goal: 'Sales Conversion', status: 'Active', assignee: 'دينا الشافعي', reach: 45000, clicks: 5100, leads: 180, revenueGenerated: 54000, roas: 13.5, roi: 1250, viewAttendance: 8500 },
  { id: 'c3', name: 'حملة توعية وإطلاق هوية سندك', budget: 3000, platform: ['TikTok'], goal: 'Reach & Views', status: 'Completed', assignee: 'شريف النجار', reach: 180000, clicks: 12500, leads: 40, revenueGenerated: 12000, roas: 4.0, roi: 300, viewAttendance: 45000 },
  { id: 'c4', name: 'توسعات السوق الخليجي عقارات', budget: 6000, platform: ['Snapchat'], goal: 'App Installs', status: 'Paused', assignee: 'دينا الشافعي', reach: 90000, clicks: 4300, leads: 75, revenueGenerated: 18000, roas: 3.0, roi: 200, viewAttendance: 15000 }
];

const mockFiles: SystemFile[] = [
  { id: 'f1', name: 'عقد توريد برمجيات النور.pdf', category: 'Contracts', size: '2.4 MB', uploadDate: '2026-06-01', type: 'pdf' },
  { id: 'f2', name: 'العرض الفني والمالي - ريد للمقاولات.docx', category: 'Proposals', size: '1.8 MB', uploadDate: '2026-06-08', type: 'docx' },
  { id: 'f3', name: 'صور الهوية التجارية - لوجو سندك.zip', category: 'Client Files', size: '15.5 MB', uploadDate: '2026-06-11', type: 'zip' },
  { id: 'f4', name: 'مسوغات تعيين الموظف محمود عبد السلام.pdf', category: 'Employee Files', size: '4.2 MB', uploadDate: '2026-01-15', type: 'pdf' }
];

const mockUploadedReports: UploadedReport[] = [
  { id: 'rep-1', fileName: 'تقرير المبيعات والعملاء لشهر مايو.pdf', fileSize: '1.2 MB', uploaderName: 'محمود عبد السلام', department: 'المبيعات', uploadTime: '2026-06-18 10:15:30' },
  { id: 'rep-2', fileName: 'خطة الحملات التسويقية لشهر يونيو.pdf', fileSize: '2.4 MB', uploaderName: 'دينا الشافعي', department: 'التسويق', uploadTime: '2026-06-18 11:45:12' }
];

const mockNotifications: Notification[] = [
  { id: 'n1', title: 'عميل محتمل جديد', message: 'سجل العميل "أحمد علي محمد" اهتمامه عبر إعلانات فيسبوك.', type: 'info', date: '2026-06-13T17:45:00', read: false },
  { id: 'n2', title: 'مهمة متأخرة!', message: 'المهمة "تجهيز عرض السعر لشركة النور" تجاوزت موعد التسليم المحدد.', type: 'danger', date: '2026-06-13T16:00:00', read: false },
  { id: 'n3', title: 'طلب إجازة جديد', message: 'قدم الموظف "محمود عبد السلام" طلب إجازة عارضة ليومين.', type: 'warning', date: '2026-06-12T11:30:00', read: true },
  { id: 'n4', title: 'متابعة مستحقة للعميل', message: 'يحين موعد الاتصال بالعميل "ليلى يوسف خليل" لمناقشة العقد.', type: 'info', date: '2026-06-13T10:15:00', read: false },
  { id: 'n5', title: 'تسجيل مصروف جديد', message: 'سجل المحاسب "سارة خالد" مصروفاً بقيمة 2200 ج.م فاتورة كهرباء.', type: 'success', date: '2026-06-13T09:00:00', read: true }
];

const mockChats: ChatSession[] = [
  {
    id: 'ch1',
    clientName: 'أحمد علي محمد',
    clientPhone: '+20 1012345678',
    lastMessage: 'تمام، في انتظار عرض السعر اليوم إن شاء الله.',
    time: '05:30 PM',
    unread: true,
    messages: [
      { id: 'm1', sender: 'client', text: 'السلام عليكم ورحمة الله، كنت بسأل عن خدمات الـ CRM', time: '11:00 AM' },
      { id: 'm2', sender: 'user', text: 'وعليكم السلام ورحمة الله وبركاته يا فندم. يسعدنا جداً تواصلك معنا. نظام سندك برو بيقدملك لوحة تحكم كاملة لإدارة المبيعات والتسويق والموظفين والـ KPIs.', time: '11:15 AM' },
      { id: 'm3', sender: 'client', text: 'رائع جداً، هل يدعم اللغة العربية بشكل كامل؟', time: '11:20 AM' },
      { id: 'm4', sender: 'user', text: 'نعم، يدعم الاتجاهين العربي والإنجليزي بالكامل، مع تقارير مالية وتتبع حضور الموظفين بالـ GPS.', time: '11:25 AM' },
      { id: 'm5', sender: 'client', text: 'تمام، في انتظار عرض السعر اليوم إن شاء الله.', time: '05:30 PM' }
    ]
  },
  {
    id: 'ch2',
    clientName: 'محمد عبد الرحمن',
    clientPhone: '+20 1234567890',
    lastMessage: 'تم إرسال التحويل البنكي وتأكيده.',
    time: 'أمس',
    unread: false,
    messages: [
      { id: 'm6', sender: 'user', text: 'مرحبا أستاذ محمد، هل قمت بمراجعة مسودة العقد؟', time: '02:00 PM' },
      { id: 'm7', sender: 'client', text: 'نعم تم المراجعة والتوقيع من جهتنا.', time: '02:30 PM' },
      { id: 'm8', sender: 'client', text: 'تم إرسال التحويل البنكي وتأكيده.', time: '03:00 PM' }
    ]
  }
];

const mockDeleteRequests: LeadDeleteRequest[] = [
  {
    id: 'req1',
    leadId: '2',
    leadName: 'سارة خالد محمود',
    requestedBy: 'محمد حسن (Employee)',
    reason: 'العميل مكرر وغير مهتم بالخدمات حالياً.',
    status: 'Pending',
    timestamp: '2026-06-14T11:30:00.000Z'
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log1',
    actionType: 'Lead Created',
    performedBy: 'محمد حسن (Employee)',
    timestamp: '2026-06-14T09:00:00.000Z',
    affectedEntity: 'lead',
    details: 'تم إنشاء عميل جديد باسم: كريم نادر'
  },
  {
    id: 'log2',
    actionType: 'Attendance Check-in',
    performedBy: 'محمود عبد السلام',
    timestamp: '2026-06-14T09:05:00.000Z',
    affectedEntity: 'attendance',
    details: 'سجل حضور بالوقت المحدد'
  },
  {
    id: 'log3',
    actionType: 'Campaign Created',
    performedBy: 'دينا الشافعي (Marketing)',
    timestamp: '2026-06-14T10:15:00.000Z',
    affectedEntity: 'campaign',
    details: 'أطلقت حملة البحث وجوجل إعلانات Lead Gen'
  },
  {
    id: 'log4',
    actionType: 'Lead Delete Requested',
    performedBy: 'محمد حسن (Employee)',
    timestamp: '2026-06-14T11:30:00.000Z',
    affectedEntity: 'lead',
    details: 'طلب حذف العميل سارة خالد محمود. السبب: العميل مكرر وغير مهتم بالخدمات حالياً.'
  }
];

const mockBonusRecords: BonusRecord[] = [
  {
    id: 'bns-1',
    employeeName: 'م. إسلام عادل',
    employeeRole: 'Web Team Leader',
    department: 'SoftwareDevelopment',
    amount: 3500,
    bonusType: 'حافز أداء ممتاز',
    date: '2026-06-01',
    reason: 'إنجاز تسليمات مشروع سندك وتطوير المعمارية البرمجية قبل الموعد',
    approvedBy: 'Finance Manager',
    status: 'Disbursed'
  },
  {
    id: 'bns-2',
    employeeName: 'رانيا مجدي',
    employeeRole: 'Account Manager',
    department: 'SoftwareDevelopment',
    amount: 2500,
    bonusType: 'عمولة مبيعات',
    date: '2026-06-05',
    reason: 'إغلاق اتفاقية التعاقد الفني والتنسيق الممتاز مع مجموعة الصاوي',
    approvedBy: 'Finance Manager',
    status: 'Disbursed'
  },
  {
    id: 'bns-3',
    employeeName: 'د. طارق مراد',
    employeeRole: 'كبير مدربي الأمن السيبراني',
    department: 'Training',
    amount: 4000,
    bonusType: 'مكافأة تميز',
    date: '2026-06-08',
    reason: 'تقييم 99% في دورة الحوسبة السحابية وتدريب 45 متدرب بنجاح',
    approvedBy: 'Finance Manager',
    status: 'Approved'
  },
  {
    id: 'bns-4',
    employeeName: 'محمود عبد السلام',
    employeeRole: 'أخصائي مبيعات كبار العملاء',
    department: 'Sales',
    amount: 5000,
    bonusType: 'عمولة مبيعات',
    date: '2026-06-10',
    reason: 'تحقيق 150% من التارقت الشهري وتوقيع 3 عقود برمجية جديدة',
    approvedBy: 'Finance Manager',
    status: 'Disbursed'
  },
  {
    id: 'bns-5',
    employeeName: 'سارة خالد',
    employeeRole: 'أخصائي موارد بشرية',
    department: 'HR',
    amount: 1800,
    bonusType: 'بدل إضافي واجتهاد',
    date: '2026-06-11',
    reason: 'مجهود استثنائي في تنظيم المقابلات وتحديث لائحة التقييمات',
    approvedBy: 'Finance Manager',
    status: 'Pending'
  }
];

export const useAppStore = create<AppState>((set) => ({
  currentRole: 'CEO',
  leads: mockLeads,
  tasks: mockTasks,
  employees: mockEmployees,
  kpiTemplates: mockKpiTemplates,
  financeRecords: mockFinanceRecords,
  bonusRecords: mockBonusRecords,
  campaigns: mockCampaigns,
  files: mockFiles,
  notifications: mockNotifications,
  chats: mockChats,
  deleteRequests: mockDeleteRequests,
  activityLogs: mockActivityLogs,
  uploadedReports: mockUploadedReports,
  
  setRole: (role) => set({ currentRole: role }),
  
  addLead: (lead, byUser) => set((state) => {
    const newLead = {
      ...lead,
      id: (state.leads.length + 1).toString(),
      dateCreated: new Date().toISOString().split('T')[0]
    };
    const user = byUser || (state.currentRole === 'CEO' ? 'أحمد علي (CEO)' : 'محمد حسن (Employee)');
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Created',
      performedBy: user,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `تم إنشاء عميل محتمل جديد باسم: ${lead.name}`
    };
    return {
      leads: [newLead, ...state.leads],
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),
  
  updateLead: (updatedLead, byUser) => set((state) => {
    const user = byUser || (state.currentRole === 'CEO' ? 'أحمد علي (CEO)' : 'محمد حسن (Employee)');
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Updated',
      performedBy: user,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `تم تحديث بيانات العميل: ${updatedLead.name}`
    };
    return {
      leads: state.leads.map((l) => l.id === updatedLead.id ? updatedLead : l),
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),
  
  deleteLead: (id, byUser) => set((state) => {
    const lead = state.leads.find(l => l.id === id);
    const leadName = lead ? lead.name : id;
    const user = byUser || (state.currentRole === 'CEO' ? 'أحمد علي (CEO)' : 'محمد حسن (Employee)');
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Deleted',
      performedBy: user,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `تم حذف العميل: ${leadName}`
    };
    return {
      leads: state.leads.filter((l) => l.id !== id),
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),
  
  importLeads: (newLeads) => set((state) => {
    const startId = state.leads.length + 1;
    const formattedLeads = newLeads.map((l, index) => ({
      ...l,
      id: (startId + index).toString(),
      dateCreated: new Date().toISOString().split('T')[0],
      assignedTo: '' // Incoming leads start unassigned
    }));
    return { leads: [...formattedLeads, ...state.leads] };
  }),

  assignLead: (leadId, agentName) => set((state) => ({
    leads: state.leads.map((l) => l.id === leadId ? { ...l, assignedTo: agentName } : l)
  })),

  autoAssignLeads: (rule) => set((state) => {
    // Perform simulated logic depending on rule selection
    const assignedAgent = rule === 'location' ? 'محمد حسن (Employee)' : 'محمد حسن (Employee)';
    return {
      leads: state.leads.map((l) => {
        if (!l.assignedTo) {
          return { ...l, assignedTo: assignedAgent };
        }
        return l;
      })
    };
  }),
  
  addTask: (task) => set((state) => ({
    tasks: [
      { ...task, id: (state.tasks.length + 1).toString() },
      ...state.tasks
    ]
  })),
  
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === updatedTask.id ? updatedTask : t)
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  
  addEmployee: (employee) => set((state) => ({
    employees: [
      {
        ...employee,
        id: 'emp' + (state.employees.length + 1),
        attendance: [],
        leaves: []
      },
      ...state.employees
    ]
  })),
  
  updateEmployee: (updatedEmployee) => set((state) => ({
    employees: state.employees.map((e) => e.id === updatedEmployee.id ? updatedEmployee : e)
  })),
  
  addAttendance: (empId, record) => set((state) => ({
    employees: state.employees.map((e) => {
      if (e.id === empId) {
        return {
          ...e,
          attendance: [record, ...e.attendance]
        };
      }
      return e;
    })
  })),

  serverCheckIn: (empId) => {
    let result = { success: false, message: '' };
    
    set((state) => {
      const employee = state.employees.find((e) => e.id === empId);
      if (!employee) {
        result = { success: false, message: 'Employee not found' };
        return {};
      }

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      
      const alreadyCheckedIn = employee.attendance.some((a) => a.date === dateStr);
      if (alreadyCheckedIn) {
        result = { success: false, message: 'Already checked in today' };
        return {};
      }

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const checkInTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

      const startHour = 9;
      const startMinute = 0;
      const gracePeriodMinutes = 15;
      const cutoffHour = 10;
      const cutoffMinute = 30;

      const checkInMinutesTotal = currentHour * 60 + currentMinute;
      const startMinutesTotal = startHour * 60 + startMinute;
      const cutoffMinutesTotal = cutoffHour * 60 + cutoffMinute;

      let delayMinutes = checkInMinutesTotal - startMinutesTotal;
      if (delayMinutes < 0) delayMinutes = 0;

      let status: 'Present' | 'Late' | 'Absent';

      if (checkInMinutesTotal > cutoffMinutesTotal) {
        status = 'Absent';
      } else if (delayMinutes > gracePeriodMinutes) {
        status = 'Late';
      } else {
        status = 'Present';
      }

      const newRecord: AttendanceRecord = {
        date: dateStr,
        checkIn: checkInTime,
        checkOut: '',
        workingHours: 0,
        delayMinutes: delayMinutes,
        status: status
      };

      result = { 
        success: true, 
        message: status === 'Present' 
          ? 'Checked in successfully! Status: Present' 
          : status === 'Late' 
            ? `Checked in, but you are Late by ${delayMinutes} minutes.` 
            : 'Checked in too late! Status: Absent.'
      };

      const newLog: ActivityLog = {
        id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
        actionType: 'Attendance Check-in',
        performedBy: employee.name,
        timestamp: new Date().toISOString(),
        affectedEntity: 'attendance',
        details: `تسجيل حضور للموظف: ${employee.name}. الحالة: ${status === 'Present' ? 'حاضر' : status === 'Late' ? 'متأخر' : 'غائب'}`
      };

      return {
        employees: state.employees.map((e) => {
          if (e.id === empId) {
            return {
              ...e,
              attendance: [newRecord, ...e.attendance]
            };
          }
          return e;
        }),
        activityLogs: [newLog, ...state.activityLogs]
      };
    });

    return result;
  },

  serverCheckOut: (empId) => {
    let result = { success: false, message: '' };

    set((state) => {
      const employee = state.employees.find((e) => e.id === empId);
      if (!employee) {
        result = { success: false, message: 'Employee not found' };
        return {};
      }

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      
      const todayRecordIdx = employee.attendance.findIndex((a) => a.date === dateStr);
      if (todayRecordIdx === -1) {
        result = { success: false, message: 'No check-in record found for today' };
        return {};
      }

      const todayRecord = employee.attendance[todayRecordIdx];
      if (todayRecord.checkOut) {
        result = { success: false, message: 'Already checked out today' };
        return {};
      }

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const checkOutTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

      const [inHour, inMin] = todayRecord.checkIn.split(':').map(Number);
      const checkInMinutes = inHour * 60 + inMin;
      const checkOutMinutes = currentHour * 60 + currentMinute;
      
      let workHours = 0;
      if (checkOutMinutes > checkInMinutes) {
        workHours = Number(((checkOutMinutes - checkInMinutes) / 60).toFixed(2));
      }

      const updatedRecord: AttendanceRecord = {
        ...todayRecord,
        checkOut: checkOutTime,
        workingHours: workHours
      };

      result = { success: true, message: `Checked out successfully! Total Hours: ${workHours}` };

      const newLog: ActivityLog = {
        id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
        actionType: 'Attendance Check-out',
        performedBy: employee.name,
        timestamp: new Date().toISOString(),
        affectedEntity: 'attendance',
        details: `تسجيل انصراف للموظف: ${employee.name}. عدد ساعات العمل: ${workHours}`
      };

      return {
        employees: state.employees.map((e) => {
          if (e.id === empId) {
            const updatedAttendance = [...e.attendance];
            updatedAttendance[todayRecordIdx] = updatedRecord;
            return {
              ...e,
              attendance: updatedAttendance
            };
          }
          return e;
        }),
        activityLogs: [newLog, ...state.activityLogs]
      };
    });

    return result;
  },
  
  addLeaveRequest: (empId, request) => set((state) => ({
    employees: state.employees.map((e) => {
      if (e.id === empId) {
        const newLeave: LeaveRequest = {
          ...request,
          id: 'lv' + (e.leaves.length + 1)
        };
        return {
          ...e,
          leaves: [newLeave, ...e.leaves]
        };
      }
      return e;
    })
  })),
  
  updateLeaveStatus: (empId, requestId, status) => set((state) => ({
    employees: state.employees.map((e) => {
      if (e.id === empId) {
        return {
          ...e,
          leaves: e.leaves.map((l) => l.id === requestId ? { ...l, status } : l)
        };
      }
      return e;
    })
  })),
  
  addKpiTemplate: (template) => set((state) => ({
    kpiTemplates: [template, ...state.kpiTemplates]
  })),
  
  updateKpiItemScore: (templateId, itemId, scores) => set((state) => ({
    kpiTemplates: state.kpiTemplates.map((t) => {
      if (t.id === templateId) {
        return {
          ...t,
          items: t.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, ...scores };
            }
            return item;
          })
        };
      }
      return t;
    })
  })),
  
  addFinancialRecord: (record) => set((state) => ({
    financeRecords: [
      {
        ...record,
        id: 'fin' + (state.financeRecords.length + 1)
      },
      ...state.financeRecords
    ]
  })),
  
  updateFinancialRecord: (record) => set((state) => ({
    financeRecords: state.financeRecords.map((r) => (r.id === record.id ? record : r))
  })),
  
  deleteFinancialRecord: (id) => set((state) => ({
    financeRecords: state.financeRecords.filter((r) => r.id !== id)
  })),

  addBonusRecord: (bonus) => set((state) => {
    const newBonus: BonusRecord = {
      ...bonus,
      id: 'bns-' + (state.bonusRecords.length + 1)
    };
    let newFinRecords = state.financeRecords;
    if (bonus.status === 'Disbursed') {
      const finExpense: FinancialRecord = {
        id: 'fin-bns-' + (state.financeRecords.length + 1),
        type: 'Expense',
        category: 'Salary',
        title: `صرف حافز ومكافأة: ${bonus.employeeName} (${bonus.bonusType})`,
        amount: bonus.amount,
        date: bonus.date,
        department: bonus.department,
        account: 'الحساب البنكي الرئيسي - CIB',
        status: 'Completed',
        paidAmount: bonus.amount,
        remainingAmount: 0
      };
      newFinRecords = [finExpense, ...state.financeRecords];
    }
    return {
      bonusRecords: [newBonus, ...state.bonusRecords],
      financeRecords: newFinRecords
    };
  }),

  updateBonusRecord: (bonus) => set((state) => ({
    bonusRecords: state.bonusRecords.map((b) => (b.id === bonus.id ? bonus : b))
  })),

  disburseBonusRecord: (id) => set((state) => {
    const target = state.bonusRecords.find((b) => b.id === id);
    if (!target) return state;
    const updatedBonus: BonusRecord = { ...target, status: 'Disbursed' };
    const finExpense: FinancialRecord = {
      id: 'fin-bns-' + (state.financeRecords.length + 1),
      type: 'Expense',
      category: 'Salary',
      title: `صرف حافز ومكافأة: ${target.employeeName} (${target.bonusType})`,
      amount: target.amount,
      date: new Date().toISOString().split('T')[0],
      department: target.department,
      account: 'الحساب البنكي الرئيسي - CIB',
      status: 'Completed',
      paidAmount: target.amount,
      remainingAmount: 0
    };
    return {
      bonusRecords: state.bonusRecords.map((b) => (b.id === id ? updatedBonus : b)),
      financeRecords: [finExpense, ...state.financeRecords]
    };
  }),

  deleteBonusRecord: (id) => set((state) => ({
    bonusRecords: state.bonusRecords.filter((b) => b.id !== id)
  })),
  
  addCampaign: (campaign, byUser) => set((state) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: 'c' + (state.campaigns.length + 1),
      reach: Math.floor(Math.random() * 5000) + 100,
      clicks: Math.floor(Math.random() * 500) + 10,
      leads: Math.floor(Math.random() * 20),
      revenueGenerated: 0
    };
    const user = byUser || (state.currentRole === 'CEO' ? 'أحمد علي (CEO)' : 'محمد حسن (Employee)');
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Campaign Created',
      performedBy: user,
      timestamp: new Date().toISOString(),
      affectedEntity: 'campaign',
      details: `تم إطلاق حملة تسويقية جديدة: ${campaign.name} ميزانية: ${campaign.budget} ج.م`
    };
    return {
      campaigns: [newCampaign, ...state.campaigns],
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),
  
  updateCampaign: (updatedCampaign, byUser) => set((state) => {
    const user = byUser || (state.currentRole === 'CEO' ? 'أحمد علي (CEO)' : 'محمد حسن (Employee)');
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Campaign Updated',
      performedBy: user,
      timestamp: new Date().toISOString(),
      affectedEntity: 'campaign',
      details: `تم تحديث الحملة التسويقية: ${updatedCampaign.name}، الحالة: ${updatedCampaign.status}`
    };
    return {
      campaigns: state.campaigns.map((c) => c.id === updatedCampaign.id ? updatedCampaign : c),
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),
  
  addFile: (file) => set((state) => ({
    files: [
      {
        ...file,
        id: 'f' + (state.files.length + 1),
        uploadDate: new Date().toISOString().split('T')[0]
      },
      ...state.files
    ]
  })),
  
  deleteFile: (id) => set((state) => ({
    files: state.files.filter((f) => f.id !== id)
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  requestDeleteLead: (leadId, leadName, requestedBy, reason) => set((state) => {
    const newReq: LeadDeleteRequest = {
      id: 'req-' + (state.deleteRequests.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      leadId,
      leadName,
      requestedBy,
      reason,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Delete Requested',
      performedBy: requestedBy,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `طلب حذف العميل "${leadName}". السبب: ${reason}`
    };
    return {
      deleteRequests: [newReq, ...state.deleteRequests],
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),

  cancelDeleteRequest: (requestId, byUser) => set((state) => {
    const req = state.deleteRequests.find(r => r.id === requestId);
    if (!req) return {};
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Delete Request Cancelled',
      performedBy: byUser,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `تم إلغاء طلب حذف العميل: "${req.leadName}"`
    };
    return {
      deleteRequests: state.deleteRequests.filter(r => r.id !== requestId),
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),

  approveDeleteRequest: (requestId, byUser) => set((state) => {
    const req = state.deleteRequests.find(r => r.id === requestId);
    if (!req) return {};
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Delete Approved',
      performedBy: byUser,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `تمت الموافقة على حذف العميل: "${req.leadName}"`
    };
    return {
      leads: state.leads.filter(l => l.id !== req.leadId),
      deleteRequests: state.deleteRequests.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r),
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),

  rejectDeleteRequest: (requestId, byUser) => set((state) => {
    const req = state.deleteRequests.find(r => r.id === requestId);
    if (!req) return {};
    const newLog: ActivityLog = {
      id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      actionType: 'Lead Delete Rejected',
      performedBy: byUser,
      timestamp: new Date().toISOString(),
      affectedEntity: 'lead',
      details: `تم رفض حذف العميل: "${req.leadName}"`
    };
    return {
      deleteRequests: state.deleteRequests.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r),
      activityLogs: [newLog, ...state.activityLogs]
    };
  }),

  addActivityLog: (actionType, performedBy, affectedEntity, details) => set((state) => ({
    activityLogs: [
      {
        id: 'log-' + (state.activityLogs.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
        actionType,
        performedBy,
        timestamp: new Date().toISOString(),
        affectedEntity,
        details
      },
      ...state.activityLogs
    ]
  })),
  
  sendChatMessage: (chatId, text) => set((state) => ({
    chats: state.chats.map((c) => {
      if (c.id === chatId) {
        const newMsg: ChatMessage = {
          id: (c.messages.length + 1).toString(),
          sender: 'user',
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...c,
          lastMessage: text,
          time: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    })
  })),

  addUploadedReport: (report) => set((state) => {
    const newReport: UploadedReport = {
      ...report,
      id: 'rep-' + (state.uploadedReports.length + 1) + '-' + Math.random().toString(36).substr(2, 4),
      uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return {
      uploadedReports: [newReport, ...state.uploadedReports]
    };
  }),

  deleteUploadedReport: (id) => set((state) => ({
    uploadedReports: state.uploadedReports.filter((r) => r.id !== id)
  }))
}));
