import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type FinancialRecord } from '../store/useAppStore';
import { useDevModuleStore } from '../store/devModuleStore';
import {
  Plus,
  CreditCard,
  Tag,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  FileText,
  Paperclip,
  Eye,
  Building2,
  UploadCloud,
  FileCheck,
  Receipt
} from 'lucide-react';
import toast from 'react-hot-toast';

export const FinanceExpenses: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { financeRecords, addFinancialRecord, updateFinancialRecord, deleteFinancialRecord } = useAppStore();
  const { projects } = useDevModuleStore();

  // Create Modal State
  const [formOpen, setFormOpen] = useState(false);

  // Form Initial Data
  const getInitialForm = () => ({
    title: '',
    category: 'أدوات ومستلزمات',
    date: new Date().toISOString().split('T')[0],
    amount: 1500,
    department: 'Administration',
    projectId: '',
    supplierName: '',
    invoiceId: '',
    paymentMethod: 'Cash' as 'Cash' | 'InstaPay' | 'Bank Transfer' | 'E-Wallet' | 'Check',
    transactionRef: '',
    bankName: '',
    walletType: '',
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

  // Expense Records List
  const expenses = financeRecords.filter(r => r.type === 'Expense');
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Simulated Attachment Handler
  const handleFileSimulate = (e: React.ChangeEvent<HTMLInputElement>, formSetter: any, currentForm: any) => {
    const file = e.target.files?.[0];
    if (file) {
      formSetter({
        ...currentForm,
        attachmentName: file.name,
        attachmentUrl: URL.createObjectURL(file)
      });
      toast.success(isRtl ? `تم إرفاق فاتورة/إيصال المصروف: ${file.name}` : `Invoice attached: ${file.name}`);
    }
  };

  // Submit Handler for New Expense
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find(p => p.id === formData.projectId);

    addFinancialRecord({
      type: 'Expense',
      title: formData.title,
      category: formData.category,
      date: formData.date,
      amount: formData.amount,
      department: formData.department,
      projectId: formData.projectId,
      projectName: selectedProj ? selectedProj.name : '',
      supplierName: formData.supplierName,
      invoiceId: formData.invoiceId || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: formData.paymentMethod,
      account: formData.paymentMethod === 'Cash' ? 'الخزينة النقدية الرئيسية' :
               formData.paymentMethod === 'Bank Transfer' ? `بنك ${formData.bankName || 'CIB'}` :
               formData.paymentMethod === 'E-Wallet' ? `محفظة ${formData.walletType || 'فودافون كاش'}` : formData.paymentMethod,
      transactionRef: formData.transactionRef || `EXP-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      bankName: formData.bankName,
      walletType: formData.walletType,
      attachments: formData.attachmentName ? [formData.attachmentName] : [],
      recordedBy: 'محمود عبد السلام (المحاسب المالي)',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Completed',
      debit: formData.amount,
      credit: 0
    });

    toast.success(isRtl ? 'تم تسجيل وتوثيق قيد المصروف بنجاح' : 'Expense record logged successfully');
    setFormOpen(false);
    setFormData(getInitialForm());
  };

  // Submit Handler for Editing Expense
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateFinancialRecord(editingRecord);
      toast.success(isRtl ? 'تم تعديل قيد المصروف بنجاح' : 'Expense record updated successfully');
      setEditingRecord(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingRecord) {
      deleteFinancialRecord(deletingRecord.id);
      toast.success(isRtl ? 'تم حذف قيد المصروف بنجاح' : 'Expense record deleted successfully');
      setDeletingRecord(null);
    }
  };

  return (
    <div className="space-y-6 font-outfit pb-12">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-gray-950 tracking-tight m-0">{t('expenses')}</h1>
            <span className="bg-red-50 text-red-700 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border border-red-150">
              {isRtl ? 'تسجيل وإثبات النفقات' : 'Expense Disbursements Module'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isRtl ? 'رصد المصاريف التشغيلية، الرواتب، اشتراكات البرامج، وإرفاق صور الفواتير والإيصالات الرسمية.' : 'Log operational costs, supplier invoices, software subscriptions and proof documents.'}
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="w-full sm:w-auto custom-btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'تسجيل مصروف جديد' : 'Log New Expense'}</span>
        </button>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm flex items-center justify-between bg-red-50/10">
          <div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{isRtl ? 'إجمالي المصروفات المحتسبة' : 'Total Expenses'}</span>
            <h3 className="text-2xl font-black text-red-600 mt-1 font-mono">{totalExpense.toLocaleString()} ج.م</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'عدد قيود المصروفات' : 'Total Expense Items'}</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1 font-mono">{expenses.length}</h3>
          </div>
          <div className="p-3 bg-gray-100 text-gray-700 rounded-2xl">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{isRtl ? 'المصروفات النقدية الخزينة' : 'Cash Disbursements'}</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1 font-mono">
              {expenses.filter(e => e.paymentMethod === 'Cash' || e.account?.includes('خزينة')).reduce((a, b) => a + b.amount, 0).toLocaleString()} ج.م
            </h3>
          </div>
          <div className="p-3 bg-gray-100 text-gray-700 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="font-extrabold text-xs text-gray-900 uppercase tracking-widest">{isRtl ? 'دفتر قيود المصروفات والمدفوعات' : 'Expenses Ledger'}</span>
          <span className="text-xs font-mono text-gray-400">
            {expenses.length} {isRtl ? 'قيد مصروف' : 'records'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-red-50/20 border-b border-gray-100 text-gray-900 font-bold">
                <th className="p-4 text-start">{isRtl ? 'البيان / الوصف' : 'Description'}</th>
                <th className="p-4 text-start">{t('date')}</th>
                <th className="p-4 text-start">{isRtl ? 'التصنيف' : 'Category'}</th>
                <th className="p-4 text-start">{isRtl ? 'القسم' : 'Department'}</th>
                <th className="p-4 text-start">{isRtl ? 'المورد / المستفيد' : 'Supplier / Beneficiary'}</th>
                <th className="p-4 text-start">{isRtl ? 'طريقة الدفع' : 'Payment Method'}</th>
                <th className="p-4 text-end">{isRtl ? 'القيمة' : 'Amount'}</th>
                <th className="p-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-bold text-gray-900 max-w-xs truncate">
                    <div>{exp.title}</div>
                    <span className="text-[10px] text-gray-400 font-mono">{exp.id} | {exp.invoiceId || 'بدون فاتورة'}</span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono">{exp.date}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                      <Tag className="w-3 h-3" />
                      <span>{exp.category}</span>
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{exp.department || 'Administration'}</td>
                  <td className="p-4 text-gray-800 font-bold">{exp.supplierName || 'مورد عام'}</td>
                  <td className="p-4 text-gray-500">{exp.paymentMethod || exp.account || 'نقدي'}</td>
                  <td className="p-4 text-end font-mono font-bold text-red-600">-{exp.amount.toLocaleString()} ج.م</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewingRecord(exp)}
                        title={isRtl ? 'تفاصيل القيد' : 'View Audit Details'}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingRecord(exp)}
                        title={isRtl ? 'تعديل' : 'Edit'}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingRecord(exp)}
                        title={isRtl ? 'حذف' : 'Delete'}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    لا يوجد مصروفات مسجلة بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. Add Expense Modal (تسجيل مصروف) */}
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
                <CreditCard className="w-5 h-5 text-red-600" />
                <span>{isRtl ? 'تسجيل قيد مصروف ونفقة جديدة' : 'Log New Expense'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRtl ? 'تحديد سبب ونوع الصرف، الجهة المستفيدة، وإرفاق فاتورة الصرف الرسمية.' : 'Record expense category, supplier/beneficiary, invoice number and attached proof.'}
              </p>
            </div>

            {/* SECTION 1: البيانات الأساسية للمصروف */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-1.5 text-red-600">
                <FileText className="w-4 h-4" />
                <span>{isRtl ? '1. البيانات الأساسية للمصروف' : '1. Basic Expense Details'}</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'البيان / الوصف *' : 'Description / Title *'}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="custom-input text-xs"
                  placeholder="اشتراك Adobe Creative Cloud لشهر أغسطس..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'تصنيف المصروف المحاسبي *' : 'Expense Category *'}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="رواتب">{isRtl ? 'رواتب' : 'Salaries'}</option>
                    <option value="إيجار">{isRtl ? 'إيجار' : 'Rent'}</option>
                    <option value="كهرباء ومياه">{isRtl ? 'كهرباء ومياه' : 'Utilities'}</option>
                    <option value="إنترنت واتصالات">{isRtl ? 'إنترنت واتصالات' : 'Internet & Telecom'}</option>
                    <option value="برامج واشتراكات">{isRtl ? 'برامج واشتراكات' : 'Software & Subscriptions'}</option>
                    <option value="أدوات ومستلزمات">{isRtl ? 'أدوات ومستلزمات' : 'Office Supplies & Tools'}</option>
                    <option value="صيانة">{isRtl ? 'صيانة' : 'Maintenance'}</option>
                    <option value="مواصلات">{isRtl ? 'مواصلات' : 'Transportation'}</option>
                    <option value="تسويق">{isRtl ? 'تسويق' : 'Marketing'}</option>
                    <option value="ضيافة">{isRtl ? 'ضيافة' : 'Hospitality'}</option>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-red-600 mb-1.5">{isRtl ? 'مبلغ المصروف (ج.م) *' : 'Amount *'}</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="custom-input text-xs font-mono font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'القسم *' : 'Department *'}</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="SoftwareDevelopment">{isRtl ? 'البرمجة والتطوير (Programming)' : 'Programming'}</option>
                    <option value="Training">{isRtl ? 'التدريب والتعليم (Training)' : 'Training'}</option>
                    <option value="Marketing">{isRtl ? 'التسويق (Marketing)' : 'Marketing'}</option>
                    <option value="Administration">{isRtl ? 'الإدارة العامة والمالية (Administration)' : 'Administration'}</option>
                    <option value="HR">{isRtl ? 'الموارد البشرية (HR)' : 'HR'}</option>
                    <option value="Sales">{isRtl ? 'المبيعات (Sales)' : 'Sales'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'المورد / المستفيد *' : 'Supplier / Beneficiary *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="custom-input text-xs"
                    placeholder="مكتبة XYZ / Adobe / شركة الكهرباء..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'رقم الفاتورة (إن وجد)' : 'Invoice Number'}</label>
                  <input
                    type="text"
                    value={formData.invoiceId}
                    onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                    className="custom-input text-xs font-mono"
                    placeholder="INV-4582..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'المشروع المرتبط (اختياري)' : 'Linked Project'}</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="">{isRtl ? '-- عام (غير خاص بمشروع) --' : '-- General --'}</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: طريقة الدفع والتحويل */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-1.5 text-red-600">
                <Receipt className="w-4 h-4" />
                <span>{isRtl ? '2. طريقة الدفع وبيانات التحويل' : '2. Payment Method & Ref'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'طريقة الدفع *' : 'Payment Method *'}</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="custom-input text-xs"
                  >
                    <option value="Cash">{isRtl ? 'نقدي (Cash الخزينة)' : 'Cash'}</option>
                    <option value="Bank Transfer">{isRtl ? 'تحويل بنكي (Bank Transfer)' : 'Bank Transfer'}</option>
                    <option value="InstaPay">InstaPay</option>
                    <option value="E-Wallet">{isRtl ? 'محفظة إلكترونية (E-Wallet)' : 'E-Wallet'}</option>
                    <option value="Check">{isRtl ? 'شيك بنكي (Check)' : 'Check'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isRtl ? 'رقم / مرجع العملية' : 'Transaction Reference'}</label>
                  <input
                    type="text"
                    value={formData.transactionRef}
                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                    className="custom-input text-xs font-mono"
                    placeholder="EXP-TXN-9024..."
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
                    placeholder="البنك التجاري الدولي CIB..."
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
                    placeholder="فودافون كاش / أورنج كاش..."
                  />
                </div>
              )}
            </div>

            {/* SECTION 3: إثبات المصروف والمرفقات */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-widest flex items-center gap-1.5 text-red-600">
                <Paperclip className="w-4 h-4" />
                <span>{isRtl ? '3. إثبات المصروف والمرفقات (صورة الفاتورة / الإيصال)' : '3. Proof of Expense & Attachments'}</span>
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
                  {isRtl ? 'اضغط أو اسحب الملف لإرفاق صورة الفاتورة / الإيصال (PDF / Image)' : 'Click to attach invoice photo or receipt proof'}
                </span>
                <span className="text-[10px] text-gray-400">{isRtl ? 'الحد الأقصى 10 ميجابايت' : 'Max size 10MB'}</span>
              </div>

              {formData.attachmentName && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
                  <div className="flex items-center gap-2 text-red-800 font-bold">
                    <FileCheck className="w-4 h-4 text-red-600" />
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
                {isRtl ? 'حفظ وإثبات المصروف' : 'Save & Post Expense'}
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
      {/* 2. Audit View Complete Expense Details Modal (الاطلاع الكامل على البيانات والصورة) */}
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
              <CreditCard className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-extrabold text-base text-gray-950">{isRtl ? 'تفاصيل وإثبات قيد المصروف الشامل' : 'Full Expense Audit Details'}</h3>
                <span className="text-xs text-gray-400 font-mono">{viewingRecord.id} | الفاتورة: {viewingRecord.invoiceId || 'بدون فاتورة'}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-gray-900 uppercase tracking-widest text-[11px] text-red-600">{isRtl ? '1. البيانات الأساسية للمصروف' : '1. Basic Information'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'البيان / الوصف' : 'Title / Description'}</span>
                  <span className="font-bold text-gray-900 text-sm">{viewingRecord.title}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'تصنيف المصروف المحاسبي' : 'Expense Category'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full mt-0.5 border border-red-200">
                    <Tag className="w-3 h-3" />
                    <span>{viewingRecord.category}</span>
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'التاريخ' : 'Date'}</span>
                  <span className="font-mono font-bold text-gray-800">{viewingRecord.date}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'المورد / المستفيد' : 'Supplier'}</span>
                  <span className="font-bold text-gray-900">{viewingRecord.supplierName || 'مورد عام'}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'القسم المسؤول' : 'Department'}</span>
                  <span className="font-bold text-gray-800">{viewingRecord.department || 'Administration'}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'المشروع المرتبط' : 'Project'}</span>
                  <span className="font-bold text-gray-800">{viewingRecord.projectName || 'مصروف عام'}</span>
                </div>
              </div>

              <h4 className="font-extrabold text-gray-900 uppercase tracking-widest text-[11px] text-red-600 pt-2">{isRtl ? '2. القيمة وبيانات السداد' : '2. Amount & Payment'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-red-50/60 p-3 rounded-xl border border-red-200">
                  <span className="text-red-700 text-[10px] block font-bold">{isRtl ? 'مبلغ المصروف المحتسب' : 'Expense Amount'}</span>
                  <span className="font-mono font-bold text-red-700 text-sm">-{viewingRecord.amount.toLocaleString()} ج.م</span>
                </div>

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

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 col-span-2 space-y-2">
                  <span className="text-gray-400 text-[10px] block font-bold">{isRtl ? 'صورة الفاتورة / الإيصال المرفق' : 'Uploaded Invoice Image'}</span>
                  {viewingRecord.attachments && viewingRecord.attachments.length > 0 ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2 font-bold text-red-800">
                        <FileCheck className="w-4 h-4 text-red-600" />
                        <span>{viewingRecord.attachments[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.success(isRtl ? `جاري معاينة صورة الفاتورة: ${viewingRecord.attachments?.[0]}` : `Previewing invoice image`)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'معاينة الصورة' : 'View Image'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs italic">{isRtl ? 'لا يوجد صورة فاتورة مرفقة لهذا القيد' : 'No invoice image attached'}</div>
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
      {/* 3. Edit Complete Expense Details Modal (تعديل كامل لكافة البيانات والصورة) */}
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
                <span>{isRtl ? 'تعديل كافة بيانات وقيد ومرفقات المصروف' : 'Edit Full Expense & Invoice Record'}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRtl ? 'يمكنك تعديل أي بند من بنود المصروف، المورد، رقم الفاتورة، واستبدال صورة الفاتورة بحرية كاملة.' : 'Modify any expense detail, category, amount, supplier, or replace invoice image.'}
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
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'تصنيف المصروف المحاسبي *' : 'Expense Category *'}</label>
                  <select
                    value={editingRecord.category}
                    onChange={(e) => setEditingRecord({ ...editingRecord, category: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="رواتب">{isRtl ? 'رواتب' : 'Salaries'}</option>
                    <option value="إيجار">{isRtl ? 'إيجار' : 'Rent'}</option>
                    <option value="كهرباء ومياه">{isRtl ? 'كهرباء ومياه' : 'Utilities'}</option>
                    <option value="إنترنت واتصالات">{isRtl ? 'إنترنت واتصالات' : 'Internet & Telecom'}</option>
                    <option value="برامج واشتراكات">{isRtl ? 'برامج واشتراكات' : 'Software & Subscriptions'}</option>
                    <option value="أدوات ومستلزمات">{isRtl ? 'أدوات ومستلزمات' : 'Office Supplies & Tools'}</option>
                    <option value="صيانة">{isRtl ? 'صيانة' : 'Maintenance'}</option>
                    <option value="مواصلات">{isRtl ? 'مواصلات' : 'Transportation'}</option>
                    <option value="تسويق">{isRtl ? 'تسويق' : 'Marketing'}</option>
                    <option value="ضيافة">{isRtl ? 'ضيافة' : 'Hospitality'}</option>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-red-600 mb-1">{isRtl ? 'مبلغ المصروف (ج.م) *' : 'Amount *'}</label>
                  <input
                    type="number"
                    required
                    value={editingRecord.amount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingRecord({ ...editingRecord, amount: val, debit: val });
                    }}
                    className="custom-input text-xs font-mono font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'القسم *' : 'Department *'}</label>
                  <select
                    value={editingRecord.department || 'Administration'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, department: e.target.value })}
                    className="custom-input text-xs"
                  >
                    <option value="SoftwareDevelopment">{isRtl ? 'البرمجة والتطوير' : 'Programming'}</option>
                    <option value="Training">{isRtl ? 'التدريب والتعليم' : 'Training'}</option>
                    <option value="Marketing">{isRtl ? 'التسويق' : 'Marketing'}</option>
                    <option value="Administration">{isRtl ? 'الإدارة العامة والمالية' : 'Administration'}</option>
                    <option value="HR">{isRtl ? 'الموارد البشرية' : 'HR'}</option>
                    <option value="Sales">{isRtl ? 'المبيعات' : 'Sales'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'المورد / المستفيد *' : 'Supplier / Beneficiary *'}</label>
                  <input
                    type="text"
                    required
                    value={editingRecord.supplierName || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, supplierName: e.target.value })}
                    className="custom-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isRtl ? 'رقم الفاتورة' : 'Invoice Number'}</label>
                  <input
                    type="text"
                    value={editingRecord.invoiceId || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, invoiceId: e.target.value })}
                    className="custom-input text-xs font-mono"
                  />
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
                    <option value="">{isRtl ? '-- عام (غير خاص بمشروع) --' : '-- General --'}</option>
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
                    value={editingRecord.paymentMethod || 'Cash'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, paymentMethod: e.target.value as any })}
                    className="custom-input text-xs"
                  >
                    <option value="Cash">{isRtl ? 'نقدي (Cash الخزينة)' : 'Cash'}</option>
                    <option value="Bank Transfer">{isRtl ? 'تحويل بنكي (Bank Transfer)' : 'Bank Transfer'}</option>
                    <option value="InstaPay">InstaPay</option>
                    <option value="E-Wallet">{isRtl ? 'محفظة إلكترونية (E-Wallet)' : 'E-Wallet'}</option>
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

              {/* Attachment Edit & Upload Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700">{isRtl ? 'تعديل وإدارة صورة الفاتورة المرفقة' : 'Edit Invoice Image Attachment'}</label>
                {editingRecord.attachments && editingRecord.attachments.length > 0 ? (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 font-bold text-red-800 text-xs">
                      <FileCheck className="w-4 h-4 text-red-600" />
                      <span>{editingRecord.attachments[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 rounded-lg bg-white border border-red-300 text-red-700 hover:bg-red-100 text-xs font-bold cursor-pointer">
                        {isRtl ? 'استبدال الصورة' : 'Replace Image'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setEditingRecord({ ...editingRecord, attachments: [f.name] });
                              toast.success(isRtl ? `تم استبدال صورة الفاتورة بـ: ${f.name}` : `Replaced invoice image with ${f.name}`);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRecord({ ...editingRecord, attachments: [] });
                          toast.success(isRtl ? 'تم حذف صورة الفاتورة المرفقة' : 'Invoice image deleted');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold"
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
                          toast.success(isRtl ? `تم إرفاق صورة الفاتورة: ${f.name}` : `Invoice attached: ${f.name}`);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-gray-700 block">
                      {isRtl ? 'اضغط لإرفاق صورة فاتورة / إيصال جديدة (PDF / Image)' : 'Click to attach new invoice image'}
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
              <h3 className="font-extrabold text-sm text-gray-900">{isRtl ? 'تأكيد حذف قيد المصروف' : 'Confirm Delete Expense'}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {isRtl
                  ? `هل أنت تأكد من رغبتك في حذف قيد المصروف "${deletingRecord.title}" بقيمة ${deletingRecord.amount.toLocaleString()} ج.م؟`
                  : `Delete expense "${deletingRecord.title}"?`}
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
