import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { GroupStudent } from '../../types';

interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  initialTab?: 'form' | 'excel';
}

export default function AddStudentsModal({ isOpen, onClose, groupId, groupName, initialTab = 'form' }: AddStudentsModalProps) {
  const { lang, addStudentsToGroup, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'form' | 'excel'>(initialTab);

  // Sync activeTab when initialTab changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('');

  // Excel/CSV Upload State
  const [file, setFile] = useState<File | null>(null);
  const [parsedStudents, setParsedStudents] = useState<GroupStudent[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(lang === 'ar' ? '⚠️ يرجى إدخال اسم الطالب' : '⚠️ Please enter student name', 'warning');
      return;
    }

    const newStudent: GroupStudent = {
      id: `std-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@sanadak.edu`,
      phone: phone.trim() || '01000000000',
      code: `STD-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      guardianName: guardianName.trim() || undefined,
      guardianPhone: guardianPhone.trim() || undefined,
      address: address.trim() || undefined
    };

    addStudentsToGroup(groupId, [newStudent]);
    showToast(
      lang === 'ar'
        ? `✓ تم إضافة الطالب (${newStudent.name}) إلى ${groupName} بنجاح`
        : `✓ Added student (${newStudent.name}) to ${groupName}`,
      'success'
    );
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        // Split into lines
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) {
          setParseError(lang === 'ar' ? 'الملف فارغ' : 'File is empty');
          return;
        }

        // Determine delimiter (comma, tab, semicolon)
        const firstLine = lines[0];
        let delimiter = ',';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(';')) delimiter = ';';

        const rows = lines.map(line => line.split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, '')));

        // Check header line
        const header = rows[0].map(h => h.toLowerCase());
        let nameIdx = header.findIndex(h => h.includes('name') || h.includes('اسم') || h.includes('طالب'));
        let emailIdx = header.findIndex(h => h.includes('email') || h.includes('بريد'));
        let phoneIdx = header.findIndex(h => h.includes('phone') || h.includes('هاتف') || h.includes('موبايل'));
        let guardianNameIdx = header.findIndex(h => h.includes('guardian') || h.includes('ولي') || h.includes('أمر'));
        let guardianPhoneIdx = header.findIndex(h => h.includes('guardian_phone') || h.includes('رقم_ولي'));
        let addressIdx = header.findIndex(h => h.includes('address') || h.includes('عنوان'));

        let dataRows = rows;
        if (nameIdx !== -1 || emailIdx !== -1 || phoneIdx !== -1) {
          dataRows = rows.slice(1);
        } else {
          nameIdx = 0;
          emailIdx = 1;
          phoneIdx = 2;
        }

        const students: GroupStudent[] = [];
        dataRows.forEach((row, i) => {
          const stdName = row[nameIdx !== -1 ? nameIdx : 0] || row[0];
          if (!stdName || stdName.toLowerCase().includes('name') || stdName.toLowerCase().includes('اسم')) return;

          const stdEmail = (emailIdx !== -1 && row[emailIdx]) ? row[emailIdx] : `student.${i + 1}@sanadak.edu`;
          const stdPhone = (phoneIdx !== -1 && row[phoneIdx]) ? row[phoneIdx] : '01000000000';

          students.push({
            id: `std-xl-${Date.now()}-${i}`,
            name: stdName,
            email: stdEmail,
            phone: stdPhone,
            code: `STD-${1000 + i}`,
            joinedDate: new Date().toISOString().split('T')[0],
            guardianName: guardianNameIdx !== -1 ? row[guardianNameIdx] : undefined,
            guardianPhone: guardianPhoneIdx !== -1 ? row[guardianPhoneIdx] : undefined,
            address: addressIdx !== -1 ? row[addressIdx] : undefined
          });
        });

        if (students.length === 0) {
          setParseError(lang === 'ar' ? 'لم يتم العثور على بيانات طلاب صالحة بالملف' : 'No valid student data found in file');
        } else {
          setParsedStudents(students);
        }
      } catch (err) {
        setParseError(lang === 'ar' ? 'حدث خطأ أثناء قراءة الملف' : 'Error parsing file content');
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleBatchSubmit = () => {
    if (parsedStudents.length === 0) return;

    addStudentsToGroup(groupId, parsedStudents);
    showToast(
      lang === 'ar'
        ? `✓ تم رفع وقبول (${parsedStudents.length}) طالب في ${groupName} بنجاح!`
        : `✓ Successfully imported (${parsedStudents.length}) students into ${groupName}!`,
      'success'
    );
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setGuardianName('');
    setGuardianPhone('');
    setAddress('');
    setFile(null);
    setParsedStudents([]);
    setParseError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 z-10 shadow-2xl relative border border-gray-100 space-y-5 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-brand-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">
              {lang === 'ar' ? 'إضافة طلاب للجروب' : 'Add Students to Group'}
            </h3>
            <p className="text-xs text-brand-600 font-bold mt-0.5">{groupName}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
              activeTab === 'form' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {lang === 'ar' ? 'إضافة يدوية (Form)' : 'Manual Form'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('excel')}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'excel' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{lang === 'ar' ? 'رفع ملف إكسيل / CSV' : 'Upload Excel / CSV'}</span>
          </button>
        </div>

        {/* Tab 1: Manual Form */}
        {activeTab === 'form' && (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                {lang === 'ar' ? 'اسم الطالب بالكامل *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: محمد أحمد علي' : 'e.g. Mohamed Ahmed'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {lang === 'ar' ? 'رقم الهاتف (موبايل)' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {lang === 'ar' ? 'اسم ولي الأمر' : 'Guardian Name'}
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={e => setGuardianName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اسم ولي الأمر' : 'Guardian Name'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  {lang === 'ar' ? 'رقم هاتف ولي الأمر' : 'Guardian Phone'}
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={e => setGuardianPhone(e.target.value)}
                  placeholder="01099887766"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                {lang === 'ar' ? 'العنوان السكني' : 'Address'}
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: القاهرة — مدينة نصر' : 'e.g. Cairo, Nasr City'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-gray-100">
              <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all">
                {lang === 'ar' ? 'إضافة الطالب' : 'Add Student'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Excel Upload */}
        {activeTab === 'excel' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 p-6 rounded-2xl text-center cursor-pointer transition-all space-y-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv, .xlsx, .xls, text/csv, text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-extrabold text-emerald-900">
                  {file ? file.name : (lang === 'ar' ? 'اضغط لاختيار ملف إكسيل / CSV أو اسحبه هنا' : 'Click or drag & drop CSV/Excel file')}
                </p>
                <p className="text-[11px] text-gray-500 font-semibold mt-1">
                  {lang === 'ar' ? 'الأعمدة المطلوبة: الاسم، البريد، الهاتف، الكود' : 'Expected columns: Name, Email, Phone, Code'}
                </p>
              </div>
            </div>

            {parseError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                ⚠️ {parseError}
              </div>
            )}

            {parsedStudents.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-800">
                    {lang === 'ar' ? `معاينة الطلاب المكتشفة بالملف (${parsedStudents.length} طالب):` : `Parsed Students Preview (${parsedStudents.length}):`}
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">جاهز للإستيراد</span>
                </div>

                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-gray-100 text-gray-600 font-bold sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-start">الاسم</th>
                        <th className="px-3 py-2 text-start">البريد</th>
                        <th className="px-3 py-2 text-start">الهاتف</th>
                        <th className="px-3 py-2 text-center">الكود</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {parsedStudents.map((std, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-bold text-gray-800">{std.name}</td>
                          <td className="px-3 py-2 text-gray-500">{std.email}</td>
                          <td className="px-3 py-2 text-gray-500">{std.phone}</td>
                          <td className="px-3 py-2 text-center font-mono font-bold text-brand-600">{std.code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleBatchSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  <span>{lang === 'ar' ? `تأكيد إضافة ${parsedStudents.length} طالب إلى الجروب` : `Import ${parsedStudents.length} Students`}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
