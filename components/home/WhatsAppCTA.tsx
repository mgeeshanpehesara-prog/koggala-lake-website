import { siteConfig } from "@/lib/site-config";
import { whatsappLink } from "@/lib/utils";
import { getWebsiteContent } from "@/lib/data/website-content-store";

export default async function WhatsAppCTA() {
  const { general } = await getWebsiteContent();
  return (
    <section className="py-16">
      <div className="container-premium">
        <div className="relative overflow-hidden rounded-xl3 bg-gradient-to-br from-teal-600/20 via-navy-800 to-navy-900 border border-teal-500/20 px-8 py-12 sm:px-14 sm:py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,209,180,0.16),transparent_55%)]" />
          <div className="relative">
            <p className="font-display text-2xl sm:text-3xl font-medium text-sand-50">
              Have a question?
            </p>
            <p className="mt-2 text-sand-200/70">
              Chat with us on WhatsApp for quick answers and flexible booking.
            </p>
            <a
              href={whatsappLink(
                general.whatsappNumber,
                "Hi! I'd like to know more about your Koggala Lake tours."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-teal-400 to-teal-600 px-8 py-4 text-sm font-semibold text-navy-950 shadow-btn transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-[2px] active:shadow-btn-press"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
