import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function InstructorDashboard() {
  const { showToast, lang, t, role } = useApp();

  const isAuthorized = role === 'instructor' || role === 'admin';

  const [roadmaps, setRoadmaps] = useState([
    {
      id: 'rm-1',
      title: lang === 'ar' ? 'مسار تعلم React' : 'React Learning Roadmap',
      fileName: 'React_Roadmap_v2.pdf',
      fileSize: '2.4 MB',
      uploadDate: lang === 'ar' ? 'منذ يومين' : '2 days ago',
      description: lang === 'ar' ? 'المسار التعليمي الأساسي لتعلم مكتبة React.js بالتفصيل.' : 'The basic educational path for learning the React.js library.',
      badge: 'PDF',
      badgeBg: 'bg-red-50 text-red-500'
    }
  ]);

  const [contents, setContents] = useState([
    {
      id: 'cnt-1',
      title: lang === 'ar' ? 'مقدمة في React' : 'Introduction to React',
      fileName: 'Session_01_Intro.mp4',
      fileSize: '156 MB',
      uploadDate: lang === 'ar' ? 'منذ 3 أيام' : '3 days ago',
      description: lang === 'ar' ? 'الفيديو التعريفي الأول للدورة التعليمية.' : 'The first introductory video of the educational course.',
      badge: 'MP4',
      badgeBg: 'bg-blue-50 text-blue-500'
    }
  ]);

  const [calMonth, setCalMonth] = useState(6);
  const [calYear, setCalYear] = useState(2026);
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('');
  const [calEvents, setCalEvents] = useState<Record<string, number[]>>({ '2026-6': [3, 7, 10, 15, 21, 28] });

  // Modal Control States
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editType, setEditType] = useState<'roadmap' | 'content'>('roadmap');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Edit Modal Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formFileSize, setFormFileSize] = useState('');
  const [formBadge, setFormBadge] = useState('');

  const monthNames = lang === 'ar'
    ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const proposeSession = () => {
    if (!newSessionDate) {
      showToast(lang === 'ar' ? '⚠️ الرجاء اختيار تاريخ الجلسة أولاً' : '⚠️ Please select a session date first', 'warning');
      return;
    }
    if (!newSessionTime) {
      showToast(lang === 'ar' ? '⚠️ الرجاء اختيار وقت الجلسة' : '⚠️ Please select a session time', 'warning');
      return;
    }
    const d = new Date(newSessionDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    setCalEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), d.getDate()] }));
    
    const formattedDate = d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    showToast(
      lang === 'ar'
        ? `✓ تم اقتراح موعد جلسة — ${formattedDate} الساعة ${newSessionTime} — بانتظار تأكيد المنسق`
        : `✓ Session proposed — ${formattedDate} at ${newSessionTime} — pending coordinator confirmation`,
      'success'
    );
    setNewSessionDate('');
    setNewSessionTime('');
  };

  const changeMonth = (dir: number) => {
    setCalMonth(m => {
      let nm = m + dir;
      if (nm > 11) { nm = 0; setCalYear(y => y + 1); }
      if (nm < 0) { nm = 11; setCalYear(y => y - 1); }
      return nm;
    });
  };

  const renderCalGrid = () => {
    const key = `${calYear}-${calMonth}`;
    const events = calEvents[key] || [];
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;
    const todayDate = today.getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="h-10" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayDate;
      const hasEvent = events.includes(d);
      cells.push(
        <div key={d}
          onClick={() => showToast(
            hasEvent
              ? (lang === 'ar' ? `📌 يوم ${d} ${monthNames[calMonth]} — يوجد جلسة مجدولة` : `📌 Day ${d} ${monthNames[calMonth]} — Scheduled session exists`)
              : (lang === 'ar' ? `يوم ${d} ${monthNames[calMonth]} — لا توجد جلسات` : `Day ${d} ${monthNames[calMonth]} — No sessions scheduled`),
            'info'
          )}
          className={`calendar-cell h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all relative
            ${isToday ? 'bg-brand-600 text-white font-bold shadow-md' : ''}
            ${hasEvent && !isToday ? 'font-semibold text-gray-800 has-event' : ''}
            ${!isToday && !hasEvent ? 'text-gray-500 hover:bg-gray-100' : ''}
          `}
        >
          {d}
          {hasEvent && !isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full" />}
        </div>
      );
    }
    return cells;
  };

  const handleOpenEdit = (type: 'roadmap' | 'content', item: any) => {
    setIsCreateMode(false);
    setEditType(type);
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDesc(item.description || '');
    setFormFileName(item.fileName);
    setFormFileSize(item.fileSize);
    setFormBadge(item.badge);
    setIsEditModalOpen(true);
  };

  const handleOpenCreate = (type: 'roadmap' | 'content', fileName: string, fileSize: string) => {
    setIsCreateMode(true);
    setEditType(type);
    setEditingItem(null);
    setFormTitle(fileName.split('.')[0]);
    setFormDesc('');
    setFormFileName(fileName);
    setFormFileSize(fileSize);
    const ext = fileName.split('.').pop()?.toUpperCase() || '';
    setFormBadge(ext);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      showToast(lang === 'ar' ? '⚠️ غير مصرح لك بإجراء هذه العملية' : '⚠️ Unauthorized action', 'error');
      return;
    }

    if (isCreateMode) {
      const newItem = {
        id: `item-${Date.now()}`,
        title: formTitle,
        fileName: formFileName,
        fileSize: formFileSize || '1.0 MB',
        uploadDate: lang === 'ar' ? 'الآن' : 'Just now',
        description: formDesc,
        badge: formBadge || (editType === 'roadmap' ? 'PDF' : 'MP4'),
        badgeBg: editType === 'roadmap' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
      };

      if (editType === 'roadmap') {
        setRoadmaps(prev => [...prev, newItem]);
        showToast(lang === 'ar' ? '✓ تم إضافة مسار التعلم بنجاح' : '✓ Roadmap added successfully', 'success');
      } else {
        setContents(prev => [...prev, newItem]);
        showToast(lang === 'ar' ? '✓ تم إضافة المحتوى التعليمي بنجاح' : '✓ Content added successfully', 'success');
      }
    } else {
      const updated = {
        ...editingItem,
        title: formTitle,
        description: formDesc,
        fileName: formFileName,
        fileSize: formFileSize,
        badge: formBadge
      };

      if (editType === 'roadmap') {
        setRoadmaps(prev => prev.map(item => item.id === editingItem.id ? updated : item));
        showToast(lang === 'ar' ? '✓ تم تحديث مسار التعلم بنجاح' : '✓ Roadmap updated successfully', 'success');
      } else {
        setContents(prev => prev.map(item => item.id === editingItem.id ? updated : item));
        showToast(lang === 'ar' ? '✓ تم تحديث المحتوى التعليمي بنجاح' : '✓ Content updated successfully', 'success');
      }
    }

    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (type: 'roadmap' | 'content', id: string) => {
    if (!isAuthorized) {
      showToast(lang === 'ar' ? '⚠️ غير مصرح لك بإجراء هذه العملية' : '⚠️ Unauthorized action', 'error');
      return;
    }

    if (type === 'roadmap') {
      setRoadmaps(prev => prev.filter(item => item.id !== id));
      showToast(lang === 'ar' ? '✓ تم إزالة مسار التعلم' : '✓ Roadmap removed', 'success');
    } else {
      setContents(prev => prev.filter(item => item.id !== id));
      showToast(lang === 'ar' ? '✓ تم إزالة المحتوى التعليمي' : '✓ Content removed', 'success');
    }
  };

  return (
    <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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

      {/* Upload zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roadmap Zone */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('رفع مسار التعلم (Roadmap)')}</h3>
              <p className="text-xs text-gray-400">PDF, DOCX, PPTX</p>
            </div>
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-all bg-gray-50/50"
            onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('border-brand-500'); }}
            onDragLeave={e => (e.currentTarget as HTMLElement).classList.remove('border-brand-500')}
            onDrop={e => {
              e.preventDefault();
              (e.currentTarget as HTMLElement).classList.remove('border-brand-500');
              if (!isAuthorized) {
                showToast(lang === 'ar' ? '⚠️ غير مصرح لك برفع ملفات' : '⚠️ Unauthorized to upload', 'error');
                return;
              }
              const file = e.dataTransfer.files?.[0];
              if (file) {
                const size = file.size > 1024 * 1024 
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                  : `${(file.size / 1024).toFixed(0)} KB`;
                handleOpenCreate('roadmap', file.name, size);
              }
            }}
            onClick={() => {
              if (!isAuthorized) {
                showToast(lang === 'ar' ? '⚠️ غير مصرح لك برفع ملفات' : '⚠️ Unauthorized to upload', 'error');
                return;
              }
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.docx,.pptx';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const size = file.size > 1024 * 1024 
                    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${(file.size / 1024).toFixed(0)} KB`;
                  handleOpenCreate('roadmap', file.name, size);
                }
              };
              input.click();
            }}
          >
            <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500 font-semibold text-sm">{t('اسحب وأفلت الملفات هنا')}</p>
          </div>
          <div className="mt-4 space-y-2">
            {roadmaps.map(item => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${item.badgeBg} flex items-center justify-center text-xs font-bold`}>
                      {item.badge}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.fileName} • {item.fileSize}</p>
                    </div>
                  </div>
                  {isAuthorized && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit('roadmap', item)}
                        className="p-1 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-all"
                        title={lang === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteItem('roadmap', item.id)}
                        className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        title={lang === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-[11px] text-gray-500 bg-white/50 p-2 rounded border border-gray-100">
                    {item.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-[10px] text-gray-400 px-1">
                  <span>{lang === 'ar' ? 'تم الرفع:' : 'Uploaded:'} {item.uploadDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Zone */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('رفع المحتوى التعليمي')}</h3>
              <p className="text-xs text-gray-400">Videos, PDFs, Resources</p>
            </div>
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-all bg-gray-50/50"
            onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('border-brand-500'); }}
            onDragLeave={e => (e.currentTarget as HTMLElement).classList.remove('border-brand-500')}
            onDrop={e => {
              e.preventDefault();
              (e.currentTarget as HTMLElement).classList.remove('border-brand-500');
              if (!isAuthorized) {
                showToast(lang === 'ar' ? '⚠️ غير مصرح لك برفع ملفات' : '⚠️ Unauthorized to upload', 'error');
                return;
              }
              const file = e.dataTransfer.files?.[0];
              if (file) {
                const size = file.size > 1024 * 1024 
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                  : `${(file.size / 1024).toFixed(0)} KB`;
                handleOpenCreate('content', file.name, size);
              }
            }}
            onClick={() => {
              if (!isAuthorized) {
                showToast(lang === 'ar' ? '⚠️ غير مصرح لك برفع ملفات' : '⚠️ Unauthorized to upload', 'error');
                return;
              }
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'video/*,.pdf,.docx,.zip';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const size = file.size > 1024 * 1024 
                    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${(file.size / 1024).toFixed(0)} KB`;
                  handleOpenCreate('content', file.name, size);
                }
              };
              input.click();
            }}
          >
            <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500 font-semibold text-sm">{t('اسحب وأفلت الملفات هنا')}</p>
          </div>
          <div className="mt-4 space-y-2">
            {contents.map(item => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${item.badgeBg} flex items-center justify-center text-xs font-bold`}>
                      {item.badge}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.fileName} • {item.fileSize}</p>
                    </div>
                  </div>
                  {isAuthorized && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit('content', item)}
                        className="p-1 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-all"
                        title={lang === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteItem('content', item.id)}
                        className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        title={lang === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-[11px] text-gray-500 bg-white/50 p-2 rounded border border-gray-100">
                    {item.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-[10px] text-gray-400 px-1">
                  <span>{lang === 'ar' ? 'تم الرفع:' : 'Uploaded:'} {item.uploadDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">{t('جدول المحاكاة والجلسات')}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <span className="text-sm font-bold text-gray-700 min-w-[120px] text-center">{monthNames[calMonth]} {calYear}</span>
            <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{t(d)}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{renderCalGrid()}</div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <input type="date" value={newSessionDate} onChange={e => setNewSessionDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-500" />
          <input type="time" value={newSessionTime} onChange={e => setNewSessionTime(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-500" />
          <button onClick={proposeSession} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-brand-600/20">{t('اقتراح موعد جلسة')}</button>
        </div>
      </div>

      {/* Edit / Create Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <form
            onSubmit={handleSaveItem}
            className="bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-2xl relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 end-4 p-1 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-black text-gray-900 text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>
                {isCreateMode 
                  ? (editType === 'roadmap' ? (lang === 'ar' ? 'إضافة مسار تعلم جديد' : 'Add New Roadmap') : (lang === 'ar' ? 'إضافة محتوى تعليمي جديد' : 'Add New Content'))
                  : (editType === 'roadmap' ? (lang === 'ar' ? 'تعديل مسار التعلم' : 'Edit Roadmap') : (lang === 'ar' ? 'تعديل المحتوى التعليمي' : 'Edit Content'))
                }
              </span>
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  {lang === 'ar' ? 'العنوان / اسم الملف' : 'Title / Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل عنوان الملف' : 'Enter title'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل تفاصيل ووصف هذا الملف' : 'Enter description'}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Replace File */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  {lang === 'ar' ? 'الملف الحالي' : 'Current File'}
                </label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 flex justify-between items-center mb-2">
                  <span className="font-semibold truncate max-w-[200px]">{formFileName}</span>
                  <span className="font-mono text-[10px] text-gray-400">{formFileSize}</span>
                </div>

                <div className="relative border border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormFileName(file.name);
                        const size = file.size > 1024 * 1024 
                          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(file.size / 1024).toFixed(0)} KB`;
                        setFormFileSize(size);
                        const ext = file.name.split('.').pop()?.toUpperCase() || '';
                        setFormBadge(ext);
                      }
                    }}
                  />
                  <span className="text-[11px] text-gray-600 font-semibold">
                    {lang === 'ar' ? 'استبدال الملف بآخر جديد...' : 'Replace with a new file...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg text-xs font-bold shadow-md transition-all">
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
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
