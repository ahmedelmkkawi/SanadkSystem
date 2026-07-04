import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Applicant } from '../../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
}

export default function ScheduleModal({ isOpen, onClose, applicantName }: ScheduleModalProps) {
  const { t, applicants, setApplicants, showToast, pushToUndoStack } = useApp();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewType, setInterviewType] = useState('Online - Zoom');

  const confirm = () => {
    if (!date || !time) { showToast('الرجاء اختيار تاريخ ووقت المقابلة', 'warning'); return; }
    const idx = applicants.findIndex(a => a.name === applicantName);
    if (idx !== -1) {
      const oldList = [...applicants];
      const newList: Applicant[] = applicants.map((a, i) => i === idx ? { ...a, status: 'accepted', actionType: 'eval-btn' } : a);
      setApplicants(newList);
      onClose();
      pushToUndoStack(() => setApplicants(oldList));
      showToast('تم جدولة المقابلة بنجاح ✓ • [تراجع]', 'success', true);
      setDate(''); setTime('');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg mx-4 p-8 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{t('scheduleInterview')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">{t('applicantNameLabel')}</label>
            <input type="text" readOnly value={applicantName} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">{t('interviewDate')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">{t('interviewTime')}</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">{t('interviewType')}</label>
            <select value={interviewType} onChange={e => setInterviewType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500">
              <option>Online - Zoom</option>
              <option>Online - Google Meet</option>
              <option>{t('inPerson')}</option>
            </select>
          </div>
          <button onClick={confirm} className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-600/20 mt-2">{t('confirmSchedule')}</button>
        </div>
      </div>
    </div>
  );
}
