import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SharingType } from '../types';
import { X, Calendar, MessageSquare, AlertCircle, CheckCircle2, Shield, ArrowRight, Gift, IndianRupee } from 'lucide-react';

export const BorrowRequestModal: React.FC = () => {
  const {
    selectedItem,
    isRequestModalOpen,
    setIsRequestModalOpen,
    createBorrowRequest,
    setActiveTab,
  } = useApp();

  const isRentalItem = Boolean(
    selectedItem && (selectedItem.sharingType === 'Rent' || (selectedItem.rentPerDay && selectedItem.rentPerDay > 0))
  );

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [requestType, setRequestType] = useState<SharingType>(() => {
    if (selectedItem?.sharingType === 'Rent' || (selectedItem?.rentPerDay && selectedItem.rentPerDay > 0)) {
      return 'Rent';
    }
    return selectedItem?.sharingType || 'Free Borrow';
  });

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const inThreeDays = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(tomorrow);
  const [endDate, setEndDate] = useState<string>(inThreeDays);
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isRequestModalOpen || !selectedItem) return null;

  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const durationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const isRental = selectedItem?.sharingType === 'Rent' || ((selectedItem?.rentPerDay || 0) > 0);
  const dailyRate = selectedItem?.rentPerDay || 0;
  const totalRentalCharge = isRental ? dailyRate * durationDays : 0;

  const handleNextStep = () => {
    setErrorMessage(null);
    if (currentStep === 2) {
      if (!startDate || !endDate) {
        setErrorMessage('Please select both start date and expected return date.');
        return;
      }
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        setErrorMessage('Return date must be on or after the start date.');
        return;
      }
      // Check conflict with existing reservations
      const s = new Date(startDate).getTime();
      const e = new Date(endDate).getTime();
      const conflict = (selectedItem.reservedDates || []).some(range => {
        const rs = new Date(range.startDate).getTime();
        const re = new Date(range.endDate).getTime();
        return s <= re && e >= rs;
      });
      if (conflict) {
        setErrorMessage(
          'Date conflict! Another RGUKT student has already reserved this item during this window. Please choose alternate dates.'
        );
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmitRequest = () => {
    setErrorMessage(null);
    const result = createBorrowRequest({
      itemId: selectedItem.id,
      requestType,
      startDate,
      endDate,
      message,
    });

    if (result.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(result.error || 'Failed to submit request');
    }
  };

  const handleClose = () => {
    setIsRequestModalOpen(false);
    setIsSuccess(false);
    setCurrentStep(1);
    setMessage('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isSuccess
                ? 'Request Sent Successfully!'
                : isRental
                ? `Rent Item (₹${dailyRate}/day)`
                : 'Request Item (100% Free)'}
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{selectedItem.title}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator if not finished */}
        {!isSuccess && (
          <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className={currentStep === 1 ? 'font-bold text-emerald-700' : ''}>
              1. Type
            </span>
            <span>→</span>
            <span className={currentStep === 2 ? 'font-bold text-emerald-700' : ''}>
              2. Dates
            </span>
            <span>→</span>
            <span className={currentStep === 3 ? 'font-bold text-emerald-700' : ''}>
              3. Message
            </span>
            <span>→</span>
            <span className={currentStep === 4 ? 'font-bold text-emerald-700' : ''}>
              4. Confirm
            </span>
          </div>
        )}

        {/* Body content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">Request Sent to {selectedItem.ownerName} ({selectedItem.ownerClass})!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  The owner has been notified in their Requests Center. You can coordinate pickup details and track progress in My Requests.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left max-w-sm mx-auto space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sharing Model:</span>
                  <span className={`font-bold ${isRental && requestType === 'Rent' ? 'text-amber-800' : 'text-emerald-700'}`}>
                    {isRental && requestType === 'Rent' ? `Daily Rental (₹${dailyRate}/day)` : `${requestType} (Free)`}
                  </span>
                </div>
                {isRental && requestType === 'Rent' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Rental Cost:</span>
                    <span className="font-bold text-amber-900">₹{totalRentalCharge}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-800">{startDate} to {endDate} ({durationDays} days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Area:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.location}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('requests');
                  }}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View in My Requests
                </button>
                <button
                  onClick={handleClose}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 1: Choose Sharing Type */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {isRentalItem ? (
                    <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-amber-200 text-amber-950 rounded-xl">
                            <IndianRupee className="w-5 h-5 text-amber-900" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-amber-950">Daily Rental Required</h4>
                            <p className="text-[11px] text-amber-800 font-medium">Important Campus Equipment ({selectedItem.category})</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-400 block">
                            ₹{dailyRate} / day
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
                        <p className="leading-relaxed">
                          Because this is an <strong>important and high-value item</strong>, borrowers must pay a daily rental charge of <strong>₹{dailyRate}/day</strong> for the duration borrowed.
                        </p>
                        <div className="pt-2 border-t border-amber-100 text-[11px] text-slate-600 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            <span>Total rent is calculated based on number of days needed.</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            <span>Payment is settled directly with <strong>{selectedItem.ownerName}</strong> via UPI or Cash upon physical item handover.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Select Free Sharing Option</h4>
                      <p className="text-xs text-slate-500 mb-3">
                        How do you want to take this item from {selectedItem.ownerName}?
                      </p>

                      <div className="space-y-2.5">
                        <label
                          onClick={() => setRequestType('Free Borrow')}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            requestType === 'Free Borrow'
                              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="sharingType"
                            checked={requestType === 'Free Borrow'}
                            onChange={() => setRequestType('Free Borrow')}
                            className="mt-1 accent-emerald-600"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span>Free Campus Borrow</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Borrow for exams, labs, or coursework. Return safely once your semester requirement is done.
                            </div>
                          </div>
                        </label>

                        {selectedItem.sharingType === 'Free Giveaway' && (
                          <label
                            onClick={() => setRequestType('Free Giveaway')}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              requestType === 'Free Giveaway'
                                ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-600'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="sharingType"
                              checked={requestType === 'Free Giveaway'}
                              onChange={() => setRequestType('Free Giveaway')}
                              className="mt-1 accent-purple-600"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                <Gift className="w-3.5 h-3.5 text-purple-700" />
                                <span>Free Giveaway Claim</span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Permanent pass-along for items no longer needed by seniors. Keep or pass forward next year!
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Select Dates */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Select Duration</h4>
                  <p className="text-xs text-slate-500">
                    Overlap conflict prevention ensures RGUKT students don't double-book.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        min={tomorrow}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Expected Return Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    requestType === 'Rent'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="flex justify-between font-semibold">
                      <span>Total Duration:</span>
                      <span className="font-mono">{durationDays} Day{durationDays > 1 ? 's' : ''}</span>
                    </div>
                    {requestType === 'Rent' ? (
                      <div className="flex justify-between items-center pt-1 border-t border-amber-200/60">
                        <span className="text-amber-800">Rental Rate (₹{dailyRate}/day):</span>
                        <strong className="text-amber-950 font-bold text-sm">₹{totalRentalCharge} total</strong>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-800">
                        Cost: <strong>₹0 (100% Free RGUKT Student Sharing)</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Message to Owner */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Add a Note to {selectedItem.ownerName}</h4>
                  <p className="text-xs text-slate-500">
                    Mention your class (e.g. P1/P2/E1/E2), purpose, and hostel pickup preference.
                  </p>

                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Hi senior! I'm an E1 student needing this mini-drafter for our Engineering Graphics class. I stay at BH-2 and can meet outside the workshop."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Step 4: Summary & Submit */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Review Request Summary</h4>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Item:</span>
                      <span className="font-bold text-slate-800">{selectedItem.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Owner:</span>
                      <span className="font-medium text-slate-800">{selectedItem.ownerName} ({selectedItem.ownerClass})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Request Type:</span>
                      <span className={`font-bold ${requestType === 'Rent' ? 'text-amber-800' : 'text-emerald-700'}`}>
                        {requestType === 'Rent' ? `Campus Rental (₹${dailyRate}/day)` : requestType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dates:</span>
                      <span className="font-mono">{startDate} to {endDate} ({durationDays} days)</span>
                    </div>
                    <div className={`flex justify-between pt-1 border-t border-slate-200 font-bold ${
                      requestType === 'Rent' ? 'text-amber-900' : 'text-emerald-800'
                    }`}>
                      <span>Total Cost:</span>
                      <span>
                        {requestType === 'Rent'
                          ? `₹${totalRentalCharge} (₹${dailyRate}/day × ${durationDays}d)`
                          : '₹0 (Free RGUKT Community Sharing)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Protected by CampusKosh QR Code Verification & Mutual Handover Inspection.</span>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-6 flex justify-between gap-3 pt-3 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitRequest}
                    className={`py-2.5 px-6 text-white text-xs font-bold rounded-xl shadow-xs transition-all ${
                      requestType === 'Rent'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    {requestType === 'Rent'
                      ? `Confirm Rental Request (₹${totalRentalCharge})`
                      : 'Send Free Request to Peer'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
