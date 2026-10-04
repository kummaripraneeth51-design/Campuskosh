import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Heart,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Gift,
  Zap,
  ChevronRight,
  Share2,
  GraduationCap,
  Trash2,
} from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

export const ItemDetailsModal: React.FC = () => {
  const {
    selectedItem,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    setIsRequestModalOpen,
    savedItemIds,
    toggleSaveItem,
    openChatWithUser,
    currentUser,
    setReportTarget,
    setIsReportModalOpen,
    setItemToDelete,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isDetailsModalOpen || !selectedItem) return null;

  const isSaved = savedItemIds.includes(selectedItem.id);
  const isOwner = selectedItem.ownerId === currentUser.id;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getPrimaryActionLabel = () => {
    if (selectedItem.sharingType === 'Rent' || (selectedItem.rentPerDay && selectedItem.rentPerDay > 0)) {
      return `Request to Rent (₹${selectedItem.rentPerDay}/day)`;
    }
    if (selectedItem.sharingType === 'Free Giveaway') return 'Request Giveaway (Claim Free)';
    return 'Request to Borrow (Free)';
  };

  const currentImage = selectedItem.images?.[activeImageIndex] || selectedItem.images?.[0] || '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{selectedItem.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedItem.distanceMeters}m away</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && <span className="text-[10px] text-emerald-700 font-bold">Copied!</span>}
            </button>

            <button
              onClick={() => toggleSaveItem(selectedItem.id)}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              title={isSaved ? 'Remove from saved' : 'Save item'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Photos Gallery (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {!imgError && currentImage ? (
                  <img
                    src={currentImage}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <CategoryIcon name={selectedItem.category} className="w-12 h-12 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500">{selectedItem.category}</span>
                  </div>
                )}

                {selectedItem.isNeedNow && (
                  <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-950" />
                    <span>⚡ Available for Immediate Pickup</span>
                  </div>
                )}
              </div>

              {/* Multi-Photo Thumbnails */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="flex gap-2">
                  {selectedItem.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-emerald-600 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Item Description */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Item Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedItem.description}
                </p>
              </div>

              {/* Pickup & Location Guidelines */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>RGUKT Campus Pickup Guidelines</span>
                </div>
                <p className="text-slate-600">
                  <strong className="text-slate-700">Location:</strong> {selectedItem.location}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-700">Pickup Instructions:</strong> {selectedItem.pickupInfo}
                </p>
                <p className="text-slate-500 text-[11px] pt-1">
                  {selectedItem.sharingType === 'Rent' || (selectedItem.rentPerDay && selectedItem.rentPerDay > 0)
                    ? `Campus Rental Policy: Daily rental fee of ₹${selectedItem.rentPerDay}/day settled with student owner upon item handover.`
                    : '100% Free Sharing Policy: No payments, no rent, no security deposits. Pure student-to-student peer support.'}
                </p>
              </div>
            </div>

            {/* Right Column: Pricing & Sharing Model, Owner Profile, Calendar (5 cols) */}
            <div className="md:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Title & Category & Condition */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-medium text-emerald-800">{selectedItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">Condition: {selectedItem.condition}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {selectedItem.title}
                  </h2>
                </div>

                {/* Pricing / Sharing Banner */}
                {selectedItem.sharingType === 'Rent' || (selectedItem.rentPerDay && selectedItem.rentPerDay > 0) ? (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-amber-800 uppercase tracking-wider block font-bold">
                          Campus Equipment Rental
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-amber-950">₹{selectedItem.rentPerDay}</span>
                          <span className="text-xs font-bold text-amber-800">/ day</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Daily rental charge set by student owner
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-300">
                          ₹{selectedItem.rentPerDay} / day
                        </span>
                      </div>
                    </div>

                    {/* Quick Daily Breakdown */}
                    {selectedItem.rentPerDay && selectedItem.rentPerDay > 0 && (
                      <div className="pt-2 border-t border-amber-200/70">
                        <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Daily Rental Rate Calculator</span>
                          <span className="font-mono text-amber-800 lowercase">rate: ₹{selectedItem.rentPerDay}/day</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          <div className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">1 Day</span>
                            <strong className="text-amber-950 font-bold text-xs">₹{selectedItem.rentPerDay}</strong>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">3 Days</span>
                            <strong className="text-amber-950 font-bold text-xs">₹{selectedItem.rentPerDay * 3}</strong>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">7 Days</span>
                            <strong className="text-amber-950 font-bold text-xs">₹{selectedItem.rentPerDay * 7}</strong>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block">14 Days</span>
                            <strong className="text-amber-950 font-bold text-xs">₹{selectedItem.rentPerDay * 14}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-emerald-800 uppercase tracking-wider block font-bold">
                        Campus Free Sharing
                      </span>
                      {selectedItem.sharingType === 'Free Giveaway' ? (
                        <div className="flex items-center gap-1.5 mt-0.5 text-purple-800 font-bold text-base">
                          <Gift className="w-5 h-5 text-purple-700" />
                          <span>100% Free Giveaway</span>
                        </div>
                      ) : (
                        <div className="text-base font-black text-emerald-800 mt-0.5">
                          Free Student Borrowing
                        </div>
                      )}
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {selectedItem.sharingType === 'Free Giveaway'
                          ? 'Passed forward by senior — yours to keep or reuse'
                          : 'Borrow for your exam/lab needs and return promptly'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-300">
                        ₹0 (Free)
                      </span>
                    </div>
                  </div>
                )}

                {/* Owner Profile Card with RGUKT Class */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedItem.ownerAvatar}
                        alt={selectedItem.ownerName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                          <span>{selectedItem.ownerName}</span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                            {selectedItem.ownerClass}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedItem.ownerDept} · RGUKT
                        </div>
                      </div>
                    </div>

                    {selectedItem.ownerVerified && (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100 text-emerald-700 inline" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Trust Score & Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div>
                      <div className="text-xs font-bold text-emerald-700 font-mono tabular-nums">
                        {selectedItem.ownerTrustScore}%
                      </div>
                      <div className="text-[10px] text-slate-400">Trust Score</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">{selectedItem.ownerRating}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Peer Rating</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 font-mono tabular-nums">
                        {selectedItem.ownerCompletedTx}
                      </div>
                      <div className="text-[10px] text-slate-400">Items Shared</div>
                    </div>
                  </div>
                </div>

                {/* Availability System Calendar Preview */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Availability Status
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      {selectedItem.availabilityStatus === 'Available' ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          🟢 Available
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                          🟡 Reserved
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <p>
                      <strong>Active Window:</strong> {selectedItem.availableFrom} to {selectedItem.availableUntil}
                    </p>
                    {selectedItem.reservedDates && selectedItem.reservedDates.length > 0 ? (
                      <div className="mt-1 pt-1 border-t border-slate-200 space-y-1">
                        <p className="text-amber-800 font-medium">Existing Reserved Slots:</p>
                        {selectedItem.reservedDates.map((res, i) => (
                          <div key={i} className="flex justify-between text-slate-600 bg-white p-1.5 rounded border border-slate-200 font-mono text-[10px]">
                            <span>{res.startDate} → {res.endDate}</span>
                            <span className="text-slate-400 font-sans">Booked by {res.borrowerName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-emerald-700 font-medium">No bookings currently active. Free to reserve anytime!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {isOwner || currentUser.role === 'admin' ? (
                  <div className="space-y-2.5">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                      <span className="font-medium">
                        {isOwner ? 'You listed this item on CampusKosh.' : 'Logged in as Campus Authority.'}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                        {selectedItem.ownerClass}
                      </span>
                    </div>

                    <button
                      onClick={() => setItemToDelete(selectedItem)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Delete Listing (Posted by Mistake)</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsDetailsModalOpen(false);
                        setIsRequestModalOpen(true);
                      }}
                      className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>{getPrimaryActionLabel()}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setIsDetailsModalOpen(false);
                          openChatWithUser(selectedItem.ownerId, selectedItem.id);
                        }}
                        className="py-2.5 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-500" />
                        <span>Chat with Owner</span>
                      </button>

                      <button
                        onClick={() => {
                          setReportTarget({
                            type: 'item',
                            id: selectedItem.id,
                            title: selectedItem.title,
                          });
                          setIsReportModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        <span>Report Listing</span>
                      </button>
                    </div>

                    {/* Secondary option if viewer accidentally listed under another persona */}
                    <div className="pt-1 text-center">
                      <button
                        onClick={() => setItemToDelete(selectedItem)}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Owner delete option (if posted by mistake)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
