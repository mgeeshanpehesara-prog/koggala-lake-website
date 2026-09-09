import type { Booking } from "@/lib/types";

export interface BookingEmailData {
  booking: Booking;
  businessName: string;
  totalLkr: number;
  duration: string;
  meetingPoint: string;
  boatPlaceName: string;
  boatPlaceDescription: string;
  boatPlaceUrl: string;
  ownerWhatsApp: string;
  contactPhone: string;
  contactEmail: string;
  instructions: string;
}

const escapeHtml = (value: unknown) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const date = (value: string) => {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
};

const dateTime = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });
};

const money = (booking: Booking, amount: number) => `${booking.currency} ${Number(amount || 0).toFixed(2)}`;
const isPaid = (booking: Booking) => booking.paymentStatus === "Paid";
const isArrival = (booking: Booking) => booking.paymentMethod === "Pay on Arrival";

const header = () => `
  <header style="padding:32px 28px;background:#092b34;color:#f8f1e5;text-align:center;border-bottom:4px solid #2dd4bf;">
    <div style="font-size:12px;letter-spacing:3px;color:#7de8d4;font-weight:700;">KOGGALA LAKE</div>
    <div style="margin-top:8px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:1px;">BOAT SAFARI &amp; KAYAK ADVENTURE</div>
    <div style="margin-top:7px;font-size:13px;letter-spacing:3px;color:#d9c9aa;font-weight:700;">WITH MALISH</div>
  </header>`;

const shell = (content: string, preheader: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(preheader)}</title></head>
<body style="margin:0;background:#eef3f1;color:#17343b;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef3f1;padding:24px 10px;">
    <tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(9,43,52,.12);">${header()}${content}</table></td></tr>
  </table>
</body></html>`;

const section = (title: string, content: string) => `<section style="padding:22px 28px;border-bottom:1px solid #e4ece9;"><h2 style="margin:0 0 15px;color:#0b5c62;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;">${title}</h2>${content}</section>`;
const row = (label: string, value: string) => `<tr><td style="padding:6px 12px 6px 0;color:#6b7d80;font-size:13px;vertical-align:top;width:42%;">${label}</td><td style="padding:6px 0;color:#17343b;font-size:14px;font-weight:600;vertical-align:top;">${value}</td></tr>`;
const table = (rows: string[]) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows.join("")}</table>`;
const notes = (value: string) => `<div style="padding:14px 16px;border-left:4px solid #f1b75b;background:#fff8e9;color:#4c3c21;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(value)}</div>`;

const paymentBlock = (data: BookingEmailData) => {
  const { booking, totalLkr } = data;
  if (isArrival(booking)) {
    return `<div style="padding:16px;border-radius:12px;background:#fff8e9;border:1px solid #f1d79b;"><div style="color:#8a5b11;font-size:13px;font-weight:800;letter-spacing:1px;">PAYMENT: PAY ON ARRIVAL</div>${table([row("Amount to Pay on Arrival", escapeHtml(money(booking, booking.totalAmount))), row("LKR Equivalent", `LKR ${totalLkr.toFixed(2)}`)])}</div>`;
  }
  return `<div style="padding:16px;border-radius:12px;background:#e8faf5;border:1px solid #a8e7d3;"><div style="color:#08745f;font-size:13px;font-weight:800;letter-spacing:1px;">PAYMENT STATUS: PAID &#10003;</div>${table([row("Total Paid", escapeHtml(money(booking, booking.totalAmount))), row("LKR Equivalent", `LKR ${totalLkr.toFixed(2)}`)])}</div>`;
};

