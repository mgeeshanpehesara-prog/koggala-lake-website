import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for booking Koggala Lake boat safaris, kayak adventures, and guided tours.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p className="text-xs uppercase tracking-wide text-teal-400">Last updated: 10 September 2026</p>

      <p>
        These terms apply to bookings and participation in private boat safaris, kayak adventures, and guided nature and wildlife tours provided by Koggala Lake Boat Safari &amp; Kayak Adventure with Malish in Sri Lanka. By making a booking, you confirm that you have read and accepted these terms.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Booking and payment</h2>
      <p>
        A booking is accepted when we or an authorised booking platform send confirmation. Prices, currency, inclusions, meeting point, date, start time, duration, and guest numbers are those shown in the booking confirmation. Full payment or the stated deposit is required by the deadline provided. A reservation may be released if payment is not received on time. Payment-provider or marketplace terms may also apply.
      </p>
      <p>
        Please provide accurate contact details and tell us before the activity about relevant requirements, including mobility needs, allergies, medical conditions, pregnancy, or children in the group. We will handle such information discreetly and advise whether a suitable arrangement is available.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Cancellations, refunds, and changes</h2>
      <p>
        Customer cancellations, refunds, no-shows, weather decisions, and changes to activities are handled under our <a href="/return-policy" className="text-teal-400 hover:text-teal-300">Cancellation &amp; Refund Policy</a>. If you book through a third-party platform, that platform&apos;s cancellation and payment rules may take priority.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Customer responsibility</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Arrive at the confirmed meeting point at least 15 minutes before departure, unless told otherwise.</li>
        <li>Follow instructions from the guide, boat operator, and activity staff at all times.</li>
        <li>Take care of personal belongings and use only equipment provided or approved by us.</li>
        <li>Do not attend under the influence of alcohol or drugs, or behave in a way that puts anyone at risk.</li>
        <li>Respect local communities, wildlife, waterways, protected areas, and conservation guidance.</li>
        <li>Pay for loss or damage caused by deliberate or negligent misuse of equipment, subject to applicable law.</li>
      </ul>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Safety requirements</h2>
      <p>
        Guests must wear a life jacket when instructed and must remain seated or positioned as directed on the boat or kayak. Children must be supervised by a responsible adult. Guests should wear suitable clothing, sun protection, and secure footwear, and bring drinking water and any essential medication. Participation may be refused or ended if a guest cannot safely follow instructions, is medically unfit, or is intoxicated. Tell us before departure about any condition that could affect safe participation.
      </p>
      <p>
        Water-based activities involve inherent risks, including slipping, falling, drowning, changing weather, insects, uneven access points, and contact with natural environments. We take reasonable safety precautions, but guests participate voluntarily and must act responsibly.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Weather and operational changes</h2>
      <p>
        Routes, vessels, guides, departure times, or activities may change because of weather, water conditions, safety concerns, conservation requirements, equipment issues, or circumstances outside our reasonable control. We will make reasonable efforts to provide the confirmed experience or a suitable alternative. Unsafe activities may be delayed, shortened, rescheduled, or cancelled in accordance with our Cancellation &amp; Refund Policy.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Liability</h2>
      <p>
        To the extent permitted by Sri Lankan law, we are not responsible for loss, damage, delay, injury, or expense caused by a guest&apos;s failure to follow instructions, inaccurate information, late arrival, personal belongings, or circumstances outside our reasonable control. Nothing in these terms excludes or limits liability that cannot legally be excluded or limited. Our responsibility for a cancelled service is generally limited to the amount paid for that affected service.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Privacy and communications</h2>
      <p>
        We use booking and contact information as described in our <a href="/privacy-policy" className="text-teal-400 hover:text-teal-300">Privacy Policy</a>. You agree that we may contact you about your booking using the phone number, WhatsApp account, or email address you provide.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Governing law and contact</h2>
      <p>
        These terms are governed by the laws of Sri Lanka. We will first try to resolve any concern directly and fairly. If you have a question about these terms or your booking, contact us:
      </p>
      <p>
        Phone or WhatsApp: {siteConfig.whatsapp}<br />
        Email: {siteConfig.email}<br />
        Location: Koggala Lake, Sri Lanka
      </p>
    </LegalPage>
  );
}
