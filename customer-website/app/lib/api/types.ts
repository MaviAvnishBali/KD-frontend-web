// ── Shared API types ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success:   boolean;
  message:   string | null;
  data:      T | null;
  errors:    string[] | null;
  timestamp: string | null;
  traceId:   string | null;
}

export interface PagedResponse<T> {
  content:          T[];
  totalElements:    number;
  totalPages:       number;
  number:           number;
  size:             number;
  first:            boolean;
  last:             boolean;
  numberOfElements: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  tokenType:    string;
  expiresIn:    number;
  user:         UserInfo;
}
export interface UserInfo {
  id:       string;
  name:     string | null;
  phone:    string | null;
  email:    string | null;
  role:     string;
  verified: boolean;
}

// ── User ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id:          string;
  name:        string | null;
  phone:       string | null;
  email:       string | null;
  avatarUrl:   string | null;
  dateOfBirth: string | null;
  gender:      string | null;
  role:        string;
  verified:    boolean;
  createdAt:   string | null;
}

export interface Address {
  id:           string;
  label:        string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark:     string | null;
  city:         string;
  state:        string;
  pincode:      string;
  latitude:     number | null;
  longitude:    number | null;
  isDefault:    boolean;
}

// ── Menu ─────────────────────────────────────────────────────────────────────
export interface Category {
  id:           number;
  name:         string;
  slug:         string;
  description:  string | null;
  imageUrl:     string | null;
  displayOrder: number;
  itemCount:    number | null;
}

export interface MenuItem {
  id:              string;
  categoryId:      number;
  name:            string;
  slug:            string;
  description:     string | null;
  price:           number;
  discountPrice:   number | null;
  foodType:        "VEG" | "NON_VEG" | "VEGAN" | "JAIN";
  gstRate:         number;
  preparationTime: number | null;
  calories:        number | null;
  isAvailable:     boolean;
  isBestSeller:    boolean;
  isRecommended:   boolean;
  rating:          number | null;
  totalReviews:    number | null;
  images:          { url: string; isPrimary: boolean }[] | null;
  tags:            string[] | null;
}

// ── Cart ─────────────────────────────────────────────────────────────────────
export interface Cart {
  userId:            string;
  items:             CartItem[];
  itemCount:         number;
  subtotal:          number;
  discountAmount:    number;
  gstAmount:         number;
  deliveryCharge:    number;
  totalAmount:       number;
  appliedCoupon:     string | null;
  freeDeliveryAbove: number;
}
export interface CartItem {
  menuItemId:          string;
  name:                string;
  imageUrl:            string | null;
  unitPrice:           number;
  quantity:            number;
  totalPrice:          number;
  specialInstruction:  string | null;
}

// ── Orders ───────────────────────────────────────────────────────────────────
export interface Order {
  id:               string;
  orderNumber:      string;
  status:           OrderStatus;
  orderType:        "DELIVERY" | "DINE_IN" | "TAKEAWAY";
  items:            OrderItem[];
  subtotal:         number;
  discountAmount:   number;
  deliveryCharge:   number;
  cgstAmount:       number;
  sgstAmount:       number;
  totalAmount:      number;
  couponCode:       string | null;
  pointsEarned:     number;
  estimatedMinutes: number | null;
  deliveryPartner:  DeliveryPartner | null;
  createdAt:        string;
  confirmedAt:      string | null;
  deliveredAt:      string | null;
}
export type OrderStatus =
  | "PENDING" | "CONFIRMED" | "PREPARING"
  | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id:         string;
  name:       string;
  quantity:   number;
  unitPrice:  number;
  totalPrice: number;
  kdsStatus:  string;
}
export interface DeliveryPartner {
  name:          string;
  phone:         string;
  vehicleNumber: string | null;
  rating:        number;
  currentLat:    number | null;
  currentLng:    number | null;
}

// ── Reservations ─────────────────────────────────────────────────────────────
export interface Reservation {
  id:             string;
  branchName:     string | null;
  customerName:   string;
  customerPhone:  string;
  partySize:      number;
  reservedDate:   string;
  reservedTime:   string;
  occasion:       string | null;
  specialRequest: string | null;
  status:         string;
  tableNumber:    string | null;
}

// ── Banners & Offers ─────────────────────────────────────────────────────────
export interface Banner {
  id:           string;
  title:        string;
  subtitle:     string | null;
  tag:          string | null;
  emoji:        string | null;
  bgColorStart: string;
  bgColorEnd:   string;
  ctaText:      string | null;
  ctaLink:      string | null;
  displayOrder: number;
}

export interface Offer {
  id:             string;
  emoji:          string;
  title:          string;
  description:    string | null;
  promoCode:      string | null;
  savingText:     string | null;
  badgeText:      string | null;
  bgColorStart:   string;
  bgColorEnd:     string;
  imageUrl:       string | null;
  discountType:   string | null;
  discountValue:  number | null;
  minOrderAmount: number | null;
  maxDiscount:    number | null;
  validUntil:     string | null;
  displayOrder:   number;
}

// ── Loyalty ───────────────────────────────────────────────────────────────────
export interface Loyalty {
  points:         number;
  tier:           string;
  lifetimePoints: number;
  nextTierPoints: number | null;
  nextTier:       string | null;
}
