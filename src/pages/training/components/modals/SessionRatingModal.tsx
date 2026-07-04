import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface SessionRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionName: string;
  onRated: (stars: number) => void;
}

export default function SessionRatingModal({ isOpen, onClose, sessionName, onRated }: SessionRatingModalProps) {
  const { showToast } = useApp();
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');

  const submit = () => {
    if (stars === 0) { showToast('⚠️ الرجاء اختيار عدد النجوم للتقييم أولاً', 'warning'); return; }
    onRated(stars);
    onClose();
    showToast('✓ شكراً لتقييمك! تم إرسال التقييم بنجاح', 'success');
    setStars(0); setFeedback('');
  };

  if (!isOpen) return null;
  const starPath = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md mx-4 p-8 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">تقييم الجلسة التعليمية</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-6 text-right">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">اسم الجلسة</p>
            <p className="font-extrabold text-zinc-800 text-base">{sessionName}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-3">كيف تقيّم جودة الشرح والمحتوى؟</label>
            <div className="flex justify-center gap-2 flex-row-reverse">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button"
                  onClick={() => setStars(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  className={`transition-all transform hover:scale-110 ${n <= (hovered || stars) ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d={starPath} /></svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-2">ملاحظات إضافية (اختياري)</label>
            <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="أدخل رأيك هنا..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm" />
          </div>
          <button onClick={submit} className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-600/20 mt-2">إرسال التقييم</button>
        </div>
      </div>
    </div>
  );
}
