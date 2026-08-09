import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Role, Lang, ToastItem, Applicant, Instructor, SharedLecture, SharedGroup, GroupStudent, StudentNote, GroupTask } from '../types';
import { initialApplicants, initialInstructors } from '../data/initialData';
import { translations } from '../data/translations';

interface UndoAction {
  restore: () => void;
}

const initialSharedLectures: SharedLecture[] = [
  {
    id: 'lec-1',
    courseName: 'تطوير تطبيقات Web (React.js)',
    topic: 'المحاضرة 08: إدارة الحالة عبر Redux Toolkit & RTK Query',
    batch: 'الدفعة 14 — مجموعة أ',
    instructorName: 'خالد أحمد',
    date: '2026-08-03',
    time: '06:00 م - 08:30 م',
    type: 'online',
    location: 'Zoom Meeting Room #482',
    studentsCount: 32,
    status: 'live'
  },
  {
    id: 'lec-2',
    courseName: 'تطوير تطبيقات Web (React.js)',
    topic: 'المحاضرة 09: الربط مع REST APIs والتعامل مع Axios',
    batch: 'الدفعة 14 — مجموعة أ',
    instructorName: 'خالد أحمد',
    date: '2026-08-05',
    time: '06:00 م - 08:30 م',
    type: 'online',
    location: 'Zoom Meeting Room #482',
    studentsCount: 32,
    status: 'upcoming'
  },
  {
    id: 'lec-3',
    courseName: 'تطبيقات الهاتف (Flutter)',
    topic: 'المحاضرة 04: بناء واجهات المستخدم والتجاوب UI/UX',
    batch: 'الدفعة 09 — مجموعة ب',
    instructorName: 'مريم حسن',
    date: '2026-08-06',
    time: '04:00 م - 07:00 م',
    type: 'in_person',
    location: 'مقر الأكاديمية — قاعة 3B',
    studentsCount: 24,
    status: 'upcoming'
  },
  {
    id: 'lec-4',
    courseName: 'أساسيات البرمجة (Python)',
    topic: 'المحاضرة 12: البرمجة كائنية التوجه OOP & Inheritance',
    batch: 'الدفعة 21 — المكثفة',
    instructorName: 'عمر فاروق',
    date: '2026-08-01',
    time: '05:00 م - 07:30 م',
    type: 'online',
    location: 'Teams Meeting Room #104',
    studentsCount: 31,
    status: 'completed'
  }
];

const initialSharedGroups: SharedGroup[] = [
  {
    id: 'grp-1',
    groupName: 'الدفعة 14 — مجموعة أ',
    courseName: 'تطوير تطبيقات Web (React.js)',
    instructorName: 'خالد أحمد',
    studentsCount: 3,
    schedule: 'الأحد والأربعاء (06:00 م - 08:30 م)',
    location: 'Zoom Meeting Room #482',
    type: 'online',
    status: 'active',
    students: [
      { id: 'std-101', name: 'أحمد محمود العبد', email: 'ahmed.m@example.com', phone: '01012345678', code: 'STD-101', joinedDate: '2026-07-01', guardianName: 'محمود العبد', guardianPhone: '01099887766', address: 'القاهرة — مدينة نصر' },
      { id: 'std-102', name: 'سارة محمد علي', email: 'sara.ali@example.com', phone: '01122334455', code: 'STD-102', joinedDate: '2026-07-02', guardianName: 'محمد علي', guardianPhone: '01155443322', address: 'الجيزة — الدقي' },
      { id: 'std-103', name: 'محمود حسن مصطفى', email: 'mahmoud.h@example.com', phone: '01299887766', code: 'STD-103', joinedDate: '2026-07-05', guardianName: 'حسن مصطفى', guardianPhone: '01233221100', address: 'الإسكندرية — سموحة' },
    ]
  },
  {
    id: 'grp-2',
    groupName: 'الدفعة 09 — مجموعة ب',
    courseName: 'تطبيقات الهاتف (Flutter)',
    instructorName: 'مريم حسن',
    studentsCount: 2,
    schedule: 'الإثنين والخميس (04:00 م - 07:00 م)',
    location: 'مقر الأكاديمية — قاعة 3B',
    type: 'in_person',
    status: 'active',
    students: [
      { id: 'std-201', name: 'عمر خالد فاروق', email: 'omar.k@example.com', phone: '01555443322', code: 'STD-201', joinedDate: '2026-07-10', guardianName: 'خالد فاروق', guardianPhone: '01511223344', address: 'القاهرة — التجمع الخامس' },
      { id: 'std-202', name: 'منى يوسف أحمد', email: 'mona.y@example.com', phone: '01088776655', code: 'STD-202', joinedDate: '2026-07-12', guardianName: 'يوسف أحمد', guardianPhone: '01077665544', address: 'الجيزة — 6 أكتوبر' },
    ]
  },
  {
    id: 'grp-3',
    groupName: 'الدفعة 21 — المكثفة',
    courseName: 'أساسيات البرمجة (Python)',
    instructorName: 'عمر فاروق',
    studentsCount: 2,
    schedule: 'السبت والثلاثاء (05:00 م - 07:30 م)',
    location: 'Teams Meeting Room #104',
    type: 'online',
    status: 'completed',
    students: [
      { id: 'std-301', name: 'إبراهيم السيد', email: 'ibrahim@example.com', phone: '01111223344', code: 'STD-301', joinedDate: '2026-06-15', guardianName: 'السيد عبد الرؤوف', guardianPhone: '01188776655', address: 'طنطا — شارع البحر' },
      { id: 'std-302', name: 'نور الدين مصطفى', email: 'nour@example.com', phone: '01222334455', code: 'STD-302', joinedDate: '2026-06-15', guardianName: 'مصطفى كامل', guardianPhone: '01255443322', address: 'المنصورة — المشاية' },
    ]
  },
  {
    id: 'grp-4',
    groupName: 'الدفعة 15 — مجموعة ج',
    courseName: 'تطوير تطبيقات Web (React.js)',
    instructorName: 'أحمد المصري',
    studentsCount: 1,
    schedule: 'السبت والأربعاء (07:00 م - 09:30 م)',
    location: 'Zoom Meeting Room #501',
    type: 'online',
    status: 'upcoming',
    students: [
      { id: 'std-401', name: 'كريم عبد العزيز', email: 'kareem@example.com', phone: '01000112233', code: 'STD-401', joinedDate: '2026-08-01', guardianName: 'عبد العزيز محمود', guardianPhone: '01022334455', address: 'القاهرة — المعادي' },
    ]
  }
];

