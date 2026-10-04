import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from './ItemCard';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  Zap,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  GraduationCap,
} from 'lucide-react';
import { RguktClass } from '../types';

export const HomeDashboard: React.FC = () => {
  const {
    items,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterSharingType,
    setFilterSharingType,
    needNowOnly,
    setNeedNowOnly,
    sortBy,
    setSortBy,
    setIsPostModalOpen,
  } = useApp();

  const [activeFilterTab, setActiveFilterTab] = useState<string>('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<number>(1000); // 1000 meters
  const [maxDailyRent, setMaxDailyRent] = useState<number>(100); // Up to ₹100/day

  // Filter tabs list (Daily Rentals & Free Items)
  const filterTabs = [
    'All',
    'Daily Rentals (Big Gear)',
    'Free to Borrow',
    'Free Giveaways',
    'Nearby Items',
    'Available Now',
    'Recently Added',
    'Popular Items',
  ];

  const rguktClasses: RguktClass[] = ['P1', 'P2', 'E1', 'E2', 'E3', 'E4'];

  // Smart Matching Recommendation Logic
  const smartMatchText = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const matches = items.filter(
      it =>
        it.title.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q)
    );
    if (matches.length > 0) {
      const nearest = [...matches].sort((a, b) => a.distanceMeters - b.distanceMeters)[0];
      return `${matches.length} matching unused item${matches.length > 1 ? 's' : ''} available for free at RGUKT! Nearest: ${nearest.location} (${nearest.distanceMeters}m away).`;
    }
    return `No exact items matching "${searchQuery}". Search for calculators, mini-drafters, cycles, PUC notes, or lab coats!`;
  }, [searchQuery, items]);

  // Main item filtering & sorting
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        it =>
          it.title.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(it => it.category === selectedCategory);
    }

    // Need Now toggle
    if (needNowOnly) {
      result = result.filter(it => it.isNeedNow && it.availabilityStatus === 'Available');
    }

    // Filter tab
    if (activeFilterTab === 'Daily Rentals (Big Gear)') {
      result = result.filter(it => it.sharingType === 'Rent' || ((it.rentPerDay || 0) > 0));
    } else if (activeFilterTab === 'Nearby Items') {
      result = result.filter(it => it.distanceMeters <= 350);
    } else if (activeFilterTab === 'Available Now') {
      result = result.filter(it => it.availabilityStatus === 'Available');
    } else if (activeFilterTab === 'Recently Added') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeFilterTab === 'Popular Items') {
      result = [...result].sort((a, b) => b.views - a.views);
    } else if (activeFilterTab === 'Free to Borrow') {
      result = result.filter(it => it.sharingType === 'Free Borrow');
    } else if (activeFilterTab === 'Free Giveaways') {
      result = result.filter(it => it.sharingType === 'Free Giveaway');
    }

    // Sharing type dropdown
    if (filterSharingType !== 'All') {
      result = result.filter(it => it.sharingType === filterSharingType);
    }

    // Condition filter
    if (conditionFilter !== 'All') {
      result = result.filter(it => it.condition === conditionFilter);
    }

    // Class filter (P1, P2, E1, E2, E3, E4)
    if (classFilter !== 'All') {
      result = result.filter(it => it.ownerClass === classFilter);
    }

    // Distance filter
    result = result.filter(it => it.distanceMeters <= maxDistance);

    // Max daily rent filter (when viewing rental gear)
    if (activeFilterTab === 'Daily Rentals (Big Gear)' || filterSharingType === 'Rent') {
      result = result.filter(it => (it.rentPerDay || 0) <= maxDailyRent);
    }

    // Sorting
    if (sortBy === 'Nearest') {
      result.sort((a, b) => a.distanceMeters - b.distanceMeters);
    } else if (sortBy === 'Daily Rent: Low to High') {
      result.sort((a, b) => (a.rentPerDay || 0) - (b.rentPerDay || 0));
    } else if (sortBy === 'Daily Rent: High to Low') {
      result.sort((a, b) => (b.rentPerDay || 0) - (a.rentPerDay || 0));
    } else if (sortBy === 'Recently Added') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'Highest Rated') {
      result.sort((a, b) => b.ownerRating - a.ownerRating);
    } else if (sortBy === 'Available Now') {
      result.sort((a, b) => (a.availabilityStatus === 'Available' ? -1 : 1));
    }

    return result;
  }, [
    items,
    searchQuery,
    selectedCategory,
    needNowOnly,
    activeFilterTab,
    filterSharingType,
    conditionFilter,
    classFilter,
    maxDistance,
    maxDailyRent,
    sortBy,
  ]);

  return (
    <div className="space-y-6 pb-16">
      {/* Hero & Greeting Section for RGUKT */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/hero_campus_sharing_1790931199024.jpg"
            alt="Campus Sharing"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-6 py-8 sm:px-10 sm:py-12 max-w-4xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-2">
            <span className="font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
              RGUKT Campus Network
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-white/80">“Share. Borrow. Reuse.”</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to CampusKosh 👋
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl text-balance leading-relaxed">
            “Why buy something you only need for a short time when another student already has it?”
            Affordable daily rentals for big & valuable gear (bicycles, drafters, tech, blazers) — plus 100% free peer borrowing & giveaways for everyday study tools!
          </p>

          {/* Quick Metrics */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Daily Rentals (Big & Important Gear)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Free Sharing (Study Items & Giveaways)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <GraduationCap className="w-4 h-4 text-teal-400" />
              40+ P1-E4 Verified RGUKT Students
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-amber-300" />
              Instant Handover & QR Verification
            </span>
          </div>
        </div>
      </section>

      {/* Prominent Search Bar & Need Now Quick Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you need today? (e.g. Scientific Calculator, Mini Drafter, PUC Notes, Cycle, Lab Coat)"
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm sm:text-base shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ⚡ Need Now Prominent Button */}
          <button
            onClick={() => setNeedNowOnly(!needNowOnly)}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-xs active:scale-[0.98] ${
              needNowOnly
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600 shadow-md'
                : 'bg-amber-100 hover:bg-amber-200/90 text-amber-950 border border-amber-300'
            }`}
          >
            <Zap className={`w-4 h-4 ${needNowOnly ? 'fill-slate-950 text-slate-950 animate-bounce' : 'text-amber-800'}`} />
            <span>⚡ Need Now</span>
          </button>

          {/* + Post an Item Button */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post an Item</span>
          </button>
        </div>

        {/* Smart Matching Alert Banner */}
        {smartMatchText && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs sm:text-sm font-medium animate-in fade-in duration-150">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{smartMatchText}</span>
          </div>
        )}
      </div>

      {/* RGUKT Classes Direct Selector: P1, P2, E1, E2, E3, E4 */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Browse Items by RGUKT Class</span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  P1 · P2 · E1 · E2 · E3 · E4
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Borrow or take unused items passed along by students in each academic year
              </p>
            </div>
          </div>

          {classFilter !== 'All' && (
            <button
              onClick={() => setClassFilter('All')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto"
            >
              Show All Classes ({items.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          <button
            onClick={() => setClassFilter('All')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center ${
              classFilter === 'All'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs">All Classes</span>
            <span className={`text-[10px] font-mono tabular-nums ${classFilter === 'All' ? 'text-slate-300' : 'text-slate-400'}`}>
              {items.length} items
            </span>
          </button>

          {[
            { id: 'P1' as RguktClass, title: 'P1', subtitle: 'PUC 1st Yr' },
            { id: 'P2' as RguktClass, title: 'P2', subtitle: 'PUC 2nd Yr' },
            { id: 'E1' as RguktClass, title: 'E1', subtitle: 'Engg 1st Yr' },
            { id: 'E2' as RguktClass, title: 'E2', subtitle: 'Engg 2nd Yr' },
            { id: 'E3' as RguktClass, title: 'E3', subtitle: 'Engg 3rd Yr' },
            { id: 'E4' as RguktClass, title: 'E4', subtitle: 'Engg 4th Yr' },
          ].map((cls) => {
            const count = items.filter((it) => it.ownerClass === cls.id).length;
            const isSelected = classFilter === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => setClassFilter(isSelected ? 'All' : cls.id)}
                className={`py-2 px-2 rounded-xl text-xs transition-all border text-center flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs font-bold ring-2 ring-emerald-600/30'
                    : 'bg-emerald-50/50 hover:bg-emerald-50 text-slate-800 border-emerald-100 hover:border-emerald-200'
                }`}
              >
                <span className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-emerald-900'}`}>
                  {cls.title}
                </span>
                <span className={`text-[10px] leading-tight ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {cls.subtitle}
                </span>
                <span className={`text-[9px] font-mono tabular-nums mt-0.5 ${isSelected ? 'text-emerald-200 font-bold' : 'text-emerald-700'}`}>
                  {count} items
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Item Categories Showcase (Kitchen items removed) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Browse Categories
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              selectedCategory === null
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Categories ({items.length})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CategoryIcon
                  name={cat.name}
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`}
                />
                <span>{cat.name}</span>
                <span className={`text-[10px] font-mono tabular-nums ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {items.filter(i => i.category === cat.name).length}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter Tabs & Class Selectors */}
      <section className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilterTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  activeFilterTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Action: RGUKT Class Filter & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick RGUKT Class Selector */}
            <div className="flex items-center gap-1 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Class:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Classes (P1 - E4)</option>
                {rguktClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Nearest">Nearest</option>
                <option value="Daily Rent: Low to High">Daily Rent: Low to High</option>
                <option value="Daily Rent: High to Low">Daily Rent: High to Low</option>
                <option value="Recently Added">Recently Added</option>
                <option value="Highest Rated">Highest Rated</option>
                <option value="Available Now">Available Now</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors shadow-xs ${
                showAdvancedFilters || conditionFilter !== 'All' || maxDistance < 1000 || maxDailyRent < 100 || filterSharingType !== 'All'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Sharing & Rental Type
              </label>
              <select
                value={filterSharingType}
                onChange={(e) => setFilterSharingType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="All">All Items (Rental & Free)</option>
                <option value="Rent">Daily Rental Items (₹/day)</option>
                <option value="Free Borrow">Free to Borrow Only</option>
                <option value="Free Giveaway">Free Giveaway (Pass Along) Only</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Item Condition
              </label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="All">Any Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Max Distance</label>
                <span className="font-mono text-emerald-700 font-bold">{maxDistance}m</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>100m (Hostel)</span>
                <span>1000m (Campus)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Max Daily Rent</label>
                <span className="font-mono text-amber-700 font-bold">₹{maxDailyRent}/day</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxDailyRent}
                onChange={(e) => setMaxDailyRent(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹5/day</span>
                <span>₹100/day</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Item Grid & Empty State */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900 tabular-nums">{filteredItems.length}</span> campus item{filteredItems.length === 1 ? '' : 's'}
            {classFilter !== 'All' && <span className="text-emerald-700 font-bold ml-1">· From {classFilter} students</span>}
            {needNowOnly && <span className="text-amber-600 font-bold ml-1">· Immediate pickup only</span>}
            {activeFilterTab === 'Daily Rentals (Big Gear)' && <span className="text-amber-700 font-bold ml-1">· Daily rentals with ₹/day pricing</span>}
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No items match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try clearing filters or search term. You can also be the first to post an item in this category for RGUKT peers!
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setNeedNowOnly(false);
                  setActiveFilterTab('All');
                  setFilterSharingType('All');
                  setClassFilter('All');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                + Post this Item
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
