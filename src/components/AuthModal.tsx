import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { User, RguktClass } from '../types';
import {
  X,
  ShieldCheck,
  Mail,
  User as UserIcon,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    users,
    switchUser,
    registerUser,
    hasCompletedInitialLogin,
    markLoginCompleted,
  } = useApp();

  const rguktClasses: { id: RguktClass; label: string; desc: string }[] = [
    { id: 'P1', label: 'P1', desc: 'PUC 1st Year' },
    { id: 'P2', label: 'P2', desc: 'PUC 2nd Year' },
    { id: 'E1', label: 'E1', desc: 'Engg 1st Year' },
    { id: 'E2', label: 'E2', desc: 'Engg 2nd Year' },
    { id: 'E3', label: 'E3', desc: 'Engg 3rd Year' },
    { id: 'E4', label: 'E4', desc: 'Engg 4th Year (Final Year)' },
  ];

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  ];

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [campusEmail, setCampusEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState<RguktClass>('E3');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [avatar, setAvatar] = useState<string>(avatarPresets[0]);
  const [authError, setAuthError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthModalOpen) return null;

  // Validate 7-character ID: 1 alphabet followed by 6 digits (e.g. B210842)
  const idRegex = /^[A-Za-z]\d{6}$/;

  const handleIdChange = (val: string) => {
    // Keep max 7 chars, uppercase letter at start
    const clean = val.trim().toUpperCase().slice(0, 7);
    setStudentId(clean);

    // Auto-suggest campus email if email is empty or matches previous id pattern
    if (clean.length > 0 && (!campusEmail || campusEmail.endsWith('@rgukt.ac.in'))) {
      setCampusEmail(`${clean.toLowerCase()}@rgukt.ac.in`);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const trimmedName = fullName.trim();
    const cleanId = studentId.trim().toUpperCase();
    const cleanEmail = campusEmail.trim().toLowerCase();

    if (!trimmedName) {
      setAuthError('Please enter your full name.');
      return;
    }

    if (!idRegex.test(cleanId)) {
      setAuthError(
        'Student ID must be exactly 7 characters: 1 alphabet letter followed by 6 digits (e.g. B210842, R220914).'
      );
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid RGUKT campus email address (e.g. b210842@rgukt.ac.in).');
      return;
    }

    // Check if user already exists
    const existing = users.find(
      u => u.studentId.toUpperCase() === cleanId || u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      // Switch to existing account
      switchUser(existing.id);
      markLoginCompleted();
      setIsAuthModalOpen(false);
      return;
    }

    // Create new RGUKT student account with chosen photo
    const newUser: User = {
      id: `user-${cleanId.toLowerCase()}`,
      fullName: trimmedName,
      studentId: cleanId,
      college: 'RGUKT',
      department,
      year: selectedClass,
      email: cleanEmail,
      phone: '+91 98765 00000',
      avatar: avatar,
      isVerified: true,
      verificationBadge: '✓ Verified RGUKT Student',
      trustScore: 92,
      rating: 5.0,
      reviewCount: 0,
      completedTransactions: 0,
      role: 'student',
      joinedDate: 'Oct 2026',
      bio: `${selectedClass} student at RGUKT. Sharing and borrowing semester essentials responsibly.`,
    };

    registerUser(newUser);
    markLoginCompleted();
    setIsAuthModalOpen(false);
  };

  const handleQuickFill = (user: User) => {
    switchUser(user.id);
    markLoginCompleted();
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {hasCompletedInitialLogin ? 'RGUKT Student Login' : 'Welcome to CampusKosh 👋'}
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                RGUKT
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasCompletedInitialLogin
                ? 'Enter your student details to borrow, share, and give away items'
                : 'Sign in with your RGUKT student details to start sharing and borrowing'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 0. Profile Photo from Gallery */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center justify-between">
                <span>Profile Photo *</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Upload from Gallery</span>
              </label>

              <div className="flex items-center gap-3.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-600 cursor-pointer group shrink-0 shadow-xs"
                  title="Click to choose photo from gallery"
                >
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose from Gallery</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Or pick preset avatar */}
                  <div className="flex items-center gap-1 pt-0.5">
                    <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                          avatar === preset ? 'ring-2 ring-emerald-600 scale-110 border-white' : 'border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Name */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Student Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Verma / Aanya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* 2. ID Number (Strict 7 characters: 1 alphabet + 6 digits) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-800">
                  RGUKT ID Number *
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {studentId.length}/7 characters (1 Letter + 6 Digits)
                </span>
              </div>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  maxLength={7}
                  placeholder="e.g. B210842 (or R220914)"
                  value={studentId}
                  onChange={(e) => handleIdChange(e.target.value)}
                  className={`w-full pl-9 pr-20 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-2 ${
                    studentId.length === 7
                      ? idRegex.test(studentId)
                        ? 'border-emerald-500 focus:ring-emerald-600 bg-emerald-50/20'
                        : 'border-rose-400 focus:ring-rose-500'
                      : 'border-slate-300 focus:ring-emerald-600'
                  }`}
                />
                <div className="absolute right-3 top-2.5 text-[11px] font-bold">
                  {studentId.length === 7 && idRegex.test(studentId) ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Valid ID
                    </span>
                  ) : studentId.length > 0 ? (
                    <span className="text-slate-400 font-mono">
                      {studentId.length}/7
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Format: 1 alphabet letter followed by 6 digits (e.g. <strong>B210842</strong>, <strong>R220914</strong>).
              </p>
            </div>

            {/* 3. Campus Email ID */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                RGUKT Campus Email ID *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="b210842@rgukt.ac.in"
                  value={campusEmail}
                  onChange={(e) => setCampusEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Official institute email for verified student credentials.
              </p>
            </div>

            {/* 4. Class Studying (P1, P2, E1, E2, E3, E4) */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Current Class / Year *</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {rguktClasses.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClass(cls.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center ${
                      selectedClass === cls.id
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-600/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">{cls.label}</span>
                    <span className={`text-[9px] font-normal truncate max-w-full ${selectedClass === cls.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {cls.desc.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Department (for Engineering E1-E4) */}
            {['E1', 'E2', 'E3', 'E4'].includes(selectedClass) && (
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Branch / Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering (ECE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                  <option value="Civil Engineering">Civil Engineering (CE)</option>
                  <option value="Chemical Engineering">Chemical Engineering (ChE)</option>
                  <option value="Metallurgical & Materials Engineering">Metallurgical & Materials Engineering (MME)</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering (EEE)</option>
                </select>
              </div>
            )}

            {/* Verification Guarantee badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All RGUKT students automatically receive the <strong>“✓ Verified RGUKT Student”</strong> badge for 100% free peer sharing.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Sign In as {selectedClass} Student</span>
            </button>
          </form>

          {/* Quick Demo Student Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-2 text-center">
              Or Instant Sign-In with Demo RGUKT Students
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    switchUser(u.id);
                    setIsAuthModalOpen(false);
                  }}
                  className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 transition-colors text-left flex items-center gap-2"
                >
                  <img
                    src={u.avatar}
                    alt={u.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="font-bold truncate text-[11px] flex items-center gap-1">
                      <span>{u.fullName.split(' ')[0]}</span>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100/70 px-1 rounded">
                        {u.year}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{u.studentId}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