const initialStudentNotes: StudentNote[] = [
  {
    id: 'note-1',
    studentId: 'std-101',
    groupId: 'grp-1',
    instructorName: 'خالد أحمد',
    content: 'طالب متميز جداً في استيعاب مفاهيم Context API وحل التمارين بسرعة.',
    category: 'academic',
    createdAt: '2026-08-05'
  },
  {
    id: 'note-2',
    studentId: 'std-101',
    groupId: 'grp-1',
    instructorName: 'خالد أحمد',
    content: 'التزام تام بمواعيد تسليم التكليفات والتفاعل الممتاز أثناء البث المباشر.',
    category: 'behavioral',
    createdAt: '2026-08-07'
  },
  {
    id: 'note-3',
    studentId: 'std-102',
    groupId: 'grp-1',
    instructorName: 'خالد أحمد',
    content: 'تحتاج للتركيز أكثر على تطبيقات TypeScript ونوع البيانات Interfaces.',
    category: 'academic',
    createdAt: '2026-08-06'
  }
];

const initialGroupTasks: GroupTask[] = [
  {
    id: 'task-1',
    groupId: 'grp-1',
    instructorName: 'خالد أحمد',
    title: 'تطبيق مشروع متجر إلكتروني متكامل باستخدام React & Redux Toolkit',
    description: 'بناء واجهات المتجر، إضافة المنتجات للسلة، وتوليد الفاتورة مع التجاوب الكامل للـ Mobile.',
    dueDate: '2026-08-15',
    createdAt: '2026-08-05',
    status: 'active'
  },
  {
    id: 'task-2',
    groupId: 'grp-1',
    instructorName: 'خالد أحمد',
    title: 'حل أسئلة اختبار المنتصف (Midterm Quiz)',
    description: 'إعادة مراجعة الأسئلة البرمجية الخاصة بالـ Custom Hooks.',
    dueDate: '2026-08-10',
    createdAt: '2026-08-04',
    status: 'active'
  }
];

interface AppContextType {
  role: Role;
  lang: Lang;
  applicants: Applicant[];
  instructors: Instructor[];
  sharedLectures: SharedLecture[];
  sharedGroups: SharedGroup[];
  studentNotes: StudentNote[];
  groupTasks: GroupTask[];
  toasts: ToastItem[];
  undoStack: UndoAction | null;
  t: (key: string) => string;
  switchRole: (role: Role) => void;
  toggleLang: () => void;
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
  setSharedLectures: React.Dispatch<React.SetStateAction<SharedLecture[]>>;
  setSharedGroups: React.Dispatch<React.SetStateAction<SharedGroup[]>>;
  setStudentNotes: React.Dispatch<React.SetStateAction<StudentNote[]>>;
  setGroupTasks: React.Dispatch<React.SetStateAction<GroupTask[]>>;
  addStudentsToGroup: (groupId: string, newStudents: GroupStudent[]) => void;
  changeStudentGroup: (studentId: string, fromGroupId: string, toGroupId: string) => void;
  addStudentNote: (note: StudentNote) => void;
  addGroupTask: (task: GroupTask) => void;
  showToast: (message: string, type: ToastItem['type'], hasUndo?: boolean) => void;
  removeToast: (id: number) => void;
  pushToUndoStack: (restore: () => void) => void;
  triggerUndo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('en') ? 'en' : 'ar';
  const [role, setRole] = useState<Role>('instructor');
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [sharedLectures, setSharedLectures] = useState<SharedLecture[]>(initialSharedLectures);
  const [sharedGroups, setSharedGroups] = useState<SharedGroup[]>(initialSharedGroups);
  const [studentNotes, setStudentNotes] = useState<StudentNote[]>(initialStudentNotes);
  const [groupTasks, setGroupTasks] = useState<GroupTask[]>(initialGroupTasks);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const undoStackRef = useRef<UndoAction | null>(null);
  const [, forceUpdate] = useState(0);
  const toastIdRef = useRef(0);

