"use client";

import { Play, Star, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

function VideoReviewCard({ review }: { review: any }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="group relative aspect-[9/14] overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-100">
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
          aria-label={`Play video review by ${review.reviewerName}`}
        >
          <img
            src={review.thumbnailUrl || "https://placehold.co/400x600?text=Review+Video"}
            alt={review.reviewerName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=Review+Video";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-2xl transition-all group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white border border-white/30">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex items-center gap-0.5 mb-1.5">
              {Array.from({ length: review.rating || 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm font-bold leading-snug line-clamp-2 drop-shadow-md mb-1">{review.reviewText}</p>
            <p className="text-[11px] font-medium opacity-90 uppercase tracking-wider">— {review.reviewerName}</p>
          </div>
        </button>
      )}
    </div>
  );
}

export function VideoReviewsSection() {
  const { config } = useTheme();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const s = config.sections.videoReviews;
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/v1/video-reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.data.filter((r: any) => r.status === "active"));
        }
      } catch (err) {
        console.error("Failed to fetch video reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (!s.enabled) return null;

  // Use dynamic reviews if available, otherwise show dummy placeholders for editor context
  const items = reviews.length > 0 ? reviews : (s.items || []);

  return (
    <section className="bg-white border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-pink-500 mb-5 border border-pink-100">
             Verified Reviews
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">{s.title}</h2>
          <p className="mt-4 text-lg text-slate-500 font-medium">{s.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.length > 0 ? (
            items.map((r) => (
              <VideoReviewCard key={r.id} review={r} />
            ))
          ) : (
            [1,2,3,4].map(i => (
              <div key={i} className="aspect-[9/14] rounded-3xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center flex-col gap-3 p-8 text-center animate-pulse">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Video className="w-6 h-6 text-slate-200" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Waiting for</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Review Content</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}