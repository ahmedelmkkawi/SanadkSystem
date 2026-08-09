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
  specialization?: string;
  model: string;
  amount: number;
  status: string;
  phone?: string;
  email?: string;
}

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  hasUndo: boolean;
}

export interface SharedLecture {
  id: string;
  courseName: string;
  topic: string;
  batch: string;
  instructorName: string;
  date: string;
  time: string;
  type: 'online' | 'in_person';
  location: string;
  studentsCount: number;
  status: 'live' | 'upcoming' | 'completed';
}

export interface GroupStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  joinedDate: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
}

export interface StudentNote {
  id: string;
  studentId: string;
  groupId: string;
  instructorName: string;
  content: string;
  category?: 'academic' | 'behavioral' | 'general';
  createdAt: string;
}

export interface GroupTask {
  id: string;
  groupId: string;
  instructorName: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  status?: 'active' | 'completed';
}

export interface SharedGroup {
  id: string;
  groupName: string;
  courseName: string;
  instructorName: string;
  studentsCount: number;
  students: GroupStudent[];
  schedule: string;
  location: string;
  type: 'online' | 'in_person';
  status: 'active' | 'upcoming' | 'completed';
}

export interface AppState {
  currentRole: Role;
  currentLang: Lang;
}

