import { NextResponse } from "next/server";
import { createBookingRecord, readBookings, validateBookingRequest, writeBookings } from "@/lib/booking-service";
import { getPendingOrder, removePendingOrder, verifyPayHereSignature } from "@/lib/payment-gateway";
import { notifyPaymentVerified } from "@/lib/notifications/booking-notifications";

export const dynamic = "force-dynamic";

function toNumber(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries(form.entries());
    const statusCode = String(data.status_code ?? "");
    const statusMessage = String(data.status_message ?? "");
    const orderId = String(data.order_id ?? "");
    const paymentId = String(data.payment_id ?? "");
    const amount = String(data.payhere_amount ?? data.amount ?? "0");
    const currency = String(data.payhere_currency ?? data.currency ?? "LKR");
    const merchantId = String(data.merchant_id ?? "");

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing order id." }, { status: 400 });
    }

    const pendingOrder = await getPendingOrder(orderId);
    if (!pendingOrder) {
      return NextResponse.json({ ok: false, error: "Pending PayHere order not found." }, { status: 404 });
    }

    const isValidCallback = verifyPayHereSignature({
      merchant_id: merchantId,
      order_id: orderId,
      payhere_amount: amount,
      payhere_currency: currency,
      status_code: statusCode,
      md5sig: String(data.md5sig ?? ""),
    });

    if (!isValidCallback) {
      await removePendingOrder(orderId);
      return NextResponse.json({ ok: false, error: "Invalid PayHere signature." }, { status: 400 });
    }

    const bookingData = pendingOrder.bookingData || {};
    const isSuccess = statusCode === "2" && statusMessage.toLowerCase().includes("success");
    const isCancelled = statusCode === "1" || statusCode === "0" || statusMessage.toLowerCase().includes("cancel");

    if (!isSuccess && !isCancelled) {
      await removePendingOrder(orderId);
      return NextResponse.json({ ok: false, error: "Payment not completed." }, { status: 402 });
    }

    if (isCancelled) {
      await removePendingOrder(orderId);
      return NextResponse.json({ ok: true, paymentStatus: "Cancelled", message: "Payment cancelled by customer." });
    }

    const payload = {
      ...bookingData,
      paymentMethod: "Pay Online - Full Amount",
      payhereOrderId: orderId,
      payherePaymentId: paymentId || "",
    };

    const validated = await validateBookingRequest(payload);
    const bookings = await readBookings();
    const duplicateIndex = bookings.findIndex((existing) => existing.payhereOrderId === orderId || existing.bookingReference === payload.bookingReference);
    const booking = duplicateIndex >= 0 ? { ...bookings[duplicateIndex] } : createBookingRecord(payload, validated);
    const amountPaid = Number(amount || 0);
    if (amountPaid < booking.totalAmount) {
      await removePendingOrder(orderId);
      return NextResponse.json({ ok: false, error: "Full payment is required." }, { status: 402 });
    }
    booking.paymentStatus = "Paid";
    booking.bookingStatus = "Confirmed";
    booking.amountPaid = amountPaid;
    booking.remainingBalance = 0;
    booking.payhereOrderId = orderId;
    booking.payherePaymentId = paymentId || booking.payherePaymentId || "";
    booking.gatewayConfigured = true;
    booking.updatedAt = new Date().toISOString();
    if (duplicateIndex >= 0) bookings[duplicateIndex] = booking; else bookings.push(booking);
    await writeBookings(bookings);
    await removePendingOrder(orderId);
    if (duplicateIndex < 0 || bookings[duplicateIndex]?.paymentStatus !== "Paid") await notifyPaymentVerified(booking);

    return NextResponse.json({ ok: true, paymentStatus: "Paid", booking });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "PayHere notification failed." }, { status: 500 });
  }
}
