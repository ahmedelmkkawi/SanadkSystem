import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type FinancialRecord } from '../store/useAppStore';
import { useDevModuleStore } from '../store/devModuleStore';
import {
  Plus,
  DollarSign,
  Tag,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  FileText,
  Paperclip,
  Clock,
  Eye,
  CreditCard,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export const FinanceRevenues: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { financeRecords, addFinancialRecord, updateFinancialRecord, deleteFinancialRecord } = useAppStore();
  const { projects } = useDevModuleStore();

  // Create Modal State
  const [formOpen, setFormOpen] = useState(false);

  // Form Initial Data
  const getInitialForm = () => ({
    title: '',
    category: 'عقد',
    date: new Date().toISOString().split('T')[0],
    totalInvoicedAmount: 10000,
    paidAmount: 10000,
    remainingAmount: 0,
    dueDate: '',
    customerName: '',
    department: 'SoftwareDevelopment',
    projectId: '',
    contractNumber: '',
    paymentMethod: 'Bank Transfer' as 'Cash' | 'InstaPay' | 'Bank Transfer' | 'E-Wallet' | 'Check',
    transactionRef: '',
    bankName: '',
    walletType: '',
    senderDetails: '',
    attachmentName: '',
    attachmentUrl: ''
  });

  const [formData, setFormData] = useState(getInitialForm());

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);

  // Delete Modal State
  const [deletingRecord, setDeletingRecord] = useState<FinancialRecord | null>(null);

  // View Details Modal State
  const [viewingRecord, setViewingRecord] = useState<FinancialRecord | null>(null);

  // Revenue Records List
  const revenues = financeRecords.filter(r => r.type === 'Revenue');
  const totalRevenue = revenues.reduce((acc, curr) => acc + curr.amount, 0);
  const totalReceivables = revenues.reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

  // Helper for Auto-Calculating Remaining & Collection Status
  const handleAmountChange = (invoiced: number, paid: number, formSetter: any, currentForm: any) => {
    const remaining = Math.max(0, invoiced - paid);
    let status = 'Full';
    if (remaining > 0 && paid > 0) status = 'Partial';
    if (paid === 0 && remaining > 0) status = 'Credit';

    formSetter({
      ...currentForm,
      totalInvoicedAmount: invoiced,
      paidAmount: paid,
      remainingAmount: remaining,
      collectionStatus: status
    });
  };

  // Simulated Attachment Handler
  const handleFileSimulate = (e: React.ChangeEvent<HTMLInputElement>, formSetter: any, currentForm: any) => {
    const file = e.target.files?.[0];
    if (file) {
      formSetter({
        ...currentForm,
        attachmentName: file.name,
        attachmentUrl: URL.createObjectURL(file)
      });
      toast.success(isRtl ? `تم إرفاق الملف: ${file.name}` : `File attached: ${file.name}`);
    }
  };

  // Submit Handler for New Revenue
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find(p => p.id === formData.projectId);

    addFinancialRecord({
      type: 'Revenue',
      title: formData.title,
      category: formData.category,
      date: formData.date,
      amount: formData.paidAmount, // collected amount
      totalInvoicedAmount: formData.totalInvoicedAmount,
      paidAmount: formData.paidAmount,
      remainingAmount: formData.remainingAmount,
      dueDate: formData.dueDate,
      collectionStatus: formData.remainingAmount === 0 ? 'Full' : (formData.paidAmount > 0 ? 'Partial' : 'Credit'),
      customerName: formData.customerName,
      department: formData.department,
      projectId: formData.projectId,
      projectName: selectedProj ? selectedProj.name : '',
      contractNumber: formData.contractNumber,
      paymentMethod: formData.paymentMethod,
      account: formData.paymentMethod === 'Bank Transfer' ? `بنك ${formData.bankName || 'CIB'}` :
               formData.paymentMethod === 'E-Wallet' ? `محفظة ${formData.walletType || 'فودافون كاش'}` : formData.paymentMethod,
      transactionRef: formData.transactionRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      bankName: formData.bankName,
      walletType: formData.walletType,
      senderDetails: formData.senderDetails,
      attachments: formData.attachmentName ? [formData.attachmentName] : [],
      recordedBy: 'محمود عبد السلام (المحاسب المالي)',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: formData.remainingAmount > 0 ? 'Pending' : 'Completed',
      credit: formData.paidAmount,
      debit: 0
    });

    toast.success(isRtl ? 'تم تسجيل الإيراد والتحصيل المالي بنجاح' : 'Revenue and collection logged successfully');
    setFormOpen(false);
    setFormData(getInitialForm());
  };

  // Submit Handler for Editing Revenue
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateFinancialRecord(editingRecord);
      toast.success(isRtl ? 'تم تعديل قيد الإيراد بنجاح' : 'Revenue record updated successfully');
      setEditingRecord(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingRecord) {
      deleteFinancialRecord(deletingRecord.id);
      toast.success(isRtl ? 'تم حذف قيد الإيراد بنجاح' : 'Revenue record deleted successfully');
      setDeletingRecord(null);
    }
  };

  return (
    <div className="space-y-6 font-outfit pb-12">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-950 tracking-tight m-0">{t('revenues')}</h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-150">
              {isRtl ? 'تسجيل وإثبات المقبوضات' : 'Revenue Collection Module'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isRtl ? 'إدخال وتوثيق إيرادات العقود، دفعات المشاريع، الخدمات الاستشارية وإثبات الإيصالات البنكية.' : 'Log and manage all revenue contracts and payment collections.'}
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'تسجيل إيراد / تحصيل جديد' : 'Log New Revenue'}</span>
        </button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'إجمالي المحصل الفعلي' : 'Total Revenue Collected'}</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">{totalRevenue.toLocaleString()} ج.م</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'المستحقات المتبقية للتحصيل' : 'Outstanding Receivables'}</span>
            <h3 className="text-2xl font-black text-amber-600 mt-1 font-mono">{totalReceivables.toLocaleString()} ج.م</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm flex items-center justify-between bg-red-50/10">
          <div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{isRtl ? 'عدد قيود الإيراد المقيدة' : 'Revenue Transactions'}</span>
            <h3 className="text-2xl font-black text-red-600 mt-1 font-mono">{revenues.length}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Revenues Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="font-extrabold text-xs text-gray-900 uppercase tracking-widest">{isRtl ? 'دفتر قيود ومقبوضات الإيرادات' : 'Revenues & Collections Ledger'}</span>
          <span className="text-xs font-mono text-gray-400">
            {revenues.length} {isRtl ? 'قيد مالي' : 'records'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'البيان / الوصف' : 'Description'}</th>
                <th className="p-4 text-start">{t('date')}</th>
                <th className="p-4 text-start">{isRtl ? 'نوع الإيراد' : 'Type / Category'}</th>
                <th className="p-4 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="p-4 text-start">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</th>
                <th className="p-4 text-end">{isRtl ? 'المحسّل الان' : 'Collected'}</th>
                <th className="p-4 text-end">{isRtl ? 'المتبقي' : 'Remaining'}</th>
                <th className="p-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {revenues.map((rev) => (
                <tr key={rev.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-bold text-gray-900 max-w-xs truncate">
                    <div>{rev.title}</div>
                    <span className="text-[10px] text-gray-400 font-mono">{rev.id} | {rev.contractNumber || 'بدون عقد'}</span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono">{rev.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      <Tag className="w-3 h-3" />
                      <span>{rev.category}</span>
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 font-bold">{rev.customerName || 'عميل عام'}</td>
                  <td className="p-4 text-gray-500">{rev.paymentMethod || rev.account || 'تحويل بنكي'}</td>
                  <td className="p-4 text-end font-mono font-bold text-emerald-600">+{rev.amount.toLocaleString()} ج.م</td>
                  <td className="p-4 text-end font-mono text-amber-600 font-bold">
                    {(rev.remainingAmount || 0) > 0 ? `${rev.remainingAmount?.toLocaleString()} ج.م` : '-'}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewingRecord(rev)}
                        title={isRtl ? 'تفاصيل القيد' : 'View Audit Details'}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingRecord(rev)}
                        title={isRtl ? 'تعديل' : 'Edit'}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingRecord(rev)}
                        title={isRtl ? 'حذف' : 'Delete'}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {revenues.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    لا يوجد إيرادات مسجلة بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. Add Revenue / Collection Modal (تسجيل إيراد / تحصيل) */}
      {/* ========================================================================= */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl w-full max-w-2xl p-6 z-10 shadow-2xl relative border border-gray-150 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-950 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>{isRtl ? 'تسجيل إيراد / تحصيل مالي جديد' : 'Log New Revenue & Collection'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRtl ? 'استيفاء بيانات العقد، المبالغ المستحقة والمحصلة، وإرفاق إيصال الدفع البنكي.' : 'Record invoice, collection amount, payment method and proof receipt.'}
              </p>
            </div>

            {/* SECTION 1: البيانات الأساسية للإيراد */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-1.5 text-red-600">
                <FileText className="w-4 h-4" />
                <span>{isRtl ? '1. البيانات الأساسية للإيراد' : '1. Basic Revenue Details'}</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'البيان / الوصف *' : 'Description / Title *'}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="custom-input text-xs"
                  placeholder="عقد توريد وتطوير سيستم مبيعات شركة النور..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'نوع الإيراد / التصنيف *' : 'Revenue Category *'}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="عقد">{isRtl ? 'عقد' : 'Contract'}</option>
                    <option value="دفعة مشروع">{isRtl ? 'دفعة مشروع' : 'Project Installment'}</option>
                    <option value="استشارة">{isRtl ? 'استشارة' : 'Consultation'}</option>
                    <option value="خدمة هندسية">{isRtl ? 'خدمة هندسية' : 'Engineering Service'}</option>
                    <option value="أخرى">{isRtl ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('date')} *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              {/* Financial Amounts Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-150">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{isRtl ? 'إجمالي الفاتورة / المستحق (ج.م) *' : 'Gross Invoice Amount *'}</label>
                  <input
                    type="number"
                    required
                    value={formData.totalInvoicedAmount}
                    onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0, formData.paidAmount, setFormData, formData)}
                    className="custom-input text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-700 mb-1">{isRtl ? 'المبلغ المحصل الآن (ج.م) *' : 'Collected Amount *'}</label>
                  <input
                    type="number"
                    required
                    value={formData.paidAmount}
                    onChange={(e) => handleAmountChange(formData.totalInvoicedAmount, parseFloat(e.target.value) || 0, setFormData, formData)}
                    className="custom-input text-xs font-mono font-bold text-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-700 mb-1">{isRtl ? 'المتبقي المستحق (ج.م)' : 'Remaining Balance'}</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.remainingAmount}
                    className="custom-input text-xs font-mono font-bold text-amber-600 bg-amber-50/50"
                  />
                </div>
              </div>

              {formData.remainingAmount > 0 && (
                <div>
                  <label className="block text-xs font-bold text-amber-700 mb-1.5">{isRtl ? 'تاريخ استحقاق المتبقي (Due Date)' : 'Due Date for Remaining'}</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="custom-input text-xs border-amber-300"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'العميل / الجهة الدافعة *' : 'Customer / Paying Entity *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="custom-input text-xs"
                    placeholder="شركة النور للاستيراد..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'القسم *' : 'Department *'}</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="SoftwareDevelopment">{isRtl ? 'البرمجة والتطوير' : 'Programming'}</option>
                    <option value="Training">{isRtl ? 'التدريب والتعليم' : 'Training'}</option>
                    <option value="Marketing">{isRtl ? 'التسويق والإعلانات' : 'Marketing'}</option>
                    <option value="Sales">{isRtl ? 'المبيعات' : 'Sales'}</option>
                    <option value="Administration">{isRtl ? 'الإدارة العامة والمالية' : 'Administration'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'المشروع المرتبط' : 'Linked Project'}</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="">{isRtl ? '-- اختر المشروع --' : '-- Select Project --'}</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'رقم العقد المرتبط (إن وجد)' : 'Linked Contract Number'}</label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="custom-input text-xs"
                  placeholder="CNT-2026-042..."
                />
              </div>
            </div>

            {/* SECTION 2: بيانات التحصيل ودفع المبالغ */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-1.5 text-red-600">
                <CreditCard className="w-4 h-4" />
                <span>{isRtl ? '2. بيانات التحصيل وطريقة الدفع' : '2. Collection & Payment Method'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'طريقة الدفع *' : 'Payment Method *'}</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="custom-input text-xs"
                  >
                    <option value="Bank Transfer">{isRtl ? 'تحويل بنكي (Bank Transfer)' : 'Bank Transfer'}</option>
                    <option value="InstaPay">InstaPay</option>
                    <option value="E-Wallet">{isRtl ? 'محفظة إلكترونية (E-Wallet)' : 'E-Wallet'}</option>
                    <option value="Cash">{isRtl ? 'نقدي (Cash)' : 'Cash'}</option>
                    <option value="Check">{isRtl ? 'شيك بنكي (Check)' : 'Check'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'رقم / مرجع العملية *' : 'Transaction Reference *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.transactionRef}
                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                    className="custom-input text-xs font-mono"
                    placeholder="TRX-948201..."
                  />
                </div>
              </div>

              {/* Conditional Bank Name */}
              {(formData.paymentMethod === 'Bank Transfer' || formData.paymentMethod === 'Check') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'اسم البنك *' : 'Bank Name *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="custom-input text-xs"
                    placeholder="البنك التجاري الدولي CIB / بنك مصر..."
                  />
                </div>
              )}

              {/* Conditional Wallet Type */}
              {formData.paymentMethod === 'E-Wallet' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'نوع / رقم المحفظة *' : 'Wallet Type / Number *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.walletType}
                    onChange={(e) => setFormData({ ...formData, walletType: e.target.value })}
                    className="custom-input text-xs"
                    placeholder="فودافون كاش / أورنج كاش - 010xxxx..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'اسم / بيانات المحوّل (اختياري)' : 'Payer Sender Details'}</label>
                <input
                  type="text"
                  value={formData.senderDetails}
                  onChange={(e) => setFormData({ ...formData, senderDetails: e.target.value })}
                  className="custom-input text-xs"
                  placeholder="اسم الشخص أو اسم الحساب المحول منه..."
                />
              </div>
            </div>

            {/* SECTION 3: إثبات العملية والمرفقات */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-1.5 text-red-600">
                <Paperclip className="w-4 h-4" />
                <span>{isRtl ? '3. إثبات العملية والمرفقات (إيصال التحصيل)' : '3. Proof & Attachments'}</span>
              </h4>

              <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileSimulate(e, setFormData, formData)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-700 block">
                  {isRtl ? 'اضغط أو اسحب الملف لإرفاق إيصال/صورة التحويل (PDF / Image)' : 'Click to attach receipt or transfer proof (PDF / Image)'}
                </span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'الحد الأقصى 10 ميجابايت' : 'Max size 10MB'}</span>
              </div>

              {formData.attachmentName && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>{formData.attachmentName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attachmentName: '', attachmentUrl: '' })}
                    className="text-red-600 hover:text-red-800 text-xs font-bold"
                  >
                    {isRtl ? 'حذف/استبدال' : 'Remove'}
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 4: بيانات النظام التلقائية */}
            <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 flex justify-between items-center font-mono">
              <span>{isRtl ? 'مسجل بواسطة:' : 'By:'} محمود عبد السلام (المحاسب المالي)</span>
              <span>{isRtl ? 'الوقت:' : 'Time:'} {new Date().toISOString().substring(0, 10)}</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs">
                {isRtl ? 'حفظ وإثبات الإيراد' : 'Save & Post Revenue'}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Audit View Complete Revenue Details Modal (الاطلاع الكامل على البيانات) */}
      {/* ========================================================================= */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setViewingRecord(null)} />
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 z-10 shadow-2xl relative border border-gray-150 space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-extrabold text-base text-gray-950">{isRtl ? 'تفاصيل وإثبات قيد الإيراد الشامل' : 'Full Revenue Audit Details'}</h3>
                <span className="text-xs text-gray-400 font-mono">{viewingRecord.id} | العقد: {viewingRecord.contractNumber || 'بدون عقد'}</span>
              </div>
            </div>

            {/* Comprehensive View Cards Grid */}
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-gray-900 uppercase tracking-widest text-[11px] text-red-600">{isRtl ? '1. البيانات الأساسية للإيراد' : '1. Basic Information'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'البيان / الوصف' : 'Title / Description'}</span>
                  <span className="font-bold text-gray-900 text-sm">{viewingRecord.title}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'نوع الإيراد / التصنيف' : 'Category'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-0.5 border border-emerald-200">
                    <Tag className="w-3 h-3" />
                    <span>{viewingRecord.category}</span>
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'التاريخ' : 'Date'}</span>
                  <span className="font-mono font-bold text-gray-800">{viewingRecord.date}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'العميل / الجهة الدافعة' : 'Customer'}</span>
                  <span className="font-bold text-gray-900">{viewingRecord.customerName || 'عميل عام'}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'القسم المسؤول' : 'Department'}</span>
                  <span className="font-bold text-gray-800">{viewingRecord.department || 'SoftwareDevelopment'}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'المشروع المرتبط' : 'Project'}</span>
                  <span className="font-bold text-gray-800">{viewingRecord.projectName || 'خدمات عامة'}</span>
                </div>
              </div>

              <h4 className="font-extrabold text-gray-900 uppercase tracking-widest text-[11px] text-red-600 pt-2">{isRtl ? '2. التوزيع المالي والتحصيل' : '2. Financial Breakdown'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'إجمالي قيمة الفاتورة / المستحق' : 'Gross Invoice Amount'}</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">{(viewingRecord.totalInvoicedAmount || viewingRecord.amount).toLocaleString()} ج.م</span>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 text-[10px] block font-bold">{isRtl ? 'المبلغ المحصل الفعلي' : 'Collected Amount'}</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">+{viewingRecord.amount.toLocaleString()} ج.م</span>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <span className="text-amber-700 text-[10px] block font-bold">{isRtl ? 'المتبقي المستحق' : 'Remaining Balance'}</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{(viewingRecord.remainingAmount || 0).toLocaleString()} ج.م</span>
                </div>
              </div>

              {viewingRecord.dueDate && (
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800 font-bold">
                  <span>{isRtl ? `تاريخ استحقاق المتبقي: ${viewingRecord.dueDate}` : `Due Date: ${viewingRecord.dueDate}`}</span>
                </div>
              )}

              <h4 className="font-extrabold text-gray-900 uppercase tracking-widest text-[11px] text-red-600 pt-2">{isRtl ? '3. بيانات الدفع والمرفقات' : '3. Payment & Attachments'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</span>
                  <span className="font-bold text-gray-900">{viewingRecord.paymentMethod || viewingRecord.account}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'رقم / مرجع العملية' : 'Transaction Ref'}</span>
                  <span className="font-mono font-bold text-gray-900">{viewingRecord.transactionRef || 'N/A'}</span>
                </div>

                {viewingRecord.bankName && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'اسم البنك' : 'Bank Name'}</span>
                    <span className="font-bold text-gray-900">{viewingRecord.bankName}</span>
                  </div>
                )}

                {viewingRecord.walletType && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'نوع / رقم المحفظة' : 'Wallet Info'}</span>
                    <span className="font-bold text-gray-900">{viewingRecord.walletType}</span>
                  </div>
                )}

                {viewingRecord.senderDetails && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-2">
                    <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'اسم / بيانات المحول' : 'Sender Details'}</span>
                    <span className="font-bold text-gray-900">{viewingRecord.senderDetails}</span>
                  </div>
                )}

                {/* Attachment Viewing Box in View Modal */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 col-span-2 space-y-2">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'صورة الفاتورة / الإيصال المرفق' : 'Uploaded Invoice / Receipt Image'}</span>
                  {viewingRecord.attachments && viewingRecord.attachments.length > 0 ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>{viewingRecord.attachments[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.success(isRtl ? `جاري معاينة الصورة: ${viewingRecord.attachments?.[0]}` : `Previewing image`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'معاينة الصورة' : 'View Image'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs italic">{isRtl ? 'لا يوجد صورة مرفقة لهذا القيد' : 'No receipt image attached'}</div>
                  )}
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 flex justify-between items-center font-mono">
                <span>{isRtl ? 'مسجل بواسطة:' : 'Recorded by:'} {viewingRecord.recordedBy || 'محمود عبد السلام (المحاسب المالي)'}</span>
                <span>{isRtl ? 'التسجيل:' : 'Time:'} {viewingRecord.createdAt || viewingRecord.date}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingRecord(null)}
                className="w-full custom-btn-secondary py-2.5 text-xs font-bold"
              >
                {isRtl ? 'إغلاق التقرير' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. Edit Complete Revenue Details Modal (تعديل كامل لكافة البيانات والصورة) */}
      {/* ========================================================================= */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setEditingRecord(null)} />
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl w-full max-w-2xl p-6 z-10 shadow-2xl relative border border-gray-150 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 end-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-950 text-base flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-600" />
                <span>{isRtl ? 'تعديل كافة بيانات وقيد ومرفقات الإيراد' : 'Edit Full Revenue & Receipt Record'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRtl ? 'يمكنك تعديل أي بند من بنود الفاتورة والتحصيل واستبدال صورة الإيصال بحرية كاملة.' : 'Modify any revenue detail, payment amounts, customer, or replace receipt image.'}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'البيان / الوصف *' : 'Description / Title *'}</label>
                <input
                  type="text"
                  required
                  value={editingRecord.title}
                  onChange={(e) => setEditingRecord({ ...editingRecord, title: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'نوع الإيراد / التصنيف *' : 'Revenue Category *'}</label>
                  <select
                    value={editingRecord.category}
                    onChange={(e) => setEditingRecord({ ...editingRecord, category: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="عقد">{isRtl ? 'عقد' : 'Contract'}</option>
                    <option value="دفعة مشروع">{isRtl ? 'دفعة مشروع' : 'Project Installment'}</option>
                    <option value="استشارة">{isRtl ? 'استشارة' : 'Consultation'}</option>
                    <option value="خدمة هندسية">{isRtl ? 'خدمة هندسية' : 'Engineering Service'}</option>
                    <option value="أخرى">{isRtl ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('date')} *</label>
                  <input
                    type="date"
                    required
                    value={editingRecord.date}
                    onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-150">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'إجمالي قيمة الفاتورة (ج.م) *' : 'Gross Invoice Amount'}</label>
                  <input
                    type="number"
                    required
                    value={editingRecord.totalInvoicedAmount || editingRecord.amount}
                    onChange={(e) => {
                      const invoiced = parseFloat(e.target.value) || 0;
                      const paid = editingRecord.amount;
                      const rem = Math.max(0, invoiced - paid);
                      setEditingRecord({ ...editingRecord, totalInvoicedAmount: invoiced, remainingAmount: rem });
                    }}
                    className="custom-input text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-700 mb-1">{isRtl ? 'المبلغ المحصل الآن (ج.م) *' : 'Collected Amount'}</label>
                  <input
                    type="number"
                    required
                    value={editingRecord.amount}
                    onChange={(e) => {
                      const paid = parseFloat(e.target.value) || 0;
                      const invoiced = editingRecord.totalInvoicedAmount || paid;
                      const rem = Math.max(0, invoiced - paid);
                      setEditingRecord({ ...editingRecord, amount: paid, paidAmount: paid, remainingAmount: rem, credit: paid });
                    }}
                    className="custom-input text-xs font-mono font-bold text-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-700 mb-1">{isRtl ? 'المتبقي المستحق (ج.م)' : 'Remaining Balance'}</label>
                  <input
                    type="number"
                    value={editingRecord.remainingAmount || 0}
                    onChange={(e) => setEditingRecord({ ...editingRecord, remainingAmount: parseFloat(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono font-bold text-amber-600 bg-amber-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'العميل / الجهة الدافعة' : 'Customer'}</label>
                  <input
                    type="text"
                    value={editingRecord.customerName || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, customerName: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'القسم' : 'Department'}</label>
                  <select
                    value={editingRecord.department || 'SoftwareDevelopment'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, department: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="SoftwareDevelopment">{isRtl ? 'البرمجة والتطوير' : 'Programming'}</option>
                    <option value="Training">{isRtl ? 'التدريب والتعليم' : 'Training'}</option>
                    <option value="Marketing">{isRtl ? 'التسويق والإعلانات' : 'Marketing'}</option>
                    <option value="Sales">{isRtl ? 'المبيعات' : 'Sales'}</option>
                    <option value="Administration">{isRtl ? 'الإدارة العامة والمالية' : 'Administration'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'المشروع المرتبط' : 'Linked Project'}</label>
                  <select
                    value={editingRecord.projectId || ''}
                    onChange={(e) => {
                      const proj = projects.find(p => p.id === e.target.value);
                      setEditingRecord({ ...editingRecord, projectId: e.target.value, projectName: proj ? proj.name : '' });
                    }}
                    className="custom-input text-xs"
                  >
                    <option value="">{isRtl ? '-- اختر المشروع --' : '-- Select Project --'}</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</label>
                  <select
                    value={editingRecord.paymentMethod || 'Bank Transfer'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, paymentMethod: e.target.value as any })}
                    className="custom-input text-xs"
                  >
                    <option value="Bank Transfer">{isRtl ? 'تحويل بنكي (Bank Transfer)' : 'Bank Transfer'}</option>
                    <option value="InstaPay">InstaPay</option>
                    <option value="E-Wallet">{isRtl ? 'محفظة إلكترونية (E-Wallet)' : 'E-Wallet'}</option>
                    <option value="Cash">{isRtl ? 'نقدي (Cash)' : 'Cash'}</option>
                    <option value="Check">{isRtl ? 'شيك بنكي (Check)' : 'Check'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'رقم / مرجع العملية' : 'Transaction Ref'}</label>
                  <input
                    type="text"
                    value={editingRecord.transactionRef || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, transactionRef: e.target.value })}
                    className="custom-input text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'اسم البنك' : 'Bank Name'}</label>
                  <input
                    type="text"
                    value={editingRecord.bankName || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, bankName: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'نوع / رقم المحفظة' : 'Wallet Info'}</label>
                  <input
                    type="text"
                    value={editingRecord.walletType || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, walletType: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'رقم العقد المرتبط' : 'Contract Number'}</label>
                <input
                  type="text"
                  value={editingRecord.contractNumber || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, contractNumber: e.target.value })}
                  className="custom-input text-xs"
                />
              </div>

              {/* Attachment Edit & Upload Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700">{isRtl ? 'تعديل وإدارة صورة الإيصال / الفاتورة المرفقة' : 'Edit Receipt / Invoice Attachment'}</label>
                {editingRecord.attachments && editingRecord.attachments.length > 0 ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>{editingRecord.attachments[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs font-bold cursor-pointer">
                        {isRtl ? 'استبدال الصورة' : 'Replace Image'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setEditingRecord({ ...editingRecord, attachments: [f.name] });
                              toast.success(isRtl ? `تم استبدال الصورة بـ: ${f.name}` : `Replaced image with ${f.name}`);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRecord({ ...editingRecord, attachments: [] });
                          toast.success(isRtl ? 'تم حذف صورة الإيصال المرفقة' : 'Attachment deleted');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold"
                      >
                        {isRtl ? 'حذف الصورة' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 p-3 rounded-xl text-center bg-gray-50/50 hover:bg-gray-50 relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setEditingRecord({ ...editingRecord, attachments: [f.name] });
                          toast.success(isRtl ? `تم إرفاق الصورة: ${f.name}` : `Image attached: ${f.name}`);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-700 block">
                      {isRtl ? 'اضغط لإرفاق صورة إيصال / تحويل جديدة (PDF / Image)' : 'Click to attach new receipt image'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-gray-100">
              <button type="submit" className="flex-1 custom-btn-primary py-2.5 text-xs font-bold">
                {isRtl ? 'حفظ كافة التعديلات' : 'Save All Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs font-bold"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeletingRecord(null)} />
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 z-10 shadow-2xl relative border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تأكيد حذف قيد الإيراد' : 'Confirm Delete Revenue'}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {isRtl
                  ? `هل أنت تأكد من رغبتك في حذف قيد الإيراد "${deletingRecord.title}" بقيمة ${deletingRecord.amount.toLocaleString()} ج.م؟`
                  : `Delete revenue "${deletingRecord.title}"?`}
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-xs rounded-xl transition-colors shadow-sm"
              >
                {isRtl ? 'نعم، احذف القيد' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setDeletingRecord(null)}
                className="flex-1 custom-btn-secondary py-2.5 text-xs"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
