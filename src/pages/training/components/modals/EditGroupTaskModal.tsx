import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { GroupTask } from '../../types';

interface EditGroupTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: GroupTask | null;
  groupName?: string;
}

export default function EditGroupTaskModal({ isOpen, onClose, task, groupName }: EditGroupTaskModalProps) {
  const { lang, updateGroupTask, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'active' | 'completed'>('active');
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; size?: string }>>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setStatus(task.status || 'active');
      setAttachments(task.attachments || []);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
        size: `${(f.size / 1024).toFixed(1)} KB`
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
      showToast(lang === 'ar' ? `✓ تم إضافة ${newFiles.length} ملف مرفق` : `✓ Added ${newFiles.length} attachments`, 'success');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast(lang === 'ar' ? '⚠️ يرجى إدخال عنوان التاسك' : '⚠️ Please enter task title', 'warning');
      return;
    }

    const updatedTask: GroupTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || task.dueDate,
      status,
      attachments
    };

    updateGroupTask(updatedTask);
    showToast(
      lang === 'ar'
        ? `✓ تم تحديث التاسك (${updatedTask.title}) بنجاح`
        : `✓ Task (${updatedTask.title}) updated successfully`,
      'success'
    );
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
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm">
              {lang === 'ar' ? 'تعديل بيانات التاسك / التكليف' : 'Edit Group Task'}
            </h3>
            {groupName && <p className="text-xs text-blue-600 font-bold mt-0.5">{groupName}</p>}
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
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            {lang === 'ar' ? 'تفاصيل ومتطلبات التاسك' : 'Task Description & Details'}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              {lang === 'ar' ? 'تاريخ التسليم (Due Date)' : 'Due Date'}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              {lang === 'ar' ? 'حالة التاسك' : 'Status'}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'completed')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="active">{lang === 'ar' ? 'نشط (جاري الاستلام)' : 'Active'}</option>
              <option value="completed">{lang === 'ar' ? 'مكتمل (تم الانتهاء)' : 'Completed'}</option>
            </select>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="space-y-2 pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span>📎</span>
              <span>{lang === 'ar' ? 'الملفات المرفقة والتكليفات (Attach Files):' : 'Attached Files:'}</span>
            </label>
            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1">
              <span>➕ {lang === 'ar' ? 'إرفاق ملف' : 'Attach File'}</span>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {attachments.length === 0 ? (
            <p className="text-[11px] text-gray-400 font-semibold italic text-center py-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              {lang === 'ar' ? 'لا يوجد ملفات مرفقة بهذا التاسك' : 'No attachments added yet'}
            </p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {attachments.map((att, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-blue-50/60 border border-blue-100 rounded-xl text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">📄</span>
                    <span className="font-bold text-gray-800 text-xs truncate">{att.name}</span>
                    {att.size && <span className="text-[10px] text-gray-400 font-mono">({att.size})</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded-lg transition-colors font-bold text-xs"
                    title={lang === 'ar' ? 'إزالة الملف' : 'Remove File'}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2.5 pt-2">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all">
            {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
}
