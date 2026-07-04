import type { Applicant, Instructor } from '../types';

export const initialApplicants: Applicant[] = [
  { name: 'Sarah Connor', date: '6/25/2026', age: '28', exp: '٣ إلى ٥ سنوات', cv: 'sarah_cv.pdf', status: 'pending', actionType: 'quick-actions' },
  { name: 'John Doe', date: '6/24/2026', age: '32', exp: 'أكثر من ٥ سنوات', cv: 'john_doe_resume.pdf', status: 'accepted', actionType: 'eval-btn' },
  { name: 'Amir Kamal', date: '6/20/2026', age: '25', exp: 'سنة إلى سنتين', cv: 'amir_cv_en.pdf', status: 'evaluated', actionType: 'score-display', score: '4/5', techScore: 4, softScore: 4, feedback: 'أداء ممتاز وسريع البديهة في الأسئلة المنطقية', passedCats: ['communication', 'problemSolving'], decision: 'pass' },
];

export const initialInstructors: Instructor[] = [
  { name: 'خالد أحمد', course: 'React Advanced', model: 'Per Student', amount: 32500, status: 'تم الدفع' },
  { name: 'مريم حسن', course: 'UI/UX Design', model: 'Monthly', amount: 15000, status: 'معلق' },
  { name: 'عمر فاروق', course: 'Node.js Backend', model: 'Per Round', amount: 28000, status: 'تم الدفع' },
];

export const statusMap: Record<string, { ar: string; en: string; className: string }> = {
  pending: { ar: 'قيد المراجعة', en: 'Pending Review', className: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
  accepted: { ar: 'مقبول مبدئياً', en: 'Provisional Accept', className: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  evaluated: { ar: 'تم التقييم', en: 'Evaluated', className: 'bg-blue-50 text-blue-600 border border-blue-200' },
};

export const paymentChartData: Record<string, number[]> = {
  'per-student': [40000, 55000, 48000, 70000, 65000, 90000, 124500],
  'per-round': [25000, 80000, 30000, 95000, 40000, 110000, 85000],
  'monthly': [60000, 60000, 60000, 60000, 60000, 60000, 60000],
};
