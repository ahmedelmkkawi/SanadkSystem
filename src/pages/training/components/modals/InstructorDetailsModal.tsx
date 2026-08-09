import { useApp } from '../../context/AppContext';
import type { Instructor } from '../../types';

interface InstructorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: Instructor | null;
}

export default function InstructorDetailsModal({ isOpen, onClose, instructor }: InstructorDetailsModalProps) {
  const { lang, sharedGroups, sharedLectures } = useApp();

  if (!isOpen || !instructor) return null;

  // Filter groups assigned to this instructor
  const assignedGroups = sharedGroups.filter(g => g.instructorName === instructor.name);

  // Filter lectures assigned to this instructor
  const assignedLectures = sharedLectures.filter(l => l.instructorName === instructor.name);

  const totalStudents = assignedGroups.reduce((acc, g) => acc + (g.students ? g.students.length : g.studentsCount), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="bg-white rounded-2xl w-full max-w-3xl p-6 z-10 shadow-2xl relative border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Profile Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-gray-900 to-brand-950 text-white rounded-2xl p-6 shadow-md border border-gray-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-2xl font-black shadow-inner">
                👨‍🏫
              </div>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{instructor.name}</span>
                  <span className="bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {instructor.specialization || instructor.course}
                  </span>
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-3 flex-wrap">
                  <span>📧 {instructor.email || `${instructor.name.toLowerCase().replace(/\s+/g, '.')}@sanadak.edu`}</span>
                  <span>📞 {instructor.phone || '01000000000'}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700 text-xs space-y-1">
              <span className="text-gray-400 block text-[11px] font-medium">{lang === 'ar' ? 'إجمالي الطلاب المسندين:' : 'Total Assigned Students:'}</span>
              <span className="text-lg font-black text-emerald-400">{totalStudents} {lang === 'ar' ? 'طالب' : 'students'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="bg-gray-800/50 p-2.5 rounded-xl border border-gray-700/60">
              <span className="text-gray-400 text-[11px] block">{lang === 'ar' ? 'عدد الجروبات:' : 'Assigned Groups:'}</span>
              <span className="font-bold text-white text-sm">{assignedGroups.length} {lang === 'ar' ? 'مجموعات' : 'groups'}</span>
            </div>
            <div className="bg-gray-800/50 p-2.5 rounded-xl border border-gray-700/60">
              <span className="text-gray-400 text-[11px] block">{lang === 'ar' ? 'المادة / التخصص:' : 'Subject:'}</span>
              <span className="font-bold text-white text-xs truncate block">{instructor.course}</span>
            </div>
            <div className="bg-gray-800/50 p-2.5 rounded-xl border border-gray-700/60">
              <span className="text-gray-400 text-[11px] block">{lang === 'ar' ? 'نظام المستحقات:' : 'Payout Model:'}</span>
              <span className="font-bold text-white text-xs">{instructor.model} (EGP {instructor.amount.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Assigned Groups Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-brand-600 flex items-center justify-center font-bold">
              👥
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">
                {lang === 'ar' ? `المجموعات التدريبية مع المحاضر (${assignedGroups.length})` : `Assigned Training Groups (${assignedGroups.length})`}
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold">
                {lang === 'ar' ? 'المجموعات النشطة والقادمة المسندة لهذا المحاضر' : 'Active and upcoming groups'}
              </p>
            </div>
          </div>

          {assignedGroups.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200/60 rounded-xl text-center text-xs text-gray-400 font-medium">
              {lang === 'ar' ? '— لا توجد مجموعات مسندة حالياً لهذا المحاضر —' : '— No groups assigned to this instructor —'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignedGroups.map(grp => (
                <div key={grp.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 text-xs shadow-2xs hover:border-brand-300 transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-gray-900 text-xs">{grp.groupName}</h4>
                    <span className="bg-red-50 text-brand-700 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold">
                      {grp.students ? grp.students.length : grp.studentsCount} {lang === 'ar' ? 'طالب' : 'students'}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-600 font-extrabold">{grp.courseName}</p>
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                    <span>🕒</span>
                    <span className="truncate">{grp.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lectures & Timetable Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              📅
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">
                {lang === 'ar' ? `جدول ومواعيد المحاضرات (${assignedLectures.length})` : `Lecture Schedules (${assignedLectures.length})`}
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold">
                {lang === 'ar' ? 'مواعيد المحاضرات والقاعات المسجلة في الجدول' : 'Lecture dates, times, and halls'}
              </p>
            </div>
          </div>

          {assignedLectures.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200/60 rounded-xl text-center text-xs text-gray-400 font-medium">
              {lang === 'ar' ? '— لا توجد محاضرات مجدولة حالياً لهذا المحاضر —' : '— No scheduled lectures found —'}
            </div>
          ) : (
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <th className="p-2.5 text-start">{lang === 'ar' ? 'الموضوع / الدرس' : 'Topic'}</th>
                    <th className="p-2.5 text-center">{lang === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}</th>
                    <th className="p-2.5 text-center">{lang === 'ar' ? 'نوع الحضور' : 'Mode'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignedLectures.map(lec => (
                    <tr key={lec.id} className="hover:bg-gray-50/80">
                      <td className="p-2.5 font-bold text-gray-800">
                        <div>{lec.topic}</div>
                        <div className="text-[10px] text-gray-400 font-semibold">{lec.batch}</div>
                      </td>
                      <td className="p-2.5 text-center text-gray-600 font-mono text-[11px]">
                        <div>{lec.date}</div>
                        <div className="text-[10px] text-gray-400">{lec.time}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          lec.type === 'online' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {lec.type === 'online' ? (lang === 'ar' ? '🌐 أونلاين' : 'Online') : (lang === 'ar' ? '🏛 حضوري' : 'In-Person')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
