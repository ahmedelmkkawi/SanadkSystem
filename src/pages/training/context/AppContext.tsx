import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Role, Lang, ToastItem, Applicant, Instructor, SharedLecture, SharedGroup } from '../types';
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
    studentsCount: 32,
    schedule: 'الأحد والأربعاء (06:00 م - 08:30 م)',
    location: 'Zoom Meeting Room #482',
    type: 'online',
    status: 'active'
  },
  {
    id: 'grp-2',
    groupName: 'الدفعة 09 — مجموعة ب',
    courseName: 'تطبيقات الهاتف (Flutter)',
    instructorName: 'مريم حسن',
    studentsCount: 24,
    schedule: 'الإثنين والخميس (04:00 م - 07:00 م)',
    location: 'مقر الأكاديمية — قاعة 3B',
    type: 'in_person',
    status: 'active'
  },
  {
    id: 'grp-3',
    groupName: 'الدفعة 21 — المكثفة',
    courseName: 'أساسيات البرمجة (Python)',
    instructorName: 'عمر فاروق',
    studentsCount: 31,
    schedule: 'السبت والثلاثاء (05:00 م - 07:30 م)',
    location: 'Teams Meeting Room #104',
    type: 'online',
    status: 'completed'
  },
  {
    id: 'grp-4',
    groupName: 'الدفعة 15 — مجموعة ج',
    courseName: 'تطوير تطبيقات Web (React.js)',
    instructorName: 'أحمد المصري',
    studentsCount: 28,
    schedule: 'السبت والأربعاء (07:00 م - 09:30 م)',
    location: 'Zoom Meeting Room #501',
    type: 'online',
    status: 'upcoming'
  }
];

interface AppContextType {
  role: Role;
  lang: Lang;
  applicants: Applicant[];
  instructors: Instructor[];
  sharedLectures: SharedLecture[];
  sharedGroups: SharedGroup[];
  toasts: ToastItem[];
  undoStack: UndoAction | null;
  t: (key: string) => string;
  switchRole: (role: Role) => void;
  toggleLang: () => void;
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
  setSharedLectures: React.Dispatch<React.SetStateAction<SharedLecture[]>>;
  setSharedGroups: React.Dispatch<React.SetStateAction<SharedGroup[]>>;
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
      role, lang, applicants, instructors, sharedLectures, sharedGroups, toasts,
      undoStack: undoStackRef.current,
      t, switchRole, toggleLang,
      setApplicants, setInstructors, setSharedLectures, setSharedGroups,
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
