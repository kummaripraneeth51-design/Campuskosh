import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { RguktClass } from '../types';
import {
  ShieldCheck,
  Star,
  Award,
  Edit3,
  Trash2,
  Heart,
  Plus,
  Mail,
  GraduationCap,
  CreditCard,
  Building,
  Camera,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { ItemCard } from './ItemCard';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    requestStudentVerification,
    items,
    deleteItem,
    savedItemIds,
    reviews,
    setIsPostModalOpen,
    setItemToDelete,
    showToast,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.fullName);
  const [studentId, setStudentId] = useState(currentUser.studentId);
  const [email, setEmail] = useState(currentUser.email);
  const [dept, setDept] = useState(currentUser.department);
  const [year, setYear] = useState<RguktClass>(currentUser.year);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [editAvatar, setEditAvatar] = useState<string>(currentUser.avatar);
  const [editError, setEditError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const formPhotoInputRef = useRef<HTMLInputElement>(null);

  // Sub-tabs on profile
  const [activeProfileTab, setActiveProfileTab] = useState<'listings' | 'saved' | 'reviews'>('listings');

  const rguktClasses: RguktClass[] = ['P1', 'P2', 'E1', 'E2', 'E3', 'E4'];
  const idRegex = /^[A-Za-z]\d{6}$/;

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  ];

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newPhoto = reader.result;
          setEditAvatar(newPhoto);
          updateUserProfile({ avatar: newPhoto });
          showToast('Profile photo updated successfully from gallery!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const myListings = items.filter(i => i.ownerId === currentUser.id);
  const savedItems = items.filter(i => savedItemIds.includes(i.id));
  const myReviews = reviews.filter(r => r.targetUserId === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const cleanId = studentId.trim().toUpperCase();
    if (!idRegex.test(cleanId)) {
      setEditError('RGUKT Student ID must be 7 characters: 1 letter followed by 6 digits (e.g. B210842).');
      return;
    }

    updateUserProfile({
      fullName: name.trim(),
      studentId: cleanId,
      email: email.trim().toLowerCase(),
      department: dept.trim(),
      year,
      bio: bio.trim(),
      avatar: editAvatar,
    });
    setIsEditing(false);
    showToast('Profile details updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div
              className="relative group/avatar cursor-pointer shrink-0"
              onClick={() => photoInputRef.current?.click()}
              title="Click to change photo from gallery"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-600 shadow-sm group-hover/avatar:brightness-90 transition-all"
              />
              <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5">Gallery</span>
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full p-1.5 shadow-md border-2 border-white transition-transform hover:scale-110"
                title="Upload photo from gallery"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.fullName}</h2>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full font-mono border border-emerald-300">
                  Class: {currentUser.year}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {currentUser.verificationBadge}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {currentUser.department} · RGUKT Campus
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  ID: <strong className="text-slate-800">{currentUser.studentId}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email}
                </span>
              </div>
              {currentUser.bio && (
                <p className="text-xs text-slate-600 max-w-md pt-1 italic">
                  "{currentUser.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons: Gallery Photo & Edit */}
          <div className="self-center sm:self-start flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={() => photoInputRef.current?.click()}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 bg-white rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Add or update photo from your device gallery"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>Change Photo</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
            </button>
          </div>
        </div>

        {/* Trust Score & Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-lg font-black text-emerald-700 font-mono tabular-nums">
              {currentUser.trustScore}%
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              RGUKT Trust Score
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{currentUser.rating}</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {currentUser.reviewCount} Peer Reviews
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {currentUser.completedTransactions}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Items Shared Free
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
              {myListings.length}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Unused Items
            </div>
          </div>
        </div>

        {/* Free Sharing Guarantee Banner */}
        <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>100% Free Campus Community Sharing</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            All RGUKT student listings are 100% free with zero pricing or fees. Pass forward semester essentials (drafters, notes, calculators) to junior batches (P1 $\to$ P2 $\to$ E1 $\to$ E4).
          </p>
        </div>
      </div>

      {/* Edit Profile Form (Collapsible) */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <h3 className="text-sm font-bold text-slate-900">Update RGUKT Student Credentials</h3>
          {editError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {editError}
            </div>
          )}

          {/* Profile Photo selector in form */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0 shadow-xs">
              <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => formPhotoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo from Gallery</span>
                </button>
                <input
                  ref={formPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setEditAvatar(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* Preset avatar choices */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-[10px] text-slate-400">Presets:</span>
                {avatarPresets.map((pr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditAvatar(pr)}
                    className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                      editAvatar === pr ? 'ring-2 ring-emerald-600 scale-110 border-white' : 'border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={pr} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                RGUKT ID Number (7 chars: 1 letter + 6 digits) *
              </label>
              <input
                type="text"
                required
                maxLength={7}
                placeholder="B210842"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase().slice(0, 7))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono uppercase font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Campus Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Class / Year *</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as RguktClass)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold"
              >
                {rguktClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} (RGUKT Class)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 text-xs block mb-1">Department / Branch</label>
            <input
              type="text"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 text-xs block mb-1">Hostel / Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
            >
              Save Credentials
            </button>
          </div>
        </form>
      )}

      {/* Tabs: My Listings, Saved, Reviews */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveProfileTab('listings')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeProfileTab === 'listings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            My Listed Unused Items ({myListings.length})
          </button>
          <button
            onClick={() => setActiveProfileTab('saved')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeProfileTab === 'saved'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Saved Items ({savedItems.length})
          </button>
          <button
            onClick={() => setActiveProfileTab('reviews')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeProfileTab === 'reviews'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Peer Reviews ({myReviews.length})
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeProfileTab === 'listings' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-500">
                You can manage or remove unused items you have shared with RGUKT peers.
              </span>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Post Unused Item</span>
              </button>
            </div>

            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {myListings.map((item) => (
                  <div key={item.id} className="relative group">
                    <ItemCard item={item} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete(item);
                      }}
                      className="absolute top-2 right-12 z-20 p-1.5 bg-white/90 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full shadow-xs border border-slate-200 transition-colors"
                      title="Delete listing (posted by mistake)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500">You haven't listed any unused items yet.</p>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="mt-3 px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg"
                >
                  List an Unused Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Items */}
        {activeProfileTab === 'saved' && (
          <div>
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {savedItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
                <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">You have no saved items yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Peer Reviews */}
        {activeProfileTab === 'reviews' && (
          <div className="space-y-3">
            {myReviews.length > 0 ? (
              myReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.reviewerAvatar}
                        alt={rev.reviewerName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{rev.reviewerName}</div>
                        <div className="text-[10px] text-slate-400">{rev.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 font-bold text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Item: {rev.itemTitle}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
                <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No peer reviews received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
