export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container-premium max-w-3xl">
        <h1 className="section-heading">{title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-sand-200/75">
          {children}
        </div>
      </div>
    </section>
  );
}
