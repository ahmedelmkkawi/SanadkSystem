import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
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
  const [role, setRole] = useState<Role>('recruiter');
  const [lang, setLang] = useState<Lang>('ar');
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const undoStackRef = useRef<UndoAction | null>(null);
  const [, forceUpdate] = useState(0);
  const toastIdRef = useRef(0);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  const switchRole = useCallback((newRole: Role) => {
    setRole(newRole);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const newLang = prev === 'ar' ? 'en' : 'ar';
      const html = document.documentElement;
      html.setAttribute('lang', newLang);
      html.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
      return newLang;
    });
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
