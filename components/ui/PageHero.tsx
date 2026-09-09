export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy-fade pt-36 pb-14 sm:pt-44 sm:pb-20 border-b border-white/5">
      <div className="container-premium">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="section-heading">{title}</h1>
        {subtitle && <p className="section-subheading">{subtitle}</p>}
      </div>
    </section>
  );
}
