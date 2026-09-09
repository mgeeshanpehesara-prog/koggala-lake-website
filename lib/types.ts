export type Currency = string;

export type ProductCategory = "boat-safari" | "kayak-tour" | "kayak-rental";

export type ExperienceType = "Private Tour" | "Self-Guided";

export interface PriceTier {
  minPeople: number;
  maxPeople: number | null; // null = and above
  pricePerPerson: number;
}

export type TimeSlotCutoffUnit = "minutes" | "hours" | "days" | "none";

export interface TimeSlotCutoff {
  value: number;
  unit: TimeSlotCutoffUnit;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  categoryLabel: string;
  badge?: string;
  name: string;
  shortDescription: string;
  fullDescription: string[];
  duration: string;
  experienceType: ExperienceType;
  equipment?: string;
  maxPeople?: number;
  timeSlots?: string[];
  timeSlotCutoffs?: Record<string, TimeSlotCutoff>;
  childrenFree: boolean;
  requiresHotelPickupDropoff?: boolean;
  priceDisplay: string;
  priceBase: {
    amount: number;
    currency: Currency;
    unit: string; // e.g. "/ adult"
  };
  pricingTiers?: PriceTier[];
  rating: number;
  reviewCount: number;
  ratingSource: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  cancellationPolicy: string;
  mainImage: string;
  galleryImages: string[];
}

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type PaymentStatus = "Unpaid" | "Pending" | "Payment Pending" | "Paid" | "Failed" | "Cancelled" | "Refunded";
export type PaymentMethod = "Pay Online - Full Amount" | "Pay on Arrival";

export interface Booking {
  id: string;
  bookingReference: string;
  productId: string;
  productSlug: string;
  productName: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  hotelName: string;
  hotelAddress: string;
  notes: string;
  totalAmount: number;
  currency: Currency;
  paymentMethod: PaymentMethod | string;
  paymentBrand?: "visa" | "mastercard";
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  amountPaid: number;
  amountDueNow: number;
  remainingBalance: number;
  payhereOrderId?: string;
  payherePaymentId?: string;
  createdAt: string;
  updatedAt?: string;
  gatewayConfigured?: boolean;
}

export interface Review {
  id: string;
  platform: "Google" | "GetYourGuide" | "Tripadvisor";
  authorName?: string;
  authorInitial?: string;
  rating: number;
  text?: string;
  productSlug?: string;
  isPlaceholder: boolean;
  featured?: boolean;
  displayOrder?: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "Boat" | "Kayaking" | "Wildlife" | "Cinnamon" | "Lake" | "Sunset";
}
