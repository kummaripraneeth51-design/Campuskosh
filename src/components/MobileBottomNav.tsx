import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Zap, PlusCircle, Repeat, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    needNowOnly,
    setNeedNowOnly,
    setIsPostModalOpen,
    requests,
    currentUser,
  } = useApp();

  const pendingRequestsCount = requests.filter(
    r => (r.ownerId === currentUser.id && r.status === 'Request Sent') ||
         (r.borrowerId === currentUser.id && r.status === 'Accepted')
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            setNeedNowOnly(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'home' && !needNowOnly ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Explore</span>
        </button>

        {/* Tab 2: Need Now */}
        <button
          onClick={() => {
            setActiveTab('home');
            setNeedNowOnly(!needNowOnly);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            needNowOnly ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Zap className={`w-5 h-5 ${needNowOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Need Now</span>
        </button>

        {/* Tab 3: Post Item (Prominent Center) */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-emerald-700"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-semibold tracking-tight text-slate-800 mt-0.5">Post</span>
        </button>

        {/* Tab 4: Requests */}
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 relative transition-colors ${
            activeTab === 'requests' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Repeat className="w-5 h-5" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-emerald-600 rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Requests</span>
        </button>

        {/* Tab 5: Profile / Trust */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'profile' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
