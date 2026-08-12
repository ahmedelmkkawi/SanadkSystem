import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FinancialRecord {
  id: string;
  type: 'Revenue' | 'Expense' | 'Receipt' | 'Payment' | 'Transfer';
  category: string;
  title: string;
  amount: number;
  date: string;
  department?: string;
  account?: string;
  paymentMethod?: 'Cash' | 'InstaPay' | 'Bank Transfer' | 'E-Wallet' | 'Check' | string;
  transactionRef?: string;
  bankName?: string;
  walletType?: string;
  senderDetails?: string;
  projectId?: string;
  projectName?: string;
  customerName?: string;
  supplierName?: string;
  contractNumber?: string;
  invoiceId?: string;
  status?: 'Completed' | 'Pending' | 'Overdue' | 'Cancelled';
  totalInvoicedAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  dueDate?: string;
  collectionStatus?: 'Full' | 'Partial' | 'Credit' | string;
  attachments?: string[];
  recordedBy?: string;
  createdAt?: string;
  debit?: number;
  credit?: number;
  balance?: number;
}

interface FinanceState {
  financeRecords: FinancialRecord[];
}

const mockFinanceRecords: FinancialRecord[] = [
  { id: 'fin1', type: 'Revenue', category: 'Contract', title: 'عقد توريد برمجيات شركة النور', amount: 45000, date: '2026-06-01' },
  { id: 'fin2', type: 'Revenue', category: 'Subscription', title: 'اشتراك شهري نظام CRM سحابي - ريد للمقاولات', amount: 3500, date: '2026-06-05' },
  { id: 'fin3', type: 'Revenue', category: 'Payment', title: 'دفعة ثانية استشارات تسويقية - شركة ستار فودز', amount: 12000, date: '2026-06-10' },
  { id: 'fin4', type: 'Expense', category: 'Salary', title: 'مرتبات الموظفين لشهر مايو', amount: 31500, date: '2026-05-30' },
  { id: 'fin5', type: 'Expense', category: 'Ads', title: 'تمويل إعلانات فيسبوك وجوجل - مبيعات الربع الثاني', amount: 8000, date: '2026-06-03' },
  { id: 'fin6', type: 'Expense', category: 'Tools', title: 'اشتراكات برامج Zoom / Slack / Figma', amount: 1500, date: '2026-06-07' },
  { id: 'fin7', type: 'Expense', category: 'Operations', title: 'إيجار المقر الإداري الشهري للشركة', amount: 10000, date: '2026-06-01' },
  { id: 'fin8', type: 'Expense', category: 'Bills', title: 'فاتورة الكهرباء والإنترنت للمقر', amount: 2200, date: '2026-06-08' }
];

const initialState: FinanceState = {
  financeRecords: mockFinanceRecords
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addFinancialRecord(state, action: PayloadAction<Omit<FinancialRecord, 'id'>>) {
      const newRec: FinancialRecord = {
        ...action.payload,
        id: 'fin' + (state.financeRecords.length + 1)
      };
      state.financeRecords.unshift(newRec);
    },
    updateFinancialRecord(state, action: PayloadAction<FinancialRecord>) {
      const index = state.financeRecords.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.financeRecords[index] = action.payload;
      }
    },
    deleteFinancialRecord(state, action: PayloadAction<string>) {
      state.financeRecords = state.financeRecords.filter((r) => r.id !== action.payload);
    }
  }
});

export const { addFinancialRecord, updateFinancialRecord, deleteFinancialRecord } = financeSlice.actions;
export default financeSlice.reducer;