export function customerBookingEmail(data: BookingEmailData) {
  const { booking } = data;
  const title = isArrival(booking) ? "YOUR BOOKING IS RESERVED 🎉" : "YOUR BOOKING IS CONFIRMED 🎉";
  const specialRequest = booking.notes.trim() ? section("Your Special Request", notes(booking.notes)) : "";
  const locationButton = data.boatPlaceUrl ? `<p style="margin:16px 0 0;"><a href="${escapeHtml(data.boatPlaceUrl)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#0b7774;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">OPEN MEETING LOCATION</a></p>` : "";
  const content = `<div style="padding:28px 28px 12px;"><h1 style="margin:0;color:#092b34;font-size:25px;line-height:1.2;">${title}</h1><p style="margin:10px 0 0;color:#5d7073;font-size:15px;line-height:1.6;">Thank you, ${escapeHtml(booking.firstName)}. We look forward to welcoming you to Koggala Lake.</p></div>
    ${section("Booking Details", table([
      row("Booking Reference", escapeHtml(booking.bookingReference)), row("Experience", escapeHtml(booking.productName)), row("Activity Date", escapeHtml(date(booking.date))), row("Selected Time Slot", escapeHtml(booking.time)), row("Activity Start Time", escapeHtml(booking.time)), row("Duration", escapeHtml(data.duration || "Not provided")), row("Number of Guests", `${booking.adults + booking.children} (${booking.adults} adults, ${booking.children} children)`), ...(booking.notes.trim() ? [row("Selected Add-ons / Options", escapeHtml(booking.notes))] : []),
    ]))}
    ${specialRequest}
    ${section("Payment Information", paymentBlock(data))}
    ${section("Meeting Location", `<div style="font-size:17px;font-weight:700;color:#17343b;">${escapeHtml(data.boatPlaceName || data.meetingPoint)}</div><p style="margin:8px 0;color:#5d7073;font-size:14px;line-height:1.6;">${escapeHtml(data.boatPlaceDescription || data.instructions)}</p>${locationButton}`)}
    ${section("Need Help?", `<p style="margin:0;color:#5d7073;font-size:14px;line-height:1.7;">WhatsApp: <a href="https://wa.me/${escapeHtml(data.ownerWhatsApp.replace(/\D/g, ""))}" style="color:#08745f;">${escapeHtml(data.ownerWhatsApp)}</a><br>Phone: ${escapeHtml(data.contactPhone)}<br>Email: <a href="mailto:${escapeHtml(data.contactEmail)}" style="color:#08745f;">${escapeHtml(data.contactEmail)}</a></p>`)}
    <footer style="padding:22px 28px;background:#f6faf8;color:#718286;font-size:12px;line-height:1.6;">${escapeHtml(data.instructions)}<br><br>${escapeHtml(data.businessName)}</footer>`;
  return shell(content, title);
}

export function ownerBookingEmail(data: BookingEmailData) {
  const { booking } = data;
  const specialRequest = booking.notes.trim() ? notes(booking.notes) : `<p style="margin:0;color:#6b7d80;font-size:14px;">No special requests provided.</p>`;
  const content = `<div style="padding:28px 28px 12px;"><h1 style="margin:0;color:#092b34;font-size:25px;line-height:1.2;">NEW BOOKING RECEIVED 🎉</h1><p style="margin:10px 0 0;color:#5d7073;font-size:14px;">Actionable booking information for ${escapeHtml(data.businessName)}.</p></div>
    ${section("Customer Details", table([row("Customer Name", escapeHtml(`${booking.firstName} ${booking.lastName}`)), row("Customer Email", escapeHtml(booking.email)), row("Customer Phone / WhatsApp", escapeHtml(booking.phone)), row("Nationality", escapeHtml(booking.country || "Not provided"))]))}
    ${section("Booking Details", table([row("Booking Reference", escapeHtml(booking.bookingReference)), row("Experience / Product", escapeHtml(booking.productName)), row("Activity Date", escapeHtml(date(booking.date))), row("Selected Time Slot", escapeHtml(booking.time)), row("Activity Start Time", escapeHtml(booking.time)), row("Duration", escapeHtml(data.duration || "Not provided")), row("Number of Adults", String(booking.adults)), row("Number of Children", String(booking.children)), row("Total Guests", String(booking.adults + booking.children)), row("Selected Add-ons / Options", escapeHtml(booking.notes || "Not provided")), row("Booking Created Date and Time", escapeHtml(dateTime(booking.createdAt)))]))}
    ${section("Customer Special Requests", specialRequest)}
    ${section("Payment Information", paymentBlock(data))}
    ${section("Location / Pickup", table([row("Boat Place / Meeting Point", escapeHtml(data.boatPlaceName || data.meetingPoint)), row("Meeting Instructions", escapeHtml(data.boatPlaceDescription || data.instructions)), row("Pickup Status", booking.hotelName ? "Pickup requested" : "No pickup requested"), row("Hotel / Accommodation", escapeHtml(booking.hotelName || "Not provided")), row("Pickup Location", escapeHtml(booking.hotelAddress || "Not provided"))]))}
    <footer style="padding:22px 28px;background:#f6faf8;color:#718286;font-size:12px;line-height:1.6;">${escapeHtml(data.businessName)}<br>Owner notification generated from the current booking and location settings.</footer>`;
  return shell(content, `New booking ${booking.bookingReference}`);
}

