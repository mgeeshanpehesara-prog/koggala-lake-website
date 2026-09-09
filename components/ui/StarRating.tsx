export default function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ""}`}>
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4 fill-gold-400"
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z" />
      </svg>
      <span className="text-sm font-semibold text-sand-50">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
