import { promises as fs } from "fs";
import path from "path";
import type { Booking } from "@/lib/types";
import { getAllProducts } from "@/lib/data/product-store";
import { getWebsiteContent } from "@/lib/data/website-content-store";
import { convertPrice } from "@/lib/currency/currency";
import { getCurrencyRates } from "@/lib/currency/rate-service";
import { customerBookingEmail, customerBookingText, ownerBookingEmail, ownerBookingText, type BookingEmailData } from "@/lib/notifications/booking-email-templates";

const RESEND_URL = "https://api.resend.com/emails";
const WHATSAPP_URL = "https://graph.facebook.com/v20.0";
const stateFile = path.join(process.cwd(), "data", "booking-notifications.json");

type NotificationState = Record<string, { reservationEmail?: boolean; reservationWhatsApp?: boolean; ownerEmail?: boolean; ownerWhatsApp?: boolean; paymentEmail?: boolean; paymentWhatsApp?: boolean; paymentOwnerEmail?: boolean; paymentOwnerWhatsApp?: boolean }>;
type EmailResult = { ok: boolean; providerId?: string; error?: string; status?: number };
type BookingNotificationResult = { customerEmail: EmailResult; ownerEmail: EmailResult };

async function readState(): Promise<NotificationState> {
  try { return JSON.parse(await fs.readFile(stateFile, "utf8")) as NotificationState; } catch { return {}; }
}
async function writeState(state: NotificationState) { await fs.mkdir(path.dirname(stateFile), { recursive: true }); await fs.writeFile(stateFile, JSON.stringify(state, null, 2), "utf8"); }
function money(booking: Booking, amount: number) { return `${booking.currency} ${Number(amount || 0).toFixed(2)}`; }
function status(booking: Booking) { return booking.paymentStatus === "Paid" ? "PAID" : booking.paymentStatus || "PAYMENT PENDING"; }
function displayDate(value: string) { const parsed = new Date(`${value}T00:00:00`); return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }); }
function details(booking: Booking, locations: string, instructions: string, whatsapp: string, totalLkr: number, meetingPoint: string, duration: string) {
  return [
    "Koggala Lake Boat Safari with Malish",
    "",
    `Booking Reference: ${booking.bookingReference}`,
    `Customer Name: ${booking.firstName} ${booking.lastName}`,
    `Customer Email: ${booking.email}`,
    `Phone / WhatsApp: ${booking.phone}`,
    `Experience / Product: ${booking.productName}`,
    `Activity Date: ${displayDate(booking.date)}`,
    `Booking Date and Time: ${new Date(booking.createdAt).toLocaleString("en-GB")}`,
    `Selected Time Slot: ${booking.time}`,
    `Activity Start Time: ${booking.time}`,
    `Duration: ${duration || "Not provided"}`,
    `Nationality: ${booking.country || "Not provided"}`,
    `Number of Guests: ${booking.adults + booking.children} (${booking.adults} adults, ${booking.children} children)`,
    `Number of Adults: ${booking.adults}`,
    `Number of Children: ${booking.children}`,
    `Selected Options / Add-ons: ${booking.notes || "Not provided"}`,
    `Customer Selected Currency: ${booking.currency}`,
    `Total Price in Customer Currency: ${money(booking, booking.totalAmount)}`,
    `Equivalent Total Price in LKR: LKR ${totalLkr.toFixed(2)}`,
    `Amount Paid: ${money(booking, booking.amountPaid)}`,
    `Amount Due: ${money(booking, booking.remainingBalance)}`,
    `Payment Method: ${booking.paymentMethod || "Not provided"}`,
    `Payment Status: ${status(booking)}`,
    `Booking Status: ${booking.bookingStatus}`,
    `Meeting Point: ${meetingPoint || "Not provided"}`,
    `Hotel / Accommodation: ${booking.hotelName || "Not provided"}`,
    `Pickup Location: ${booking.hotelAddress || "Not provided"}`,
    `Pickup Information: ${booking.hotelName ? "Hotel pickup requested" : "No hotel pickup requested"}`,
    `Boat Location:\n${locations || "Not provided"}`,
    `Important Booking Information:\n${instructions || "Please arrive at the boat location before your selected time."}`,
    `WhatsApp Contact: ${whatsapp || "Contact the business through the website"}`,
    `Additional Requests / Notes: ${booking.notes || "No additional requests provided."}`,
  ].join("\n");
}
async function sendEmail(to: string, subject: string, text: string, html: string): Promise<EmailResult> {
  const provider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();
  const key = process.env.RESEND_API_KEY; const from = process.env.EMAIL_FROM;
  if (provider !== "resend") return { ok: false, error: `Unsupported email provider: ${provider}` };
  if (!key || !from || !to) return { ok: false, error: "Missing RESEND_API_KEY, EMAIL_FROM, or recipient email." };
  if (from.toLowerCase().includes("onboarding@resend.dev")) {
    console.warn("[booking-email] EMAIL_FROM uses Resend sandbox sender onboarding@resend.dev; arbitrary customer delivery may be restricted. Verify a sending domain and use that domain in EMAIL_FROM for production.");
  }

  try {
    const response = await fetch(RESEND_URL, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject, text, html }) });
    const body = await response.json().catch(() => null) as { id?: string; message?: string; error?: string } | null;
    if (!response.ok) {
      return { ok: false, status: response.status, error: body?.message || body?.error || `Resend rejected the email with HTTP ${response.status}.` };
    }
    return { ok: true, status: response.status, providerId: body?.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Email request failed." };
  }
}
async function sendWhatsApp(to: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN; const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId || !to) return false;
  const response = await fetch(`${WHATSAPP_URL}/${phoneId}/messages`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to: to.replace(/[^\d]/g, ""), type: "text", text: { body: text } }) });
  return response.ok;
}
async function markSent(booking: Booking, key: keyof NonNullable<NotificationState[string]>) {
  const state = await readState(); state[booking.bookingReference] = { ...(state[booking.bookingReference] || {}), [key]: true }; await writeState(state);
}
async function notify(booking: Booking, payment: boolean): Promise<BookingNotificationResult> {
  const content = await getWebsiteContent(); const settings = content.bookingNotifications; const configuredOwnerEmail = process.env.BOOKING_OWNER_EMAIL || settings.ownerEmail; const locationText = [content.locations.ticketOffice.enabled && `${content.locations.ticketOffice.name}: ${content.locations.ticketOffice.description}${content.locations.ticketOffice.url ? `\n${content.locations.ticketOffice.buttonText}: ${content.locations.ticketOffice.url}` : ""}`, content.locations.boatPlace.enabled && `${content.locations.boatPlace.name}: ${content.locations.boatPlace.description}${content.locations.boatPlace.url ? `\n${content.locations.boatPlace.buttonText}: ${content.locations.boatPlace.url}` : ""}`].filter(Boolean).join("\n");
  const businessName = process.env.BUSINESS_NAME || "Koggala Lake Boat Safari with Malish";
  const product = (await getAllProducts()).find((item) => item.slug === booking.productSlug);
  const rates = await getCurrencyRates();
  const totalLkr = convertPrice(booking.totalAmount, booking.currency, "LKR", rates.rates);
  const text = details(booking, locationText, settings.bookingInstructions, settings.ownerWhatsApp, totalLkr, product?.meetingPoint || content.general.meetingPoint, product?.duration || "Not provided");
  const emailData: BookingEmailData = {
    booking,
    businessName,
    totalLkr,
    duration: product?.duration || "Not provided",
    meetingPoint: product?.meetingPoint || content.general.meetingPoint,
    boatPlaceName: content.locations.boatPlace.enabled ? content.locations.boatPlace.name : content.general.meetingPoint,
    boatPlaceDescription: content.locations.boatPlace.enabled ? content.locations.boatPlace.description : settings.bookingInstructions,
    boatPlaceUrl: content.locations.boatPlace.enabled ? content.locations.boatPlace.url : "",
    ownerWhatsApp: settings.ownerWhatsApp || content.general.whatsappNumber,
    contactPhone: content.general.contactPhone,
    contactEmail: content.general.email,
    instructions: settings.bookingInstructions,
  };
  const customerHtml = customerBookingEmail(emailData);
  const ownerHtml = ownerBookingEmail(emailData);
  const customerText = customerBookingText(emailData);
  const ownerText = ownerBookingText(emailData);
  const state = await readState(); const current = state[booking.bookingReference] || {};
  const customerEmailKey = payment ? "paymentEmail" : "reservationEmail";
  const ownerEmailKey = payment ? "paymentOwnerEmail" : "ownerEmail";
  const customerAlreadySent = current[customerEmailKey];
  const ownerAlreadySent = current[ownerEmailKey];
  const customerEmail = customerAlreadySent ? { ok: true, error: "Already sent for this booking." } : await sendEmail(booking.email, `${payment ? "Booking Confirmed" : businessName} - Booking ${booking.bookingReference}`, customerText, customerHtml);
  console.info(`[booking-email] customer ${booking.bookingReference} to ${booking.email}: ${customerEmail.ok ? "accepted" : "failed"}${customerEmail.providerId ? ` (${customerEmail.providerId})` : ""}${customerEmail.error ? ` - ${customerEmail.error}` : ""}`);
  if (customerEmail.ok && !customerAlreadySent) await markSent(booking, customerEmailKey);
  if (!payment && !current.reservationWhatsApp) { if (await sendWhatsApp(booking.phone, `BOOKING CONFIRMATION\n\n${text}`)) await markSent(booking, "reservationWhatsApp"); }
  const ownerResult = ownerAlreadySent ? { ok: true, error: "Already sent for this booking." } : await sendEmail(configuredOwnerEmail, `${payment ? "Payment received" : "New Booking Notification"} - ${booking.bookingReference}`, ownerText, ownerHtml);
  console.info(`[booking-email] owner ${booking.bookingReference} to ${configuredOwnerEmail}: ${ownerResult.ok ? "accepted" : "failed"}${ownerResult.providerId ? ` (${ownerResult.providerId})` : ""}${ownerResult.error ? ` - ${ownerResult.error}` : ""}`);
  if (ownerResult.ok && !ownerAlreadySent) await markSent(booking, ownerEmailKey);
  if (!payment && !current.ownerWhatsApp) { if (await sendWhatsApp(settings.ownerWhatsApp, `NEW BOOKING RECEIVED\n\n${text}`)) await markSent(booking, "ownerWhatsApp"); }
  if (payment && !current.paymentWhatsApp) { if (await sendWhatsApp(booking.phone, `BOOKING CONFIRMATION\n\n${text}`)) await markSent(booking, "paymentWhatsApp"); }
  if (payment && !current.paymentOwnerWhatsApp) { if (await sendWhatsApp(settings.ownerWhatsApp, `PAYMENT RECEIVED\n\n${text}`)) await markSent(booking, "paymentOwnerWhatsApp"); }
  return { customerEmail, ownerEmail: ownerResult };
}
export async function notifyBookingCreated(booking: Booking) { return notify(booking, false); }
export async function notifyPaymentVerified(booking: Booking) { return notify(booking, true); }
