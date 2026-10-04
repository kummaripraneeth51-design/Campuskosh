import React, { useState } from 'react';
import { Item } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, Heart, MapPin, Zap, Gift, Clock, Trash2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { setSelectedItem, setIsDetailsModalOpen, savedItemIds, toggleSaveItem, setItemToDelete, currentUser } = useApp();
  const [imgError, setImgError] = useState(false);
  const isSaved = savedItemIds.includes(item.id);
  const canDelete = currentUser.id === item.ownerId || currentUser.role === 'admin';

  const handleCardClick = () => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Visual Image Slot */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imgError && item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            <CategoryIcon name={item.category} className="w-10 h-10 mb-2 opacity-60 text-slate-500" />
            <span className="text-xs font-medium text-slate-500 line-clamp-1">{item.category}</span>
          </div>
        )}

        {/* Top Badges overlay: Need now indicator and price/rental tag */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.isNeedNow && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-300/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                <Zap className="w-3 h-3 fill-amber-900" />
                Need Now
              </span>
            )}
            {item.sharingType === 'Rent' || (item.rentPerDay && item.rentPerDay > 0) ? (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-amber-950 bg-amber-300/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs border border-amber-400">
                <span>₹{item.rentPerDay}</span>
                <span className="text-[9px] font-bold text-amber-900">/day</span>
              </span>
            ) : item.sharingType === 'Free Giveaway' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-900 bg-purple-100/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                <Gift className="w-3 h-3 text-purple-700" />
                Free
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-900 bg-emerald-100/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                Free
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setItemToDelete(item);
                }}
                className="p-1.5 rounded-full bg-white/95 hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-xs backdrop-blur-xs transition-colors"
                title="Delete listing (posted by mistake)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem(item.id);
              }}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 shadow-xs backdrop-blur-xs transition-colors"
              title={isSaved ? 'Remove from saved' : 'Save item'}
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Availability Status */}
        <div className="absolute bottom-2 left-2.5">
          {item.availabilityStatus === 'Available' ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Reserved
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span className="font-medium text-slate-600 truncate max-w-[140px]">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.condition}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="tabular-nums font-mono text-[11px]">{item.distanceMeters}m</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Location snippet */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {item.location}
          </p>
        </div>

        {/* Bottom Row: Price / Rental Badge & Owner Micro-Profile with RGUKT Class */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {item.sharingType === 'Rent' || (item.rentPerDay && item.rentPerDay > 0) ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                <span className="font-black text-sm text-amber-950">₹{item.rentPerDay}</span>
                <span className="text-[10px] font-bold text-amber-800">/ day</span>
              </span>
            ) : item.sharingType === 'Free Giveaway' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                <Gift className="w-3.5 h-3.5 text-purple-700" />
                <span>Free Giveaway</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span>Free to Borrow</span>
              </span>
            )}
          </div>

          {/* Owner info with RGUKT class */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <img
              src={item.ownerAvatar}
              alt={item.ownerName}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80';
              }}
            />
            <span className="font-medium text-slate-800 truncate max-w-[70px]">
              {item.ownerName.split(' ')[0]}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded font-mono border border-emerald-200">
              {item.ownerClass}
            </span>
            <div className="flex items-center text-amber-500 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums ml-0.5 text-slate-700">{item.ownerRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
