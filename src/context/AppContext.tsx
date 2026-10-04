import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Item,
  Category,
  BorrowRequest,
  ChatMessage,
  Review,
  ReportItem,
  TransactionStatus,
  SharingType,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_ITEMS,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
} from '../data/mockData';

// Safe Storage helper for iframes with blocked localStorage
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage access blocked or restricted in sandbox iframe
    }
    return null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch {
      // Storage access blocked or restricted in sandbox iframe
    }
  },
};

interface AppContextType {
  currentUser: User;
  users: User[];
  items: Item[];
  categories: Category[];
  requests: BorrowRequest[];
  reviews: Review[];
  reports: ReportItem[];
  savedItemIds: string[];
  chatMessages: ChatMessage[];
  
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
  
  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  filterSharingType: string;
  setFilterSharingType: (t: string) => void;
  needNowOnly: boolean;
  setNeedNowOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  
  // Modals
  isPostModalOpen: boolean;
  setIsPostModalOpen: (val: boolean) => void;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (val: boolean) => void;
  isRequestModalOpen: boolean;
  setIsRequestModalOpen: (val: boolean) => void;
  isHandoverModalOpen: boolean;
  setIsHandoverModalOpen: (val: boolean) => void;
  activeHandoverRequestId: string | null;
  setActiveHandoverRequestId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  hasCompletedInitialLogin: boolean;
  markLoginCompleted: () => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (val: boolean) => void;
  reportTarget: { type: 'item' | 'user' | 'transaction'; id: string; title: string } | null;
  setReportTarget: (target: { type: 'item' | 'user' | 'transaction'; id: string; title: string } | null) => void;
  
  // Delete item modal state
  itemToDelete: Item | null;
  setItemToDelete: (item: Item | null) => void;
  toastNotification: string | null;
  showToast: (msg: string) => void;
  
  // Chat Navigation
  activeChatUserId: string | null;
  activeChatItemId: string | null;
  openChatWithUser: (userId: string, itemId?: string) => void;
  sendChatMessage: (recipientId: string, text: string, attachmentUrl?: string) => void;

