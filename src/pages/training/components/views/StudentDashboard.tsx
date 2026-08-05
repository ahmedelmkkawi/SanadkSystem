import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface StudentDashboardProps {
  sessionRatings: Record<string, number>;
  onOpenRatingModal: (sessionName: string, rowId: string) => void;
}

export default function StudentDashboard({ sessionRatings, onOpenRatingModal }: StudentDashboardProps) {
  const { showToast, pushToUndoStack, lang, t, sharedLectures } = useApp();
  const [scheduleView, setScheduleView] = useState<'weekly' | 'monthly'>('weekly');
  const [lectureAttendance, setLectureAttendance] = useState<Record<number, 'online' | 'offline' | 'completed' | null>>({
    0: 'online',
    1: null,
    2: 'completed',
    3: null,
  });

  // Calendar State
  const [studentCalMonth, setStudentCalMonth] = useState(6); // July
  const [studentCalYear, setStudentCalYear] = useState(2026);
  const studentCalMonthNames = lang === 'ar'
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const studentLectureDays: Record<number, number[]> = { 6: [1, 3, 7, 10, 14, 17, 21, 24, 28, 31] };
  const studentAttendedDays: Record<number, number[]> = { 6: [1, 3, 7, 10] };
  const studentAbsentDays: Record<number, number[]> = { 6: [14] };

  const setAttendanceType = (lectureIndex: number, type: 'online' | 'offline') => {
    const previousType = lectureAttendance[lectureIndex];
    
    const update = (newType: typeof previousType) => {
      setLectureAttendance(prev => ({ ...prev, [lectureIndex]: newType }));
    };

    update(type);
    pushToUndoStack(() => {
      update(previousType);
    });

    if (type === 'online') {
      showToast(lang === 'ar' ? '✓ تم اختيار الحضور أونلاين • [تراجع]' : '✓ Online attendance selected • [Undo]', 'success', true);
    } else {
      showToast(lang === 'ar' ? '✓ تم اختيار الحضور الشخصي • [تراجع]' : '✓ Physical attendance selected • [Undo]', 'success', true);
    }
  };

  const joinSession = (lectureIndex: number) => {
    const type = lectureAttendance[lectureIndex];
    if (!type || type === 'completed') {
      showToast(lang === 'ar' ? 'الرجاء اختيار نوع الحضور أولاً (أونلاين أو حضوري)' : 'Please select attendance type first (Online or Offline)', 'warning');
      return;
    }
    if (type === 'online') {
      showToast(lang === 'ar' ? '🔗 جاري فتح رابط الجلسة على Zoom... يرجى الانتظار' : '🔗 Opening Zoom session link... Please wait', 'info');
    } else {
      showToast(lang === 'ar' ? '📍 تم تأكيد حضورك الشخصي — المقر: فرع المعادي، الدور الثالث' : '📍 Physical attendance confirmed — Location: Maadi Branch, 3rd Floor', 'info');
    }
  };

  const changeStudentMonth = (dir: number) => {
    setStudentCalMonth(m => {
      let nm = m + dir;
      if (nm > 11) { nm = 0; setStudentCalYear(y => y + 1); }
      if (nm < 0) { nm = 11; setStudentCalYear(y => y - 1); }
      showToast(`📅 ${studentCalMonthNames[nm]} ${studentCalYear}`, 'info');
      return nm;
    });
  };

  const renderStudentCalendar = () => {
    const firstDay = new Date(studentCalYear, studentCalMonth, 1).getDay();
    const daysInMonth = new Date(studentCalYear, studentCalMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === studentCalYear && today.getMonth() === studentCalMonth;
    const todayDate = today.getDate();
    
    const lectures = studentLectureDays[studentCalMonth] || [];
    const attended = studentAttendedDays[studentCalMonth] || [];
    const absent = studentAbsentDays[studentCalMonth] || [];
    
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayDate;
      const isLecture = lectures.includes(d);
      const isAttended = attended.includes(d);
      const isAbsent = absent.includes(d);
      
      let classes = 'calendar-cell h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all ';
      
      if (isToday) {
        classes += 'bg-brand-600 text-white font-black shadow-md shadow-brand-500/20 ';
      } else if (isAttended) {
        classes += 'bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 ';
      } else if (isAbsent) {
        classes += 'bg-red-50 text-red-500 font-bold border border-red-200 ';
      } else if (isLecture) {
        classes += 'bg-brand-50/50 text-brand-600 border border-brand-100 font-semibold hover:bg-brand-50 ';
      } else {
        classes += 'text-gray-500 hover:bg-gray-100 ';
      }
      
      const tooltip = isAttended ? t('تم الحضور ✓') : isAbsent ? t('غياب ✗') : isLecture ? t('يوم محاضرة') : `${t('يوم')} ${d}`;
      
      cells.push(
        <div 
          key={d} 
          className={classes} 
          onClick={() => showToast(`${tooltip} — ${t('يوم')} ${d} ${studentCalMonthNames[studentCalMonth]}`, 'info')}
          title={tooltip}
        >
          {d}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Student Enrolled Course & Instructor Alignment Card */}
      <div className="bg-gradient-to-r from-zinc-900 via-gray-900 to-brand-950 text-white rounded-2xl p-6 shadow-md border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-black text-xl shadow-inner">
              🎓
            </div>
            <div>
              <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                {lang === 'ar' ? 'بيانات الطالب والدورة المسجل بها' : 'Enrolled Student Profile'}
              </span>
              <h2 className="text-lg font-black text-white mt-1">
                {lang === 'ar' ? 'تطوير تطبيقات Web (React.js)' : 'Web Development (React.js)'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-200">
              {lang === 'ar' ? 'حالة القيد: مستمر بالدراسة' : 'Status: Active Student'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div className="bg-gray-800/50 border border-gray-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-base font-bold">
              👨‍🏫
            </div>
            <div>
              <span className="text-gray-400 block text-[11px] font-medium">{lang === 'ar' ? 'المحاضر المسؤول:' : 'Assigned Instructor:'}</span>
              <span className="font-extrabold text-white text-sm">خالد أحمد</span>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center text-base font-bold">
              👥
            </div>
            <div>
              <span className="text-gray-400 block text-[11px] font-medium">{lang === 'ar' ? 'الدفعة والمجموعة:' : 'Group / Batch:'}</span>
              <span className="font-extrabold text-white text-sm">الدفعة 14 — مجموعة أ</span>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-base font-bold">
              📅
            </div>
            <div>
              <span className="text-gray-400 block text-[11px] font-medium">{lang === 'ar' ? 'مواعيد المحاضرات:' : 'Class Schedule:'}</span>
              <span className="font-extrabold text-white text-sm">الأحد والأربعاء (06:00 م)</span>
            </div>
          </div>
        </div>
      </div>
      {/* Top Section: Progress & General Attendance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm flex flex-col justify-center items-center">
          <h3 className="font-bold text-gray-500 text-sm mb-6">{t('نسبة إنجاز الدورة')}</h3>
          <div className="relative w-36 h-36 mx-auto">
            <svg className="w-36 h-36 circular-progress" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f4f4f5" strokeWidth="6"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="70.75" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900 neon-text-glow">75%</span>
              <span className="text-xs text-gray-400">{t('مكتمل')}</span>
            </div>
          </div>
        </div>

        {/* Detailed Attendance Stats */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{t('إحصائيات الحضور')}</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{t('سجل الحضور العام')}</h3>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">{t('يوليو')} 2026</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-2xl font-black text-emerald-600">18</p>
              <p className="text-xs text-emerald-500 font-semibold mt-1">{t('جلسة حضرتها')}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-2xl font-black text-brand-600">4</p>
              <p className="text-xs text-brand-500 font-semibold mt-1">{t('جلسات غياب')}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-2xl font-black text-blue-600">22</p>
              <p className="text-xs text-blue-500 font-semibold mt-1">{t('إجمالي الجلسات')}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">{t('نسبة الحضور الإجمالية')}</span>
            <span className="text-sm font-black text-emerald-600">82%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-700" style={{ width: '82%' }}></div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{t('أداء الحضور جيد 👏')}</p>
              <p className="text-xs text-gray-400">{t('حافظ على نسبة حضور لا تقل عن 80% للحصول على الشهادة')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{t('جدول المحاضرات')}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setScheduleView('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scheduleView === 'weekly' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t('أسبوعي')}
            </button>
            <button
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scheduleView === 'monthly' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t('شهري')}
            </button>
          </div>
        </div>

        {/* Weekly View */}
        {scheduleView === 'weekly' ? (
          <div className="overflow-x-auto">
            <table className={`w-full text-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('التاريخ')}</th>
                  <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('المحاضرة')}</th>
                  <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('المحاضر')}</th>
                  <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('الوقت')}</th>
                  <th className="px-5 py-3 text-center">{t('نوع الحضور')}</th>
                  <th className="px-5 py-3 text-center">{t('الإجراء')}</th>
                  <th className="px-5 py-3 text-center">{t('التقييم')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {sharedLectures.map((lec, idx) => (
                <tr key={lec.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex flex-col items-center justify-center">
                      <span className="text-brand-600 text-[10px] font-bold">{lec.date}</span>
                      <span className="text-brand-600 text-xs font-black leading-none">{lec.time.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 text-sm">{lec.topic}</p>
                    <p className="text-xs text-brand-600 font-semibold mt-0.5">{lec.courseName} — {lec.batch}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-800 font-bold text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                      <span>{lec.instructorName}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-semibold">{lec.time}</td>
                  <td className="px-5 py-4">
                    {lectureAttendance[idx] === 'online' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(idx, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-blue-400 bg-blue-100 text-blue-700">🌐 {t('أونلاين')}</button>
                          <button onClick={() => setAttendanceType(idx, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🏛 {t('حضوري')}</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-blue-600">✓ {t('أونلاين')}</span>
                      </div>
                    ) : lectureAttendance[idx] === 'offline' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(idx, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🌐 {t('أونلاين')}</button>
                          <button onClick={() => setAttendanceType(idx, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-emerald-400 bg-emerald-100 text-emerald-700">🏛 {t('حضوري')}</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-emerald-600">✓ {t('حضوري')}</span>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 justify-center">
                        <button onClick={() => setAttendanceType(idx, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600">🌐 {t('أونلاين')}</button>
                        <button onClick={() => setAttendanceType(idx, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100">🏛 {t('حضوري')}</button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {lec.status === 'live' ? (
                      <button onClick={() => joinSession(idx)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-extrabold text-xs transition-all shadow-md shadow-red-600/20 animate-pulse flex items-center gap-1 mx-auto">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span>{t('انضمام للبث')}</span>
                      </button>
                    ) : lec.status === 'upcoming' ? (
                      <button onClick={() => joinSession(idx)} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md shadow-brand-600/20">{t('انضمام')}</button>
                    ) : (
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-bold">{t('مكتملة')}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {sessionRatings[String(idx)] ? (
                      <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">⭐ {sessionRatings[String(idx)]}/5</span>
                    ) : (
                      <button onClick={() => onOpenRatingModal(lec.topic, String(idx))} className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1 mx-auto">{t('تقييم')}</button>
                    )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => changeStudentMonth(-1)} className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <span className="text-sm font-bold text-gray-700 min-w-[120px] text-center">{studentCalMonthNames[studentCalMonth]} {studentCalYear}</span>
              <button onClick={() => changeStudentMonth(1)} className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
              {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(d => <div key={d} className="py-2">{t(d)}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderStudentCalendar()}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> {t('يوم محاضرة')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {t('تم الحضور')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> {t('غياب')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Weekly Schedule Table (Monday - Sunday hour grid) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">📅 {t('الجدول الأسبوعي الكامل')}</h3>
            <p className="text-xs text-gray-400 mt-1">{t('جميع المحاضرات والأنشطة مرتبة حسب أيام الأسبوع')}</p>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">{t('الأسبوع الحالي')}</span>
        </div>
        <div className="overflow-x-auto p-5">
          <table className={`w-full min-w-[1250px] border-collapse border border-gray-200 ${lang === 'ar' ? 'text-right' : 'text-left'} bg-white rounded-xl overflow-hidden shadow-sm table-fixed`}>
            <colgroup>
              <col style={{ width: '140px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
              <col style={{ width: '123px' }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="border border-gray-200 p-4 text-center bg-gray-100/50">{t('اليوم / الوقت')}</th>
                {['07:00 - 09:00', '09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00', '21:00 - 23:00', '23:00 - 00:00'].map(t => (
                  <th key={t} className="border border-gray-200 p-2 text-center text-[11px] font-extrabold text-brand-900">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {/* Sunday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">{t('الأحد')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">29 {t('يونيو')}</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-emerald-50/30" colSpan={2}>
                  <div className="bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg p-2.5 text-start text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-emerald-800 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900 border border-emerald-300 w-fit">{t('تم الحضور ✓')}</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 React State Management</span>
                    </div>
                    <p className="text-[10px] mt-1 text-emerald-900/80">⏰ 20:00 - 22:00</p>
                    <p className="text-[10px] text-emerald-900/80">🏷️ {t('الوحدة الثانية')} — {t('تطبيقات عملية')}</p>
                    <p className="text-[10px] text-emerald-900/80">🏛️ 🌐 {t('أونلاين')} | {t('أ. خالد')}</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Monday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">{t('الاثنين')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">30 {t('يونيو')}</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-emerald-50/30" colSpan={1}>
                  <div className="bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg p-2.5 text-start text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-emerald-800 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900 border border-emerald-300 w-fit">{t('تم الحضور ✓')}</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 {t('مراجعة وتمارين عملية')}</span>
                    </div>
                    <p className="text-[10px] mt-1 text-emerald-900/80">⏰ 19:00 - 21:00</p>
                    <p className="text-[10px] text-emerald-900/80">🏷️ {t('تمارين تفاعلية Hooks')}</p>
                    <p className="text-[10px] text-emerald-900/80">🏛️ 🏛 {t('حضوري')} | {t('أ. خالد')}</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Tuesday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">{t('الثلاثاء')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">1 {t('يوليو')}</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-amber-50/30" colSpan={2}>
                  <div className="bg-amber-100 text-amber-950 border border-amber-300 rounded-lg p-2.5 text-start text-xs leading-relaxed font-black shadow-md hover:shadow-lg transition-all ring-2 ring-amber-400/30 animate-pulse">
                    <div className="font-black text-amber-900 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded text-amber-900 border border-amber-400 w-fit">{t('اليوم ●')}</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 API Integration & Fetch</span>
                    </div>
                    <p className="text-[10px] mt-1 text-amber-900/80">⏰ 20:00 - 22:00</p>
                    <p className="text-[10px] text-amber-900/80">🏷️ {t('الثالثة')} — Axios & Fetch</p>
                    <p className="text-[10px] text-amber-900/80">🏛️ 🌐 {t('أونلاين')} | {t('أ. خالد')}</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Wednesday */}
              <tr className="hover:bg-gray-50/20 transition-colors bg-gray-50/30">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-400">{t('الأربعاء')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">2 {t('يوليو')}</div>
                </td>
                <td className="border border-gray-200 p-4 text-center text-gray-400 font-bold bg-zinc-50/50" colSpan={9}>
                  {t('— لا توجد محاضرات —')}
                </td>
              </tr>

              {/* Thursday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">{t('الخميس')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">3 {t('يوليو')}</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-red-50/30" colSpan={2}>
                  <div className="bg-red-100 text-red-950 border border-red-300 rounded-lg p-2.5 text-start text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-red-900 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-red-200 px-1.5 py-0.5 rounded text-red-900 border border-red-300 w-fit">{t('قريباً')}</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 React Router & Navigation</span>
                    </div>
                    <p className="text-[10px] mt-1 text-red-900/80">⏰ 20:00 - 22:00</p>
                    <p className="text-[10px] text-red-900/80">🏷️ {t('الثالثة')} — {t('التنقل بين الصفحات')}</p>
                    <p className="text-[10px] text-red-900/80">🏛️ 🌐 {t('أونلاين')} | {t('أ. خالد')}</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Friday */}
              <tr className="hover:bg-gray-50/20 transition-colors bg-gray-50/30">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-400">{t('الجمعة')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">4 {t('يوليو')}</div>
                </td>
                <td className="border border-gray-200 p-4 text-center text-gray-400 font-bold bg-zinc-50/50" colSpan={9}>
                  {t('— إجازة أسبوعية —')}
                </td>
              </tr>

              {/* Saturday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">{t('السبت')}</span>
                  <div className="text-[10px] text-gray-400 mt-1">5 {t('يوليو')}</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-red-50/30" colSpan={2}>
                  <div className="bg-red-100 text-red-950 border border-red-300 rounded-lg p-2.5 text-start text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-red-900 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-red-200 px-1.5 py-0.5 rounded text-red-900 border border-red-300 w-fit">{t('قريباً')}</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 {t('جلسة محاكاة (Mock Interview)')}</span>
                    </div>
                    <p className="text-[10px] mt-1 text-red-900/80">⏰ 18:00 - 20:00</p>
                    <p className="text-[10px] text-red-900/80">🏷️ {t('تدريب على المقابلات')}</p>
                    <p className="text-[10px] text-red-900/80">🏛️ 🌐 {t('أونلاين')} | {t('أ. مريم')}</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
