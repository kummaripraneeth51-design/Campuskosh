import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Flag,
  UserX,
  AlertOctagon,
} from 'lucide-react';

export const TrustSafetyModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    reportTarget,
    submitReport,
  } = useApp();

  const [reason, setReason] = useState('Item condition misrepresented');
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isReportModalOpen || !reportTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(
      reportTarget.type,
      reportTarget.id,
      reportTarget.title,
      reason,
      details.trim() || 'No additional details provided.'
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsReportModalOpen(false);
      setDetails('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">
              Report & Campus Safety
            </h3>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Report Filed with Campus Moderator</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Our Student Affairs moderation team has received your report for review. Thank you for protecting the campus community.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Reporting Target:
                </span>
                <span className="font-bold text-slate-900 block truncate">
                  {reportTarget.title}
                </span>
                <span className="text-[11px] text-slate-500">
                  Type: {reportTarget.type.toUpperCase()}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Reason for Reporting
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Item condition misrepresented">Item condition misrepresented or broken</option>
                  <option value="Unreturned item / Overdue return">Unreturned item / Overdue return</option>
                  <option value="Unresponsive student / No-show at handover">Unresponsive student / No-show at handover</option>
                  <option value="Suspicious listing or prohibited item">Suspicious listing or prohibited item</option>
                  <option value="Harassment or inappropriate message">Harassment or inappropriate message</option>
                  <option value="Other campus policy violation">Other campus policy violation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain what occurred during the handover or chat..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Campus Privacy Guarantee
                </span>
                <p>
                  Personal contact numbers and hostel room numbers remain concealed until mutual acceptance. False reports are subject to disciplinary review.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
