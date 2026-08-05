import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function InstructorDashboard() {
  const { showToast, lang, t, role, sharedLectures, setSharedLectures, sharedGroups, setSharedGroups } = useApp();

  const isAuthorized = role === 'instructor' || role === 'admin';

  // Lectures Timetable State
  const [lectureFilter, setLectureFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [lectureSearch, setLectureSearch] = useState('');
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  
  // New Lecture Form State
  const [newLecCourse, setNewLecCourse] = useState('');
  const [newLecTopic, setNewLecTopic] = useState('');
  const [newLecBatch, setNewLecBatch] = useState('');
  const [newLecDate, setNewLecDate] = useState('');
  const [newLecTime, setNewLecTime] = useState('');
  const [newLecType, setNewLecType] = useState<'online' | 'in_person'>('online');
  const [newLecLocation, setNewLecLocation] = useState('');
  const [newLecStudents, setNewLecStudents] = useState('25');

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLecCourse || !newLecTopic || !newLecDate) {
      showToast(lang === 'ar' ? '⚠️ يرجى تعبئة كافة الحقول المطلوبة' : '⚠️ Please fill in all required fields', 'warning');
      return;
    }

    const newLec = {
      id: `lec-${Date.now()}`,
      courseName: newLecCourse,
      topic: newLecTopic,
      batch: newLecBatch || (lang === 'ar' ? 'الدفعة الجديدة' : 'New Batch'),
      instructorName: lang === 'ar' ? 'خالد أحمد' : 'Khaled Ahmed',
      date: newLecDate,
      time: newLecTime || '06:00 PM',
      type: newLecType,
      location: newLecLocation || (newLecType === 'online' ? 'Zoom Meeting' : (lang === 'ar' ? 'قاعة التدريب 1' : 'Hall 1')),
      studentsCount: parseInt(newLecStudents) || 20,
      status: 'upcoming' as const
    };

    setSharedLectures(prev => [newLec, ...prev]);
    showToast(lang === 'ar' ? '✓ تم إضافة المحاضرة للجدول وتحديث جدول الطلاب' : '✓ Lecture added and synchronized with student portal', 'success');
    setIsAddLectureModalOpen(false);
    setNewLecCourse('');
    setNewLecTopic('');
    setNewLecBatch('');
    setNewLecDate('');
    setNewLecTime('');
    setNewLecLocation('');
  };

  // Instructors List for Selection
  const instructorOptions = [
    lang === 'ar' ? 'خالد أحمد' : 'Khaled Ahmed',
    lang === 'ar' ? 'مريم حسن' : 'Maryam Hassan',
    lang === 'ar' ? 'عمر فاروق' : 'Omar Farouk',
    lang === 'ar' ? 'أحمد المصري' : 'Ahmed Elmasry',
  ];

  // Selected Instructor Filter
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  
  // Add Group Modal State
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [newGrpName, setNewGrpName] = useState('');
  const [newGrpCourse, setNewGrpCourse] = useState('');
  const [newGrpInstructor, setNewGrpInstructor] = useState(instructorOptions[0]);
  const [newGrpStudents, setNewGrpStudents] = useState('25');
  const [newGrpSchedule, setNewGrpSchedule] = useState('');
  const [newGrpLocation, setNewGrpLocation] = useState('');
  const [newGrpType, setNewGrpType] = useState<'online' | 'in_person'>('online');
  const [newGrpStatus, setNewGrpStatus] = useState<'active' | 'upcoming' | 'completed'>('active');

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrpName || !newGrpCourse || !newGrpInstructor) {
      showToast(lang === 'ar' ? '⚠️ يرجى تعبئة كافة الحقول المطلوبة' : '⚠️ Please fill in all required fields', 'warning');
      return;
    }

    const newGrp = {
      id: `grp-${Date.now()}`,
      groupName: newGrpName,
      courseName: newGrpCourse,
      instructorName: newGrpInstructor,
      studentsCount: parseInt(newGrpStudents) || 20,
      schedule: newGrpSchedule || (lang === 'ar' ? 'الأحد والأربعاء (06:00 م)' : 'Sun & Wed (06:00 PM)'),
      location: newGrpLocation || (newGrpType === 'online' ? 'Zoom Meeting' : (lang === 'ar' ? 'قاعة التدريب 2' : 'Hall 2')),
      type: newGrpType,
      status: newGrpStatus
    };

    setSharedGroups(prev => [newGrp, ...prev]);
    showToast(lang === 'ar' ? `✓ تم إضافة مجموعة (${newGrpName}) للمحاضر ${newGrpInstructor} بنجاح` : `✓ Group (${newGrpName}) added for ${newGrpInstructor}`, 'success');
    setIsAddGroupModalOpen(false);
    setNewGrpName('');
    setNewGrpCourse('');
    setNewGrpSchedule('');
    setNewGrpLocation('');
  };

  return (
    <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Instructor Lectures Timetable */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{lang === 'ar' ? 'جدول المحاضرات للانستراكتور' : 'Instructor Lectures Schedule'}</span>
                <span className="bg-brand-100 text-brand-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {sharedLectures.length} {lang === 'ar' ? 'محاضرة' : 'lectures'}
                </span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {lang === 'ar' ? 'استعراض المحاضرات المجدولة، البث المباشر، وتفاصيل الجلسات والطلاب' : 'View scheduled lectures, live streams, and session details'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={lectureSearch}
                onChange={e => setLectureSearch(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث عن محاضرة أو مادة...' : 'Search lecture or course...'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 pe-8"
              />
              <svg className="w-4 h-4 text-gray-400 absolute end-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Add Lecture Button */}
            {isAuthorized && (
              <button
                onClick={() => setIsAddLectureModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-brand-600/20 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>{lang === 'ar' ? 'إضافة محاضرة جديدة' : 'Add New Lecture'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: lang === 'ar' ? 'جميع المحاضرات' : 'All Lectures' },
            { key: 'live', label: lang === 'ar' ? '🔴 جارية الآن' : '🔴 Live Now' },
            { key: 'upcoming', label: lang === 'ar' ? 'المحاضرات القادمة' : 'Upcoming' },
            { key: 'completed', label: lang === 'ar' ? 'المكتملة' : 'Completed' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setLectureFilter(tab.key as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                lectureFilter === tab.key
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lectures Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs text-right text-gray-700">
            <thead className="bg-gray-50/80 text-gray-500 uppercase font-extrabold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 text-start">{lang === 'ar' ? 'اسم الدورة / المادة' : 'Course Name'}</th>
                <th className="px-4 py-3.5 text-start">{lang === 'ar' ? 'عنوان المحاضرة' : 'Lecture Topic'}</th>
                <th className="px-4 py-3.5 text-start">{lang === 'ar' ? 'الدفعة' : 'Batch'}</th>
                <th className="px-4 py-3.5 text-start">{lang === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}</th>
                <th className="px-4 py-3.5 text-start">{lang === 'ar' ? 'نوع الحضور والمكان' : 'Attendance Mode & Location'}</th>
                <th className="px-4 py-3.5 text-center">{lang === 'ar' ? 'الطلاب' : 'Students'}</th>
                <th className="px-4 py-3.5 text-center">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="px-4 py-3.5 text-center">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sharedLectures
                .filter(lec => {
                  if (lectureFilter === 'live') return lec.status === 'live';
                  if (lectureFilter === 'upcoming') return lec.status === 'upcoming';
                  if (lectureFilter === 'completed') return lec.status === 'completed';
                  return true;
                })
                .filter(lec => {
                  if (!lectureSearch.trim()) return true;
                  const query = lectureSearch.toLowerCase();
                  return lec.courseName.toLowerCase().includes(query) || lec.topic.toLowerCase().includes(query) || lec.batch.toLowerCase().includes(query);
                })
                .map(lec => (
                  <tr key={lec.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gray-900">{lec.courseName}</td>
                    <td className="px-4 py-3.5 font-medium text-gray-800">{lec.topic}</td>
                    <td className="px-4 py-3.5 text-gray-500 font-medium">
                      <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md text-[11px]">
                        {lec.batch}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-semibold whitespace-nowrap">
                      <div>{lec.date}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{lec.time}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${lec.type === 'online' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                        <span className="font-bold text-gray-800">{lec.type === 'online' ? (lang === 'ar' ? 'أونلاين' : 'Online') : (lang === 'ar' ? 'حضوري' : 'In-Person')}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate max-w-[180px]">{lec.location}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-gray-700">{lec.studentsCount}</td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {lec.status === 'live' && (
                        <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center justify-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <span>{lang === 'ar' ? 'جارية الآن' : 'Live Now'}</span>
                        </span>
                      )}
                      {lec.status === 'upcoming' && (
                        <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[11px] font-extrabold">
                          {lang === 'ar' ? 'قادمة' : 'Upcoming'}
                        </span>
                      )}
                      {lec.status === 'completed' && (
                        <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold">
                          {lang === 'ar' ? 'مكتملة' : 'Completed'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {lec.status === 'live' && (
                          <button
                            onClick={() => showToast(lang === 'ar' ? `🚀 جاري الانضمام للبث المباشر: ${lec.topic}` : `🚀 Joining Live Stream: ${lec.topic}`, 'success')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-sm transition-all flex items-center gap-1"
                          >
                            <span>{lang === 'ar' ? 'بدء البث' : 'Start Stream'}</span>
                          </button>
                        )}
                        {lec.status === 'upcoming' && (
                          <button
                            onClick={() => showToast(lang === 'ar' ? `✓ تم التجهيز لفتح القاعة الإلكترونية للمحاضرة` : `✓ Preparing session room`, 'info')}
                            className="bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all"
                          >
                            <span>{lang === 'ar' ? 'انضمام' : 'Join'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => showToast(lang === 'ar' ? `📝 فتح سجل تحضير الحضور لـ ${lec.topic}` : `📝 Opening Attendance Sheet for ${lec.topic}`, 'info')}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all"
                          title={lang === 'ar' ? 'تسجيل الحضور' : 'Attendance'}
                        >
                          {lang === 'ar' ? 'الحضور' : 'Attendance'}
                        </button>
                        {isAuthorized && (
                          <button
                            onClick={() => {
                              setSharedLectures(prev => prev.filter(l => l.id !== lec.id));
                              showToast(lang === 'ar' ? '✓ تم إزالة المحاضرة من الجدول وتحديث بوابات الطلاب' : '✓ Lecture removed and student portals updated', 'success');
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                            title={lang === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t('الدورات النشطة'), val: '3' },
          { label: t('عدد الطلاب'), val: '87' },
          { label: t('الجلسة القادمة'), val: lang === 'ar' ? 'غداً، 8:00 م' : 'Tomorrow, 8:00 PM', color: 'text-brand-600', size: 'text-lg' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all" style={{ boxShadow: '0 0 10px rgba(239,68,68,0.05)' }}>
            <p className="text-gray-500 text-sm font-semibold mb-1">{s.label}</p>
            <p className={`font-black text-gray-900 ${s.color || ''} ${s.size || 'text-3xl'}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Instructor Groups Box Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{lang === 'ar' ? 'مجموعات التدريب للمحاضرين' : 'Instructor Training Groups'}</span>
                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                  {sharedGroups.filter(g => selectedInstructor === 'all' || g.instructorName === selectedInstructor).length} {lang === 'ar' ? 'مجموعة' : 'groups'}
                </span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {lang === 'ar' ? 'عرض المجموعات الخاصة بكل محاضر وتخصيص المجموعات الجديدة' : 'Display assigned groups for each instructor and add new groups'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Select Instructor Dropdown Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-gray-500 whitespace-nowrap">
                {lang === 'ar' ? 'تصفية حسب المحاضر:' : 'Filter by Instructor:'}
              </span>
              <select
                value={selectedInstructor}
                onChange={e => setSelectedInstructor(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{lang === 'ar' ? 'جميع المحاضرين' : 'All Instructors'}</option>
                {instructorOptions.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Add New Group Button */}
            {isAuthorized && (
              <button
                onClick={() => setIsAddGroupModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>{lang === 'ar' ? 'إضافة مجموعة جديدة' : 'Add New Group'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Groups Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {sharedGroups
            .filter(g => selectedInstructor === 'all' || g.instructorName === selectedInstructor)
            .map(grp => (
              <div key={grp.id} className="bg-gray-50/70 border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all space-y-3 relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">{grp.groupName}</h3>
                    <p className="text-xs text-purple-700 font-bold mt-0.5">{grp.courseName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                    grp.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : (grp.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200')
                  }`}>
                    {grp.status === 'active' ? (lang === 'ar' ? 'نشطة' : 'Active') : (grp.status === 'upcoming' ? (lang === 'ar' ? 'قادمة' : 'Upcoming') : (lang === 'ar' ? 'مكتملة' : 'Completed'))}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-200/80">
                  <div>
                    <span className="text-gray-400 font-medium block">{lang === 'ar' ? 'المحاضر المسؤول:' : 'Instructor:'}</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      <span>{grp.instructorName}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block">{lang === 'ar' ? 'عدد الطلاب:' : 'Students:'}</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{grp.studentsCount} {lang === 'ar' ? 'طالب' : 'students'}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-white p-2.5 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{grp.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{grp.location}</span>
                  </div>
                </div>

                {isAuthorized && (
                  <button
                    onClick={() => {
                      setSharedGroups(prev => prev.filter(g => g.id !== grp.id));
                      showToast(lang === 'ar' ? `✓ تم حذف مجموعة ${grp.groupName}` : `✓ Removed ${grp.groupName}`, 'success');
                    }}
                    className="absolute bottom-3 end-3 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-all"
                    title={lang === 'ar' ? 'حذف المجموعة' : 'Delete Group'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Add New Lecture Modal */}
      {isAddLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddLectureModalOpen(false)} />
          <form
            onSubmit={handleAddLecture}
            className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-100 space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsAddLectureModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{lang === 'ar' ? 'إضافة محاضرة جديدة للجدول' : 'Add New Scheduled Lecture'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'اسم الدورة / المادة *' : 'Course Name *'}</label>
                <input
                  type="text"
                  required
                  value={newLecCourse}
                  onChange={e => setNewLecCourse(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: تطوير تطبيقات React' : 'e.g. React Web Dev'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'الدفعة / المجموعة' : 'Batch / Group'}</label>
                <input
                  type="text"
                  value={newLecBatch}
                  onChange={e => setNewLecBatch(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الدفعة 14 — مجموعة أ' : 'e.g. Batch 14 - Group A'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'عنوان وتفاصيل المحاضرة *' : 'Lecture Topic *'}</label>
              <input
                type="text"
                required
                value={newLecTopic}
                onChange={e => setNewLecTopic(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: المحاضرة 10: Performance Optimization' : 'e.g. Lecture 10: Performance'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'التاريخ *' : 'Date *'}</label>
                <input
                  type="date"
                  required
                  value={newLecDate}
                  onChange={e => setNewLecDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'الوقت' : 'Time'}</label>
                <input
                  type="text"
                  value={newLecTime}
                  onChange={e => setNewLecTime(e.target.value)}
                  placeholder={lang === 'ar' ? '06:00 م - 08:30 م' : '06:00 PM - 08:30 PM'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'نوع الحضور' : 'Attendance Mode'}</label>
                <select
                  value={newLecType}
                  onChange={e => setNewLecType(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="online">{lang === 'ar' ? 'أونلاين (Online)' : 'Online'}</option>
                  <option value="in_person">{lang === 'ar' ? 'حضوري (In-Person)' : 'In-Person'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'عدد الطلاب المتوقع' : 'Students Count'}</label>
                <input
                  type="number"
                  value={newLecStudents}
                  onChange={e => setNewLecStudents(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'رابط القاعة / مكان المحاضرة' : 'Location / Meeting Link'}</label>
              <input
                type="text"
                value={newLecLocation}
                onChange={e => setNewLecLocation(e.target.value)}
                placeholder={lang === 'ar' ? 'رابط Zoom/Teams أو اسم القاعة' : 'Zoom link or Hall name'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all">
                {lang === 'ar' ? 'إضافة المحاضرة' : 'Add Lecture'}
              </button>
              <button
                type="button"
                onClick={() => setIsAddLectureModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold transition-all"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Group Modal */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddGroupModalOpen(false)} />
          <form
            onSubmit={handleAddGroup}
            className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-100 space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsAddGroupModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{lang === 'ar' ? 'إضافة مجموعة جديدة وتعيين محاضر' : 'Add New Group & Assign Instructor'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'اسم المجموعة *' : 'Group Name *'}</label>
                <input
                  type="text"
                  required
                  value={newGrpName}
                  onChange={e => setNewGrpName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الدفعة 16 — مجموعة د' : 'e.g. Batch 16 - Group D'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'اسم الدورة / المادة *' : 'Course Name *'}</label>
                <input
                  type="text"
                  required
                  value={newGrpCourse}
                  onChange={e => setNewGrpCourse(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: تطوير تطبيقات React.js' : 'e.g. React.js Dev'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'اختيار اسم المحاضر *' : 'Select Instructor *'}</label>
                <select
                  value={newGrpInstructor}
                  onChange={e => setNewGrpInstructor(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {instructorOptions.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'عدد الطلاب' : 'Students Count'}</label>
                <input
                  type="number"
                  value={newGrpStudents}
                  onChange={e => setNewGrpStudents(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'مواعيد المحاضرات' : 'Schedule Days & Time'}</label>
              <input
                type="text"
                value={newGrpSchedule}
                onChange={e => setNewGrpSchedule(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: الأحد والأربعاء (06:00 م - 08:30 م)' : 'e.g. Sun & Wed (06:00 PM)'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'نوع الحضور' : 'Attendance Mode'}</label>
                <select
                  value={newGrpType}
                  onChange={e => setNewGrpType(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="online">{lang === 'ar' ? 'أونلاين (Online)' : 'Online'}</option>
                  <option value="in_person">{lang === 'ar' ? 'حضوري (In-Person)' : 'In-Person'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'حالة المجموعة' : 'Group Status'}</label>
                <select
                  value={newGrpStatus}
                  onChange={e => setNewGrpStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">{lang === 'ar' ? 'نشطة / مستمرة' : 'Active'}</option>
                  <option value="upcoming">{lang === 'ar' ? 'قادمة' : 'Upcoming'}</option>
                  <option value="completed">{lang === 'ar' ? 'مكتملة' : 'Completed'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'مكان / رابط المحاضرات' : 'Location / Link'}</label>
              <input
                type="text"
                value={newGrpLocation}
                onChange={e => setNewGrpLocation(e.target.value)}
                placeholder={lang === 'ar' ? 'رابط Zoom أو رقم القاعة' : 'Zoom link or Hall number'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all">
                {lang === 'ar' ? 'إضافة المجموعة' : 'Add Group'}
              </button>
              <button
                type="button"
                onClick={() => setIsAddGroupModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold transition-all"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
