import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Role, Lang, ToastItem, Applicant, Instructor } from '../types';
import { initialApplicants, initialInstructors } from '../data/initialData';
import { translations } from '../data/translations';

interface UndoAction {
  restore: () => void;
}

interface AppContextType {
  role: Role;
  lang: Lang;
  applicants: Applicant[];
  instructors: Instructor[];
  toasts: ToastItem[];
  undoStack: UndoAction | null;
  t: (key: string) => string;
  switchRole: (role: Role) => void;
  toggleLang: () => void;
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  setInstructors: React.Dispatch<React.SetStateAction<Instructor[]>>;
  showToast: (message: string, type: ToastItem['type'], hasUndo?: boolean) => void;
  removeToast: (id: number) => void;
  pushToUndoStack: (restore: () => void) => void;
  triggerUndo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('en') ? 'en' : 'ar';
  const [role, setRole] = useState<Role>('recruiter');
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
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
      role, lang, applicants, instructors, toasts,
      undoStack: undoStackRef.current,
      t, switchRole, toggleLang,
      setApplicants, setInstructors,
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
