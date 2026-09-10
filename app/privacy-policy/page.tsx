import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Koggala Lake Boat Safari & Kayak Adventure with Malish handles personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-xs uppercase tracking-wide text-teal-400">Last updated: 10 September 2026</p>

      <p>
        Koggala Lake Boat Safari &amp; Kayak Adventure with Malish respects your privacy. This policy explains how we collect, use, store, and share personal information when you browse our website, contact us, or book a private boat safari, kayak adventure, or guided nature and wildlife tour.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Information we collect</h2>
      <p>Depending on your interaction with us, we may collect:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Your name, email address, telephone or WhatsApp number, and preferred language.</li>
        <li>Booking details such as activity, date, time, number of guests, meeting point, and special requests.</li>
        <li>Payment and transaction details needed to confirm or reconcile a booking. We do not need to receive or store your full card number when payment is handled by a payment provider.</li>
        <li>Messages, feedback, reviews, and other information you choose to send us.</li>
        <li>Basic technical information such as device, browser, approximate location, and pages viewed when provided through website analytics or security tools.</li>
      </ul>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">How we use information</h2>
      <p>We use personal information to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Process, confirm, manage, and communicate with you about bookings.</li>
        <li>Provide the requested tour or activity and respond to questions or support requests.</li>
        <li>Process payments, refunds, rescheduling, and operational notifications.</li>
        <li>Protect guests, staff, vessels, equipment, and the website from fraud or misuse.</li>
        <li>Improve our services, understand website use, and comply with legal or accounting obligations.</li>
      </ul>
      <p>
        We send marketing messages only where permitted and where you have given appropriate consent. You can ask us to stop marketing communications at any time.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Sharing information</h2>
      <p>
        We do not sell your personal information. We may share the minimum information needed with trusted service providers such as payment processors, booking or communication providers, technology and hosting providers, insurers, professional advisers, or public authorities where required by law. Third-party booking platforms may process your information under their own privacy policies.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Payments and security</h2>
      <p>
        Payment information may be handled directly by a third-party payment provider using its secure systems. We use reasonable technical and organisational measures to protect information, but no online transmission or storage system can be guaranteed to be completely secure. Please do not send full card numbers, passwords, or other sensitive payment information through WhatsApp or ordinary email.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Retention and your choices</h2>
      <p>
        We keep booking and transaction records for as long as reasonably necessary to provide services, handle disputes, meet tax and accounting requirements, and protect our legitimate business interests. You may ask us to access, correct, delete, or explain our use of your personal information, subject to legal and operational limits. You may also object to certain uses or withdraw consent where consent is the legal basis.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Children and external links</h2>
      <p>
        Our activities may welcome families, but bookings should be made by an adult or with the involvement of a parent or responsible guardian. Our website may link to third-party sites and services. We are not responsible for their privacy practices, content, or security.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Contact information</h2>
      <p>
        For privacy questions or requests, contact Koggala Lake Boat Safari &amp; Kayak Adventure with Malish:
      </p>
      <p>
        Phone or WhatsApp: {siteConfig.whatsapp}<br />
        Email: {siteConfig.email}<br />
        Location: Koggala Lake, Sri Lanka
      </p>
    </LegalPage>
  );
}
