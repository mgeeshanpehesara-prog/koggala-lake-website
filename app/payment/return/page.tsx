"use client";

import { useEffect, useState } from "react";

export default function PaymentReturnPage() {
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      setMessage("Payment status could not be verified.");
      return;
    }

    setMessage(`Your payment is being verified for order ${orderId}. Please check your booking status in the admin dashboard or contact us on WhatsApp.`);
  }, []);

  return (
    <main className="page-shell payment-success-shell">
      <div className="booking-success" style={{ maxWidth: 640, margin: "4rem auto" }}>
        <div className="success-icon">✓</div>
        <h3>Payment status update</h3>
        <p>{message}</p>
      </div>
    </main>
  );
}
