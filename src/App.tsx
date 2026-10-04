import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { RequestsCenter } from './components/RequestsCenter';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { BorrowRequestModal } from './components/BorrowRequestModal';
import { PostItemModal } from './components/PostItemModal';
import { HandoverQRModal } from './components/HandoverQRModal';
import { TrustSafetyModal } from './components/TrustSafetyModal';
import { AuthModal } from './components/AuthModal';
import { AdminCategoriesModal } from './components/AdminCategoriesModal';
import { DeleteItemModal } from './components/DeleteItemModal';
import { ToastNotification } from './components/ToastNotification';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isAdminCategoriesOpen, setIsAdminCategoriesOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar following Top Bar Contract */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-8">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'requests' && <RequestsCenter />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Collegiate Footer */}
      <Footer onOpenAdminCategories={() => setIsAdminCategoriesOpen(true)} />

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <MobileBottomNav />

      {/* Interactive Flow Modals */}
      <ItemDetailsModal />
      <BorrowRequestModal />
      <PostItemModal />
      <HandoverQRModal />
      <TrustSafetyModal />
      <AuthModal />
      <DeleteItemModal />
      <ToastNotification />
      <AdminCategoriesModal
        isOpen={isAdminCategoriesOpen}
        onClose={() => setIsAdminCategoriesOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
