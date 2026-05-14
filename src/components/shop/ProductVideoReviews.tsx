import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Star, X } from "lucide-react";

const reviews = [
  {
    id: "1",
    name: "Sarah M.",
    title: "Softest fabric ever!",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    name: "Aisha R.",
    title: "My toddler loves it",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "3",
    name: "Emma L.",
    title: "True to size & adorable",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "4",
    name: "Priya K.",
    title: "Worth every taka",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "5",
    name: "Nadia H.",
    title: "Perfect for daycare",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "6",
    name: "Zara T.",
    title: "Bought 3 more colors",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export function ProductVideoReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<typeof reviews[number] | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-ink">
            <Play className="h-3 w-3" fill="currentColor" /> Video reviews
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">What parents are saying</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border-2 p-2 hover:border-brand-pink"
            aria-label="Previous reviews"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border-2 p-2 hover:border-brand-pink"
            aria-label="Next reviews"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActiveVideo(r)}
            className="group relative aspect-[9/14] w-[200px] flex-shrink-0 snap-start overflow-hidden rounded-3xl bg-brand-ink text-left shadow-soft sm:w-[220px]"
          >
            <img
              src={r.thumbnail}
              alt={r.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-white shadow-pop transition-transform group-hover:scale-110">
                <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-1 text-sm font-bold leading-tight">{r.title}</p>
              <p className="text-xs opacity-80">— {r.name}</p>
            </div>
          </button>
        ))}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close video"
          >
            <X size={22} />
          </button>
          <div
            className="relative aspect-[9/16] max-h-[90vh] w-full max-w-md overflow-hidden rounded-3xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeVideo.videoUrl}
              className="h-full w-full object-cover"
              autoPlay
              controls
              playsInline
            />
          </div>
        </div>
      )}
    </section>
  );
}
