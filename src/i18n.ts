import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appName: "Sanadk PRO",
      dashboard: "Dashboard",
      crm: "CRM",
      leads: "Leads",
      pipeline: "Pipeline",
      communication: "Communication",
      tasks: "Tasks",
      employees: "Employees",
      kpi: "KPIs",
      finance: "Finance",
      marketing: "Marketing",
      files: "Files & Documents",
      notifications: "Notifications",
      reports: "Reports Center",
      
      // CRM
      addNewLead: "Add New Lead",
      editLead: "Edit Lead",
      leadName: "Lead Name",
      phone: "Phone",
      email: "Email",
      company: "Company",
      jobTitle: "Job Title",
      source: "Source",
      governorate: "Governorate",
      notes: "Notes",
      importExcelCsv: "Import Excel/CSV",
      searchLeads: "Search leads...",
      searchEmployees: "Search employees...",
      allSources: "All Sources",
      allGovernorates: "All Governorates",
      whatsapp: "WhatsApp",
      calls: "Calls",
      inbox: "Inbox",
      sent: "Sent",
      drafts: "Drafts",
      templates: "Templates",
      chatPlaceholder: "Type a message...",
      callLog: "Call Log",
      callResult: "Call Result",
      followUpDate: "Follow-up Date",
      
      // Tasks
      createTask: "Create Task",
      taskName: "Task Name",
      description: "Description",
      priority: "Priority",
      dueDate: "Due Date",
      assignee: "Assignee",
      todo: "To Do",
      inProgress: "In Progress",
      review: "Review",
      completed: "Completed",
      cancelled: "Cancelled",
      high: "High",
      medium: "Medium",
      low: "Low",
      
      // Employees
      attendance: "Attendance",
      checkIn: "Check In",
      checkOut: "Check Out",
      workingHours: "Working Hours",
      delay: "Delay",
      leaveRequests: "Leave Requests",
      employeeList: "Employee List",
      department: "Department",
      directManager: "Direct Manager",
      hireDate: "Hire Date",
      salary: "Salary",
      approve: "Approve",
      reject: "Reject",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      
      // KPI
      kpiBuilder: "KPI Builder",
      kpiItems: "KPI Items",
      evaluationFlow: "Evaluation Flow",
      kpiDashboard: "KPI Dashboard",
      kpiTemplateName: "KPI Template Name",
      targetValue: "Target Value",
      actualValue: "Actual Value",
      weight: "Weight",
      measurementType: "Measurement Type",
      selfEval: "Self Evaluation",
      managerEval: "Manager Evaluation",
      finalScore: "Final Score",
      topPerformers: "Top Performers",
      
      // Finance
      revenues: "Revenues",
      expenses: "Expenses",
      netProfit: "Net Profit",
      contracts: "Contracts",
      payments: "Payments",
      subscriptions: "Subscriptions",
      salaries: "Salaries",
      advertising: "Advertising",
      tools: "Tools",
      operations: "Operations",
      utilities: "Utilities/Bills",
      financialReports: "Financial Reports",
      profitAndLoss: "Profit & Loss",
      cashFlow: "Cash Flow",
      
      // Marketing
      campaigns: "Campaigns",
      results: "Results",
      budget: "Budget",
      platform: "Platform",
      clicks: "Clicks",
      reach: "Reach",
      cpl: "CPL",
      conversionRate: "Conversion Rate",
      roi: "ROI",
      roas: "ROAS",
      
      // Dashboard Cards
      totalRevenue: "Total Revenue",
      totalExpenses: "Total Expenses",
      activeLeads: "Active Leads",
      lateTasks: "Late Tasks",
      systemOverview: "System Overview",
      recentActivities: "Recent Activities",
      employeePerformance: "Employee Performance",
      
      // User Roles
      ceo: "CEO",
      headOfDept: "Head of Department",
      teamLeader: "Team Leader",
      employee: "Employee",
      changeRole: "Change Role",
      
      // Common UI
      search: "Search",
      filter: "Filter",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      viewDetails: "View Details",
      status: "Status",
      date: "Date",
      value: "Value",
      role: "Role",
      profile: "Profile",
      allPriorities: "All Priorities",
      allStatuses: "All Statuses",
      allAssignees: "All Assignees",
      allDepartments: "All Departments",
      uploadReport: "Upload Report",
      uploadedReportsList: "Uploaded Team Reports",
      uploaderName: "Uploader Name",
      serverTime: "Server Time",
      pdfOnly: "PDF files only",
      dragOrSelectPdf: "Select PDF report file...",
      successUpload: "Report uploaded successfully!",
      errorPdfOnly: "Please select a PDF file only!",
      resetFilters: "Reset Filters",
      
      // Dev and Training Module Navigation
      trainingNav: "Training & Education",
      devDeptNav: "Software Development",
      clientPortalNav: "Client Portal",
      devDashboard: "Dashboard",
      devProjects: "Projects",
      devTasks: "Tasks",
      devTeams: "Teams",
      devWorkload: "Workload",
      devBugs: "Bugs",
      devChangeRequests: "Change Requests",
      devReports: "Reports",
      devDeveloperDashboard: "Developer Dashboard",
      devProjectProgress: "Project Progress",
      settingsNav: "Settings"
    }
  },
  ar: {
    translation: {
      appName: "سندك برو",
      dashboard: "لوحة التحكم",
      crm: "إدارة العملاء",
      leads: "العملاء المحتملون",
      pipeline: "مراحل المبيعات",
      communication: "مركز الاتصالات",
      tasks: "إدارة المهام",
      employees: "إدارة الموظفين",
      kpi: "مؤشرات الأداء",
      finance: "الإدارة المالية",
      marketing: "التسويق",
      files: "الملفات والمستندات",
      notifications: "مركز الإشعارات",
      reports: "مركز التقارير",
      
      // CRM
      addNewLead: "إضافة عميل جديد",
      editLead: "تعديل عميل",
      leadName: "اسم العميل",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      company: "الشركة",
      jobTitle: "المسمى الوظيفي",
      source: "المصدر",
      governorate: "المحافظة",
      notes: "ملاحظات",
      importExcelCsv: "استيراد Excel/CSV",
      searchLeads: "البحث عن عملاء...",
      searchEmployees: "البحث عن موظفين...",
      allSources: "كل المصادر",
      allGovernorates: "كل المحافظات",
      whatsapp: "واتساب",
      calls: "المكالمات",
      inbox: "البريد الوارد",
      sent: "المرسل",
      drafts: "المسودات",
      templates: "القوالب جاهزة",
      chatPlaceholder: "اكتب رسالة...",
      callLog: "سجل المكالمات",
      callResult: "نتيجة المكالمات",
      followUpDate: "تاريخ المتابعة",
      
      // Tasks
      createTask: "إنشاء مهمة",
      taskName: "اسم المهمة",
      description: "الوصف",
      priority: "الأولوية",
      dueDate: "تاريخ التسليم",
      assignee: "المسؤول",
      todo: "قيد الانتظار",
      inProgress: "قيد التنفيذ",
      review: "المراجعة",
      completed: "مكتملة",
      cancelled: "ملغاة",
      high: "عالية",
      medium: "متوسطة",
      low: "منخفضة",
      
      // Employees
      attendance: "الحضور والانصراف",
      checkIn: "تسجيل حضور",
      checkOut: "تسجيل انصراف",
      workingHours: "ساعات العمل",
      delay: "التأخير",
      leaveRequests: "طلبات الإجازة",
      employeeList: "قائمة الموظفين",
      department: "القسم",
      directManager: "المدير المباشر",
      hireDate: "تاريخ التعيين",
      salary: "الراتب",
      approve: "موافقة",
      reject: "رفض",
      pending: "قيد الانتظار",
      approved: "تمت الموافقة",
      rejected: "مرفوض",
      
      // KPI
      kpiBuilder: "منشئ مؤشرات الأداء",
      kpiItems: "بنود التقييم",
      evaluationFlow: "دورة التقييم",
      kpiDashboard: "لوحة مؤشرات الأداء",
      kpiTemplateName: "اسم نموذج التقييم",
      targetValue: "الهدف المطلوبة",
      actualValue: "القيمة الفعلية",
      weight: "الوزن النسبي",
      measurementType: "نوع القياس",
      selfEval: "التقييم الذاتي",
      managerEval: "تقييم المدير",
      finalScore: "الدرجة النهائية",
      topPerformers: "أفضل الموظفين أداءً",
      
      // Finance
      revenues: "الإيرادات",
      expenses: "المصروفات",
      netProfit: "صافي الأرباح",
      contracts: "العقود",
      payments: "الدفعات",
      subscriptions: "الاشتراكات",
      salaries: "الرواتب",
      advertising: "الإعلانات والتسويق",
      tools: "الأدوات والاشتراكات",
      operations: "التشغيل",
      utilities: "فواتير ومرافق",
      financialReports: "التقارير المالية",
      profitAndLoss: "الأرباح والخسائر",
      cashFlow: "التدفق النقدي",
      
      // Marketing
      campaigns: "الحملات الإعلانية",
      results: "النتائج والمؤشرات",
      budget: "الميزانية",
      platform: "المنصة",
      clicks: "النقرات",
      reach: "الوصول",
      cpl: "تكلفة العميل المحتمل",
      conversionRate: "معدل التحويل",
      roi: "العائد على الاستثمار",
      roas: "العائد على الإعلان",
      
      // Dashboard Cards
      totalRevenue: "إجمالي الإيرادات",
      totalExpenses: "إجمالي المصروفات",
      activeLeads: "العملاء النشطون",
      lateTasks: "المهام المتأخرة",
      systemOverview: "نظرة عامة على النظام",
      recentActivities: "الأنشطة الأخيرة",
      employeePerformance: "أداء الموظفين",
      
      // User Roles
      ceo: "الرئيس التنفيذي (CEO)",
      headOfDept: "رئيس القسم (Head)",
      teamLeader: "قائد الفريق (TL)",
      employee: "الموظف",
      changeRole: "تغيير الصلاحيات",
      
      // Common UI
      search: "بحث",
      filter: "تصفية",
      save: "حفظ",
      cancel: "إلغاء",
      submit: "إرسال",
      actions: "الإجراءات",
      edit: "تعديل",
      delete: "حذف",
      viewDetails: "عرض التفاصيل",
      status: "الحالة",
      date: "التاريخ",
      value: "القيمة",
      role: "الصلاحية",
      profile: "الملف الشخصي",
      allPriorities: "كل الأولويات",
      allStatuses: "كل الحالات",
      allAssignees: "كل المسؤولين",
      allDepartments: "كل الأقسام",
      uploadReport: "رفع تقرير",
      uploadedReportsList: "تقارير الفريق المرفوعة",
      uploaderName: "اسم رافع التقرير",
      serverTime: "وقت السيرفر",
      pdfOnly: "ملفات PDF فقط",
      dragOrSelectPdf: "اختر ملف التقرير بصيغة PDF...",
      successUpload: "تم رفع التقرير بنجاح!",
      errorPdfOnly: "يرجى اختيار ملف PDF فقط!",
      resetFilters: "إعادة ضبط التصفية",
      
      // Dev and Training Module Navigation
      trainingNav: "التدريب والتعليم",
      devDeptNav: "تطوير البرمجيات",
      clientPortalNav: "بوابة العميل",
      devDashboard: "لوحة التحكم",
      devProjects: "المشاريع",
      devTasks: "المهام",
      devTeams: "الفرق",
      devWorkload: "ضغط العمل",
      devBugs: "الأخطاء والبلاغات",
      devChangeRequests: "طلبات التعديل",
      devReports: "التقارير",
      devDeveloperDashboard: "لوحة المطور",
      devProjectProgress: "متابعة المشروع",
      settingsNav: "الإعدادات"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar', // Default to Arabic as requested and as this is an Arabic CRM
    interpolation: {
      escapeValue: false
    }
  });

// Handle text direction based on active language
const updateDirection = (lng: string) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

// Listen to language change to dynamically adjust page direction
i18n.on('languageChanged', (lng) => {
  updateDirection(lng);
});

// Initialize direction
updateDirection(i18n.language || 'ar');

export default i18n;
