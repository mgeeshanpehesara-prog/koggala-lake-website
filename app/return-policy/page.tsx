import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "Cancellation, refund and weather policy for Koggala Lake tours and activities.",
};

export default function ReturnPolicyPage() {
  return (
    <LegalPage title="Cancellation & Refund Policy">
      <p className="text-xs uppercase tracking-wide text-teal-400">Last updated: 10 September 2026</p>

      <p>
        This policy applies to bookings for private boat safaris, kayak adventures, and guided nature and wildlife tours operated by Koggala Lake Boat Safari &amp; Kayak Adventure with Malish in Sri Lanka.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Booking confirmation</h2>
      <p>
        A booking is confirmed only after we have received the required booking details and payment or deposit, and have sent written confirmation by email or WhatsApp. Please check the date, time, number of guests, meeting point, activity, and contact details in your confirmation and tell us promptly if anything is incorrect.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Cancellations by the customer</h2>
      <p>
        Please contact us as soon as possible if you need to cancel. Unless a different written arrangement is stated in your booking confirmation, the following terms apply:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Cancellation at least 48 hours before the scheduled start time: eligible for a full refund of the amount paid.</li>
        <li>Cancellation between 24 and 48 hours before the scheduled start time: eligible for a 50% refund of the amount paid.</li>
        <li>Cancellation less than 24 hours before the scheduled start time: normally non-refundable.</li>
      </ul>
      <p>
        Refund eligibility is based on the time we receive your cancellation request. Third-party platform terms may apply when you book through a marketplace, and those terms will take priority where applicable.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Refunds and rescheduling</h2>
      <p>
        Approved refunds are returned to the original payment method where reasonably possible. Bank, card, currency-conversion, and payment-provider charges may not be recoverable. Processing times depend on the payment provider and can take several business days. We may offer one complimentary date change when requested at least 48 hours in advance, subject to availability and any difference in price.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">No-shows and late arrival</h2>
      <p>
        A no-show, failure to attend at the confirmed meeting point, or arrival too late to complete the activity is treated as a customer cancellation with no refund. Please allow enough time for traffic, directions, parking, and local conditions. Contact us immediately if you are delayed; we will try to help where the schedule allows, but a shortened or missed activity may still be charged in full.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Weather conditions</h2>
      <p>
        Safety comes first. Our guide or boat operator may delay, shorten, reschedule, change the route, or cancel an activity because of heavy rain, lightning, strong winds, rough water, poor visibility, flooding, or any other unsafe condition. We will contact you using the details in your booking as early as practical.
      </p>
      <p>
        If we cancel because conditions are unsafe and no suitable alternative date or activity is accepted, you may choose a full refund of the amount paid for the affected activity or a reasonable alternative where available. Minor rain or ordinary changes in lake conditions do not automatically qualify for a refund.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Changes or cancellations by us</h2>
      <p>
        We may change the departure time, route, vessel, guide, or activity format when necessary for safety, operational, conservation, or availability reasons. We will offer a suitable alternative where possible. If a significant change is not acceptable, we will discuss rescheduling or a refund for the affected service. Our liability for a cancellation is limited to the amount paid for the affected booking, except where applicable law requires otherwise.
      </p>

      <h2 className="pt-4 font-display text-2xl font-medium text-sand-50">Contact us</h2>
      <p>
        To cancel, request a refund, or discuss a change, contact us with your booking name, date, activity, and confirmation reference:
      </p>
      <p>
        WhatsApp or phone: {siteConfig.whatsapp}<br />
        Email: {siteConfig.email}
      </p>
    </LegalPage>
  );
}
