import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ChevronDown, UserCircle2, ShieldCheck, LogOut, UserPlus } from 'lucide-react';

export const UserSwitcher: React.FC = () => {
  const { currentUser, users, switchUser, setIsAuthModalOpen, setAuthModalMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left"
        title="Switch simulated student profile"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.fullName}
          className="w-7 h-7 rounded-full object-cover border border-slate-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
          }}
        />
        <div className="hidden sm:block text-xs">
          <div className="font-semibold text-slate-800 leading-tight flex items-center gap-1">
            {currentUser.fullName}
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded font-mono">
              {currentUser.year}
            </span>
            {currentUser.isVerified && (
              <span className="text-emerald-600 text-[10px]" title="Verified RGUKT Student">✓</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {currentUser.role === 'admin' ? 'Campus Admin' : `${currentUser.studentId} · ${currentUser.department.split(' ')[0]}`}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Campus Student ({users.length} RGUKT Peers)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch profiles to test borrower, lender, or admin view across classes
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-50">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                    user.id === currentUser.id ? 'bg-emerald-50/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <span>{user.fullName}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                          {user.year}
                        </span>
                        {user.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {user.role === 'admin' ? 'Campus Authority' : `${user.studentId} · ${user.department}`}
                      </div>
                    </div>
                  </div>
                  {user.id === currentUser.id && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-1 mt-1 px-2 space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register New Student
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign In to Another Account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
