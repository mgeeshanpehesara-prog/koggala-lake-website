import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This is a placeholder Privacy Policy for Phase 1. A complete policy
        covering data collection, storage and booking information will be
        published once the booking system and admin dashboard are built in
        a later phase.
      </p>
      <p>
        For any questions about your data in the meantime, please contact us
        directly via WhatsApp or email.
      </p>
    </LegalPage>
  );
}
