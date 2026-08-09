import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AddStudentsModal from '../modals/AddStudentsModal';
import AddGroupTaskModal from '../modals/AddGroupTaskModal';
import AddStudentNoteModal from '../modals/AddStudentNoteModal';
import StudentDetailsModal from '../modals/StudentDetailsModal';
import InstructorDetailsModal from '../modals/InstructorDetailsModal';
import type { GroupStudent, SharedGroup, Instructor } from '../../types';

export default function InstructorDashboard() {
  const { showToast, lang, t, role, setSharedLectures, sharedGroups, setSharedGroups, instructors } = useApp();

  const isManager = role === 'recruiter' || role === 'admin';
  const isInstructor = role === 'instructor' || role === 'admin';

  // New Modals State
  const [addStudentsModalData, setAddStudentsModalData] = useState<{ isOpen: boolean; groupId: string; groupName: string; initialTab?: 'form' | 'excel' }>({ isOpen: false, groupId: '', groupName: '', initialTab: 'form' });
  const [addTaskModalData, setAddTaskModalData] = useState<{ isOpen: boolean; groupId: string; groupName: string; instructorName: string }>({ isOpen: false, groupId: '', groupName: '', instructorName: '' });
  const [addNoteModalData, setAddNoteModalData] = useState<{ isOpen: boolean; studentId: string; studentName: string; groupId: string; groupName: string; instructorName: string }>({ isOpen: false, studentId: '', studentName: '', groupId: '', groupName: '', instructorName: '' });
  const [studentDetailsData, setStudentDetailsData] = useState<{ isOpen: boolean; student: GroupStudent | null; group: SharedGroup | null }>({ isOpen: false, student: null, group: null });
  const [instructorDetailsModalData, setInstructorDetailsModalData] = useState<{ isOpen: boolean; instructor: Instructor | null }>({ isOpen: false, instructor: null });

  // Lectures Timetable State
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

    const newGrp: SharedGroup = {
      id: `grp-${Date.now()}`,
      groupName: newGrpName,
      courseName: newGrpCourse,
      instructorName: newGrpInstructor,
      studentsCount: parseInt(newGrpStudents) || 0,
      students: [],
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
      {/* Full Weekly Schedule Table (Instructor / Student View Only - Hidden for Training Manager) */}
      {role !== 'recruiter' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>📅</span>
              <span>{t('الجدول الأسبوعي الكامل')}</span>
            </h3>
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
                {['07:00 - 09:00', '09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00', '21:00 - 23:00', '23:00 - 00:00'].map(slot => (
                  <th key={slot} className="border border-gray-200 p-2 text-center text-[11px] font-extrabold text-brand-900">{slot}</th>
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
      )}

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
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{lang === 'ar' ? 'مجموعات التدريب للمحاضرين' : 'Instructor Training Groups'}</span>
                <span className="bg-red-50 text-brand-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold border border-red-100">
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
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">{lang === 'ar' ? 'جميع المحاضرين' : 'All Instructors'}</option>
                {instructorOptions.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Add New Group Button (Training Manager Only) */}
            {isManager && (
              <button
                onClick={() => setIsAddGroupModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-brand-600/20 flex items-center gap-1.5"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {sharedGroups
            .filter(g => selectedInstructor === 'all' || g.instructorName === selectedInstructor)
            .map(grp => (
              <div key={grp.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition-all space-y-4 relative flex flex-col justify-between" style={{ boxShadow: '0 0 12px rgba(239,68,68,0.04)' }}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                        <span>{grp.groupName}</span>
                        <span className="bg-red-50 text-brand-700 text-[10px] px-2 py-0.5 rounded-md font-mono border border-red-100 font-bold">
                          {grp.studentsCount} {lang === 'ar' ? 'طالب' : 'students'}
                        </span>
                      </h3>
                      <p className="text-xs text-brand-600 font-extrabold mt-0.5">{grp.courseName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${grp.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : (grp.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200')
                      }`}>
                      {grp.status === 'active' ? (lang === 'ar' ? 'نشطة' : 'Active') : (grp.status === 'upcoming' ? (lang === 'ar' ? 'قادمة' : 'Upcoming') : (lang === 'ar' ? 'مكتملة' : 'Completed'))}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 font-medium block">{lang === 'ar' ? 'المحاضر المسؤول:' : 'Instructor:'}</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                        <span>{grp.instructorName}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium block">{lang === 'ar' ? 'المواعيد والمكان:' : 'Schedule & Location:'}</span>
                      <span className="font-bold text-gray-700 text-[11px] block truncate">{grp.schedule}</span>
                    </div>
                  </div>

                  {/* Group Action Buttons Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                    {/* Training Manager Action: Add Students via Form or Excel (Separate Buttons) */}
                    {isManager && (
                      <>
                        <button
                          onClick={() => setAddStudentsModalData({ isOpen: true, groupId: grp.id, groupName: grp.groupName, initialTab: 'form' })}
                          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm shadow-brand-600/20 transition-all flex items-center justify-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                          <span>{lang === 'ar' ? '+ إضافة طالب (Form)' : '+ Add Student (Form)'}</span>
                        </button>
                        <button
                          onClick={() => setAddStudentsModalData({ isOpen: true, groupId: grp.id, groupName: grp.groupName, initialTab: 'excel' })}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <span>{lang === 'ar' ? '📥 رفع طلاب (Excel)' : 'Upload Excel'}</span>
                        </button>
                      </>
                    )}

                    {/* Instructor Action: Add Task for Whole Group */}
                    {isInstructor && (
                      <button
                        onClick={() => setAddTaskModalData({ isOpen: true, groupId: grp.id, groupName: grp.groupName, instructorName: grp.instructorName })}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-sm shadow-brand-600/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        <span>{lang === 'ar' ? 'إضافة تاسك للجروب' : 'Add Group Task'}</span>
                      </button>
                    )}
                  </div>

                  {/* Students Breakdown List Section */}
                  <div className="bg-gray-50/70 rounded-xl border border-gray-200 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-gray-200/60 pb-1.5">
                      <span className="font-extrabold text-gray-800 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{lang === 'ar' ? 'طلاب الجروب:' : 'Group Students:'}</span>
                      </span>
                      <span className="text-[11px] font-bold text-gray-400">
                        {grp.students && grp.students.length > 0 ? `${grp.students.length} ${lang === 'ar' ? 'مسجلين' : 'enrolled'}` : (lang === 'ar' ? 'لا يوجد طلاب بعد' : 'No students yet')}
                      </span>
                    </div>

                    {!grp.students || grp.students.length === 0 ? (
                      <p className="text-[11px] text-gray-400 font-medium text-center py-2">
                        {lang === 'ar' ? 'اضغط على "إضافة طلاب" لإضافة أعضاء الجروب' : 'Click "Add Students" to add group members'}
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
                        {grp.students.map(std => (
                          <div key={std.id} className="flex items-center justify-between gap-2 p-2 bg-white hover:bg-red-50/50 rounded-lg text-xs transition-colors border border-gray-100 shadow-2xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-md bg-red-50 text-brand-600 font-bold border border-red-100 flex items-center justify-center text-[11px]">
                                {std.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-extrabold text-gray-800 text-[11px] truncate">{std.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{std.code}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {/* Manager & Instructor: Inspect student profile, notes, and tasks */}
                              <button
                                onClick={() => setStudentDetailsData({ isOpen: true, student: std, group: grp })}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1"
                                title={lang === 'ar' ? 'عرض تفاصيل وملاحظات الطالب' : 'View student notes & tasks'}
                              >
                                <span>{lang === 'ar' ? '🔍 التفاصيل' : '🔍 Details'}</span>
                              </button>

                              {/* Instructor: Add note specifically for student */}
                              {isInstructor && (
                                <button
                                  onClick={() => setAddNoteModalData({
                                    isOpen: true,
                                    studentId: std.id,
                                    studentName: std.name,
                                    groupId: grp.id,
                                    groupName: grp.groupName,
                                    instructorName: grp.instructorName
                                  })}
                                  className="bg-red-50 hover:bg-red-100 text-brand-700 border border-red-200 px-2 py-1 rounded-md text-[10px] font-bold transition-all"
                                  title={lang === 'ar' ? 'إضافة ملاحظة للطالب' : 'Add Note'}
                                >
                                  <span>{lang === 'ar' ? '✍️ ملاحظة' : '✍️ Note'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {isManager && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setSharedGroups(prev => prev.filter(g => g.id !== grp.id));
                        showToast(lang === 'ar' ? `✓ تم حذف مجموعة ${grp.groupName}` : `✓ Removed ${grp.groupName}`, 'success');
                      }}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1"
                      title={lang === 'ar' ? 'حذف المجموعة' : 'Delete Group'}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <span>{lang === 'ar' ? 'حذف المجموعة' : 'Delete Group'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Instructors & Specializations Table (Training Manager Only) */}
      {isManager && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                👨‍🏫
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base">
                  {lang === 'ar' ? 'جدول المحاضرين والتخصصات' : 'Instructors & Specializations Table'}
                </h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  {lang === 'ar' ? 'اضغط على أي محاضر لاستعراض البيانات التفصيلية والمجموعات المسندة له ومواعيد المحاضرات' : 'Click any row to inspect detailed profile, assigned groups, and schedules'}
                </p>
              </div>
            </div>
            <span className="bg-brand-50 text-brand-700 border border-brand-200 text-xs px-3 py-1 rounded-full font-bold self-start sm:self-center">
              {instructors.length} {lang === 'ar' ? 'محاضر مسجل' : 'instructors'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 font-extrabold uppercase border-b border-gray-200">
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'المحاضر' : 'Instructor'}</th>
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'التخصص / المادة' : 'Specialization'}</th>
                  <th className="p-3.5 text-center">{lang === 'ar' ? 'المجموعات المسندة' : 'Assigned Groups'}</th>
                  <th className="p-3.5 text-center">{lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</th>
                  <th className="p-3.5 text-center">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {instructors.map((ins, idx) => {
                  const assigned = sharedGroups.filter(g => g.instructorName === ins.name);
                  const totalStds = assigned.reduce((acc, g) => acc + (g.students ? g.students.length : g.studentsCount), 0);

                  return (
                    <tr
                      key={idx}
                      onClick={() => setInstructorDetailsModalData({ isOpen: true, instructor: ins })}
                      className="hover:bg-brand-50/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-extrabold text-gray-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 font-bold border border-brand-100 flex items-center justify-center text-xs">
                          {ins.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900">{ins.name}</div>
                          <div className="text-[10px] text-gray-400 font-semibold">{ins.email || 'instructor@sanadak.edu'}</div>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-brand-700">{ins.course}</td>
                      <td className="p-3.5 text-center font-extrabold text-gray-800">
                        <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200">
                          {assigned.length} {lang === 'ar' ? 'جروب' : 'groups'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-extrabold text-emerald-700">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200 font-mono">
                          {totalStds} {lang === 'ar' ? 'طالب' : 'students'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInstructorDetailsModalData({ isOpen: true, instructor: ins });
                          }}
                          className="bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all shadow-2xs"
                        >
                          🔍 {lang === 'ar' ? 'التفاصيل' : 'Details'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'اختيار اسم المحاضر *' : 'Select Instructor *'}</label>
                <select
                  value={newGrpInstructor}
                  onChange={e => setNewGrpInstructor(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
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
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">{lang === 'ar' ? 'نوع الحضور' : 'Attendance Mode'}</label>
                <select
                  value={newGrpType}
                  onChange={e => setNewGrpType(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="active">{lang === 'ar' ? 'نشطة / مستمرة' : 'Active'}</option>
                  <option value="upcoming">{lang === 'ar' ? 'قادمة' : 'Upcoming'}</option>
                  <option value="completed">{lang === 'ar' ? 'مكتملة' : 'Completed'}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all">
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

      {/* Modals for Group & Student Management */}
      <AddStudentsModal
        isOpen={addStudentsModalData.isOpen}
        onClose={() => setAddStudentsModalData({ isOpen: false, groupId: '', groupName: '' })}
        groupId={addStudentsModalData.groupId}
        groupName={addStudentsModalData.groupName}
        initialTab={addStudentsModalData.initialTab}
      />

      <AddGroupTaskModal
        isOpen={addTaskModalData.isOpen}
        onClose={() => setAddTaskModalData({ isOpen: false, groupId: '', groupName: '', instructorName: '' })}
        groupId={addTaskModalData.groupId}
        groupName={addTaskModalData.groupName}
        instructorName={addTaskModalData.instructorName}
      />

      <AddStudentNoteModal
        isOpen={addNoteModalData.isOpen}
        onClose={() => setAddNoteModalData({ isOpen: false, studentId: '', studentName: '', groupId: '', groupName: '', instructorName: '' })}
        studentId={addNoteModalData.studentId}
        studentName={addNoteModalData.studentName}
        groupId={addNoteModalData.groupId}
        groupName={addNoteModalData.groupName}
        instructorName={addNoteModalData.instructorName}
      />

      <StudentDetailsModal
        isOpen={studentDetailsData.isOpen}
        onClose={() => setStudentDetailsData({ isOpen: false, student: null, group: null })}
        student={studentDetailsData.student}
        group={studentDetailsData.group}
      />

      <InstructorDetailsModal
        isOpen={instructorDetailsModalData.isOpen}
        onClose={() => setInstructorDetailsModalData({ isOpen: false, instructor: null })}
        instructor={instructorDetailsModalData.instructor}
      />
    </div>
  );
}
