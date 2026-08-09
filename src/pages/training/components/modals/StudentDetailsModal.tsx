import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { GroupStudent, SharedGroup } from '../../types';
import AddStudentNoteModal from './AddStudentNoteModal';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: GroupStudent | null;
  group: SharedGroup | null;
}

export default function StudentDetailsModal({ isOpen, onClose, student, group }: StudentDetailsModalProps) {
  const { lang, studentNotes, groupTasks, role, sharedGroups, changeStudentGroup, showToast } = useApp();
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [targetGroupId, setTargetGroupId] = useState<string>('');

  if (!isOpen || !student || !group) return null;

  const isManager = role === 'recruiter' || role === 'admin';
  const isInstructor = role === 'instructor' || role === 'admin';

  // Notes specifically for this student
  const filteredNotes = studentNotes.filter(n => n.studentId === student.id || (n.groupId === group.id && n.studentId === student.id));

  // Tasks for the student's group
  const filteredTasks = groupTasks.filter(t => t.groupId === group.id);

  const handleGroupTransfer = () => {
    if (!targetGroupId || targetGroupId === group.id) return;
    const targetGroup = sharedGroups.find(g => g.id === targetGroupId);
    if (!targetGroup) return;

    changeStudentGroup(student.id, group.id, targetGroupId);
    showToast(
      lang === 'ar'
        ? `✓ تم نقل الطالب (${student.name}) إلى مجموعة (${targetGroup.groupName}) بنجاح!`
        : `✓ Moved student (${student.name}) to group (${targetGroup.groupName})!`,
      'success'
    );
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Card */}
        <div
          className="bg-white rounded-2xl w-full max-w-2xl p-6 z-10 shadow-2xl relative border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Student Header Card */}
          <div className="bg-gradient-to-r from-red-950 via-brand-900 to-red-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-brand-700/30 space-y-4">
            <div className="absolute -end-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-black shadow-inner">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>{student.name}</span>
                    <span className="bg-brand-500/40 border border-brand-400/50 text-red-100 text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold">
                      {student.code}
                    </span>
                  </h2>
                  <p className="text-xs text-red-200 font-medium mt-1 flex items-center gap-3 flex-wrap">
                    <span>📧 {student.email}</span>
                    <span>📞 {student.phone}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-xl p-3 text-xs space-y-1 min-w-[170px]">
                <div className="text-red-200 text-[11px] font-medium">{lang === 'ar' ? 'الجروب الانتماء:' : 'Assigned Group:'}</div>
                <div className="font-bold text-white text-xs">{group.groupName}</div>
                <div className="text-red-300 text-[11px] font-semibold">{lang === 'ar' ? 'المحاضر:' : 'Instructor:'} {group.instructorName}</div>
              </div>
            </div>

            {/* Guardian & Address Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/15 text-xs">
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="text-red-200 text-[10px] block font-medium">{lang === 'ar' ? 'اسم ولي الأمر:' : 'Guardian Name:'}</span>
                <span className="font-bold text-white truncate block">{student.guardianName || (lang === 'ar' ? 'غير مسجل' : 'N/A')}</span>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="text-red-200 text-[10px] block font-medium">{lang === 'ar' ? 'هاتف ولي الأمر:' : 'Guardian Phone:'}</span>
                <span className="font-bold text-white truncate block">{student.guardianPhone || (lang === 'ar' ? 'غير مسجل' : 'N/A')}</span>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="text-red-200 text-[10px] block font-medium">{lang === 'ar' ? 'العنوان:' : 'Address:'}</span>
                <span className="font-bold text-white truncate block">{student.address || (lang === 'ar' ? 'غير مسجل' : 'N/A')}</span>
              </div>
            </div>
          </div>

          {/* Group Transfer Bar (Training Manager Only) */}
          {isManager && (
            <div className="bg-brand-50/60 border border-brand-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🔄</span>
                <h4 className="font-extrabold text-gray-900 text-xs">
                  {lang === 'ar' ? 'تعديل مجموعة الطالب (نقل لجروب آخر)' : 'Change Student Group'}
                </h4>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={targetGroupId}
                  onChange={e => setTargetGroupId(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-extrabold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">{lang === 'ar' ? '-- اختر الجروب الجديد للنقل --' : '-- Select New Group --'}</option>
                  {sharedGroups.filter(g => g.id !== group.id).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.groupName} ({g.courseName} — {g.instructorName})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleGroupTransfer}
                  disabled={!targetGroupId || targetGroupId === group.id}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-brand-600/20"
                >
                  {lang === 'ar' ? 'تأكيد نقل الطالب' : 'Transfer Student'}
                </button>
              </div>
            </div>
          )}

          {/* Instructor Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  📝
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">
                    {lang === 'ar' ? 'ملاحظات المحاضر على الطالب' : 'Instructor Notes for Student'}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-semibold">
                    {lang === 'ar' ? 'الملاحظات الأكاديمية والسلوكية المسجلة من المحاضر' : 'Academic & behavioral evaluation notes'}
                  </p>
                </div>
              </div>

              {/* Add Note is ONLY for Instructors */}
              {isInstructor && (
                <button
                  onClick={() => setIsAddNoteOpen(true)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  <span>{lang === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}</span>
                </button>
              )}
            </div>

            {filteredNotes.length === 0 ? (
              <div className="p-4 bg-gray-50 border border-gray-200/60 rounded-xl text-center text-xs text-gray-400 font-medium">
                {lang === 'ar' ? '— لا توجد ملاحظات مسجلة لهذا الطالب حتى الآن —' : '— No notes recorded for this student yet —'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredNotes.map(note => (
                  <div key={note.id} className="p-3.5 bg-amber-50/40 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        note.category === 'academic' ? 'bg-blue-100 text-blue-700' : (note.category === 'behavioral' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700')
                      }`}>
                        {note.category === 'academic' ? (lang === 'ar' ? 'أكاديمي' : 'Academic') : (note.category === 'behavioral' ? (lang === 'ar' ? 'سلوكي' : 'Behavioral') : (lang === 'ar' ? 'عام' : 'General'))}
                      </span>
                      <span className="text-gray-400 text-[11px] font-mono">{note.createdAt}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-xs leading-relaxed">{note.content}</p>
                    <div className="text-[11px] text-gray-500 font-bold pt-1">
                      {lang === 'ar' ? 'المحاضر:' : 'By Instructor:'} <span className="text-amber-800">{note.instructorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Tasks Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  🎯
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">
                    {lang === 'ar' ? 'التاسكات المطلوبة من الجروب' : 'Assigned Group Tasks'}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-semibold">
                    {lang === 'ar' ? 'المشاريع والتكليفات المسندة لمجموعة الطالب كاملة' : 'Tasks and projects assigned to this group'}
                  </p>
                </div>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="p-4 bg-gray-50 border border-gray-200/60 rounded-xl text-center text-xs text-gray-400 font-medium">
                {lang === 'ar' ? '— لا توجد تاسكات مسندة لهذا الجروب حالياً —' : '— No active group tasks assigned —'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map(t => (
                  <div key={t.id} className="p-4 bg-blue-50/40 border border-blue-200/80 rounded-xl space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-extrabold text-gray-900 text-xs">{t.title}</h4>
                      <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap">
                        {lang === 'ar' ? 'تاريخ التسليم:' : 'Due:'} {t.dueDate}
                      </span>
                    </div>
                    {t.description && (
                      <p className="text-gray-600 font-medium text-[11px] leading-relaxed bg-white p-2 rounded-lg border border-gray-100">
                        {t.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold pt-1">
                      <span>{lang === 'ar' ? 'المحاضر الناشر:' : 'Assigned by:'} <strong className="text-gray-800">{t.instructorName}</strong></span>
                      <span className="text-gray-400 font-mono">{lang === 'ar' ? 'تاريخ النشر:' : 'Published:'} {t.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Note Sub-Modal */}
      <AddStudentNoteModal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        studentId={student.id}
        studentName={student.name}
        groupId={group.id}
        groupName={group.groupName}
        instructorName={group.instructorName}
      />
    </>
  );
}