  const t = useCallback((key: string): string => {
    if (!key) return '';
    if (translations[lang][key]) return translations[lang][key];

    if (lang === 'en') {
      const entry = Object.entries(translations.ar).find(([_, val]) => val === key);
      if (entry && translations.en[entry[0]]) {
        return translations.en[entry[0]];
      }
    } else {
      const entry = Object.entries(translations.en).find(([_, val]) => val === key);
      if (entry && translations.ar[entry[0]]) {
        return translations.ar[entry[0]];
      }
    }

    let result = key;
    const dictSource = lang === 'en' ? translations.ar : translations.en;
    const dictTarget = lang === 'en' ? translations.en : translations.ar;

    const items = Object.entries(dictSource)
      .filter(([_, val]) => typeof val === 'string' && val.length > 0)
      .sort((a, b) => b[1].length - a[1].length);

    for (const [k, val] of items) {
      if (result.includes(val)) {
        result = result.replace(val, dictTarget[k]);
      }
    }

    return result;
  }, [lang]);

  const switchRole = useCallback((newRole: Role) => {
    setRole(newRole);
  }, []);

  const toggleLang = useCallback(() => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  }, [i18n]);

  const addStudentsToGroup = useCallback((groupId: string, newStudents: GroupStudent[]) => {
    setSharedGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const existing = g.students || [];
        const updated = [...existing, ...newStudents];
        return {
          ...g,
          students: updated,
          studentsCount: updated.length
        };
      }
      return g;
    }));
  }, []);

  const changeStudentGroup = useCallback((studentId: string, fromGroupId: string, toGroupId: string) => {
    if (fromGroupId === toGroupId) return;

    setSharedGroups(prev => {
      let targetStudent: GroupStudent | undefined;

      // 1. Remove student from source group
      const updatedGroups = prev.map(g => {
        if (g.id === fromGroupId) {
          const found = (g.students || []).find(s => s.id === studentId);
          if (found) targetStudent = found;
          const filtered = (g.students || []).filter(s => s.id !== studentId);
          return {
            ...g,
            students: filtered,
            studentsCount: filtered.length
          };
        }
        return g;
      });

      // 2. Add student to target group
      if (!targetStudent) return prev;

      return updatedGroups.map(g => {
        if (g.id === toGroupId) {
          const updated = [...(g.students || []), targetStudent!];
          return {
            ...g,
            students: updated,
            studentsCount: updated.length
          };
        }
        return g;
      });
    });
  }, []);

  const addStudentNote = useCallback((note: StudentNote) => {
    setStudentNotes(prev => [note, ...prev]);
  }, []);

  const addGroupTask = useCallback((task: GroupTask) => {
    setGroupTasks(prev => [task, ...prev]);
  }, []);

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'info', hasUndo = false) => {
    const id = ++toastIdRef.current;
    const cleanMessage = message.split(' • ')[0];
    setToasts(prev => [...prev, { id, message: cleanMessage, type, hasUndo }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const pushToUndoStack = useCallback((restore: () => void) => {
    undoStackRef.current = { restore };
    forceUpdate(n => n + 1);
  }, []);

  const triggerUndo = useCallback(() => {
    if (undoStackRef.current) {
      undoStackRef.current.restore();
      showToast('تم التراجع عن الإجراء بنجاح ✓', 'success');
      undoStackRef.current = null;
      forceUpdate(n => n + 1);
    }
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      role, lang, applicants, instructors, sharedLectures, sharedGroups, studentNotes, groupTasks, toasts,
      undoStack: undoStackRef.current,
      t, switchRole, toggleLang,
      setApplicants, setInstructors, setSharedLectures, setSharedGroups, setStudentNotes, setGroupTasks,
      addStudentsToGroup, changeStudentGroup, addStudentNote, addGroupTask,
      showToast, removeToast,
      pushToUndoStack, triggerUndo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

