import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";
import { useState } from "react";

const videoReviews = [
  {
    id: "1",
    name: "Sarah M.",
    title: "Softest baby clothes ever!",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    name: "Aisha R.",
    title: "My toddler loves the prints",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "3",
    name: "Emma L.",
    title: "Great quality, fast shipping",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "4",
    name: "Priya K.",
    title: "Perfect fit for newborns",
    rating: 5,
    thumbnail: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

function VideoReviewCard({ review }: { review: typeof videoReviews[number] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="group relative aspect-[9/14] overflow-hidden rounded-3xl bg-brand-ink shadow-soft">
      {playing ? (
        <video
          src={review.videoUrl}
          className="h-full w-full object-cover"
          autoPlay
          controls
          playsInline
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="block h-full w-full text-left"
          aria-label={`Play video review by ${review.name}`}
        >
          <img
            src={review.thumbnail}
            alt={review.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink text-white shadow-pop transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="mt-1 text-sm font-bold leading-tight">{review.title}</p>
            <p className="text-xs opacity-80">— {review.name}</p>
          </div>
        </button>
      )}
    </div>
  );
}

export function VideoReviewsSection() {
  return (
    <section className="border-y bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-ink">
              <Play className="h-3 w-3" fill="currentColor" /> Happy parents
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Video reviews from our customers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Real stories from families who love ChildrenGoods.</p>
          </div>
          <Link to="/collections/all" className="text-sm font-bold text-brand-pink hover:underline">
            Shop best sellers →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {videoReviews.map((r) => (
            <VideoReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
