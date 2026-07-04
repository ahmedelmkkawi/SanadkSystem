import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Applicant } from '../../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationModal({ isOpen, onClose }: ApplicationModalProps) {
  const { t, applicants, setApplicants, showToast, pushToUndoStack } = useApp();
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const formRef = useRef<{
    name: string; age: string; email: string; phone: string;
    exp: string; spec: string;
  }>({ name: '', age: '', email: '', phone: '', exp: '', spec: '' });

  const goToStep = (s: number) => setStep(s);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    const { name, age, email, phone } = formRef.current;
    if (name.length < 3) errs.name = 'الرجاء إدخال الاسم بالكامل';
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1) errs.age = 'الرجاء إدخال عمر صحيح';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'الرجاء إدخال بريد إلكتروني صحيح';
    if (!/^[0-9]+$/.test(phone) || phone.length < 8) errs.phone = 'الرجاء إدخال رقم هاتف صحيح';
    setErrors(errs);
    if (Object.keys(errs).length === 0) goToStep(2);
    else showToast('الرجاء تصحيح الأخطاء أولاً للمتابعة', 'warning');
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formRef.current.exp) errs.exp = 'الرجاء اختيار سنوات الخبرة';
    if (!formRef.current.spec) errs.spec = 'الرجاء اختيار التخصص';
    setErrors(errs);
    if (Object.keys(errs).length === 0) goToStep(3);
    else showToast('الرجاء تعبئة الخيارات الإلزامية', 'warning');
  };

  const validateStep3 = () => {
    if (!cvFile) {
      setErrors({ cv: 'يرجى رفع ملف السيرة الذاتية للمتابعة' });
      showToast('الرجاء رفع ملف السيرة الذاتية أولاً', 'warning');
      return;
    }
    setErrors({});
    goToStep(4);
  };

  const handleFileUpload = (file: File) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      showToast('يرجى اختيار ملف PDF أو DOCX فقط', 'warning'); return;
    }
    if (file.size > 10 * 1024 * 1024) { showToast('حجم الملف يتجاوز 10MB', 'warning'); return; }
    
    setUploading(true);
    setUploadProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 25;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setCvFile(file.name);
        setUploading(false);
        showToast('تم رفع الملف بنجاح ✓', 'success');
      }
      setUploadProgress(Math.round(p));
    }, 120);
  };

  const submitForm = () => {
    const expMap: Record<string, string> = { '10+': 'أكثر من ٥ سنوات', '5-10': 'أكثر من ٥ سنوات', '3-5': '٣ إلى ٥ سنوات', '1-3': '٣ إلى ٥ سنوات', '0-1': 'سنة إلى سنتين' };
    const newApp: Applicant = {
      name: formRef.current.name, date: new Date().toLocaleDateString('ar-EG'),
      age: formRef.current.age, exp: expMap[formRef.current.exp] || formRef.current.exp,
      cv: cvFile!, status: 'accepted', actionType: 'eval-btn',
    };
    const newList = [...applicants, newApp];
    const addedIndex = newList.length - 1;
    setApplicants(newList);
    onClose();
    pushToUndoStack(() => setApplicants(prev => prev.filter((_, i) => i !== addedIndex)));
    showToast('تم إرسال الطلب بنجاح! ✓ • [تراجع]', 'success', true);
    // Reset
    setCvFile(null); setUploadProgress(0); setStep(1);
    formRef.current = { name: '', age: '', email: '', phone: '', exp: '', spec: '' };
  };

  if (!isOpen) return null;

  const stepDotClass = (s: number) => step >= s
    ? 'w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md'
    : 'w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm';
  const lineClass = (s: number) => step > s ? 'w-12 h-0.5 bg-brand-600' : 'w-12 h-0.5 bg-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl mx-4 p-8 animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{t('applicationForm')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={stepDotClass(1)}>1</div>
          <div className={lineClass(1)} />
          <div className={stepDotClass(2)}>2</div>
          <div className={lineClass(2)} />
          <div className={stepDotClass(3)}>3</div>
          <div className={lineClass(3)} />
          <div className={stepDotClass(4)}>4</div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 mb-4">{t('personalInfo')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('fullName')}</label>
                <input defaultValue={formRef.current.name} onChange={e => formRef.current.name = e.target.value} type="text" placeholder="أدخل اسمك الكامل" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('age')}</label>
                <input defaultValue={formRef.current.age} onChange={e => formRef.current.age = e.target.value} type="number" min="1" placeholder="25" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500" />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">{t('email')}</label>
              <input defaultValue={formRef.current.email} onChange={e => formRef.current.email = e.target.value} type="email" placeholder="example@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500" dir="ltr" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">{t('phone')}</label>
              <input defaultValue={formRef.current.phone} onChange={e => { formRef.current.phone = e.target.value.replace(/[^0-9]/g, ''); e.target.value = formRef.current.phone; }} type="text" placeholder="01XXXXXXXXX" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500" dir="ltr" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <button onClick={validateStep1} className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all mt-4 shadow-lg shadow-brand-600/20">{t('nextStep')}</button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 mb-4">{t('experienceInfo')}</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">{t('experienceYears')}</label>
              <select defaultValue={formRef.current.exp} onChange={e => formRef.current.exp = e.target.value} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">{t('selectExp')}</option>
                <option value="0-1">0 - 1 سنة</option>
                <option value="1-3">1 - 3 سنوات</option>
                <option value="3-5">3 - 5 سنوات</option>
                <option value="5-10">5 - 10 سنوات</option>
                <option value="10+">+10 سنوات</option>
              </select>
              {errors.exp && <p className="text-red-500 text-xs mt-1">{errors.exp}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">{t('specialization')}</label>
              <select defaultValue={formRef.current.spec} onChange={e => formRef.current.spec = e.target.value} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">اختر التخصص الرئيسي</option>
                <option>Frontend Development</option>
                <option>Backend Development</option>
                <option>Full Stack Development</option>
                <option>UI/UX Design</option>
                <option>Data Science</option>
                <option>Mobile Development</option>
              </select>
              {errors.spec && <p className="text-red-500 text-xs mt-1">{errors.spec}</p>}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => goToStep(1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all">{t('prevStep')}</button>
              <button onClick={validateStep2} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md">{t('nextStep2')}</button>
            </div>
          </div>
        )}

        {/* Step 3 - CV Upload */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 mb-4">{t('cvUpload')}</h4>
            <input type="file" id="cvFileInput" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-brand-400 transition-all bg-gray-50/50"
              onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('border-brand-500', 'bg-brand-50/10'); }}
              onDragLeave={e => (e.currentTarget as HTMLElement).classList.remove('border-brand-500', 'bg-brand-50/10')}
              onDrop={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.remove('border-brand-500', 'bg-brand-50/10'); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('cvFileInput')?.click()}
            >
              <svg className="w-14 h-14 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="font-bold text-gray-600 text-lg">{t('dragDropCV')}</p>
              <p className="text-sm text-gray-400 mt-2">PDF, DOCX — Max 10MB</p>
            </div>
            {(uploading || cvFile) && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 font-semibold">{cvFile || 'جاري الرفع...'}</span>
                  <span className="text-sm text-brand-600 font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-brand-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
            {errors.cv && <p className="text-red-500 text-xs mt-1">{errors.cv}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => goToStep(2)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all">السابق</button>
              <button onClick={validateStep3} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md">التالي</button>
            </div>
          </div>
        )}

        {/* Step 4 - Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-gray-800 mb-4">{t('reviewSubmit')}</h4>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3 border border-gray-200">
              {[['الاسم', formRef.current.name], ['العمر', formRef.current.age], ['الهاتف', formRef.current.phone], ['الخبرة', formRef.current.exp], ['التخصص', formRef.current.spec], ['السيرة الذاتية', cvFile || '-']].map(([label, val], i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">{label}</span>
                    <span className={`font-semibold ${i === 5 ? 'text-brand-600' : 'text-gray-800'}`}>{val}</span>
                  </div>
                  {i < 5 && <div className="border-t border-gray-200 mt-3" />}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => goToStep(3)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all">السابق</button>
              <button onClick={submitForm} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-600/20">{t('submitApp')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
