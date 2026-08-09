import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { StudentNote } from '../../types';

interface AddStudentNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  instructorName?: string;
}

export default function AddStudentNoteModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  groupId,
  groupName,
  instructorName
}: AddStudentNoteModalProps) {
  const { lang, addStudentNote, showToast } = useApp();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'academic' | 'behavioral' | 'general'>('academic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast(lang === 'ar' ? '⚠️ يرجى كتابة نص الملاحظة' : '⚠️ Please write note content', 'warning');
      return;
    }

    const newNote: StudentNote = {
      id: `note-${Date.now()}`,
      studentId,
      groupId,
      instructorName: instructorName || (lang === 'ar' ? 'خالد أحمد' : 'Khaled Ahmed'),
      content: content.trim(),
      category,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addStudentNote(newNote);
    showToast(
      lang === 'ar'
        ? `✓ تم حفظ الملاحظة للطالب (${studentName}) بنجاح!`
        : `✓ Note added for student (${studentName})`,
      'success'
    );
    setContent('');
    setCategory('academic');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-full max-w-lg p-6 z-10 shadow-2xl relative border border-gray-100 space-y-4 animate-fade-in"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <button type="button" onClick={onClose} className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm">
              {lang === 'ar' ? 'إضافة ملاحظة على الطالب' : 'Add Note for Student'}
            </h3>
            <p className="text-xs text-amber-700 font-bold mt-0.5">
              {studentName} — <span className="text-gray-500 font-normal">{groupName}</span>
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">
            {lang === 'ar' ? 'تصنيف الملاحظة' : 'Note Category'}
          </label>
          <div className="flex gap-2">
            {[
              { key: 'academic', label: lang === 'ar' ? 'أكاديمي / أداء' : 'Academic' },
              { key: 'behavioral', label: lang === 'ar' ? 'سلوكي / التزام' : 'Behavioral' },
              { key: 'general', label: lang === 'ar' ? 'ملاحظة عامة' : 'General' },
            ].map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key as any)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  category === cat.key
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            {lang === 'ar' ? 'نص الملاحظة *' : 'Note Content *'}
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={lang === 'ar' ? 'اكتب ملاحظاتك وتقييمك لأداء الطالب خلال المحاضرات أو المشاريع...' : 'Write your notes regarding student performance...'}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-amber-500 resize-none font-medium"
          />
        </div>

        <div className="flex gap-2.5 pt-2">
          <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all">
            {lang === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
}
