import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastNotification, showToast } = useApp();

  if (!toastNotification) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-3 duration-200 pointer-events-auto">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="line-clamp-2">{toastNotification}</span>
        </div>
        <button
          onClick={() => showToast('')}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
