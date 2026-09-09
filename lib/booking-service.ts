import { promises as fs } from "fs";
import path from "path";
import type { Booking, Currency, PaymentMethod, PaymentStatus, BookingStatus } from "@/lib/types";
import { getAllProducts } from "@/lib/data/product-store";
import { getTimeSlotCutoff, isTimeSlotBookable } from "@/lib/time-slots";
import { convertPrice } from "@/lib/currency/currency";
import { getCurrencyRates } from "@/lib/currency/rate-service";

const file = path.join(process.cwd(), "data", "bookings.json");

export const PAYMENT_METHODS = ["Pay Online - Full Amount", "Pay on Arrival"] as const;
export const PAYMENT_STATUSES: PaymentStatus[] = ["Unpaid", "Pending", "Payment Pending", "Paid", "Failed", "Cancelled", "Refunded"];
export const BOOKING_STATUSES: BookingStatus[] = ["Pending", "Confirmed", "Cancelled", "Completed"];

export function createBookingReference() {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KOG-${datePart}-${randomPart}`;
}

export async function readBookings(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

export async function writeBookings(bookings: Booking[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(bookings, null, 2), "utf8");
}

export function normalizeBookingStatus(value?: string): BookingStatus {
  return (BOOKING_STATUSES.includes(value as BookingStatus) ? value : "Pending") as BookingStatus;
}

export function normalizePaymentStatus(value?: string): PaymentStatus {
  return (PAYMENT_STATUSES.includes(value as PaymentStatus) ? value : "Unpaid") as PaymentStatus;
}

export function getProductPriceForGuests(product: any, adults: number, children: number) {
  const guestCount = Number(adults || 0) + Number(children || 0);
  const pricingTiers = product.pricingTiers || [];
  const baseUnit = product.priceBase?.amount ?? 0;

  const tier = pricingTiers.find((entry: any) => {
    const minPeople = Number(entry.minPeople || 1);
    const maxPeople = entry.maxPeople === null || entry.maxPeople === undefined ? Number.MAX_SAFE_INTEGER : Number(entry.maxPeople);
    return guestCount >= minPeople && guestCount <= maxPeople;
  });

  const unitPrice = tier ? Number(tier.pricePerPerson || 0) : Number(baseUnit || 0);
  const total = Number(adults || 0) * unitPrice;
  return { unitPrice, total, guestCount };
}

export async function validateBookingRequest(payload: any) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Booking payload is invalid.");
  }

  const required = [
    "productSlug",
    "date",
    "time",
    "adults",
    "children",
    "firstName",
    "lastName",
    "email",
    "phone",
    "country",
  ];

  for (const key of required) {
    const value = payload[key];
    if ((key === "adults" || key === "children") && (value === undefined || value === null || Number(value) < 0)) {
      throw new Error(`Please provide a valid ${key}.`);
    }
    if (typeof value === "string" && !value.trim() && key !== "children") {
      throw new Error(`Please complete the ${key} field.`);
    }
  }

  const email = String(payload.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  const products = await getAllProducts();
  const product = products.find((item) => item.slug === payload.productSlug);
  if (!product) {
    throw new Error("The selected product could not be found.");
  }

  const totalGuests = Number(payload.adults || 0) + Number(payload.children || 0);
  const maxPeople = Number(product.maxPeople || 0);
  if (maxPeople > 0 && totalGuests > maxPeople) {
    throw new Error(`This booking exceeds the product capacity of ${maxPeople} guests.`);
  }

  if (!product.timeSlots?.includes(payload.time)) {
    throw new Error("The selected time is not available for this product.");
  }

  if (!isTimeSlotBookable(String(payload.date), String(payload.time), getTimeSlotCutoff(product.timeSlotCutoffs, String(payload.time)))) {
    throw new Error("This time slot is no longer available for booking.");
  }

  const { total: baseTotal } = getProductPriceForGuests(product, Number(payload.adults || 0), Number(payload.children || 0));
  if (!Number.isFinite(baseTotal) || baseTotal <= 0) {
    throw new Error("The booking total could not be calculated.");
  }

  const merchantChoice = String(payload.paymentMethod || "").trim();
  const supportedPaymentMethod = merchantChoice && PAYMENT_METHODS.includes(merchantChoice as (typeof PAYMENT_METHODS)[number])
    ? (merchantChoice as (typeof PAYMENT_METHODS)[number])
    : "Pay on Arrival";
  const requiresHotelPickup = Boolean(product.requiresHotelPickupDropoff);

  if (merchantChoice && !PAYMENT_METHODS.includes(merchantChoice as (typeof PAYMENT_METHODS)[number])) {
    throw new Error("Unsupported payment method.");
  }

  if (requiresHotelPickup && (!String(payload.hotelName || "").trim() || !String(payload.hotelAddress || "").trim())) {
    throw new Error("Please complete the hotel or accommodation name and address.");
  }

  const rates = await getCurrencyRates();
  const requestedCurrency = String(payload.currency || product.priceBase?.currency || "USD").toUpperCase();
  const normalizedCurrency = (rates.rates[requestedCurrency] ? requestedCurrency : product.priceBase?.currency || "USD") as Currency;
  const total = Number(convertPrice(baseTotal, product.priceBase?.currency || "USD", normalizedCurrency, rates.rates).toFixed(2));
  const paymentMethod: PaymentMethod = supportedPaymentMethod as PaymentMethod;
  const amountDueNow = paymentMethod === "Pay on Arrival" ? 0 : total;
  const remainingBalance = paymentMethod === "Pay on Arrival" ? total : 0;

  return {
    product,
    total,
    paymentMethod,
    amountDueNow,
    remainingBalance,
    currency: normalizedCurrency,
  };
}

export function createBookingRecord(payload: any, validated: ReturnType<typeof validateBookingRequest> extends Promise<infer T> ? T : never): Booking {
  const bookingReference = createBookingReference();
  const now = new Date().toISOString();
  const requiresHotelPickup = Boolean(validated.product.requiresHotelPickupDropoff);

  return {
    id: bookingReference,
    bookingReference,
    productId: payload.productSlug,
    productSlug: payload.productSlug,
    productName: validated.product.name,
    date: payload.date,
    time: payload.time,
    adults: Number(payload.adults || 0),
    children: Number(payload.children || 0),
    firstName: String(payload.firstName || "").trim(),
    lastName: String(payload.lastName || "").trim(),
    email: String(payload.email || "").trim(),
    phone: String(payload.phone || "").trim(),
    country: String(payload.country || "").trim(),
    hotelName: requiresHotelPickup ? String(payload.hotelName || "").trim() : "",
    hotelAddress: requiresHotelPickup ? String(payload.hotelAddress || "").trim() : "",
    notes: String(payload.notes || "").trim(),
    totalAmount: Number(validated.total || 0),
    currency: validated.currency,
    paymentMethod: validated.paymentMethod,
    paymentBrand: payload.paymentBrand === "mastercard" ? "mastercard" : payload.paymentBrand === "visa" ? "visa" : undefined,
    paymentStatus: "Payment Pending",
    bookingStatus: "Pending",
    amountPaid: 0,
    amountDueNow: Number(validated.amountDueNow || 0),
    remainingBalance: Number(validated.remainingBalance || 0),
    payhereOrderId: String(payload.payhereOrderId || "").trim() || undefined,
    payherePaymentId: String(payload.payherePaymentId || "").trim() || undefined,
    createdAt: now,
    updatedAt: now,
    gatewayConfigured: false,
  };
}
