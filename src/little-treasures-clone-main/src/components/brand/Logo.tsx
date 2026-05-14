import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="ChildrenGoods home">
      <span className="font-display text-2xl font-extrabold tracking-tight text-brand-pink">
        CHILDRENG
        <Star />
        <Star />
        DS
      </span>
    </Link>
  );
}

function Star() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="-mt-1 inline-block h-[0.85em] w-[0.85em] fill-brand-pink align-middle"
      aria-hidden
    >
      <path d="M12 2l2.39 6.96H22l-6 4.36 2.3 7.08L12 16l-6.3 4.4L8 13.32 2 8.96h7.61L12 2z" />
    </svg>
  );
}