const textPayment = (data: BookingEmailData) => isArrival(data.booking)
  ? `PAYMENT: PAY ON ARRIVAL\nAmount to Pay on Arrival: ${money(data.booking, data.booking.totalAmount)}\nLKR Equivalent: LKR ${data.totalLkr.toFixed(2)}`
  : `PAYMENT STATUS: PAID ✓\nTotal Paid: ${money(data.booking, data.booking.totalAmount)}\nLKR Equivalent: LKR ${data.totalLkr.toFixed(2)}`;

export function customerBookingText(data: BookingEmailData) {
  const { booking } = data;
  return [
    isArrival(booking) ? "YOUR BOOKING IS RESERVED" : "YOUR BOOKING IS CONFIRMED",
    "",
    `Booking Reference: ${booking.bookingReference}`,
    `Experience: ${booking.productName}`,
    `Activity Date: ${date(booking.date)}`,
    `Selected Time Slot: ${booking.time}`,
    `Activity Start Time: ${booking.time}`,
    `Duration: ${data.duration || "Not provided"}`,
    `Number of Guests: ${booking.adults + booking.children}`,
    booking.notes.trim() ? `Selected Add-ons / Options: ${booking.notes}` : "",
    booking.notes.trim() ? `YOUR SPECIAL REQUEST:\n${booking.notes}` : "",
    "",
    textPayment(data),
    "",
    "MEETING LOCATION",
    data.boatPlaceName || data.meetingPoint,
    data.boatPlaceDescription || data.instructions,
    data.boatPlaceUrl ? `Open Meeting Location: ${data.boatPlaceUrl}` : "",
    "",
    "NEED HELP?",
    `WhatsApp: ${data.ownerWhatsApp}`,
    `Phone: ${data.contactPhone}`,
    `Email: ${data.contactEmail}`,
  ].filter(Boolean).join("\n");
}

export function ownerBookingText(data: BookingEmailData) {
  const { booking } = data;
  return [
    "NEW BOOKING RECEIVED",
    "",
    "CUSTOMER DETAILS",
    `Customer Name: ${booking.firstName} ${booking.lastName}`,
    `Customer Email: ${booking.email}`,
    `Customer Phone / WhatsApp: ${booking.phone}`,
    `Nationality: ${booking.country || "Not provided"}`,
    "",
    "BOOKING DETAILS",
    `Booking Reference: ${booking.bookingReference}`,
    `Experience / Product: ${booking.productName}`,
    `Activity Date: ${date(booking.date)}`,
    `Selected Time Slot: ${booking.time}`,
    `Activity Start Time: ${booking.time}`,
    `Duration: ${data.duration || "Not provided"}`,
    `Number of Adults: ${booking.adults}`,
    `Number of Children: ${booking.children}`,
    `Total Guests: ${booking.adults + booking.children}`,
    `Selected Add-ons / Options: ${booking.notes || "Not provided"}`,
    `Booking Created Date and Time: ${dateTime(booking.createdAt)}`,
    "",
    "CUSTOMER SPECIAL REQUESTS",
    booking.notes || "No special requests provided.",
    "",
    "PAYMENT INFORMATION",
    textPayment(data),
    "",
    "LOCATION / PICKUP",
    `Boat Place / Meeting Point: ${data.boatPlaceName || data.meetingPoint}`,
    `Meeting Instructions: ${data.boatPlaceDescription || data.instructions}`,
    `Pickup Status: ${booking.hotelName ? "Pickup requested" : "No pickup requested"}`,
    `Hotel / Accommodation: ${booking.hotelName || "Not provided"}`,
    `Pickup Location: ${booking.hotelAddress || "Not provided"}`,
  ].join("\n");
}
