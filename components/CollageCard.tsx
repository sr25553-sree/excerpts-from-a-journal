"use client";

import type { Entry } from "@/lib/types";
import type { Mood } from "@/lib/types";

interface CollageCardProps {
  entry: Pick<Entry, "id" | "content" | "created_at" | "mood">;
  onClick: (id: string) => void;
}

const CARD_VARIANTS = [
  {
    bg: "bg-card-cream",
    shadow: "shadow-[2px_3px_12px_rgba(0,0,0,0.08)]",
    extra: "",
  },
  {
    bg: "bg-card-pink",
    shadow: "shadow-[1px_2px_10px_rgba(0,0,0,0.06)]",
    extra: "",
  },
  {
    bg: "bg-card-blue",
    shadow: "shadow-[2px_4px_14px_rgba(0,0,0,0.07)]",
    extra: "",
  },
  {
    bg: "bg-card-yellow",
    shadow: "shadow-[1px_3px_10px_rgba(0,0,0,0.08)]",
    extra: "",
  },
  {
    bg: "bg-card-white",
    shadow: "shadow-[2px_2px_8px_rgba(0,0,0,0.1)]",
    extra: "border border-rule/50",
  },
];

const ROTATIONS = [
  "-rotate-3",
  "-rotate-2",
  "-rotate-1",
  "rotate-0",
  "rotate-1",
  "rotate-2",
  "rotate-3",
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "\u2026";
}

const MOOD_LABELS: Record<string, string> = {
  grief: "grief",
  joy: "joy",
  longing: "longing",
  anger: "anger",
  tenderness: "tenderness",
  confusion: "confusion",
  relief: "relief",
};

export function CollageCard({ entry, onClick }: CollageCardProps) {
  const hash = hashId(entry.id);
  const variant = CARD_VARIANTS[hash % CARD_VARIANTS.length];
  const rotation = ROTATIONS[hash % ROTATIONS.length];

  return (
    <button
      onClick={() => onClick(entry.id)}
      className={`
        ${variant.bg} ${variant.shadow} ${variant.extra}
        ${rotation}
        block w-full cursor-pointer rounded-sm p-5 text-left
        transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-10
      `}
    >
      <p className="font-serif text-sm leading-[1.7] text-ink line-clamp-4">
        {truncate(entry.content, 200)}
      </p>
      {entry.mood && (
        <span className="mt-3 inline-block font-sans text-[10px] uppercase tracking-widest text-ink-faint">
          {MOOD_LABELS[entry.mood] ?? entry.mood}
        </span>
      )}
    </button>
  );
}
