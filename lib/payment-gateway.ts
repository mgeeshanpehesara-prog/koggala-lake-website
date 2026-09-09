import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type PaymentBrand = "visa" | "mastercard";

const pendingOrdersFile = path.join(process.cwd(), "data", "payhere-pending-orders.json");

export function isCardPaymentGatewayConfigured() {
  return Boolean(process.env.MERCHANT_ID && process.env.MERCHANT_SECRET);
}

export function getCardPaymentUnavailableMessage(paymentBrand: PaymentBrand) {
  return `Online ${paymentBrand === "visa" ? "Visa" : "Mastercard"} payment is not currently available. Please confirm your booking through WhatsApp instead.`;
}

export async function readPendingOrders(): Promise<Array<Record<string, any>>> {
  try {
    const raw = await fs.readFile(pendingOrdersFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writePendingOrders(orders: Array<Record<string, any>>) {
  await fs.mkdir(path.dirname(pendingOrdersFile), { recursive: true });
  await fs.writeFile(pendingOrdersFile, JSON.stringify(orders, null, 2), "utf8");
}

export async function savePendingOrder(orderId: string, bookingData: Record<string, any>) {
  const orders = await readPendingOrders();
  const next = orders.filter((order) => order.orderId !== orderId);
  next.push({ orderId, bookingData, createdAt: new Date().toISOString(), status: "Pending" });
  await writePendingOrders(next);
  return orderId;
}

export async function getPendingOrder(orderId: string) {
  const orders = await readPendingOrders();
  return orders.find((order) => order.orderId === orderId) || null;
}

export async function removePendingOrder(orderId: string) {
  const orders = await readPendingOrders();
  await writePendingOrders(orders.filter((order) => order.orderId !== orderId));
}

export function getPayHereCheckoutBaseUrl() {
  return process.env.NEXT_PUBLIC_PAYHERE_LIVE_MODE === "true"
    ? "https://www.payhere.lk/pay/checkout"
    : "https://sandbox.payhere.lk/pay/checkout";
}

export function getPayHereCheckoutHash(orderId: string, amount: number | string, currency: string, merchantSecret?: string) {
  const safeAmount = Number(amount).toFixed(2);
  const secret = merchantSecret ?? process.env.MERCHANT_SECRET ?? "";
  return crypto
    .createHash("md5")
    .update(`${secret}${process.env.MERCHANT_ID ?? ""}${orderId}${safeAmount}${currency}`)
    .digest("hex")
    .toUpperCase();
}

export function verifyPayHereSignature(payload: Record<string, any>) {
  const merchantSecret = process.env.MERCHANT_SECRET ?? "";
  const merchantId = String(payload.merchant_id ?? "");
  const orderId = String(payload.order_id ?? "");
  const amount = String(payload.payhere_amount ?? payload.amount ?? "0");
  const currency = String(payload.payhere_currency ?? payload.currency ?? "LKR");
  const statusCode = String(payload.status_code ?? "");
  const expected = crypto
    .createHash("md5")
    .update(`${merchantSecret}${merchantId}${orderId}${amount}${currency}${statusCode}`)
    .digest("hex")
    .toUpperCase();

  return expected === String(payload.md5sig ?? "").toUpperCase();
}

export async function initiateCardPaymentSession({
  paymentBrand,
  amount,
  currency,
  bookingData,
}: {
  paymentBrand: PaymentBrand;
  amount: number;
  currency: string;
  bookingData: Record<string, any>;
}) {
  if (!isCardPaymentGatewayConfigured()) {
    return {
      ok: false as const,
      error: getCardPaymentUnavailableMessage(paymentBrand),
    };
  }

  const orderId = `KOG-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const merchantId = process.env.MERCHANT_ID ?? "";
  const merchantSecret = process.env.MERCHANT_SECRET ?? "";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const orderAmount = Number(amount).toFixed(2);
  const hash = getPayHereCheckoutHash(orderId, orderAmount, currency, merchantSecret);

  await savePendingOrder(orderId, bookingData);

  const params = new URLSearchParams({
    merchant_id: merchantId,
    return_url: `${siteUrl}/payment/return?order_id=${encodeURIComponent(orderId)}`,
    cancel_url: `${siteUrl}/payment/cancel?order_id=${encodeURIComponent(orderId)}`,
    notify_url: `${siteUrl}/api/payhere/notify`,
    order_id: orderId,
    items: bookingData.productName ? String(bookingData.productName) : "Koggala Lake experience",
    currency,
    amount: orderAmount,
    first_name: String(bookingData.firstName || "Guest"),
    last_name: String(bookingData.lastName || "Customer"),
    email: String(bookingData.email || ""),
    phone: String(bookingData.phone || ""),
    address: String(bookingData.hotelAddress || bookingData.country || ""),
    city: String(bookingData.country || ""),
    country: String(bookingData.country || ""),
    custom_1: JSON.stringify(bookingData),
    custom_2: paymentBrand,
    hash,
  });

  return {
    ok: true as const,
    provider: "PayHere",
    paymentBrand,
    amount,
    currency,
    orderId,
    paymentUrl: `${getPayHereCheckoutBaseUrl()}?${params.toString()}`,
  };
}
