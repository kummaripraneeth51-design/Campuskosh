import React from 'react';
import { useApp } from '../context/AppContext';
import { UserSwitcher } from './UserSwitcher';
import { Plus, Zap, MessageSquare, Repeat, ShieldCheck, Heart } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsPostModalOpen,
    needNowOnly,
    setNeedNowOnly,
    requests,
    currentUser,
    savedItemIds,
  } = useApp();

  const pendingRequestsCount = requests.filter(
    r => (r.ownerId === currentUser.id && r.status === 'Request Sent') ||
         (r.borrowerId === currentUser.id && r.status === 'Accepted')
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('home');
              setNeedNowOnly(false);
            }}
            className="flex items-baseline gap-1.5 text-left group"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              CampusKosh
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              RGUKT
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              setActiveTab('home');
              setNeedNowOnly(false);
            }}
            className={`transition-colors hover:text-slate-900 py-1 border-b-2 ${
              activeTab === 'home' && !needNowOnly
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Explore Items
          </button>

          <button
            onClick={() => {
              setActiveTab('home');
              setNeedNowOnly(!needNowOnly);
            }}
            className={`flex items-center gap-1.5 transition-colors py-1 border-b-2 ${
              needNowOnly
                ? 'border-amber-500 text-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Zap className={`w-4 h-4 ${needNowOnly ? 'fill-amber-500 text-amber-500' : 'text-amber-500'}`} />
            <span>Need Now</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 transition-colors py-1 border-b-2 relative ${
              activeTab === 'requests'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Repeat className="w-4 h-4 text-slate-400" />
            <span>My Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 transition-colors py-1 border-b-2 ${
              activeTab === 'chat'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 transition-colors py-1 border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Trust & Profile</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick saved items trigger */}
          <button
            onClick={() => setActiveTab('profile')}
            className="hidden sm:flex items-center gap-1 p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Saved items"
          >
            <Heart className="w-4 h-4" />
            {savedItemIds.length > 0 && (
              <span className="text-xs font-semibold text-slate-600 tabular-nums">
                {savedItemIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post an Item</span>
          </button>

          <UserSwitcher />
        </div>
      </div>
    </header>
  );
};
