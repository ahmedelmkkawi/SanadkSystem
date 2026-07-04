import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { paymentChartData } from '../../data/initialData';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { ScriptableContext } from 'chart.js';
import type { Instructor, PayoutModel } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const { instructors, setInstructors, showToast, pushToUndoStack, lang, t } = useApp();
  
  // Payout System
  const [selectedPayoutModel, setSelectedPayoutModel] = useState<PayoutModel>('per-student');
  const [chartData, setChartData] = useState<number[]>(paymentChartData['per-student']);

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCourse, setFormCourse] = useState('');
  const [formModel, setFormModel] = useState('Per Student');
  const [formAmount, setFormAmount] = useState('');
  const [formStatus, setFormStatus] = useState('تم الدفع');

  // Calculations
  let totalPaid = 0;
  let pendingPaid = 0;
  instructors.forEach(ins => {
    if (ins.status === 'تم الدفع' || ins.status === 'Paid') {
      totalPaid += ins.amount;
    } else {
      pendingPaid += ins.amount;
    }
  });

  const openAddModal = () => {
    setEditIndex(null);
    setFormName('');
    setFormCourse('');
    setFormModel('Per Student');
    setFormAmount('');
    setFormStatus('تم الدفع');
    setIsModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    const ins = instructors[idx];
    setEditIndex(idx);
    setFormName(ins.name);
    setFormCourse(ins.course);
    setFormModel(ins.model);
    setFormAmount(ins.amount.toString());
    setFormStatus(ins.status);
    setIsModalOpen(true);
  };

  const deleteIns = (idx: number) => {
    const deletedItem = instructors[idx];
    const oldList = [...instructors];
    setInstructors(prev => prev.filter((_, i) => i !== idx));
    pushToUndoStack(() => setInstructors(oldList));
    showToast(
      lang === 'ar'
        ? `تم حذف المحاضر ${deletedItem.name} • [تراجع]`
        : `Deleted instructor ${deletedItem.name} • [Undo]`,
      'warning',
      true
    );
  };

  const saveInstructor = () => {
    const amountNum = parseInt(formAmount.trim(), 10);
    if (!formName.trim() || !formCourse.trim() || isNaN(amountNum)) {
      showToast(
        lang === 'ar'
          ? 'الرجاء إدخال بيانات صحيحة في جميع الحقول الإلزامية'
          : 'Please enter valid values in all mandatory fields',
        'warning'
      );
      return;
    }

    const updatedItem: Instructor = {
      name: formName.trim(),
      course: formCourse.trim(),
      model: formModel,
      amount: amountNum,
      status: formStatus,
    };

    const oldList = [...instructors];

    if (editIndex !== null) {
      setInstructors(prev => prev.map((item, i) => i === editIndex ? updatedItem : item));
      pushToUndoStack(() => setInstructors(oldList));
      showToast(
        lang === 'ar'
          ? 'تم تعديل بيانات المحاضر بنجاح • [تراجع]'
          : 'Instructor details updated successfully • [Undo]',
        'success',
        true
      );
    } else {
      setInstructors(prev => [...prev, updatedItem]);
      pushToUndoStack(() => setInstructors(oldList));
      showToast(
        lang === 'ar'
          ? 'تم إضافة محاضر جديد بنجاح ✓ • [تراجع]'
          : 'New instructor added successfully ✓ • [Undo]',
        'success',
        true
      );
    }
    setIsModalOpen(false);
  };

  const updatePayoutModelChart = (model: PayoutModel) => {
    setSelectedPayoutModel(model);
    setChartData(paymentChartData[model]);
    showToast(
      lang === 'ar'
        ? `تم تغيير وضع تحليل المدفوعات إلى: ${t(model)}`
        : `Payout analytics model changed to: ${t(model)}`,
      'info'
    );
  };

  const savePayoutSettings = () => {
    setChartData(paymentChartData[selectedPayoutModel]);
    showToast(
      lang === 'ar'
        ? 'تم تحديث وحفظ نظام الدفع والتحليلات بنجاح ✓'
        : 'Payout settings and analytics saved successfully ✓',
      'success'
    );
  };

  // Chart configuration
  const data = {
    labels: lang === 'ar'
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: lang === 'ar' ? 'المدفوعات' : 'Payments',
      data: chartData,
      borderColor: '#dc2626',
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(220, 38, 38, 0.15)');
        gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
        return gradient;
      },
      borderWidth: 2.5,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#dc2626',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#a1a1aa',
        bodyColor: '#fafafa',
        borderColor: '#e4e4e7',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (c: any) => `EGP ${c.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f4f4f5' },
        ticks: {
          color: '#a1a1aa',
          callback: (v: any) => `${(v / 1000)}K`
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#a1a1aa' }
      }
    }
  };

  return (
    <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* 4 Finance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all neon-border">
          <p className="text-gray-500 text-sm font-semibold mb-1">{t('totalPayout')}</p>
          <p className="text-3xl font-black text-gray-900 neon-text-glow">EGP {totalPaid.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">+18% {t('fromPrevMonth')}</p>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all neon-border">
          <p className="text-gray-500 text-sm font-semibold mb-1">{t('pendingBal')}</p>
          <p className="text-3xl font-black text-amber-500">EGP {pendingPaid.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-semibold mt-1">{t('pendingPayoutDesc')}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all neon-border">
          <p className="text-gray-500 text-sm font-semibold mb-1">{t('activeInstructors')}</p>
          <p className="text-3xl font-black text-gray-900">{instructors.length}</p>
          <p className="text-xs text-gray-400 font-semibold mt-1">{t('inApprovedCourses')}</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all neon-border">
          <p className="text-gray-500 text-sm font-semibold mb-1">{t('totalStudentsAll')}</p>
          <p className="text-3xl font-black text-gray-900">342</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">+24 {t('thisWeek')}</p>
        </div>
      </div>

      {/* Setup & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payout Model Setup Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">{t('payoutModel')}</h3>
            <p className="text-xs text-gray-400 mb-5">{t('payoutModelDesc')}</p>
            
            <div className="space-y-3">
              {/* Radio 1: Per Student */}
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{t('Per Student')}</p>
                    <p className="text-[11px] text-gray-400">{t('perStudentDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payoutModel"
                  value="per-student"
                  checked={selectedPayoutModel === 'per-student'}
                  onChange={() => updatePayoutModelChart('per-student')}
                  className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                />
              </label>

              {/* Radio 2: Per Round */}
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{t('Per Round')}</p>
                    <p className="text-[11px] text-gray-400">{t('perRoundDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payoutModel"
                  value="per-round"
                  checked={selectedPayoutModel === 'per-round'}
                  onChange={() => updatePayoutModelChart('per-round')}
                  className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                />
              </label>

              {/* Radio 3: Monthly */}
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{t('Monthly')}</p>
                    <p className="text-[11px] text-gray-400">{t('monthlySalaryDesc')}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payoutModel"
                  value="monthly"
                  checked={selectedPayoutModel === 'monthly'}
                  onChange={() => updatePayoutModelChart('monthly')}
                  className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                />
              </label>
            </div>
          </div>

          <button onClick={savePayoutSettings} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-bold text-sm mt-4 transition-all shadow-lg shadow-brand-600/20">
            {t('saveSettings')}
          </button>
        </div>

        {/* Financial Line Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">{t('financeChart')}</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 outline-none">
              <option>{t('last6Months')}</option>
              <option>{t('lastYear')}</option>
              <option>{t('allPeriods')}</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] relative">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>

      {/* Instructors Table & Operations */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{t('instructorPayments')}</h3>
          <button onClick={openAddModal} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20">
            + {t('addNewInstructor')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-zinc-700 text-center align-middle">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-5 py-3">{t('instructor')}</th>
                <th className="px-5 py-3">{t('course')}</th>
                <th className="px-5 py-3">{t('model')}</th>
                <th className="px-5 py-3">{t('amount')}</th>
                <th className="px-5 py-3">{t('status')}</th>
                <th className="px-5 py-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-800">
              {instructors.map((ins, i) => {
                const isPaid = ins.status === 'تم الدفع' || ins.status === 'Paid';
                const statusText = isPaid ? (lang === 'ar' ? 'تم الدفع' : 'Paid') : (lang === 'ar' ? 'معلق' : 'Pending');
                const statusClass = isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600';
                const modelClass = ins.model === 'Per Student' ? 'bg-red-50 text-brand-600' : ins.model === 'Monthly' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600';
                
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-600">
                          {ins.name.charAt(0)}
                        </div>
                        <span className="font-extrabold text-gray-800">{ins.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{ins.course}</td>
                    <td className="px-5 py-4">
                      <span className={`${modelClass} px-2.5 py-1 rounded-lg text-xs font-semibold`}>{t(ins.model)}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">EGP {ins.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`${statusClass} px-2.5 py-1.5 rounded-lg text-xs font-bold`}>{statusText}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(i)} className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-zinc-500 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm" title={t('تعديل')}>
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => deleteIns(i)} className="w-8 h-8 rounded-full bg-red-50 border border-red-100 text-brand-600 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm" title={t('حذف')}>
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructor Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg mx-4 p-8 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editIndex !== null ? t('editInstructorDetails') : t('addNewInstructor')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('instructorName')} *</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder={t('enterFullName')} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('courseSubject')} *</label>
                <input type="text" value={formCourse} onChange={e => setFormCourse(e.target.value)} placeholder="React, UI/UX, Node.js" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('model')}</label>
                <select value={formModel} onChange={e => setFormModel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 font-bold">
                  <option value="Per Student">Per Student</option>
                  <option value="Per Round">Per Round</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('amountEgp')} *</label>
                <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="15000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">{t('status')}</label>
                <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 font-bold">
                  <option value="تم الدفع">{t('Paid')}</option>
                  <option value="معلق">{t('Pending')}</option>
                </select>
              </div>
              <button onClick={saveInstructor} className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-brand-600/20 mt-2">
                {t('saveData')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
