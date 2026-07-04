import { useApp } from '../../context/AppContext';
import type { ToastItem } from '../../types';


const icons: Record<string, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
};

const colors: Record<string, string> = {
  success: 'bg-emerald-600 border border-emerald-500/20',
  error: 'bg-red-600 border border-red-500/20',
  info: 'bg-zinc-800 border border-zinc-700/20',
  warning: 'bg-amber-500 border border-amber-400/20',
};

function Toast({ toast }: { toast: ToastItem }) {
  const { removeToast, triggerUndo } = useApp();

  return (
    <div className={`animate-slide-up pointer-events-auto flex items-center justify-between gap-3 ${colors[toast.type]} text-white px-5 py-3.5 rounded-xl shadow-xl font-bold text-sm min-w-[320px]`}>
      <div className="flex items-center gap-2.5">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[toast.type]} />
        </svg>
        <span>{toast.message}</span>
      </div>
      {toast.hasUndo && (
        <button
          onClick={() => { triggerUndo(); removeToast(toast.id); }}
          className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs font-black transition-colors ms-4 border border-white/20"
        >
          تراجع (Undo)
        </button>
      )}
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 items-center pointer-events-none">
      {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
    </div>
  );
}