  // Actions
  switchUser: (userId: string) => void;
  registerUser: (newUser: User) => void;
  updateUserProfile: (updated: Partial<User>) => void;
  requestStudentVerification: () => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'views' | 'ownerRating' | 'ownerVerified' | 'ownerCollege' | 'ownerDept' | 'ownerTrustScore' | 'ownerCompletedTx' | 'ownerClass'>) => void;
  updateItem: (itemId: string, updated: Partial<Item>) => void;
  deleteItem: (itemId: string) => void;
  toggleSaveItem: (itemId: string) => void;
  
  // Category management
  addCategory: (cat: Omit<Category, 'id' | 'itemCount'>) => void;
  deleteCategory: (catId: string) => void;

  // Request & Handover
  createBorrowRequest: (params: {
    itemId: string;
    requestType: SharingType;
    startDate: string;
    endDate: string;
    message?: string;
  }) => { success: boolean; error?: string; request?: BorrowRequest };
  updateRequestStatus: (requestId: string, status: TransactionStatus) => void;
  confirmHandover: (requestId: string, role: 'owner' | 'borrower', code?: string) => boolean;
  confirmReturn: (requestId: string, role: 'owner' | 'borrower') => boolean;
  
  // Reviews & Reports
  submitReview: (targetUserId: string, rating: number, comment: string, itemTitle: string) => void;
  submitReport: (targetType: 'item' | 'user' | 'transaction', targetId: string, targetTitle: string, reason: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state safely with safeStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v4_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_USERS.length) return parsed;
      } catch {
        // invalid json
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return safeStorage.getItem('campuskosh_v4_current_user_id') || 'user-rohan';
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v4_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_ITEMS.length) {
          return parsed;
        }
      } catch {
        // invalid json
      }
    }
    return INITIAL_ITEMS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v3_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure kitchen items are not in saved categories
        if (Array.isArray(parsed) && !parsed.some((c: Category) => c.name.toLowerCase().includes('kitchen'))) {
          return parsed;
        }
      } catch {
        // invalid json
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [requests, setRequests] = useState<BorrowRequest[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v3_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // invalid json
      }
    }
    return INITIAL_REQUESTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v3_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // invalid json
      }
    }
    return INITIAL_REVIEWS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v3_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // invalid json
      }
    }
    return [];
  });

  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    const saved = safeStorage.getItem('campuskosh_v3_saved_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // invalid json
      }
    }
    return ['item-1', 'item-3'];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = safeStorage.getItem('campuskosh_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // invalid json
      }
    }
    return [
      {
        id: 'msg-1',
        conversationId: 'user-rohan_user-aanya',
        senderId: 'user-rohan',
        senderName: 'Rohan Verma',
        text: 'Hi Aanya! I sent a request for the Casio fx-991EX calculator for Monday.',
        timestamp: '10:30 AM',
        isRead: true,
      },
      {
        id: 'msg-2',
        conversationId: 'user-rohan_user-aanya',
        senderId: 'user-aanya',
        senderName: 'Aanya Sharma',
        text: 'Hey Rohan! Yes, I just accepted your request. We can meet outside Hostel 4 Reception at 9:30 AM before your exam.',
        timestamp: '10:35 AM',
        isRead: true,
      }
    ];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterSharingType, setFilterSharingType] = useState<string>('All');
  const [needNowOnly, setNeedNowOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('Nearest');

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState<boolean>(false);
  const [activeHandoverRequestId, setActiveHandoverRequestId] = useState<string | null>(null);

  // Auto-open login on first app launch
  const [hasCompletedInitialLogin, setHasCompletedInitialLogin] = useState<boolean>(() => {
    return safeStorage.getItem('campuskosh_v4_has_logged_in') === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    // Show login on first time opening the app!
    return safeStorage.getItem('campuskosh_v4_has_logged_in') !== 'true';
  });

  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const markLoginCompleted = () => {
    setHasCompletedInitialLogin(true);
    safeStorage.setItem('campuskosh_v4_has_logged_in', 'true');
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'item' | 'user' | 'transaction'; id: string; title: string } | null>(null);

  // Delete item modal state
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(current => (current === msg ? null : current));
    }, 4000);
  };

  // Chat target state
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>('user-aanya');
  const [activeChatItemId, setActiveChatItemId] = useState<string | null>('item-1');

  // Sync to safe storage
  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_saved_items', JSON.stringify(savedItemIds));
  }, [savedItemIds]);

  useEffect(() => {
    safeStorage.setItem('campuskosh_v4_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
      markLoginCompleted();
    }
  };

  const registerUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    markLoginCompleted();
  };

  const updateUserProfile = (updated: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updated } : u));
  };

  const requestStudentVerification = () => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          isVerified: true,
          verificationBadge: '✓ Verified Student',
          trustScore: Math.min(100, u.trustScore + 20),
        };
      }
      return u;
    }));
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'views' | 'ownerRating' | 'ownerVerified' | 'ownerCollege' | 'ownerDept' | 'ownerTrustScore' | 'ownerCompletedTx' | 'ownerClass'>) => {
    const newItem: Item = {
      ...itemData,
      id: `item-${Date.now()}`,
      ownerRating: currentUser.rating,
      ownerVerified: currentUser.isVerified,
      ownerCollege: 'RGUKT',
      ownerDept: currentUser.department,
      ownerClass: currentUser.year,
      ownerTrustScore: currentUser.trustScore,
      ownerCompletedTx: currentUser.completedTransactions,
      views: 1,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);

    // Update category item count
    setCategories(prev => prev.map(c => c.name === newItem.category ? { ...c, itemCount: c.itemCount + 1 } : c));
  };

  const updateItem = (itemId: string, updated: Partial<Item>) => {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, ...updated } : it));
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const deleteItem = (itemId: string) => {
    const itemToRemove = items.find(it => it.id === itemId);
    setItems(prev => prev.filter(it => it.id !== itemId));

    if (itemToRemove) {
      setCategories(prev =>
        prev.map(c =>
          c.name === itemToRemove.category
            ? { ...c, itemCount: Math.max(0, c.itemCount - 1) }
            : c
        )
      );
    }

    setSavedItemIds(prev => prev.filter(id => id !== itemId));

    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
      setIsDetailsModalOpen(false);
    }

    setItemToDelete(null);
    showToast(
      itemToRemove
        ? `"${itemToRemove.title}" was permanently removed from campus listings.`
        : 'Item was removed.'
    );
  };

  const toggleSaveItem = (itemId: string) => {
    setSavedItemIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const addCategory = (catData: Omit<Category, 'id' | 'itemCount'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      itemCount: 0,
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  const createBorrowRequest = (params: {
    itemId: string;
    requestType: SharingType;
    startDate: string;
    endDate: string;
    message?: string;
  }) => {
    const item = items.find(i => i.id === params.itemId);
    if (!item) return { success: false, error: 'Item not found' };

    if (item.ownerId === currentUser.id) {
      return { success: false, error: 'You cannot request your own listed item!' };
    }

    // Overlap prevention logic
    const reqStart = new Date(params.startDate).getTime();
    const reqEnd = new Date(params.endDate).getTime();

    if (reqEnd < reqStart) {
      return { success: false, error: 'Return date cannot be earlier than start date.' };
    }

    const hasConflict = (item.reservedDates || []).some(range => {
      const rStart = new Date(range.startDate).getTime();
      const rEnd = new Date(range.endDate).getTime();
      return (reqStart <= rEnd && reqEnd >= rStart);
    });

    if (hasConflict) {
      return {
        success: false,
        error: 'Item is already reserved for the selected date window. Please choose another date or pick 🟢 available dates.',
      };
    }

    const days = Math.max(1, Math.ceil((reqEnd - reqStart) / (1000 * 60 * 60 * 24)));
    const token = `CK-${Math.floor(1000 + Math.random() * 9000)}-TX`;

    const newRequest: BorrowRequest = {
      id: `req-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0] || '',
      itemCategory: item.category,
      borrowerId: currentUser.id,
      borrowerName: currentUser.fullName,
      borrowerAvatar: currentUser.avatar,
      borrowerClass: currentUser.year,
      borrowerPhone: currentUser.phone,
      borrowerEmail: currentUser.email,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      requestType: (item.sharingType === 'Rent' || (item.rentPerDay && item.rentPerDay > 0)) ? 'Rent' : params.requestType,
      rentPerDay: (item.sharingType === 'Rent' || (item.rentPerDay && item.rentPerDay > 0)) ? (item.rentPerDay || 0) : 0,
      totalRentalCharge: (item.sharingType === 'Rent' || (item.rentPerDay && item.rentPerDay > 0)) ? ((item.rentPerDay || 0) * days) : 0,
      rentPaymentStatus: (item.sharingType === 'Rent' || (item.rentPerDay && item.rentPerDay > 0)) ? 'Pending' : 'Not Applicable',
      startDate: params.startDate,
      endDate: params.endDate,
      durationDays: days,
      message: params.message || '',
      pickupLocation: item.pickupInfo || item.location,
      status: 'Request Sent',
      qrCodeToken: token,
      conditionChecklist: {
        noPhysicalDamage: true,
        allAccessoriesIncluded: true,
        functioningProperly: true,
      },
      handoverConfirmedByOwner: false,
      handoverConfirmedByBorrower: false,
      returnConfirmedByOwner: false,
      returnConfirmedByBorrower: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests(prev => [newRequest, ...prev]);

    // Send initial automatic message into chat
    const conversationId = [currentUser.id, item.ownerId].sort().join('_');
    const introMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: `Hello! I would like to ${params.requestType === 'Free Giveaway' ? 'claim the giveaway for' : 'borrow'} "${item.title}" from ${params.startDate} to ${params.endDate}.${params.message ? ` Note: "${params.message}"` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setChatMessages(prev => [...prev, introMsg]);

    return { success: true, request: newRequest };
  };

  const updateRequestStatus = (requestId: string, status: TransactionStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updated = { ...req, status, updatedAt: new Date().toISOString() };
        
        // If accepted, add to item's reserved dates
        if (status === 'Accepted') {
          setItems(itemsList => itemsList.map(it => {
            if (it.id === req.itemId) {
              const newReservation = {
                id: `res-${Date.now()}`,
                startDate: req.startDate,
                endDate: req.endDate,
                borrowerId: req.borrowerId,
                borrowerName: req.borrowerName,
              };
              return {
                ...it,
                availabilityStatus: 'Reserved',
                reservedDates: [...it.reservedDates, newReservation],
                currentBorrower: req.borrowerName,
                expectedReturnDate: req.endDate,
              };
            }
            return it;
          }));
        }
        return updated;
      }
      return req;
    }));
  };

  const confirmHandover = (requestId: string, role: 'owner' | 'borrower', code?: string): boolean => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return false;

    if (code && code.trim().toUpperCase() !== req.qrCodeToken) {
      return false;
    }

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const ownerDone = role === 'owner' ? true : r.handoverConfirmedByOwner;
        const borrowerDone = role === 'borrower' ? true : r.handoverConfirmedByBorrower;
        const bothDone = (ownerDone && borrowerDone) || (code ? true : false); // scanning token completes mutual verification

        return {
          ...r,
          handoverConfirmedByOwner: ownerDone || Boolean(code),
          handoverConfirmedByBorrower: borrowerDone || Boolean(code),
          rentPaymentStatus: (r.requestType === 'Rent' || ((r.rentPerDay || 0) > 0)) ? 'Paid' : 'Not Applicable',
          status: bothDone ? 'Item Borrowed' : 'Handover Pending',
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    }));

    return true;
  };

  const confirmReturn = (requestId: string, role: 'owner' | 'borrower'): boolean => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return false;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const ownerDone = role === 'owner' ? true : r.returnConfirmedByOwner;
        const borrowerDone = role === 'borrower' ? true : r.returnConfirmedByBorrower;
        const bothDone = (ownerDone && borrowerDone) || role === 'owner'; // Owner final confirm wraps it up

        if (bothDone) {
          // Free the item back to Available
          setItems(itemsList => itemsList.map(it => {
            if (it.id === r.itemId) {
              return {
                ...it,
                availabilityStatus: 'Available',
                currentBorrower: undefined,
                expectedReturnDate: undefined,
              };
            }
            return it;
          }));

          // Increment completed transactions count & boost trust score for both
          setUsers(userList => userList.map(u => {
            if (u.id === r.ownerId || u.id === r.borrowerId) {
              return {
                ...u,
                completedTransactions: u.completedTransactions + 1,
                trustScore: Math.min(100, u.trustScore + 2),
              };
            }
            return u;
          }));
        }

        return {
          ...r,
          returnConfirmedByOwner: ownerDone,
          returnConfirmedByBorrower: borrowerDone,
          status: bothDone ? 'Completed' : 'Returned',
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    }));

    return true;
  };

  const openChatWithUser = (userId: string, itemId?: string) => {
    setActiveChatUserId(userId);
    if (itemId) setActiveChatItemId(itemId);
    setActiveTab('chat');
  };

  const sendChatMessage = (recipientId: string, text: string, attachmentUrl?: string) => {
    if (!text.trim() && !attachmentUrl) return;
    const conversationId = [currentUser.id, recipientId].sort().join('_');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      attachmentUrl,
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const submitReview = (targetUserId: string, rating: number, comment: string, itemTitle: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      targetUserId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.fullName,
      reviewerAvatar: currentUser.avatar,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      itemTitle,
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate target user's rating & trust score
    setUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        const userRevs = [...reviews.filter(r => r.targetUserId === targetUserId), newRev];
        const avg = userRevs.reduce((acc, r) => acc + r.rating, 0) / userRevs.length;
        return {
          ...u,
          rating: Number(avg.toFixed(1)),
          reviewCount: userRevs.length,
          trustScore: Math.min(100, u.trustScore + (rating >= 4 ? 3 : -5)),
        };
      }
      return u;
    }));
  };

  const submitReport = (
    targetType: 'item' | 'user' | 'transaction',
    targetId: string,
    targetTitle: string,
    reason: string,
    details: string
  ) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.fullName,
      targetType,
      targetId,
      targetTitle,
      reason,
      details,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        items,
        categories,
        requests,
        reviews,
        reports,
        savedItemIds,
        chatMessages,
        activeTab,
        setActiveTab,
        selectedItem,
        setSelectedItem,
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
        isPostModalOpen,
        setIsPostModalOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        isRequestModalOpen,
        setIsRequestModalOpen,
        isHandoverModalOpen,
        setIsHandoverModalOpen,
        activeHandoverRequestId,
        setActiveHandoverRequestId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        hasCompletedInitialLogin,
        markLoginCompleted,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTarget,
        setReportTarget,
        itemToDelete,
        setItemToDelete,
        toastNotification,
        showToast,
        activeChatUserId,
        activeChatItemId,
        openChatWithUser,
        sendChatMessage,
        switchUser,
        registerUser,
        updateUserProfile,
        requestStudentVerification,
        addItem,
        updateItem,
        deleteItem,
        toggleSaveItem,
        addCategory,
        deleteCategory,
        createBorrowRequest,
        updateRequestStatus,
        confirmHandover,
        confirmReturn,
        submitReview,
        submitReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
