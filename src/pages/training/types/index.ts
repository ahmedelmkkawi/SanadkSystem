export type Role = 'recruiter' | 'instructor' | 'student' | 'admin';
export type Lang = 'ar' | 'en';
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ApplicantStatus = 'pending' | 'accepted' | 'evaluated';
export type ActionType = 'quick-actions' | 'eval-btn' | 'score-display';
export type PayoutModel = 'per-student' | 'per-round' | 'monthly';

export interface Applicant {
  name: string;
  date: string;
  age: string;
  exp: string;
  cv: string;
  status: ApplicantStatus;
  actionType: ActionType;
  score?: string;
  techScore?: number;
  softScore?: number;
  feedback?: string;
  passedCats?: string[];
  decision?: string;
}

export interface Instructor {
  name: string;
  course: string;
  model: string;
  amount: number;
  status: string;
}

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  hasUndo: boolean;
}

export interface AppState {
  currentRole: Role;
  currentLang: Lang;
}
