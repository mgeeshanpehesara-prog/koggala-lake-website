"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import { siteConfig } from "@/lib/site-config";
import DatePicker from "@/components/ui/DatePicker";
import type { PaymentBrand } from "@/lib/payment-gateway";
import { getTimeSlotCutoff, isTimeSlotBookable } from "@/lib/time-slots";

export default function BookingPanel({ product }: { product: Product }) {
  const { currency, displayPrice, convertAmount } = useCurrency();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"select" | "details" | "summary" | "payment">("select");
  const [paymentBrand, setPaymentBrand] = useState<PaymentBrand>("visa");
  const [paymentMode, setPaymentMode] = useState<"Pay Online" | "Pay on Arrival">("Pay Online");
  const [bookingId, setBookingId] = useState("");
  const [confirmation, setConfirmation] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiresHotelPickup = Boolean(product.requiresHotelPickupDropoff);

  const tier =
    product.pricingTiers?.find(
      (entry) => adults >= entry.minPeople && (entry.maxPeople === null || adults <= entry.maxPeople)
    ) ?? null;

  const unit = tier?.pricePerPerson ?? product.priceBase.amount;
  const total = Math.max(0, Number((unit * adults).toFixed(2)));
  const bookingTotal = Number(convertAmount(total, product.priceBase.currency).toFixed(2));
  const amountDueNow = paymentMode === "Pay on Arrival" ? 0 : bookingTotal;
  const amountDue = paymentMode === "Pay on Arrival" ? bookingTotal : 0;

  const whatsapp = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Booking request\n${product.name}\nName: ${firstName} ${lastName}\nDate: ${date}\nTime: ${time}\nAdults: ${adults}\nChildren: ${children}\nEmail: ${email}`
  )}`;

  async function handleCardPayment() {
    setError("");
    setIsSubmitting(true);

    if (!date || !time) {
      setError("Please select a valid date and departure time.");
      setIsSubmitting(false);
      return;
    }

    if (requiresHotelPickup && (!hotelName.trim() || !hotelAddress.trim())) {
      setError("Please complete the hotel or accommodation name and address.");
      setIsSubmitting(false);
      return;
    }

    if (email !== confirmEmail) {
      setError("Email addresses do not match.");
      setIsSubmitting(false);
      return;
    }

    const totalGuests = adults + children;
    const maxPeople = product.maxPeople ?? 0;
    if (maxPeople > 0 && totalGuests > maxPeople) {
      setError(`This booking exceeds the maximum capacity of ${maxPeople} guests.`);
      setIsSubmitting(false);
      return;
    }

    if (!product.timeSlots?.includes(time) || !isTimeSlotBookable(date, time, getTimeSlotCutoff(product.timeSlotCutoffs, time))) {
      setError("The selected time is not available for this product.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (paymentMode === "Pay on Arrival") {
        const response = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productSlug: product.slug,
            productName: product.name,
            date,
            time,
            adults,
            children,
            firstName,
            lastName,
            email,
            phone,
            country,
            ...(requiresHotelPickup ? { hotelName, hotelAddress } : {}),
            notes,
            paymentMethod: "Pay on Arrival",
            paymentType: paymentMode,
            currency,
            totalAmount: total,
            amountDueNow: 0,
            remainingBalance: bookingTotal,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) {
          setError(data.error || "Could not reserve this experience.");
          return;
        }
        const booking = data.booking;
        setBookingId(booking.id || booking.bookingReference);
        setConfirmation({
          bookingReference: booking.bookingReference,
          product: booking.productName,
          date: booking.date,
          time: booking.time,
          guests: `${booking.adults} adults, ${booking.children} children`,
          total: booking.totalAmount,
          amountPaid: booking.amountPaid,
          amountDue: booking.remainingBalance,
          currency: booking.currency,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          payOnArrival: true,
        });
        return;
      }

      const response = await fetch("/api/payhere/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentBrand,
          amount: bookingTotal,
          currency,
          bookingData: {
            productSlug: product.slug,
            productName: product.name,
            date,
            time,
            adults,
            children,
            firstName,
            lastName,
            email,
            phone,
            country,
            ...(requiresHotelPickup ? { hotelName, hotelAddress } : {}),
            notes,
            paymentMethod: "Pay Online - Full Amount",
            paymentBrand,
            paymentType: paymentMode,
            currency,
            totalAmount: total,
            amountDueNow: bookingTotal,
            remainingBalance: 0,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error || "Online card payment is not currently available.");
        setIsSubmitting(false);
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      setError("Online card payment is not currently available.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not start the payment flow.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="booking-panel">
      <div className="booking-price">
        <div>
          <span>From</span>
          <strong>{displayPrice(product.priceBase.amount, product.priceBase.currency)}</strong>
          <small>{product.priceBase.unit}</small>
        </div>
        <div className="rating-pill">
          ★ {product.rating} <span>({product.reviewCount})</span>
        </div>
      </div>

      {product.childrenFree && <div className="free-child">Children under 12 travel FREE</div>}

      {step === "select" && (
        <div className="booking-fields">
          <label>
            Date
            <DatePicker value={date} onChange={setDate} minDate={new Date()} placeholder="Select date" />
          </label>

          <label>
            Time
            <select value={time} onChange={(event) => setTime(event.target.value)}>
              <option value="">Choose exact time</option>
              {(product.timeSlots || []).map((slot) => {
                const available = !date || isTimeSlotBookable(date, slot, getTimeSlotCutoff(product.timeSlotCutoffs, slot));
                return <option key={slot} value={slot} disabled={!available}>{slot}{!available ? " (Unavailable)" : ""}</option>;
              })}
            </select>
          </label>

          <div className="guest-grid">
            <label>
              Adults
              <select value={adults} onChange={(event) => setAdults(Number(event.target.value))}>
                {Array.from({ length: product.maxPeople || 8 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </label>

            <label>
              Children
              <select value={children} onChange={(event) => setChildren(Number(event.target.value))}>
                {Array.from({ length: Math.min(6, product.maxPeople || 8) + 1 }, (_, index) => (
                  <option key={index} value={index}>{index}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="total-row">
            <span>Estimated total</span>
            <strong>{displayPrice(total, product.priceBase.currency)}</strong>
          </div>

          <button className="cta-button full" disabled={!date || !time} onClick={() => setStep("details")}>
            Continue to Guest Details →
          </button>
        </div>
      )}

      {step === "details" && (
        <div className="booking-fields">
          <label>
            First name *
            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="First name" />
          </label>

          <label>
            Last name *
            <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Last name" />
          </label>

          <label>
            Email *
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" />
          </label>

          <label>
            Confirm email *
            <input value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} type="email" required placeholder="Confirm email" />
          </label>

          <label>
            Phone / WhatsApp *
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+94 ..." />
          </label>

          <label>
            Country *
            <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" />
          </label>

          {requiresHotelPickup && (
            <>
              <label>
                Hotel / accommodation name
                <input value={hotelName} onChange={(event) => setHotelName(event.target.value)} placeholder="Hotel or accommodation" />
              </label>

              <label>
                Hotel / accommodation address
                <input value={hotelAddress} onChange={(event) => setHotelAddress(event.target.value)} placeholder="Street, city or area" />
              </label>
            </>
          )}

          <label>
            Special requests / notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anything we should know?" />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button
            className="cta-button full"
            disabled={!firstName || !lastName || !email || !confirmEmail || !phone || !country || (requiresHotelPickup && (!hotelName.trim() || !hotelAddress.trim()))}
            onClick={() => setStep("summary")}
          >
            Continue to Booking Summary →
          </button>
          <button className="back-button" onClick={() => setStep("select")}>← Back</button>
        </div>
      )}

      {step === "summary" && (
        <div className="booking-fields">
          <div className="payment-summary">
            <b>{product.name}</b>
            <span>
              {date} · {time} · {adults} adults · {children} children
            </span>
            <span>
              Guest: {firstName} {lastName} · {email} · {phone}
            </span>
            {requiresHotelPickup && (
              <>
                <span>Hotel: {hotelName || "Not provided"}</span>
                <span>Address: {hotelAddress || "Not provided"}</span>
              </>
            )}
            <span>Total: {displayPrice(total, product.priceBase.currency)}</span>
            <span>{paymentMode === "Pay on Arrival" ? "Amount due on arrival" : "Amount due now"}: {displayPrice(paymentMode === "Pay on Arrival" ? amountDue : amountDueNow, currency)}</span>
          </div>

          <button className="cta-button full" onClick={() => setStep("payment")}>
            Continue to Payment →
          </button>
          <button className="back-button" onClick={() => setStep("details")}>← Back</button>
        </div>
      )}

      {step === "payment" && !bookingId && (
        <div className="booking-fields">
          <div className="payment-summary">
            <b>Payment</b>
            <span>{product.name}</span>
            <span>
              {date} · {time} · {adults} adults · {children} children
            </span>
            <span>Total: {displayPrice(total, product.priceBase.currency)}</span>
            <span>{paymentMode === "Pay on Arrival" ? "Amount due on arrival" : "Amount due now"}: {displayPrice(paymentMode === "Pay on Arrival" ? amountDue : amountDueNow, currency)}</span>
          </div>

          <div className="pay-options">
            <button className={paymentMode === "Pay Online" ? "selected" : ""} onClick={() => setPaymentMode("Pay Online")}>
              <b>Pay Online - Full Amount</b>
              <span>Pay the full reservation total securely online.</span>
            </button>
            <button className={paymentMode === "Pay on Arrival" ? "selected" : ""} onClick={() => setPaymentMode("Pay on Arrival")}>
              <b>Reserve Now, Pay on Arrival</b>
              <span>Reserve your experience now and pay the full amount when you arrive at the boat location.</span>
            </button>
          </div>

          {paymentMode === "Pay Online" && <div className="pay-options">
            <button className={paymentBrand === "visa" ? "selected" : ""} onClick={() => setPaymentBrand("visa")}>
              <b>Visa</b>
              <span>Pay with Visa</span>
            </button>
            <button className={paymentBrand === "mastercard" ? "selected" : ""} onClick={() => setPaymentBrand("mastercard")}>
              <b>Mastercard</b>
              <span>Pay with Mastercard</span>
            </button>
          </div>}

          {error && <p className="error-message">{error}</p>}

          <button className={paymentMode === "Pay on Arrival" ? "cta-button full" : "card-button"} onClick={handleCardPayment} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : paymentMode === "Pay on Arrival" ? "Reserve Now" : `💳 Pay with ${paymentBrand === "visa" ? "Visa" : "Mastercard"}`}
            <span>{displayPrice(paymentMode === "Pay on Arrival" ? amountDue : amountDueNow, currency)}</span>
          </button>

          <a className="whatsapp-button" href={whatsapp} target="_blank" rel="noreferrer">
            Confirm details on WhatsApp ↗
          </a>

          <p className="secure-note">
            {paymentMode === "Pay on Arrival" ? "Your reservation will be saved immediately. Payment is due in full when you arrive at the boat location." : "Your booking is confirmed after the payment provider verifies the transaction."}
          </p>

          <button className="back-button" onClick={() => setStep("summary")}>← Back</button>
        </div>
      )}

      {bookingId && confirmation && (
        <div className="booking-success">
          <div className="success-icon">✓</div>
          <h3>{confirmation.testMode ? "Booking Saved in Test Mode" : "Booking Confirmed"}</h3>
          <p>
            Your booking reference is <b>{confirmation.bookingReference}</b>.
          </p>
          <p><strong>Product:</strong> {confirmation.product}</p>
          <p><strong>Date:</strong> {confirmation.date}</p>
          <p><strong>Time:</strong> {confirmation.time}</p>
          <p><strong>Guests:</strong> {confirmation.guests}</p>
          <p><strong>Total:</strong> {displayPrice(confirmation.total, confirmation.currency || currency)}</p>
          <p><strong>Amount paid:</strong> {displayPrice(confirmation.amountPaid, confirmation.currency || currency)}</p>
          <p><strong>Amount due:</strong> {displayPrice(confirmation.amountDue ?? confirmation.remainingBalance ?? 0, confirmation.currency || currency)}</p>
          {confirmation.paymentMethod && <p><strong>Payment method:</strong> {confirmation.paymentMethod}</p>}
          {confirmation.paymentStatus && <p><strong>Payment status:</strong> {confirmation.paymentStatus}</p>}
          <p>
            {confirmation.payOnArrival
              ? "Your experience is reserved. Please pay the full amount when you arrive at the boat location. A confirmation email has been sent to you."
              : confirmation.gatewayConfigured
              ? "Payment was confirmed by the gateway."
              : "Payment gateway not configured yet. This booking was saved in test mode and no verified payment has been received."}
          </p>
          <a className="whatsapp-button" href={whatsapp} target="_blank" rel="noreferrer">
            Send booking to WhatsApp ↗
          </a>
        </div>
      )}
    </div>
  );
}

