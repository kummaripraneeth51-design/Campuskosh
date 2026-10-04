export type ConditionType = 'New' | 'Like New' | 'Good' | 'Used';
export type SharingType = 'Free Borrow' | 'Free Giveaway' | 'Rent';
export type AvailabilityStatus = 'Available' | 'Reserved' | 'Unavailable';
export type RguktClass = 'P1' | 'P2' | 'E1' | 'E2' | 'E3' | 'E4';

export type TransactionStatus =
  | 'Request Sent'
  | 'Accepted'
  | 'Handover Pending'
  | 'Item Borrowed'
  | 'Return Due'
  | 'Returned'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export interface User {
  id: string;
  fullName: string;
  studentId: string;
  college: string; // e.g. "RGUKT"
  department: string;
  year: RguktClass; // 'P1' | 'P2' | 'E1' | 'E2' | 'E3' | 'E4'
  email: string;
  phone: string;
  avatar: string;
  isVerified: boolean;
  verificationBadge: string; // '✓ Verified RGUKT Student'
  trustScore: number; // 0 - 100
  rating: number; // e.g. 4.9
  reviewCount: number;
  completedTransactions: number;
  role: 'student' | 'admin';
  joinedDate: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
}

export interface ReservedDateRange {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  borrowerId: string;
  borrowerName: string;
}

export interface Item {
  id: string;
  title: string;
  category: string;
  description: string;
  condition: ConditionType;
  sharingType: SharingType;
  rentPerDay?: number; // Daily rental charge in ₹ (for big/important items; 0 or undefined for free items)
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerVerified: boolean;
  ownerCollege: string;
  ownerDept: string;
  ownerClass: RguktClass;
  ownerTrustScore: number;
  ownerCompletedTx: number;
  location: string;
  distanceMeters: number;
  pickupInfo: string;
  contactPreference: 'In-App Chat' | 'Phone' | 'Email';
  availableFrom: string; // YYYY-MM-DD
  availableUntil: string; // YYYY-MM-DD
  availabilityStatus: AvailabilityStatus;
  reservedDates: ReservedDateRange[];
  currentBorrower?: string;
  expectedReturnDate?: string;
  isNeedNow: boolean; // available for immediate pickup (<30 min)
  views: number;
  createdAt: string;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemCategory: string;
  borrowerId: string;
  borrowerName: string;
  borrowerAvatar: string;
  borrowerClass: RguktClass;
  borrowerPhone: string;
  borrowerEmail: string;
  ownerId: string;
  ownerName: string;
  requestType: SharingType;
  rentPerDay?: number;
  totalRentalCharge?: number;
  rentPaymentStatus?: 'Pending' | 'Paid' | 'Not Applicable';
  startDate: string;
  endDate: string;
  durationDays: number;
  message?: string;
  pickupLocation: string;
  status: TransactionStatus;
  qrCodeToken: string;
  conditionChecklist: {
    noPhysicalDamage: boolean;
    allAccessoriesIncluded: boolean;
    functioningProperly: boolean;
  };
  handoverConfirmedByOwner: boolean;
  handoverConfirmedByBorrower: boolean;
  returnConfirmedByOwner: boolean;
  returnConfirmedByBorrower: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  itemId?: string;
  itemTitle?: string;
  itemImage?: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Review {
  id: string;
  targetUserId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  itemTitle: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'item' | 'user' | 'transaction';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'Pending Review' | 'Investigated' | 'Resolved';
  createdAt: string;
}
