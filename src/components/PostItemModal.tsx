import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConditionType, SharingType } from '../types';
import {
  X,
  Upload,
  Eye,
  CheckCircle2,
  MapPin,
  AlertCircle,
  Gift,
  HeartHandshake,
  IndianRupee,
  Clock,
} from 'lucide-react';

export const PostItemModal: React.FC = () => {
  const {
    isPostModalOpen,
    setIsPostModalOpen,
    categories,
    addItem,
    currentUser,
  } = useApp();

  const photoPresets = [
    { label: 'Scientific Calculator', url: '/src/assets/images/product_casio_calculator_1790931220537.jpg' },
    { label: 'Mini Drafter Set', url: '/src/assets/images/product_drafting_set_1790931235665.jpg' },
    { label: 'Campus Bicycle', url: '/src/assets/images/product_campus_bicycle_1790931251743.jpg' },
    { label: 'PUC Notes / Textbooks', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lab Coat & Goggles', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80' },
    { label: 'Badminton Rackets', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80' },
    { label: 'Acoustic Guitar', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80' },
  ];

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Books');
  const [images, setImages] = useState<string[]>([photoPresets[0].url]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ConditionType>('Good');
  const [sharingType, setSharingType] = useState<SharingType>('Free Borrow');
  const [rentPerDay, setRentPerDay] = useState<number>(25);
  const [availableFrom, setAvailableFrom] = useState(today);
  const [availableUntil, setAvailableUntil] = useState(nextMonth);
  const [location, setLocation] = useState('Boys Hostel 4, Block B');
  const [pickupInfo, setPickupInfo] = useState('Available at hostel lounge or near Central Library.');
  const [contactPreference, setContactPreference] = useState<'In-App Chat' | 'Phone' | 'Email'>('In-App Chat');
  const [isNeedNow, setIsNeedNow] = useState(true);

  // Preview mode toggle
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPostModalOpen) return null;

  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleAddCustomUrl = () => {
    if (customImageUrl.trim() && !images.includes(customImageUrl.trim())) {
      setImages(prev => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please enter an item name');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a description for the item');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please add at least one photo for your listing');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please provide a campus pickup location (e.g. Boys Hostel 2)');
      return;
    }

    addItem({
      title: title.trim(),
      category,
      description: description.trim(),
      condition,
      sharingType,
      rentPerDay: sharingType === 'Rent' ? Math.max(1, Number(rentPerDay) || 20) : 0,
      images,
      ownerId: currentUser.id,
      ownerName: currentUser.fullName,
      ownerAvatar: currentUser.avatar,
      location: location.trim(),
      distanceMeters: Math.floor(100 + Math.random() * 350),
      pickupInfo: pickupInfo.trim(),
      contactPreference,
      availableFrom,
      availableUntil,
      availabilityStatus: 'Available',
      reservedDates: [],
      isNeedNow,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPostModalOpen(false);
      setTitle('');
      setDescription('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isPreviewMode ? 'Preview Your Unused Item' : '+ Post Unused Item on CampusKosh'}
            </h3>
            <p className="text-xs text-slate-500">
              Pass forward unused items to RGUKT peers (100% Free Sharing)
            </p>
          </div>
          <button
            onClick={() => setIsPostModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Item Successfully Shared!</h4>
              <p className="text-xs text-slate-500">
                RGUKT students can now discover and request to borrow or claim your item for free.
              </p>
            </div>
          ) : isPreviewMode ? (
            /* PREVIEW MODE */
            <div className="space-y-5">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-emerald-800">{category}</span>
                  <span>·</span>
                  <span>Condition: {condition}</span>
                  <span>·</span>
                  <span className="font-bold text-emerald-700">{sharingType} (Free)</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{title || 'Untitled Item'}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Cost</span>
                  <span className="font-bold text-emerald-700">₹0 (100% Free Sharing)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Sharing Type</span>
                  <span className="font-bold text-slate-900">{sharingType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">RGUKT Location</span>
                  <span className="font-medium text-slate-700">{location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Availability Window</span>
                  <span className="font-medium text-slate-700">{availableFrom} to {availableUntil}</span>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Publish Free Listing Now
                </button>
              </div>
            </div>
          ) : (
            /* EDIT / POST FORM */
            <form onSubmit={(e) => { e.preventDefault(); setIsPreviewMode(true); }} className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio Scientific Calculator / Mini-Drafter / PUC Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Category & Condition Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ConditionType)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="New">New (Unopened)</option>
                    <option value="Like New">Like New (Mint)</option>
                    <option value="Good">Good (Working nicely)</option>
                    <option value="Used">Used (Functional)</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload & Presets */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Upload Multiple Photos *
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex-1 flex gap-1 min-w-[220px]">
                      <input
                        type="text"
                        placeholder="Or paste image URL"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomUrl}
                        className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Campus Quick Presets */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 block mb-1 font-medium">
                      Or pick from sample campus gear:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {photoPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddPreset(preset.url)}
                          className="px-2 py-1 bg-slate-50 hover:bg-emerald-50 text-[11px] text-slate-600 hover:text-emerald-700 rounded border border-slate-200 transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Images List */}
                  {images.length > 0 && (
                    <div className="flex gap-2 pt-2 overflow-x-auto">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 group">
                          <img src={img} alt="Selected" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Item Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Which classes or branch this item is best for (P1, P2, E1-E4), notes included, any advice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Campus Sharing & Rental Model Selector */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800 block">
                    Sharing & Rental Model *
                  </label>
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    Rental for Big Gear · Free for Others
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Daily Rental (Big & Important Items) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSharingType('Rent');
                      if (!rentPerDay || rentPerDay <= 0) setRentPerDay(25);
                    }}
                    className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${
                      sharingType === 'Rent'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Daily Rental</span>
                    </div>
                    <span className={`text-[10px] font-normal leading-tight ${sharingType === 'Rent' ? 'text-amber-100' : 'text-slate-500'}`}>
                      For big & valuable gear (Cycles, drafters, tech)
                    </span>
                  </button>

                  {/* Free Borrow */}
                  <button
                    type="button"
                    onClick={() => {
                      setSharingType('Free Borrow');
                      setRentPerDay(0);
                    }}
                    className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${
                      sharingType === 'Free Borrow'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Free Borrow</span>
                    </div>
                    <span className={`text-[10px] font-normal leading-tight ${sharingType === 'Free Borrow' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      100% Free peer sharing (Return when done)
                    </span>
                  </button>

                  {/* Free Giveaway */}
                  <button
                    type="button"
                    onClick={() => {
                      setSharingType('Free Giveaway');
                      setRentPerDay(0);
                    }}
                    className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${
                      sharingType === 'Free Giveaway'
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Free Giveaway</span>
                    </div>
                    <span className={`text-[10px] font-normal leading-tight ${sharingType === 'Free Giveaway' ? 'text-purple-100' : 'text-slate-500'}`}>
                      Pass along permanently to juniors (Surplus items)
                    </span>
                  </button>
                </div>

                {/* Rental Rate Configuration if 'Rent' is selected */}
                {sharingType === 'Rent' && (
                  <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200 animate-in fade-in space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-950 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Daily Rental Rate (₹ / day) *</span>
                      </label>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300">
                        ₹{rentPerDay || 0} per day
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="5"
                          max="500"
                          step="5"
                          value={rentPerDay || ''}
                          onChange={(e) => setRentPerDay(Math.max(0, parseInt(e.target.value) || 0))}
                          placeholder="e.g. 25"
                          className="w-full pl-7 pr-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        {[15, 25, 35, 50].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => setRentPerDay(rate)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                              rentPerDay === rate
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            ₹{rate}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Standard campus rates: Bicycles (₹20-30/day), Scientific calculators (₹10-15/day), Drafter sets (₹15-20/day), Placement Blazers (₹35-50/day).
                    </p>
                  </div>
                )}

                {sharingType !== 'Rent' && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    ✓ 100% Free Campus Community Item — No rental fees or security deposits required.
                  </p>
                )}
              </div>

              {/* Availability Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Available From
                  </label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Available Until
                  </label>
                  <input
                    type="date"
                    value={availableUntil}
                    min={availableFrom}
                    onChange={(e) => setAvailableUntil(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Location & Pickup Guidelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    RGUKT Pickup Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boys Hostel 2, Room 304 / Central Library"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pickup Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meet outside BH-2 ground floor after 5 PM"
                    value={pickupInfo}
                    onChange={(e) => setPickupInfo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Need Now toggle & Contact preference */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNeedNow}
                    onChange={(e) => setIsNeedNow(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-900">⚡ Mark as "Need Now"</span>
                    <span className="block text-[11px] text-slate-500">
                      Available for immediate handover on campus within 30 minutes
                    </span>
                  </div>
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Contact via:</span>
                  <select
                    value={contactPreference}
                    onChange={(e) => setContactPreference(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded-lg p-1 text-xs text-slate-800"
                  >
                    <option value="In-App Chat">In-App Chat</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Listing</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
