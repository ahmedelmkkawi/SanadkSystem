import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { statusMap } from '../../data/initialData';
import type { Applicant } from '../../types';

interface RecruiterDashboardProps {
  onSchedule: (name: string) => void;
}

export default function RecruiterDashboard({ onSchedule }: RecruiterDashboardProps) {
  const { lang, applicants, setApplicants, showToast, pushToUndoStack, t } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeEvalIndex, setActiveEvalIndex] = useState<number | null>(null);
  
  const techScoreRef = useRef<number | null>(null);
  const softScoreRef = useRef<number | null>(null);
  const selectedCatsRef = useRef<string[]>([]);
  const feedbackRef = useRef('');
  const decisionRef = useRef<string>('');
  const [evalKey, setEvalKey] = useState(0); // to force re-render eval form

  const softCategories = [
    { value: 'communication', label: t('communication') || (lang === 'ar' ? 'مهارات التواصل' : 'Communication Skills') },
    { value: 'problemSolving', label: t('problemSolving') || (lang === 'ar' ? 'حل المشكلات' : 'Problem Solving') },
    { value: 'teamwork', label: t('teamwork') || (lang === 'ar' ? 'العمل الجماعي' : 'Teamwork') },
    { value: 'timeManagement', label: t('timeManagement') || (lang === 'ar' ? 'إدارة الوقت' : 'Time Management') },
    { value: 'adaptability', label: t('adaptability') || (lang === 'ar' ? 'المرونة والتكيف' : 'Adaptability & Flexibility') },
    { value: 'criticalThinking', label: t('criticalThinking') || (lang === 'ar' ? 'التفكير النقدي' : 'Critical Thinking') },
  ];

  const filtered = applicants.filter(a => {
    const nm = a.name.toLowerCase().includes(search.toLowerCase()) || a.exp.toLowerCase().includes(search.toLowerCase());
    const sm = filterStatus === 'all' || a.status === filterStatus;
    return nm && sm;
  });

  const deleteApplicant = (idx: number) => {
    const realIdx = applicants.findIndex(a => a === filtered[idx]);
    const oldList = [...applicants];
    const name = applicants[realIdx].name;
    setApplicants(prev => prev.filter((_, i) => i !== realIdx));
    pushToUndoStack(() => setApplicants(oldList));
    showToast(
      lang === 'ar'
        ? `تم حذف المرشح ${name} • [تراجع]`
        : `Deleted candidate ${name} • [Undo]`,
      'warning',
      true
    );
  };

  const focusEvaluationForm = (filteredIdx: number) => {
    const realIdx = applicants.findIndex(a => a === filtered[filteredIdx]);
    const cand = applicants[realIdx];
    setActiveEvalIndex(realIdx);
    techScoreRef.current = cand.techScore ?? null;
    softScoreRef.current = cand.softScore ?? null;
    selectedCatsRef.current = cand.passedCats ?? [];
    feedbackRef.current = cand.feedback ?? '';
    decisionRef.current = cand.decision ?? '';
    setEvalKey(k => k + 1);
    if (cand.status === 'evaluated' && cand.techScore) {
      showToast(
        lang === 'ar'
          ? `تعديل التقييم الحالي للمرشح: ${cand.name}`
          : `Edit current evaluation for candidate: ${cand.name}`,
        'info'
      );
    } else {
      showToast(
        lang === 'ar'
          ? `بدء تقييم جديد للمرشح: ${cand.name}`
          : `Start new evaluation for candidate: ${cand.name}`,
        'info'
      );
    }
    setTimeout(() => document.getElementById('evalFormSection')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const cancelEval = () => {
    setActiveEvalIndex(null);
    techScoreRef.current = null;
    softScoreRef.current = null;
    selectedCatsRef.current = [];
    feedbackRef.current = '';
    decisionRef.current = '';
    setEvalKey(k => k + 1);
  };

  const submitEval = () => {
    if (activeEvalIndex === null) {
      showToast(
        lang === 'ar'
          ? 'الرجاء اختيار مرشح لتقييمه من جدول المتقدمين أولاً'
          : 'Please select a candidate to evaluate from the table first',
        'warning'
      );
      return;
    }
    if (!techScoreRef.current || !softScoreRef.current || selectedCatsRef.current.length === 0 || feedbackRef.current.trim().length < 10) {
      showToast(
        lang === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة بالشكل الصحيح'
          : 'Please fill out all required fields correctly',
        'warning'
      );
      return;
    }
    const oldList = JSON.parse(JSON.stringify(applicants));
    const avgScore = Math.round((techScoreRef.current + softScoreRef.current) / 2) + '/5';
    const newList: Applicant[] = applicants.map((a, i) => i === activeEvalIndex
      ? { ...a, status: 'evaluated', actionType: 'score-display', score: avgScore, techScore: techScoreRef.current!, softScore: softScoreRef.current!, feedback: feedbackRef.current.trim(), passedCats: selectedCatsRef.current, decision: decisionRef.current || 'pass' }
      : a
    );
    setApplicants(newList);
    const name = applicants[activeEvalIndex].name;
    pushToUndoStack(() => setApplicants(oldList));
    showToast(
      lang === 'ar'
        ? `تم حفظ تقييم المرشح ${name} بنجاح! • [تراجع]`
        : `Candidate ${name} evaluation saved successfully! • [Undo]`,
      'success',
      true
    );
    cancelEval();
    setTimeout(() => document.getElementById('applicantsTable')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('totalApplicants') || (lang === 'ar' ? 'إجمالي المتقدمين' : 'Total Applicants'), val: '47', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', iconBg: 'bg-brand-50', iconColor: 'text-brand-500', sub: lang === 'ar' ? '+12% هذا الشهر' : '+12% this month', subColor: 'text-emerald-600' },
          { label: t('scheduledInterviews') || (lang === 'ar' ? 'مقابلات مجدولة' : 'Scheduled Interviews'), val: '12', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', sub: lang === 'ar' ? 'بانتظار المراجعة' : 'Pending review', subColor: 'text-gray-400' },
          { label: t('acceptedCandidates') || (lang === 'ar' ? 'تم القبول' : 'Accepted'), val: '8', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', sub: lang === 'ar' ? '17% نسبة القبول' : '17% acceptance rate', subColor: 'text-emerald-600' },
          { label: t('rejectedCandidates') || (lang === 'ar' ? 'تم الرفض' : 'Rejected'), val: '27', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', iconBg: 'bg-red-50', iconColor: 'text-red-500', sub: lang === 'ar' ? 'آخر تحديث: اليوم' : 'Last update: Today', subColor: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all" style={{ boxShadow: '0 0 10px rgba(239,68,68,0.05)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm font-semibold">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${s.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{s.val}</p>
            <p className={`text-xs ${s.subColor} font-semibold mt-1`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="relative w-full sm:w-80">
            <svg className="w-5 h-5 absolute top-1/2 -translate-y-1/2 start-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder={lang === 'ar' ? "البحث عن طريق اسم المتقدم أو الخبرة..." : "Search by applicant name or experience..."} className="w-full bg-gray-50 border border-gray-200 rounded-xl ps-11 pe-4 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 placeholder-gray-400 font-medium" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 font-bold outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="pending">{lang === 'ar' ? 'قيد المراجعة' : 'Pending Review'}</option>
            <option value="accepted">{lang === 'ar' ? 'مقبول مبدئياً' : 'Shortlisted'}</option>
            <option value="evaluated">{lang === 'ar' ? 'تم التقييم' : 'Evaluated'}</option>
          </select>
        </div>

        <div id="applicantsTable" className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-center align-middle">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">{lang === 'ar' ? 'اسم المرشح' : 'Candidate Name'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'العمر' : 'Age'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الخبرة' : 'Experience'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'السيرة الذاتية' : 'CV / Resume'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-gray-800 divide-y divide-gray-100">
                {filtered.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center">
                        <span className="font-extrabold text-zinc-900 text-sm">{a.name}</span>
                        <span className="text-[10px] text-gray-400 mt-1">{lang === 'ar' ? 'تاريخ التقديم:' : 'Application Date:'} {a.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-bold">{a.age}</td>
                    <td className="px-6 py-5">
                      <span className="bg-red-50/80 text-brand-600 border border-brand-100 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">{a.exp}</span>
                    </td>
                    <td className="px-6 py-5">
                      <a href="#" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-brand-600 transition-colors text-xs font-semibold">{a.cv}</a>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`${statusMap[a.status]?.className} px-3.5 py-1.5 rounded-xl text-xs font-bold`}>
                        {lang === 'ar' ? statusMap[a.status]?.ar : statusMap[a.status]?.en}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2.5">
                        {a.actionType === 'quick-actions' && (
                          <button onClick={() => onSchedule(a.name)} className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm animate-pulse" title={lang === 'ar' ? "قبول وجدولة مقابلة" : "Accept & schedule interview"}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                        {a.actionType === 'eval-btn' && (
                          <button onClick={() => focusEvaluationForm(i)} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <span>{lang === 'ar' ? 'تقييم المقابلة' : 'Evaluate Interview'}</span>
                          </button>
                        )}
                        {a.actionType === 'score-display' && (
                          <span className="text-xs text-brand-600 font-extrabold">{lang === 'ar' ? 'التقييم:' : 'Score:'} {a.score}</span>
                        )}
                        <button onClick={() => deleteApplicant(i)} className="w-8 h-8 rounded-full bg-red-50 border border-red-100 text-brand-600 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm" title={t('حذف')}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Evaluation Form */}
      <div id="evalFormSection" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">{lang === 'ar' ? 'نموذج تقييم المقابلة' : 'Interview Evaluation Form'}</h3>
          <p className="text-sm text-gray-400 mt-1">{lang === 'ar' ? 'تقييم شامل للمرشح بناءً على الأداء التقني والمهارات الشخصية' : 'Comprehensive evaluation based on technical performance and soft skills'}</p>
        </div>

        {activeEvalIndex !== null && (
          <div className="mx-5 mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-between animate-fade-in">
            <span className="text-sm font-bold text-brand-900">
              {lang === 'ar' ? 'اسم المرشح قيد التقييم حالياً:' : 'Candidate currently under evaluation:'} <span className="underline text-brand-600 font-extrabold">{applicants[activeEvalIndex]?.name}</span>
            </span>
            <button onClick={cancelEval} className="text-xs text-red-600 hover:text-red-700 font-black transition-colors">{lang === 'ar' ? 'إلغاء التحديد ✗' : 'Cancel ✗'}</button>
          </div>
        )}

        <form key={evalKey} className="p-5 space-y-6" onSubmit={e => { e.preventDefault(); submitEval(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Score */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-3">{lang === 'ar' ? 'التقييم التقني (1-5)' : 'Technical Rating (1-5)'}</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <label key={n} className="flex-1 text-center py-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:border-brand-400 font-bold transition-all text-gray-600 has-[:checked]:bg-brand-600 has-[:checked]:border-brand-600 has-[:checked]:text-white">
                    <input type="radio" name="techScore" value={n} defaultChecked={techScoreRef.current === n} onChange={() => techScoreRef.current = n} className="hidden" />
                    {n}
                  </label>
                ))}
              </div>
            </div>
            {/* Soft Score */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-3">{lang === 'ar' ? 'المهارات الشخصية (1-5)' : 'Soft Skills Rating (1-5)'}</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <label key={n} className="flex-1 text-center py-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:border-brand-400 font-bold transition-all text-gray-600 has-[:checked]:bg-brand-600 has-[:checked]:border-brand-600 has-[:checked]:text-white">
                    <input type="radio" name="softScore" value={n} defaultChecked={softScoreRef.current === n} onChange={() => softScoreRef.current = n} className="hidden" />
                    {n}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-3">{lang === 'ar' ? 'التصنيفات المجتازة (المهارات الشخصية والناعمة)' : 'Passed Categories (Soft & Core Skills)'}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {softCategories.map(cat => (
                <label key={cat.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                  <input type="checkbox" value={cat.value} defaultChecked={selectedCatsRef.current.includes(cat.value)} onChange={e => {
                    if (e.target.checked) selectedCatsRef.current = [...selectedCatsRef.current, cat.value];
                    else selectedCatsRef.current = selectedCatsRef.current.filter(v => v !== cat.value);
                  }} className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">{lang === 'ar' ? 'ملاحظات التقييم' : 'Evaluation Notes'}</label>
            <textarea defaultValue={feedbackRef.current} onChange={e => feedbackRef.current = e.target.value} rows={4} placeholder={lang === 'ar' ? "اكتب ملاحظات مفصلة عن أداء المرشح..." : "Write detailed notes on applicant's performance..."} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 resize-none placeholder-gray-400 text-sm" />
          </div>

          {/* Decision */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-3">{lang === 'ar' ? 'القرار النهائي' : 'Final Decision'}</label>
            <div className="flex gap-3">
              {[
                { val: 'pass', label: lang === 'ar' ? 'ناجح ✓' : 'Pass ✓', checked: 'bg-emerald-50 border-emerald-500 text-emerald-700' },
                { val: 'review', label: lang === 'ar' ? 'يحتاج مراجعة ⟳' : 'Needs Review ⟳', checked: 'bg-amber-50 border-amber-500 text-amber-700' },
                { val: 'fail', label: lang === 'ar' ? 'غير ناجح ✗' : 'Fail ✗', checked: 'bg-red-50 border-red-500 text-red-700' }
              ].map(d => (
                <label key={d.val} className="flex-1">
                  <input type="radio" name="decision" value={d.val} defaultChecked={decisionRef.current === d.val} onChange={() => decisionRef.current = d.val} className="hidden peer" />
                  <div className={`text-center py-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer peer-checked:${d.checked} font-bold text-sm transition-all hover:border-gray-300 text-gray-500`}>{d.label}</div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-600/20 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>{lang === 'ar' ? 'حفظ التقييم' : 'Save Evaluation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
