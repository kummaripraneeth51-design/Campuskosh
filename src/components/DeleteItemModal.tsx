import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

export const DeleteItemModal: React.FC = () => {
  const { itemToDelete, setItemToDelete, deleteItem, currentUser } = useApp();
  const [selectedReason, setSelectedReason] = useState<string>('Posted by mistake');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!itemToDelete) return null;

  const reasons = [
    'Posted by mistake',
    'Item is no longer available',
    'Entered incorrect details / re-posting new photos',
    'Item already handed over or given away',
    'Duplicate listing',
  ];

  const isOwner = currentUser.id === itemToDelete.ownerId;
  const isAdmin = currentUser.role === 'admin';

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteItem(itemToDelete.id);
      setIsDeleting(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Delete Campus Listing
              </h3>
              <p className="text-[11px] text-slate-500">
                Remove mistaken or unused item from RGUKT catalog
              </p>
            </div>
          </div>

          <button
            onClick={() => setItemToDelete(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Warning explanation */}
          <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Are you sure you want to delete this listing?</p>
              <p className="text-rose-800 text-[11px] leading-relaxed">
                If this item was posted by mistake or is no longer available, it will be immediately removed from CampusKosh. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Item Preview Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
              {itemToDelete.images && itemToDelete.images.length > 0 ? (
                <img
                  src={itemToDelete.images[0]}
                  alt={itemToDelete.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CategoryIcon name={itemToDelete.category} className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                <span className="font-semibold text-emerald-800 truncate">{itemToDelete.category}</span>
                <span>·</span>
                <span>{itemToDelete.condition}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {itemToDelete.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Posted by {itemToDelete.ownerName} ({itemToDelete.ownerClass}) · {itemToDelete.location}
              </p>
            </div>
          </div>

          {/* Reason selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Reason for Deletion
            </label>
            <div className="space-y-1.5">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all border flex items-center justify-between ${
                    selectedReason === reason
                      ? 'bg-rose-50/80 border-rose-300 text-rose-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{reason}</span>
                  {selectedReason === reason && (
                    <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Authority notice */}
          {(isOwner || isAdmin) && (
            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Authorized as {isAdmin && !isOwner ? 'Campus Authority (Admin)' : 'Listing Owner'}.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setItemToDelete(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            Keep Listing
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Item'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
