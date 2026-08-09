import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { GroupTask } from '../../types';

interface AddGroupTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  instructorName?: string;
}

export default function AddGroupTaskModal({ isOpen, onClose, groupId, groupName, instructorName }: AddGroupTaskModalProps) {
  const { lang, addGroupTask, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast(lang === 'ar' ? '⚠️ يرجى إدخال عنوان التاسك' : '⚠️ Please enter task title', 'warning');
      return;
    }

    const newTask: GroupTask = {
      id: `task-${Date.now()}`,
      groupId,
      instructorName: instructorName || (lang === 'ar' ? 'خالد أحمد' : 'Khaled Ahmed'),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    addGroupTask(newTask);
    showToast(
      lang === 'ar'
        ? `✓ تم نشر التاسك (${newTask.title}) لجميع طلاب ${groupName}`
        : `✓ Task assigned to ${groupName}`,
      'success'
    );
    setTitle('');
    setDescription('');
    setDueDate('');
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
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm">
              {lang === 'ar' ? 'إضافة تاسك جديد للجروب كامل' : 'Add New Task for Entire Group'}
            </h3>
            <p className="text-xs text-brand-600 font-bold mt-0.5">{groupName}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            {lang === 'ar' ? 'عنوان التاسك / التكليف *' : 'Task Title *'}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={lang === 'ar' ? 'مثال: مشروع تطبيق React & Redux Toolkit' : 'e.g. Build React E-commerce App'}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            {lang === 'ar' ? 'تفاصيل ومتطلبات التاسك' : 'Task Description & Details'}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={lang === 'ar' ? 'اكتب تفاصيل المطلوب والمتطلبات الواجب تنفيذها...' : 'Write detailed task requirements...'}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            {lang === 'ar' ? 'تاريخ التسليم النهائي (Due Date)' : 'Due Date'}
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div className="flex gap-2.5 pt-2">
          <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all">
            {lang === 'ar' ? 'نشر التاسك للجروب' : 'Publish Task'}
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
}
