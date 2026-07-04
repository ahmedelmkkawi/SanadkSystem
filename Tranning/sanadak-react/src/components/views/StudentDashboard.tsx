import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface StudentDashboardProps {
  sessionRatings: Record<string, number>;
  onOpenRatingModal: (sessionName: string, rowId: string) => void;
}

export default function StudentDashboard({ sessionRatings, onOpenRatingModal }: StudentDashboardProps) {
  const { showToast, pushToUndoStack } = useApp();
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
  const studentCalMonthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
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
      showToast('✓ تم اختيار الحضور أونلاين • [تراجع]', 'success', true);
    } else {
      showToast('✓ تم اختيار الحضور الشخصي • [تراجع]', 'success', true);
    }
  };

  const joinSession = (lectureIndex: number) => {
    const type = lectureAttendance[lectureIndex];
    if (!type || type === 'completed') {
      showToast('الرجاء اختيار نوع الحضور أولاً (أونلاين أو حضوري)', 'warning');
      return;
    }
    if (type === 'online') {
      showToast('🔗 جاري فتح رابط الجلسة على Zoom... يرجى الانتظار', 'info');
    } else {
      showToast('📍 تم تأكيد حضورك الشخصي — المقر: فرع المعادي، الدور الثالث', 'info');
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
      
      const tooltip = isAttended ? 'تم الحضور ✓' : isAbsent ? 'غياب ✗' : isLecture ? 'يوم محاضرة' : `يوم ${d}`;
      
      cells.push(
        <div 
          key={d} 
          className={classes} 
          onClick={() => showToast(`${tooltip} — يوم ${d} ${studentCalMonthNames[studentCalMonth]}`, 'info')}
          title={tooltip}
        >
          {d}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      {/* Top Section: Progress & General Attendance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm flex flex-col justify-center items-center">
          <h3 className="font-bold text-gray-500 text-sm mb-6">نسبة إنجاز الدورة</h3>
          <div className="relative w-36 h-36 mx-auto">
            <svg className="w-36 h-36 circular-progress" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f4f4f5" strokeWidth="6"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="70.75" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900 neon-text-glow">75%</span>
              <span className="text-xs text-gray-400">مكتمل</span>
            </div>
          </div>
        </div>

        {/* Detailed Attendance Stats */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">إحصائيات الحضور</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">سجل الحضور العام</h3>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">يوليو 2026</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-2xl font-black text-emerald-600">18</p>
              <p className="text-xs text-emerald-500 font-semibold mt-1">جلسة حضرتها</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-2xl font-black text-brand-600">4</p>
              <p className="text-xs text-brand-500 font-semibold mt-1">جلسات غياب</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-2xl font-black text-blue-600">22</p>
              <p className="text-xs text-blue-500 font-semibold mt-1">إجمالي الجلسات</p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">نسبة الحضور الإجمالية</span>
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
              <p className="text-sm font-bold text-gray-800">أداء الحضور جيد 👏</p>
              <p className="text-xs text-gray-400">حافظ على نسبة حضور لا تقل عن 80% للحصول على الشهادة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">جدول المحاضرات</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setScheduleView('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scheduleView === 'weekly' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scheduleView === 'monthly' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              شهري
            </button>
          </div>
        </div>

        {/* Weekly View */}
        {scheduleView === 'weekly' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-5 py-3 text-right">التاريخ</th>
                  <th className="px-5 py-3 text-right">المحاضرة</th>
                  <th className="px-5 py-3 text-right">المحاضر</th>
                  <th className="px-5 py-3 text-right">الوقت</th>
                  <th className="px-5 py-3 text-center">نوع الحضور</th>
                  <th className="px-5 py-3 text-center">الإجراء</th>
                  <th className="px-5 py-3 text-center">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Lecture 0 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex flex-col items-center justify-center">
                      <span className="text-brand-600 text-[10px] font-bold">يوليو</span>
                      <span className="text-brand-600 text-base font-black leading-none">01</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 text-sm">React State Management</p>
                    <p className="text-xs text-gray-400 mt-0.5">الوحدة الثانية</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium text-sm">أ. خالد</td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-semibold">8:00 - 10:00 م</td>
                  <td className="px-5 py-4">
                    {lectureAttendance[0] === 'online' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(0, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-blue-400 bg-blue-100 text-blue-700">🌐 أونلاين</button>
                          <button onClick={() => setAttendanceType(0, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🏛 حضوري</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-blue-600">✓ أونلاين</span>
                      </div>
                    ) : lectureAttendance[0] === 'offline' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(0, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🌐 أونلاين</button>
                          <button onClick={() => setAttendanceType(0, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-emerald-400 bg-emerald-100 text-emerald-700">🏛 حضوري</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-emerald-600">✓ حضوري</span>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 justify-center">
                        <button onClick={() => setAttendanceType(0, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600">🌐 أونلاين</button>
                        <button onClick={() => setAttendanceType(0, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100">🏛 حضوري</button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => joinSession(0)} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md shadow-brand-600/20">انضمام</button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {sessionRatings['0'] ? (
                      <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">⭐ {sessionRatings['0']}/5</span>
                    ) : (
                      <button onClick={() => onOpenRatingModal('React State Management', '0')} className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1 mx-auto">تقييم</button>
                    )}
                  </td>
                </tr>

                {/* Lecture 1 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center">
                      <span className="text-blue-500 text-[10px] font-bold">يوليو</span>
                      <span className="text-blue-500 text-base font-black leading-none">03</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 text-sm">API Integration & Data Fetching</p>
                    <p className="text-xs text-gray-400 mt-0.5">الوحدة الثالثة</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium text-sm">أ. خالد</td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-semibold">8:00 - 10:00 م</td>
                  <td className="px-5 py-4">
                    {lectureAttendance[1] === 'online' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(1, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-blue-400 bg-blue-100 text-blue-700">🌐 أونلاين</button>
                          <button onClick={() => setAttendanceType(1, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🏛 حضوري</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-blue-600">✓ أونلاين</span>
                      </div>
                    ) : lectureAttendance[1] === 'offline' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(1, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🌐 أونلاين</button>
                          <button onClick={() => setAttendanceType(1, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-emerald-400 bg-emerald-100 text-emerald-700">🏛 حضوري</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-emerald-600">✓ حضوري</span>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 justify-center">
                        <button onClick={() => setAttendanceType(1, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600">🌐 أونلاين</button>
                        <button onClick={() => setAttendanceType(1, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100">🏛 حضوري</button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg font-semibold">قريباً</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {sessionRatings['1'] ? (
                      <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">⭐ {sessionRatings['1']}/5</span>
                    ) : (
                      <button onClick={() => onOpenRatingModal('API Integration & Data Fetching', '1')} className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1 mx-auto">تقييم</button>
                    )}
                  </td>
                </tr>

                {/* Lecture 2 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex flex-col items-center justify-center">
                      <span className="text-emerald-500 text-[10px] font-bold">يونيو</span>
                      <span className="text-emerald-500 text-base font-black leading-none">28</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 text-sm">React Fundamentals & JSX</p>
                    <p className="text-xs text-gray-400 mt-0.5">الوحدة الأولى</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium text-sm">أ. خالد</td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-semibold">8:00 - 10:00 م</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold">✓ تمت (أونلاين)</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl font-bold">مكتملة</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {sessionRatings['2'] ? (
                      <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">⭐ {sessionRatings['2']}/5</span>
                    ) : (
                      <button onClick={() => onOpenRatingModal('React Fundamentals & JSX', '2')} className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1 mx-auto">تقييم</button>
                    )}
                  </td>
                </tr>

                {/* Lecture 3 */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex flex-col items-center justify-center">
                      <span className="text-purple-500 text-[10px] font-bold">يوليو</span>
                      <span className="text-purple-500 text-base font-black leading-none">07</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900 text-sm">React Hooks & Context API</p>
                    <p className="text-xs text-gray-400 mt-0.5">الوحدة الرابعة</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium text-sm">أ. خالد</td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-semibold">8:00 - 10:00 م</td>
                  <td className="px-5 py-4">
                    {lectureAttendance[3] === 'online' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(3, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-blue-400 bg-blue-100 text-blue-700">🌐 أونلاين</button>
                          <button onClick={() => setAttendanceType(3, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🏛 حضوري</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-blue-600">✓ أونلاين</span>
                      </div>
                    ) : lectureAttendance[3] === 'offline' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => setAttendanceType(3, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500">🌐 أونلاين</button>
                          <button onClick={() => setAttendanceType(3, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-emerald-400 bg-emerald-100 text-emerald-700">🏛 حضوري</button>
                        </div>
                        <span className="text-center text-[10px] mt-1 font-semibold text-emerald-600">✓ حضوري</span>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 justify-center">
                        <button onClick={() => setAttendanceType(3, 'online')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600">🌐 أونلاين</button>
                        <button onClick={() => setAttendanceType(3, 'offline')} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100">🏛 حضوري</button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg font-semibold">قريباً</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {sessionRatings['3'] ? (
                      <span className="text-xs text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">⭐ {sessionRatings['3']}/5</span>
                    ) : (
                      <button onClick={() => onOpenRatingModal('React Hooks & Context API', '3')} className="text-brand-600 hover:text-brand-700 text-xs font-bold flex items-center gap-1 mx-auto">تقييم</button>
                    )}
                  </td>
                </tr>
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
              {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(d => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderStudentCalendar()}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> يوم محاضرة</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> تم الحضور</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> غياب</span>
            </div>
          </div>
        )}
      </div>

      {/* Full Weekly Schedule Table (Monday - Sunday hour grid) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">📅 الجدول الأسبوعي الكامل</h3>
            <p className="text-xs text-gray-400 mt-1">جميع المحاضرات والأنشطة مرتبة حسب أيام الأسبوع</p>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">الأسبوع الحالي</span>
        </div>
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[1250px] border-collapse border border-gray-200 text-right bg-white rounded-xl overflow-hidden shadow-sm table-fixed">
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
                <th className="border border-gray-200 p-4 text-center bg-gray-100/50">اليوم / الوقت</th>
                {['07:00 - 09:00', '09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00', '21:00 - 23:00', '23:00 - 00:00'].map(t => (
                  <th key={t} className="border border-gray-200 p-2 text-center text-[11px] font-extrabold text-brand-900">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {/* Sunday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">الأحد</span>
                  <div className="text-[10px] text-gray-400 mt-1">29 يونيو</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-emerald-50/30" colSpan={2}>
                  <div className="bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg p-2.5 text-right text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-emerald-800 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900 border border-emerald-300 w-fit">تم الحضور ✓</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 React State Management</span>
                    </div>
                    <p className="text-[10px] mt-1 text-emerald-900/80">⏰ 20:00 - 22:00</p>
                    <p className="text-[10px] text-emerald-900/80">🏷️ الثانية — تطبيقات عملية</p>
                    <p className="text-[10px] text-emerald-900/80">🏛️ 🌐 أونلاين | أ. خالد</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Monday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">الاثنين</span>
                  <div className="text-[10px] text-gray-400 mt-1">30 يونيو</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-emerald-50/30" colSpan={1}>
                  <div className="bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg p-2.5 text-right text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-emerald-800 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900 border border-emerald-300 w-fit">تم الحضور ✓</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 مراجعة وتمارين عملية</span>
                    </div>
                    <p className="text-[10px] mt-1 text-emerald-900/80">⏰ 19:00 - 21:00</p>
                    <p className="text-[10px] text-emerald-900/80">🏷️ تمارين تفاعلية Hooks</p>
                    <p className="text-[10px] text-emerald-900/80">🏛️ 🏛 حضوري | أ. خالد</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Tuesday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">الثلاثاء</span>
                  <div className="text-[10px] text-gray-400 mt-1">1 يوليو</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-amber-50/30" colSpan={2}>
                  <div className="bg-amber-100 text-amber-950 border border-amber-400 rounded-lg p-2.5 text-right text-xs leading-relaxed font-black shadow-md hover:shadow-lg transition-all ring-2 ring-amber-400/30 animate-pulse">
                    <div className="font-black text-amber-900 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-amber-200 px-1.5 py-0.5 rounded text-amber-900 border border-amber-400 w-fit">اليوم ●</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 API Integration & Fetch</span>
                    </div>
                    <p className="text-[10px] mt-1 text-amber-900/80">⏰ 20:00 - 22:00</p>
                    <p className="text-[10px] text-amber-900/80">🏷️ الثالثة — Axios & Fetch</p>
                    <p className="text-[10px] text-amber-900/80">🏛️ 🌐 أونلاين | أ. خالد</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Wednesday */}
              <tr className="hover:bg-gray-50/20 transition-colors bg-gray-50/30">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-400">الأربعاء</span>
                  <div className="text-[10px] text-gray-400 mt-1">2 يوليو</div>
                </td>
                <td className="border border-gray-200 p-4 text-center text-gray-400 font-bold bg-zinc-50/50" colSpan={9}>
                  — لا توجد محاضرات —
                </td>
              </tr>

              {/* Thursday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">الخميس</span>
                  <div className="text-[10px] text-gray-400 mt-1">3 يوليو</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-red-50/30" colSpan={2}>
                  <div className="bg-red-100 text-red-950 border border-red-300 rounded-lg p-2.5 text-right text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-red-900 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-red-200 px-1.5 py-0.5 rounded text-red-900 border border-red-300 w-fit">قريباً</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 React Router & Navigation</span>
                    </div>
                    <p className="text-[10px] mt-1 text-red-900/80">⏰ 20:00 - 22:00</p>
                    <p className="text-[10px] text-red-900/80">🏷️ الثالثة — التنقل بين الصفحات</p>
                    <p className="text-[10px] text-red-900/80">🏛️ 🌐 أونلاين | أ. خالد</p>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
              </tr>

              {/* Friday */}
              <tr className="hover:bg-gray-50/20 transition-colors bg-gray-50/30">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-400">الجمعة</span>
                  <div className="text-[10px] text-gray-400 mt-1">4 يوليو</div>
                </td>
                <td className="border border-gray-200 p-4 text-center text-gray-400 font-bold bg-zinc-50/50" colSpan={9}>
                  — إجازة أسبوعية —
                </td>
              </tr>

              {/* Saturday */}
              <tr className="hover:bg-gray-50/20 transition-colors">
                <td className="border border-gray-200 p-4 text-center bg-gray-50/50">
                  <span className="text-sm font-black text-gray-800">السبت</span>
                  <div className="text-[10px] text-gray-400 mt-1">5 يوليو</div>
                </td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-gray-50/5"></td>
                <td className="border border-gray-200 p-2 bg-red-50/30" colSpan={2}>
                  <div className="bg-red-100 text-red-950 border border-red-300 rounded-lg p-2.5 text-right text-xs leading-relaxed font-semibold shadow-sm hover:shadow transition-shadow">
                    <div className="font-bold text-red-900 mb-1 flex flex-col gap-1 items-start">
                      <span className="text-[9px] bg-red-200 px-1.5 py-0.5 rounded text-red-900 border border-red-300 w-fit">قريباً</span>
                      <span className="font-black text-[11px] leading-tight block mt-0.5">📚 جلسة محاكاة (Mock Interview)</span>
                    </div>
                    <p className="text-[10px] mt-1 text-red-900/80">⏰ 18:00 - 20:00</p>
                    <p className="text-[10px] text-red-900/80">🏷️ تدريب على المقابلات</p>
                    <p className="text-[10px] text-red-900/80">🏛️ 🌐 أونلاين | أ. مريم</p>
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
