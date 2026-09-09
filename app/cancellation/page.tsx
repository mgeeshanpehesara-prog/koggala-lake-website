import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Cancellation Policy" };

export default function CancellationPage() {
  return (
    <LegalPage title="Cancellation Policy">
      <p>
        This is a placeholder Cancellation Policy for Phase 1. Our full
        cancellation terms will be confirmed and published here once the
        booking engine is live.
      </p>
      <p>
        Until then, please message us on WhatsApp for flexible
        cancellation or rescheduling arrangements.
      </p>
    </LegalPage>
  );
}
