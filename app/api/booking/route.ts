import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  createBookingRecord,
  normalizeBookingStatus,
  normalizePaymentStatus,
  readBookings,
  validateBookingRequest,
  writeBookings,
} from "@/lib/booking-service";
import { notifyBookingCreated } from "@/lib/notifications/booking-notifications";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ ok: false, error: "Booking payload is invalid." }, { status: 400 });
  }

  try {
    const paymentMethod = String(body.paymentMethod || "").trim();

    if (paymentMethod !== "Pay on Arrival") {
      return NextResponse.json(
        {
          ok: false,
          error: "Online payment must be started through the payment checkout.",
        },
        { status: 402 }
      );
    }

    const validated = await validateBookingRequest(body);
    const booking = createBookingRecord(body, validated);
    const bookings = await readBookings();
    bookings.push(booking);
    await writeBookings(bookings);
    const notifications = await notifyBookingCreated(booking);

    return NextResponse.json({
      ok: true,
      booking,
      gatewayConfigured: false,
      notifications: {
        customerEmailAccepted: notifications.customerEmail.ok,
        ownerEmailAccepted: notifications.ownerEmail.ok,
      },
      message: booking.paymentMethod === "Pay on Arrival"
        ? "Booking reserved successfully. Payment status is Payment Pending and the full amount is due on arrival."
        : "Booking created successfully. Payment status remains pending until a real payment is verified.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking could not be created.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readBookings());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.id) {
    return NextResponse.json({ ok: false, error: "Booking identifier is required." }, { status: 400 });
  }

  const bookings = await readBookings();
  const index = bookings.findIndex((booking) => booking.id === body.id || booking.bookingReference === body.id);

  if (index === -1) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }

  const current = bookings[index];
  const updated = {
    ...current,
    ...body,
    bookingStatus: normalizeBookingStatus(body.bookingStatus || current.bookingStatus),
    paymentStatus: normalizePaymentStatus(body.paymentStatus || current.paymentStatus),
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = updated;
  await writeBookings(bookings);
  return NextResponse.json({ ok: true, booking: updated });
}
