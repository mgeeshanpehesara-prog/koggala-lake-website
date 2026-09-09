import CTAButton from "@/components/ui/CTAButton";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center pt-20">
      <p className="eyebrow">404</p>
      <h1 className="section-heading mt-3">Page Not Found</h1>
      <p className="section-subheading mx-auto">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
        you back to exploring Koggala Lake.
      </p>
      <div className="mt-8">
        <CTAButton href="/">Back to Home &rarr;</CTAButton>
      </div>
    </section>
  );
}
