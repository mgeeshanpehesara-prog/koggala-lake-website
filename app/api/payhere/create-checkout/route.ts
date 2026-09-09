import { NextResponse } from "next/server";
import { initiateCardPaymentSession } from "@/lib/payment-gateway";
import { validateBookingRequest } from "@/lib/booking-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paymentBrand = body.paymentBrand === "mastercard" ? "mastercard" : "visa";
    await validateBookingRequest({ ...(body.bookingData || {}), paymentMethod: "Pay Online - Full Amount", paymentBrand });

    const result = await initiateCardPaymentSession({
      paymentBrand,
      amount: Number(body.amount || 0),
      currency: String(body.currency || "LKR"),
      bookingData: body.bookingData || {},
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 402 });
    }

    return NextResponse.json({
      ok: true,
      paymentUrl: result.paymentUrl,
      orderId: result.orderId,
      provider: result.provider,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not start PayHere checkout.",
      },
      { status: 500 }
    );
  }
}
