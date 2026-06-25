const NOW = new Date().toISOString();

export const MOCK: Record<string, unknown> = {
  // ── Dashboard ─────────────────────────────────────────────────────────────
  "reports/dashboard": {
    todaySales: 48320,
    todayOrders: 134,
    activeOrders: 12,
    totalCustomers: 3241,
    avgOrderValue: 360,
    avgRating: 4.6,
    lowStockAlerts: 3,
    pendingReservations: 7,
    salesTrend: [
      { hour: "9am",  sales: 2100,  orders: 6  },
      { hour: "10am", sales: 3400,  orders: 9  },
      { hour: "11am", sales: 5200,  orders: 14 },
      { hour: "12pm", sales: 9800,  orders: 28 },
      { hour: "1pm",  sales: 11200, orders: 31 },
      { hour: "2pm",  sales: 7600,  orders: 21 },
      { hour: "3pm",  sales: 3100,  orders: 8  },
      { hour: "4pm",  sales: 2400,  orders: 7  },
      { hour: "5pm",  sales: 3520,  orders: 10 },
    ],
    ordersByType: [
      { name: "Dine In",  value: 61 },
      { name: "Takeaway", value: 42 },
      { name: "Delivery", value: 31 },
    ],
    topItems: [
      { name: "Veg Dum Biryani",    quantity: 48, revenue: 14400 },
      { name: "Chicken Seekh",       quantity: 37, revenue: 11100 },
      { name: "Paneer Makhani",      quantity: 32, revenue: 9600  },
      { name: "Dal Makhani",         quantity: 28, revenue: 6720  },
      { name: "Butter Naan",         quantity: 24, revenue: 2880  },
      { name: "Gulab Jamun",         quantity: 21, revenue: 2940  },
    ],
    recentOrders: [
      { id: "o1", number: "KD-2341", customer: "Rahul Sharma",  total: 890,  status: "DELIVERED",  type: "DINE_IN",  time: "2 min ago" },
      { id: "o2", number: "KD-2340", customer: "Priya Mehta",   total: 450,  status: "PREPARING",  type: "TAKEAWAY", time: "8 min ago" },
      { id: "o3", number: "KD-2339", customer: "Amit Verma",    total: 1240, status: "CONFIRMED",  type: "DELIVERY", time: "14 min ago" },
      { id: "o4", number: "KD-2338", customer: "Sunita Patel",  total: 620,  status: "READY",      type: "DINE_IN",  time: "20 min ago" },
      { id: "o5", number: "KD-2337", customer: "Vikram Singh",  total: 380,  status: "DELIVERED",  type: "TAKEAWAY", time: "35 min ago" },
      { id: "o6", number: "KD-2336", customer: "Kavya Reddy",   total: 760,  status: "CANCELLED",  type: "DELIVERY", time: "1 hr ago"   },
    ],
  },

  // ── Categories ────────────────────────────────────────────────────────────
  "v1/categories": [
    { id: 1, name: "Biryani & Rice",   slug: "biryani-rice",   itemCount: 12 },
    { id: 2, name: "Starters",          slug: "starters",        itemCount: 18 },
    { id: 3, name: "Main Course",       slug: "main-course",     itemCount: 22 },
    { id: 4, name: "Breads",            slug: "breads",          itemCount: 8  },
    { id: 5, name: "Desserts",          slug: "desserts",        itemCount: 10 },
    { id: 6, name: "Beverages",         slug: "beverages",       itemCount: 14 },
    { id: 7, name: "Kebabs & Tandoor",  slug: "kebabs-tandoor",  itemCount: 16 },
    { id: 8, name: "Soups & Salads",   slug: "soups-salads",   itemCount: 9  },
  ],

  // ── Menu items ────────────────────────────────────────────────────────────
  "v1/products": {
    content: [
      { id: "m1",  categoryId: 1, name: "Veg Dum Biryani",        description: "Slow-cooked fragrant basmati with saffron", price: 299, discountPrice: 249, foodType: "VEG",     preparationTime: 25, isAvailable: true,  isBestSeller: true,  rating: 4.7 },
      { id: "m2",  categoryId: 1, name: "Chicken Dum Biryani",    description: "Mughlai-style layered chicken biryani",      price: 349, discountPrice: null, foodType: "NON_VEG", preparationTime: 30, isAvailable: true,  isBestSeller: true,  rating: 4.8 },
      { id: "m3",  categoryId: 1, name: "Mutton Biryani",         description: "Royal mutton dum biryani with raita",        price: 429, discountPrice: null, foodType: "NON_VEG", preparationTime: 35, isAvailable: true,  isBestSeller: false, rating: 4.6 },
      { id: "m4",  categoryId: 2, name: "Paneer Tikka",           description: "Tandoor-grilled cottage cheese cubes",       price: 279, discountPrice: 229, foodType: "VEG",     preparationTime: 20, isAvailable: true,  isBestSeller: true,  rating: 4.5 },
      { id: "m5",  categoryId: 2, name: "Chicken Seekh Kebab",    description: "Minced chicken with herbs on skewers",       price: 299, discountPrice: null, foodType: "NON_VEG", preparationTime: 20, isAvailable: true,  isBestSeller: true,  rating: 4.7 },
      { id: "m6",  categoryId: 2, name: "Hara Bhara Kebab",       description: "Crispy spinach & pea patties",               price: 199, discountPrice: null, foodType: "VEG",     preparationTime: 15, isAvailable: true,  isBestSeller: false, rating: 4.3 },
      { id: "m7",  categoryId: 3, name: "Paneer Makhani",         description: "Cottage cheese in rich tomato cream sauce",  price: 299, discountPrice: 249, foodType: "VEG",     preparationTime: 20, isAvailable: true,  isBestSeller: true,  rating: 4.6 },
      { id: "m8",  categoryId: 3, name: "Dal Makhani",            description: "Slow-cooked black lentils overnight",        price: 239, discountPrice: null, foodType: "VEG",     preparationTime: 15, isAvailable: true,  isBestSeller: true,  rating: 4.8 },
      { id: "m9",  categoryId: 3, name: "Butter Chicken",         description: "Tender chicken in velvety makhani gravy",    price: 329, discountPrice: 279, foodType: "NON_VEG", preparationTime: 25, isAvailable: true,  isBestSeller: true,  rating: 4.9 },
      { id: "m10", categoryId: 3, name: "Mutton Rogan Josh",      description: "Kashmiri-style aromatic lamb curry",         price: 399, discountPrice: null, foodType: "NON_VEG", preparationTime: 30, isAvailable: false, isBestSeller: false, rating: 4.7 },
      { id: "m11", categoryId: 4, name: "Butter Naan",            description: "Soft leavened bread from tandoor",           price: 59,  discountPrice: null, foodType: "VEG",     preparationTime: 10, isAvailable: true,  isBestSeller: false, rating: 4.4 },
      { id: "m12", categoryId: 4, name: "Garlic Naan",            description: "Naan topped with fresh garlic & butter",     price: 69,  discountPrice: null, foodType: "VEG",     preparationTime: 10, isAvailable: true,  isBestSeller: false, rating: 4.5 },
      { id: "m13", categoryId: 5, name: "Gulab Jamun",            description: "Soft milk solids dumplings in rose syrup",   price: 99,  discountPrice: null, foodType: "VEG",     preparationTime: 5,  isAvailable: true,  isBestSeller: true,  rating: 4.6 },
      { id: "m14", categoryId: 5, name: "Phirni",                 description: "Chilled rice pudding with saffron",          price: 119, discountPrice: null, foodType: "VEG",     preparationTime: 5,  isAvailable: true,  isBestSeller: false, rating: 4.4 },
      { id: "m15", categoryId: 6, name: "Royal Shahi Lassi",      description: "Thick yoghurt drink with saffron & nuts",    price: 149, discountPrice: 119, foodType: "VEG",     preparationTime: 5,  isAvailable: true,  isBestSeller: true,  rating: 4.7 },
      { id: "m16", categoryId: 7, name: "Seekh Kebab (Veg)",      description: "Mixed vegetable seekh on iron skewers",      price: 229, discountPrice: null, foodType: "VEG",     preparationTime: 18, isAvailable: true,  isBestSeller: false, rating: 4.2 },
      { id: "m17", categoryId: 7, name: "Galouti Kebab",          description: "Melt-in-mouth minced mutton patties",        price: 349, discountPrice: null, foodType: "NON_VEG", preparationTime: 22, isAvailable: true,  isBestSeller: true,  rating: 4.8 },
      { id: "m18", categoryId: 8, name: "Shorba-e-Murgh",         description: "Spiced chicken broth with herbs",            price: 149, discountPrice: null, foodType: "NON_VEG", preparationTime: 10, isAvailable: true,  isBestSeller: false, rating: 4.3 },
    ],
    totalElements: 18,
    totalPages: 1,
    number: 0,
    size: 100,
    first: true,
    last: true,
    numberOfElements: 18,
  },

  // ── Admin orders ─────────────────────────────────────────────────────────
  "admin/orders": {
    content: [
      { id: "o1",  orderNumber: "KD-2341", customerName: "Rahul Sharma",   customerPhone: "+919876543210", status: "DELIVERED",        orderType: "DINE_IN",  totalAmount: 890,  itemCount: 3, createdAt: "2026-06-25T16:50:00Z" },
      { id: "o2",  orderNumber: "KD-2340", customerName: "Priya Mehta",    customerPhone: "+919812345678", status: "PREPARING",        orderType: "TAKEAWAY", totalAmount: 450,  itemCount: 2, createdAt: "2026-06-25T16:44:00Z" },
      { id: "o3",  orderNumber: "KD-2339", customerName: "Amit Verma",     customerPhone: "+919988776655", status: "CONFIRMED",        orderType: "DELIVERY", totalAmount: 1240, itemCount: 5, createdAt: "2026-06-25T16:38:00Z" },
      { id: "o4",  orderNumber: "KD-2338", customerName: "Sunita Patel",   customerPhone: "+919765432109", status: "READY",            orderType: "DINE_IN",  totalAmount: 620,  itemCount: 2, createdAt: "2026-06-25T16:32:00Z" },
      { id: "o5",  orderNumber: "KD-2337", customerName: "Vikram Singh",   customerPhone: "+919654321098", status: "DELIVERED",        orderType: "TAKEAWAY", totalAmount: 380,  itemCount: 1, createdAt: "2026-06-25T16:17:00Z" },
      { id: "o6",  orderNumber: "KD-2336", customerName: "Kavya Reddy",    customerPhone: "+919543210987", status: "CANCELLED",        orderType: "DELIVERY", totalAmount: 760,  itemCount: 3, createdAt: "2026-06-25T15:52:00Z" },
      { id: "o7",  orderNumber: "KD-2335", customerName: "Arjun Nair",     customerPhone: "+919432109876", status: "OUT_FOR_DELIVERY", orderType: "DELIVERY", totalAmount: 540,  itemCount: 2, createdAt: "2026-06-25T15:40:00Z" },
      { id: "o8",  orderNumber: "KD-2334", customerName: "Deepa Iyer",     customerPhone: "+919321098765", status: "DELIVERED",        orderType: "DINE_IN",  totalAmount: 1580, itemCount: 6, createdAt: "2026-06-25T15:15:00Z" },
      { id: "o9",  orderNumber: "KD-2333", customerName: "Sanjay Kapoor",  customerPhone: "+919210987654", status: "PENDING",          orderType: "TAKEAWAY", totalAmount: 290,  itemCount: 1, createdAt: "2026-06-25T17:00:00Z" },
      { id: "o10", orderNumber: "KD-2332", customerName: "Meena Joshi",    customerPhone: "+919109876543", status: "CONFIRMED",        orderType: "DELIVERY", totalAmount: 870,  itemCount: 4, createdAt: "2026-06-25T14:58:00Z" },
    ],
    totalElements: 134,
    totalPages: 14,
    number: 0,
    size: 10,
    first: true,
    last: false,
    numberOfElements: 10,
  },

  // ── Admin reservations ────────────────────────────────────────────────────
  "admin/reservations": [
    { id: "r1", customerName: "Ananya Krishnan",  customerPhone: "+919876501234", partySize: 4,  reservedDate: "2026-06-25", reservedTime: "19:30", occasion: "Anniversary",   specialRequest: "Window seat preferred",   status: "CONFIRMED", tableNumber: "T-04", branchName: "Kila Darbar Main" },
    { id: "r2", customerName: "Rohan Malhotra",   customerPhone: "+919865412300", partySize: 2,  reservedDate: "2026-06-25", reservedTime: "20:00", occasion: null,            specialRequest: null,                       status: "PENDING",   tableNumber: null,   branchName: "Kila Darbar Main" },
    { id: "r3", customerName: "Sneha Chatterjee", customerPhone: "+919854123456", partySize: 8,  reservedDate: "2026-06-25", reservedTime: "20:30", occasion: "Birthday",      specialRequest: "Birthday cake please",    status: "CONFIRMED", tableNumber: "T-12", branchName: "Kila Darbar Main" },
    { id: "r4", customerName: "Karan Mehta",      customerPhone: "+919843012345", partySize: 3,  reservedDate: "2026-06-26", reservedTime: "13:00", occasion: null,            specialRequest: "Jain food required",      status: "CONFIRMED", tableNumber: "T-06", branchName: "Kila Darbar Main" },
    { id: "r5", customerName: "Pooja Sharma",     customerPhone: "+919832901234", partySize: 6,  reservedDate: "2026-06-26", reservedTime: "19:00", occasion: "Corporate",     specialRequest: "Separate billing please", status: "PENDING",   tableNumber: null,   branchName: "Kila Darbar Main" },
    { id: "r6", customerName: "Nikhil Gupta",     customerPhone: "+919821890123", partySize: 2,  reservedDate: "2026-06-24", reservedTime: "20:00", occasion: "Anniversary",   specialRequest: null,                       status: "COMPLETED", tableNumber: "T-02", branchName: "Kila Darbar Main" },
    { id: "r7", customerName: "Tanvi Desai",      customerPhone: "+919810789012", partySize: 5,  reservedDate: "2026-06-24", reservedTime: "19:30", occasion: null,            specialRequest: null,                       status: "CANCELLED", tableNumber: null,   branchName: "Kila Darbar Main" },
  ],

  // ── Admin party hall ──────────────────────────────────────────────────────
  "admin/party-hall/bookings": [
    { id: "ph1", customerName: "Sunita Kapoor",   customerPhone: "+919876501234", customerEmail: "sunita@example.com",  eventType: "Birthday",      guestCount: 60, preferredDate: "2026-07-05", preferredTime: "7:00 PM – 10:00 PM", packageType: "ROYAL", specialRequests: "Pink and gold theme, birthday cake arrangement", status: "CONFIRMED",  totalAmount: 28000, createdAt: "2026-06-20T10:00:00Z" },
    { id: "ph2", customerName: "Arjun Malhotra",  customerPhone: "+919865412300", customerEmail: null,                 eventType: "Ring Ceremony", guestCount: 85, preferredDate: "2026-07-12", preferredTime: "7:00 PM – 10:00 PM", packageType: "GRAND",  specialRequests: "Floral mandap required, no non-veg", status: "PENDING",    totalAmount: 48000, createdAt: "2026-06-22T14:30:00Z" },
    { id: "ph3", customerName: "Priya Sharma",    customerPhone: "+919854123456", customerEmail: "priya.s@gmail.com",  eventType: "Baby Shower",   guestCount: 35, preferredDate: "2026-07-08", preferredTime: "1:00 PM – 4:00 PM", packageType: "BASIC",  specialRequests: "Pastel decorations, vegetarian menu only", status: "CONFIRMED",  totalAmount: 15000, createdAt: "2026-06-21T09:15:00Z" },
    { id: "ph4", customerName: "Rohit Verma",     customerPhone: "+919843012345", customerEmail: "rohit.v@company.com", eventType: "Corporate",    guestCount: 75, preferredDate: "2026-07-15", preferredTime: "10:00 AM – 1:00 PM", packageType: "ROYAL", specialRequests: "Projector and screen setup, tea/coffee arrangements", status: "PENDING",    totalAmount: 28000, createdAt: "2026-06-23T11:00:00Z" },
    { id: "ph5", customerName: "Meena Reddy",     customerPhone: "+919832901234", customerEmail: "meena.r@gmail.com",  eventType: "Anniversary",   guestCount: 50, preferredDate: "2026-06-28", preferredTime: "7:00 PM – 10:00 PM", packageType: "ROYAL", specialRequests: "Romantic candle setup, champagne on arrival", status: "COMPLETED",  totalAmount: 28000, createdAt: "2026-06-15T16:45:00Z" },
    { id: "ph6", customerName: "Kavita Singh",    customerPhone: "+919821890123", customerEmail: null,                 eventType: "Birthday",      guestCount: 40, preferredDate: "2026-07-03", preferredTime: "4:00 PM – 7:00 PM", packageType: "BASIC",  specialRequests: null, status: "CANCELLED", totalAmount: null,  createdAt: "2026-06-19T08:00:00Z" },
  ],

  // ── Admin customers ───────────────────────────────────────────────────────
  "admin/customers": {
    content: [
      { id: "c1",  name: "Rahul Sharma",   phone: "+919876543210", email: "rahul@example.com",   totalOrders: 24, totalSpend: 18420, loyaltyPoints: 920,  tier: "GOLD",   createdAt: "2025-03-12T10:00:00Z", lastOrderAt: "2026-06-25T16:50:00Z" },
      { id: "c2",  name: "Priya Mehta",    phone: "+919812345678", email: "priya@example.com",   totalOrders: 18, totalSpend: 12600, loyaltyPoints: 630,  tier: "SILVER", createdAt: "2025-04-08T10:00:00Z", lastOrderAt: "2026-06-25T16:44:00Z" },
      { id: "c3",  name: "Amit Verma",     phone: "+919988776655", email: null,                  totalOrders: 31, totalSpend: 27400, loyaltyPoints: 1370, tier: "GOLD",   createdAt: "2025-01-20T10:00:00Z", lastOrderAt: "2026-06-25T16:38:00Z" },
      { id: "c4",  name: "Sunita Patel",   phone: "+919765432109", email: "sunita@example.com",  totalOrders: 9,  totalSpend: 6200,  loyaltyPoints: 310,  tier: "BRONZE", createdAt: "2025-06-01T10:00:00Z", lastOrderAt: "2026-06-25T16:32:00Z" },
      { id: "c5",  name: "Vikram Singh",   phone: "+919654321098", email: "vikram@example.com",  totalOrders: 47, totalSpend: 42100, loyaltyPoints: 2105, tier: "ROYAL",  createdAt: "2024-11-05T10:00:00Z", lastOrderAt: "2026-06-25T16:17:00Z" },
      { id: "c6",  name: "Kavya Reddy",    phone: "+919543210987", email: "kavya@example.com",   totalOrders: 12, totalSpend: 9800,  loyaltyPoints: 490,  tier: "SILVER", createdAt: "2025-05-14T10:00:00Z", lastOrderAt: "2026-06-25T15:52:00Z" },
      { id: "c7",  name: "Arjun Nair",     phone: "+919432109876", email: null,                  totalOrders: 6,  totalSpend: 3900,  loyaltyPoints: 195,  tier: "BRONZE", createdAt: "2025-09-22T10:00:00Z", lastOrderAt: "2026-06-25T15:40:00Z" },
      { id: "c8",  name: "Deepa Iyer",     phone: "+919321098765", email: "deepa@example.com",   totalOrders: 38, totalSpend: 35600, loyaltyPoints: 1780, tier: "ROYAL",  createdAt: "2024-12-18T10:00:00Z", lastOrderAt: "2026-06-25T15:15:00Z" },
      { id: "c9",  name: "Sanjay Kapoor",  phone: "+919210987654", email: "sanjay@example.com",  totalOrders: 3,  totalSpend: 1200,  loyaltyPoints: 60,   tier: "BRONZE", createdAt: "2026-05-30T10:00:00Z", lastOrderAt: "2026-06-25T17:00:00Z" },
      { id: "c10", name: "Meena Joshi",    phone: "+919109876543", email: "meena@example.com",   totalOrders: 21, totalSpend: 16300, loyaltyPoints: 815,  tier: "GOLD",   createdAt: "2025-02-07T10:00:00Z", lastOrderAt: "2026-06-25T14:58:00Z" },
    ],
    totalElements: 3241,
    totalPages: 325,
    number: 0,
    size: 10,
    first: true,
    last: false,
    numberOfElements: 10,
  },

  // ── Offers ────────────────────────────────────────────────────────────────
  "admin/banners/offers": [
    {
      id: "off1", emoji: "👑", title: "Royal Welcome Offer", description: "Save big on your first order at Kila Darbar",
      promoCode: "ROYAL50", savingText: "Save ₹50", badgeText: "New User",
      bgColorStart: "#7C1D1D", bgColorEnd: "#4a0b0b",
      discountType: "FLAT", discountValue: 50, minOrderAmount: 300, maxDiscount: 50,
      validUntil: "2026-12-31T23:59:00", displayOrder: 1, is_active: true,
    },
    {
      id: "off2", emoji: "🌙", title: "Weekend Royal Feast", description: "Enjoy 20% off on weekend orders",
      promoCode: "WEEKEND20", savingText: "Save up to ₹100", badgeText: "Weekend",
      bgColorStart: "#1a1a4e", bgColorEnd: "#0d0d2e",
      discountType: "PERCENTAGE", discountValue: 20, minOrderAmount: 500, maxDiscount: 100,
      validUntil: "2026-08-31T23:59:00", displayOrder: 2, is_active: true,
    },
    {
      id: "off3", emoji: "🎉", title: "Birthday Bonanza", description: "Special birthday month discount for loyal customers",
      promoCode: "BDAY30", savingText: "Save 30%", badgeText: "Birthday",
      bgColorStart: "#065F46", bgColorEnd: "#022C22",
      discountType: "PERCENTAGE", discountValue: 30, minOrderAmount: 400, maxDiscount: 150,
      validUntil: null, displayOrder: 3, is_active: false,
    },
  ],
};

export function getMockResponse(url: string): unknown | null {
  const path = url.replace(/^\//, "").split("?")[0];

  // Admin login endpoint (dev bypass — never hits real backend)
  if (path === "v1/auth/admin/login") {
    return {
      accessToken: "dev-bypass-token",
      refreshToken: "dev-refresh-token",
      tokenType: "Bearer",
      expiresIn: 86400000,
      user: { id: "dev-admin", name: "Dev Admin", email: "admin@kiladarbar.com", role: "SUPER_ADMIN", verified: true },
    };
  }

  // Party hall status update: admin/party-hall/bookings/{id}/status
  if (/^admin\/party-hall\/bookings\/[^/]+\//.test(path)) {
    return { updated: true };
  }

  // Image upload endpoint: admin/menu/items/{id}/image
  if (/^admin\/menu\/items\/[^/]+\/images$/.test(path)) {
    return { url: "https://placehold.co/400x300/7C1D1D/ffffff?text=Dish", isPrimary: true };
  }

  for (const key of Object.keys(MOCK)) {
    if (path === key || path.startsWith(key)) return MOCK[key];
  }
  return null;
}
