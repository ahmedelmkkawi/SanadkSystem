import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function InstructorDashboard() {
  const { showToast } = useApp();
  const [chatMessages, setChatMessages] = useState([
    { self: false, text: 'مرحباً، هل يمكنك تحديد موعد الجلسة التجريبية؟' },
    { self: true, text: 'نعم، أقترح يوم الخميس القادم الساعة 7 مساءً' },
    { self: false, text: 'مستعد، تم التأكيد. يرجى تجهيز المحتوى قبل الموعد' },
    { self: true, text: 'تم رفع ملف الـ Roadmap. هل يمكن تغيير الموعد ليوم السبت؟' },
    { self: false, text: 'سأراجع الجدول وأؤكد لك خلال ساعة ⏳' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [calMonth, setCalMonth] = useState(6);
  const [calYear, setCalYear] = useState(2026);
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('');
  const [calEvents, setCalEvents] = useState<Record<string, number[]>>({ '2026-6': [3, 7, 10, 15, 21, 28] });

  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { self: true, text: chatInput.trim() }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { self: false, text: 'تم استلام رسالتك، سأرد قريباً 👍' }]);
    }, 1500);
  };

  const proposeSession = () => {
    if (!newSessionDate) { showToast('⚠️ الرجاء اختيار تاريخ الجلسة أولاً', 'warning'); return; }
    if (!newSessionTime) { showToast('⚠️ الرجاء اختيار وقت الجلسة', 'warning'); return; }
    const d = new Date(newSessionDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    setCalEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), d.getDate()] }));
    const formattedDate = d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    showToast(`✓ تم اقتراح موعد جلسة — ${formattedDate} الساعة ${newSessionTime} — بانتظار تأكيد المنسق`, 'success');
    setNewSessionDate(''); setNewSessionTime('');
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
          onClick={() => showToast(hasEvent ? `📌 يوم ${d} ${monthNames[calMonth]} — يوجد جلسة مجدولة` : `يوم ${d} ${monthNames[calMonth]} — لا توجد جلسات`, 'info')}
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'الدورات النشطة', val: '3' },
          { label: 'عدد الطلاب', val: '87' },
          { label: 'الجلسة القادمة', val: 'غداً، 8:00 م', color: 'text-brand-600', size: 'text-lg' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all" style={{ boxShadow: '0 0 10px rgba(239,68,68,0.05)' }}>
            <p className="text-gray-500 text-sm font-semibold mb-1">{s.label}</p>
            <p className={`font-black text-gray-900 ${s.color || ''} ${s.size || 'text-3xl'}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Upload zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'رفع مسار التعلم (Roadmap)', sub: 'PDF, DOCX, PPTX', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', iconBg: 'bg-brand-50', iconColor: 'text-brand-500', toast: 'تم رفع ملف Roadmap بنجاح ✓', file: { badge: 'PDF', name: 'React_Roadmap_v2.pdf', size: '2.4 MB • منذ يومين', badgeBg: 'bg-red-50 text-red-500' } },
          { title: 'رفع المحتوى التعليمي', sub: 'Videos, PDFs, Resources', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', toast: 'تم رفع المحتوى بنجاح ✓', file: { badge: 'MP4', name: 'Session_01_Intro.mp4', size: '156 MB • منذ 3 أيام', badgeBg: 'bg-blue-50 text-blue-500' } },
        ].map(z => (
          <div key={z.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${z.iconBg} flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${z.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={z.icon} /></svg>
              </div>
              <div><h3 className="font-bold text-gray-900">{z.title}</h3><p className="text-xs text-gray-400">{z.sub}</p></div>
            </div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-all bg-gray-50/50"
              onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('border-brand-500'); }}
              onDragLeave={e => (e.currentTarget as HTMLElement).classList.remove('border-brand-500')}
              onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.remove('border-brand-500'); showToast(z.toast, 'success'); }}
            >
              <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <p className="text-gray-500 font-semibold text-sm">اسحب وأفلت الملفات هنا</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded ${z.file.badgeBg} flex items-center justify-center text-xs font-bold`}>{z.file.badge}</div>
                  <div><p className="text-sm font-semibold text-gray-800">{z.file.name}</p><p className="text-xs text-gray-400">{z.file.size}</p></div>
                </div>
                <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded">✓ تم الرفع</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">جدول المحاكاة والجلسات</h3>
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
            {['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalGrid()}</div>
          <div className="mt-4 flex gap-3 flex-wrap">
            <input type="date" value={newSessionDate} onChange={e => setNewSessionDate(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="time" value={newSessionTime} onChange={e => setNewSessionTime(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-500" />
            <button onClick={proposeSession} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-brand-600/20">اقتراح موعد جلسة</button>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col h-[480px] shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div><h3 className="font-bold text-sm text-gray-900">التنسيق مع المنسق</h3><p className="text-[11px] text-emerald-500">متصل الآن</p></div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 max-w-[85%] text-sm ${m.self ? 'bg-brand-600 text-white rounded-[16px_16px_4px_16px]' : 'bg-gray-100 text-gray-800 rounded-[16px_16px_16px_4px]'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat(); }} type="text" placeholder="اكتب رسالة..." className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 placeholder-gray-400" />
            <button onClick={sendChat} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-all">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
