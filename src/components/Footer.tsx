import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart, Repeat, Sparkles, Settings } from 'lucide-react';

interface FooterProps {
  onOpenAdminCategories: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminCategories }) => {
  const { setActiveTab } = useApp();

  return (
    <footer className="mt-16 bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-2 md:col-span-1">
            <span className="text-lg font-black tracking-tight text-slate-900 block">
              CampusKosh
            </span>
            <p className="text-xs text-slate-500 font-medium">
              “Share. Borrow. Reuse.”
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              A student-to-student campus sharing platform for RGUKT to find, borrow, and pass forward unused academic tools and campus essentials 100% free.
            </p>
          </div>

          {/* Core Objectives */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Community
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-slate-900 transition-colors">
                  Available Campus Gear
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('requests')} className="hover:text-slate-900 transition-colors">
                  QR Handover Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-slate-900 transition-colors">
                  Verified Student Badges
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('chat')} className="hover:text-slate-900 transition-colors">
                  Direct In-App Messages
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Trust & Safety
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>Verified RGUKT Student Accounts</li>
              <li>Mutual Handover Inspection Checklists</li>
              <li>100% Free Campus Reuse & Giveaway</li>
              <li>Student Welfare Moderation</li>
            </ul>
          </div>

          {/* Admin & Sustainability */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Campus Administration
            </h4>
            <p className="text-xs text-slate-500">
              Coordinated with the Student Affairs & Campus Sustainability Cell.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenAdminCategories}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Category Manager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom hairline row */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            © 2026 CampusKosh. Built for university student communities.
          </div>
          <div className="flex items-center gap-1">
            <span>Encouraging zero-waste campus living</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">RGUKT Student Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
