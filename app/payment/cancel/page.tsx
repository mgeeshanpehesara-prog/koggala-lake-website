"use client";

export default function PaymentCancelPage() {
  return (
    <main className="page-shell payment-success-shell">
      <div className="booking-success" style={{ maxWidth: 640, margin: "4rem auto" }}>
        <div className="success-icon">!</div>
        <h3>Payment cancelled</h3>
        <p>Your payment was cancelled. No booking was confirmed until a successful payment is completed.</p>
      </div>
    </main>
  );
}
