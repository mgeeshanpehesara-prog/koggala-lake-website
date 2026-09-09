import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        This is a placeholder Terms &amp; Conditions page for Phase 1. Full
        terms covering bookings, payments and liability will be added once
        the booking and payment systems are implemented in a later phase.
      </p>
      <p>
        Please contact us directly via WhatsApp or email if you have
        questions before booking.
      </p>
    </LegalPage>
  );
}
