import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Camera,
  Check,
  Star,
  IndianRupee,
} from 'lucide-react';

export const HandoverQRModal: React.FC = () => {
  const {
    requests,
    activeHandoverRequestId,
    isHandoverModalOpen,
    setIsHandoverModalOpen,
    confirmHandover,
    confirmReturn,
    currentUser,
    submitReview,
  } = useApp();

  const [enteredToken, setEnteredToken] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Condition checklist states
  const [check1, setCheck1] = useState(true); // Undamaged
  const [check2, setCheck2] = useState(true); // Accessories included
  const [check3, setCheck3] = useState(true); // Operational
  const [rentPaymentConfirmed, setRentPaymentConfirmed] = useState(false);

  // Post-completion review states
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!isHandoverModalOpen || !activeHandoverRequestId) return null;

  const currentReq = requests.find(r => r.id === activeHandoverRequestId);
  if (!currentReq) return null;

  const isOwner = currentReq.ownerId === currentUser.id;
  const isRental = currentReq.requestType === 'Rent' || ((currentReq.rentPerDay || 0) > 0);
  const totalRent = currentReq.totalRentalCharge || ((currentReq.rentPerDay || 0) * currentReq.durationDays);

  const isHandoverPhase =
    currentReq.status === 'Accepted' || currentReq.status === 'Handover Pending';
  const isReturnPhase =
    currentReq.status === 'Item Borrowed' ||
    currentReq.status === 'Return Due' ||
    currentReq.status === 'Returned';
  const isCompleted = currentReq.status === 'Completed';

  const handleSimulateScan = () => {
    setEnteredToken(currentReq.qrCodeToken);
    setTokenError(null);
  };

  const handleConfirmHandover = () => {
    setTokenError(null);
    if (!check1 || !check2 || !check3) {
      setTokenError('Both students must verify all 3 condition checks before proceeding.');
      return;
    }

    if (isRental && !rentPaymentConfirmed) {
      setTokenError(
        isOwner
          ? `Please verify that you have received the rental fee of ₹${totalRent} before confirming handover.`
          : `Please confirm that you have paid the rental fee of ₹${totalRent} to the owner.`
      );
      return;
    }

    const success = confirmHandover(
      currentReq.id,
      isOwner ? 'owner' : 'borrower',
      enteredToken.trim() || undefined
    );

    if (!success) {
      setTokenError('Invalid QR Token code. Please ensure the token matches the owner QR display.');
    }
  };

  const handleConfirmReturn = () => {
    setTokenError(null);
    if (!check1 || !check2 || !check3) {
      setTokenError('Please confirm the return condition checklist before completing.');
      return;
    }

    confirmReturn(currentReq.id, isOwner ? 'owner' : 'borrower');
  };

  const handleSendReview = () => {
    const targetUserId = isOwner ? currentReq.borrowerId : currentReq.ownerId;
    submitReview(
      targetUserId,
      rating,
      reviewComment.trim() || 'Great RGUKT campus sharing experience! Item was in excellent condition.',
      currentReq.itemTitle
    );
    setReviewSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isCompleted
                  ? 'Transaction Completed'
                  : isReturnPhase
                  ? 'Item Return & Inspection'
                  : 'Smart QR Handover'}
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{currentReq.itemTitle}</p>
            </div>
          </div>
          <button
            onClick={() => setIsHandoverModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {tokenError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{tokenError}</span>
            </div>
          )}

          {/* PHASE 1: HANDOVER STAGE */}
          {isHandoverPhase && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  {isOwner
                    ? 'Show this QR code to the borrower during handover'
                    : 'Scan the owner’s QR code to confirm receiving the item'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Both RGUKT students inspect the physical condition to ensure community trust.
                </p>
              </div>

              {/* QR Code Presentation Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="25" height="25" fill="#047857" rx="3" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" rx="2" />
                    <rect x="18" y="18" width="9" height="9" fill="#047857" rx="1" />

                    <rect x="65" y="10" width="25" height="25" fill="#047857" rx="3" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" rx="2" />
                    <rect x="73" y="18" width="9" height="9" fill="#047857" rx="1" />

                    <rect x="10" y="65" width="25" height="25" fill="#047857" rx="3" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" rx="2" />
                    <rect x="18" y="73" width="9" height="9" fill="#047857" rx="1" />

                    <circle cx="45" cy="20" r="3" fill="#1e293b" />
                    <circle cx="55" cy="20" r="3" fill="#1e293b" />
                    <circle cx="45" cy="35" r="3" fill="#1e293b" />
                    <circle cx="35" cy="45" r="3" fill="#1e293b" />
                    <circle cx="50" cy="50" r="4" fill="#047857" />
                    <circle cx="65" cy="45" r="3" fill="#1e293b" />
                    <circle cx="75" cy="55" r="3" fill="#1e293b" />
                    <circle cx="45" cy="65" r="3" fill="#1e293b" />
                    <circle cx="55" cy="75" r="3" fill="#1e293b" />
                    <circle cx="65" cy="80" r="3" fill="#1e293b" />
                    <circle cx="80" cy="75" r="3" fill="#1e293b" />
                  </svg>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
                    Security Token
                  </span>
                  <span className="text-base font-black tracking-widest text-slate-900 font-mono">
                    {currentReq.qrCodeToken}
                  </span>
                </div>
              </div>

              {/* Fast Simulation Scanner Button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter QR Code Token"
                  value={enteredToken}
                  onChange={(e) => setEnteredToken(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono tracking-wider uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  onClick={handleSimulateScan}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Simulate Camera Scan"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Auto-Scan</span>
                </button>
              </div>

              {/* Mandatory Rental Payment Section for Important Items */}
              {isRental && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-amber-700" />
                      <span>Rental Charge Payable</span>
                    </span>
                    <span className="text-xs font-black text-amber-950 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-400">
                      ₹{totalRent} total
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-900 leading-relaxed">
                    Daily Rental Rate: <strong>₹{currentReq.rentPerDay}/day × {currentReq.durationDays} days = ₹{totalRent}</strong>.
                    <br />
                    {isOwner
                      ? `Confirm that you have received this ₹${totalRent} rental payment before releasing the equipment.`
                      : `You must pay ₹${totalRent} rent directly to ${currentReq.ownerName} upon item receipt (UPI / Cash).`}
                  </div>

                  <label className="flex items-center gap-2 text-amber-950 font-bold cursor-pointer pt-2 border-t border-amber-200/80">
                    <input
                      type="checkbox"
                      checked={rentPaymentConfirmed}
                      onChange={(e) => setRentPaymentConfirmed(e.target.checked)}
                      className="accent-amber-600 rounded w-4 h-4"
                    />
                    <span className="text-xs">
                      {isOwner
                        ? `✓ I confirm payment of ₹${totalRent} rent has been received`
                        : `✓ I have paid ₹${totalRent} rent to ${currentReq.ownerName}`}
                    </span>
                  </label>
                </div>
              )}

              {/* Condition Checklist */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Mutual Inspection Checklist
                </span>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={check1}
                    onChange={(e) => setCheck1(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>No visible physical damage or cracks</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={check2}
                    onChange={(e) => setCheck2(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>All parts, clips, and cases included</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={check3}
                    onChange={(e) => setCheck3(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Powered on and working properly</span>
                </label>
              </div>

              <button
                onClick={handleConfirmHandover}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                  isRental
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isRental
                    ? `Confirm Rent Paid (₹${totalRent}) & Start Rental`
                    : 'Confirm Handover & Start Free Borrowing'}
                </span>
              </button>
            </div>
          )}

          {/* PHASE 2: RETURN STAGE */}
          {isReturnPhase && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Item Return in Progress</span>
                </div>
                <p className="text-emerald-800">
                  Borrower: <strong>{currentReq.borrowerName} ({currentReq.borrowerClass})</strong> · Owner: <strong>{currentReq.ownerName}</strong>
                </p>
                <p className="text-slate-600 text-[11px]">
                  Return Due Date: {currentReq.endDate}. {isRental ? `Daily rental of ₹${currentReq.rentPerDay}/day was settled at handover.` : 'Free community return inspection.'}
                </p>
              </div>

              {/* Return Condition Inspection */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Return Condition Inspection
                </span>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={check1}
                    onChange={(e) => setCheck1(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Item returned in same clean condition</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={check2}
                    onChange={(e) => setCheck2(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>All parts and accessories returned intact</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={check3}
                    onChange={(e) => setCheck3(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Ready to be shared with next RGUKT student</span>
                </label>
              </div>

              <button
                onClick={handleConfirmReturn}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Item Received & Complete Transaction</span>
              </button>
            </div>
          )}

          {/* PHASE 3: COMPLETED & REVIEW STAGE */}
          {isCompleted && (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Transaction Completed!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thank you for contributing to RGUKT's zero-waste student sharing network!
                </p>
              </div>

              {!reviewSubmitted ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    Rate your sharing experience with {isOwner ? currentReq.borrowerName : currentReq.ownerName}:
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Leave a short review to boost their campus trust score..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />

                  <button
                    onClick={handleSendReview}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Submit Peer Review (+Trust Score)
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                  Review submitted! Your RGUKT peer's trust score has increased.
                </div>
              )}

              <button
                onClick={() => setIsHandoverModalOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Handover Center
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
