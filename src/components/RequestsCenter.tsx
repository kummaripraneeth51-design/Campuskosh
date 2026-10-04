import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BorrowRequest, TransactionStatus } from '../types';
import {
  Repeat,
  CheckCircle2,
  QrCode,
  RotateCcw,
  MessageSquare,
  Star,
  MapPin,
  Gift,
  HeartHandshake,
} from 'lucide-react';

export const RequestsCenter: React.FC = () => {
  const {
    requests,
    currentUser,
    updateRequestStatus,
    setIsHandoverModalOpen,
    setActiveHandoverRequestId,
    openChatWithUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  const incomingRequests = requests.filter(r => r.ownerId === currentUser.id);
  const outgoingRequests = requests.filter(r => r.borrowerId === currentUser.id);

  const displayedRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  const handleOpenHandover = (requestId: string) => {
    setActiveHandoverRequestId(requestId);
    setIsHandoverModalOpen(true);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'Request Sent':
        return <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">⏳ Pending Owner Acceptance</span>;
      case 'Accepted':
        return <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">✓ Accepted — Handover Ready</span>;
      case 'Handover Pending':
        return <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-indigo-200">📱 QR Handover in Progress</span>;
      case 'Item Borrowed':
        return <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">🚲 In Active Use</span>;
      case 'Return Due':
        return <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-200">⚠️ Return Due Today</span>;
      case 'Returned':
        return <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-purple-200">🔄 Returned — Inspection Pending</span>;
      case 'Completed':
        return <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-300">🎉 Completed & Verified</span>;
      case 'Rejected':
        return <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">Declined</span>;
      case 'Cancelled':
        return <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Repeat className="w-6 h-6 text-emerald-700" />
            <span>Borrow & Handover Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            100% Free RGUKT Student Sharing: manage approvals, QR handovers, and returns
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'incoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Incoming Requests ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'outgoing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Borrowings ({outgoingRequests.length})
          </button>
        </div>
      </div>

      {/* Requests Feed */}
      {displayedRequests.length > 0 ? (
        <div className="space-y-4">
          {displayedRequests.map((req) => {
            const isOwner = req.ownerId === currentUser.id;
            const otherUserName = isOwner ? req.borrowerName : req.ownerName;
            const otherUserAvatar = isOwner ? req.borrowerAvatar : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80';
            const otherUserId = isOwner ? req.borrowerId : req.ownerId;
            const otherUserClass = isOwner ? req.borrowerClass : 'E4';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Header row: Status and ID */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(req.status)}
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {req.id}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">
                    Token: <strong className="text-slate-800 font-bold">{req.qrCodeToken}</strong>
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={req.itemImage}
                    alt={req.itemTitle}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-800">{req.itemCategory}</span>
                      <span>·</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        {req.requestType === 'Rent' || (req.rentPerDay && req.rentPerDay > 0) ? (
                          <span className="text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-300">
                            ₹{req.rentPerDay}/day Campus Rental
                          </span>
                        ) : req.requestType === 'Free Giveaway' ? (
                          <><Gift className="w-3.5 h-3.5 text-purple-700" /> Free Giveaway</>
                        ) : (
                          <><HeartHandshake className="w-3.5 h-3.5 text-emerald-700" /> Free to Borrow</>
                        )}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {req.itemTitle}
                    </h4>

                    {/* Counterparty info with RGUKT Class */}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>{isOwner ? 'Requested by:' : 'Item Owner:'}</span>
                      <img
                        src={otherUserAvatar}
                        alt={otherUserName}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-900">{otherUserName}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-mono border border-emerald-200">
                        {otherUserClass}
                      </span>
                    </div>

                    {req.message && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 italic">
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  {/* Summary Box (Rental Cost or Free) */}
                  <div className="sm:text-right shrink-0 space-y-1 text-xs sm:border-l sm:border-slate-100 sm:pl-4">
                    <div className="text-slate-500 text-[11px]">Duration</div>
                    <div className="font-mono font-semibold text-slate-800">
                      {req.startDate} → {req.endDate}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {req.durationDays} Day{req.durationDays > 1 ? 's' : ''}
                    </div>
                    {req.requestType === 'Rent' || (req.rentPerDay && req.rentPerDay > 0) ? (
                      <div className="pt-1 space-y-0.5">
                        <div className="text-amber-950 font-black text-xs">
                          ₹{req.totalRentalCharge || ((req.rentPerDay || 0) * req.durationDays)} total
                        </div>
                        <div className="text-[10px] text-amber-800 font-semibold">
                          (₹{req.rentPerDay}/day rent)
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block border ${
                          req.rentPaymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          {req.rentPaymentStatus === 'Paid' ? '✓ Rent Settled' : 'Rent Due at Handover'}
                        </span>
                      </div>
                    ) : (
                      <div className="pt-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        100% Free Sharing
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-xs">{req.pickupLocation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Chat with other student */}
                    <button
                      onClick={() => openChatWithUser(otherUserId, req.itemId)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Chat</span>
                    </button>

                    {/* OWNER ACTIONS: Pending approval */}
                    {isOwner && req.status === 'Request Sent' && (
                      <>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Accepted')}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {/* HANDOVER ACTIONS: Accepted -> Handover */}
                    {(req.status === 'Accepted' || req.status === 'Handover Pending') && (
                      <button
                        onClick={() => handleOpenHandover(req.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{isOwner ? 'Show QR Handover' : 'Scan / Confirm Handover'}</span>
                      </button>
                    )}

                    {/* RETURN ACTIONS: Borrowed -> Return */}
                    {(req.status === 'Item Borrowed' || req.status === 'Return Due') && (
                      <button
                        onClick={() => handleOpenHandover(req.id)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isOwner ? 'Confirm Return Inspection' : 'Request Return'}</span>
                      </button>
                    )}

                    {/* COMPLETED ACTIONS: Leave Review */}
                    {req.status === 'Completed' && (
                      <button
                        onClick={() => handleOpenHandover(req.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Review & Details</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Repeat className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">
            No {activeTab === 'incoming' ? 'incoming' : 'outgoing'} requests right now
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'incoming'
              ? 'When RGUKT peers request items you posted, requests will appear here for one-click approval.'
              : 'Browse the catalog to borrow or claim calculators, drafters, books, or sports gear 100% free!'}
          </p>
        </div>
      )}
    </div>
  );
};
