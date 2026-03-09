"use client";

import Image from "next/image";
import type { Entry } from "@/lib/types";

export const CARD_TYPES = [
  "/images/card-type-1.svg",
  "/images/card-type-2.svg",
  "/images/card-type-3.svg",
  "/images/card-type-4.svg",
  "/images/card-type-5.svg",
  "/images/card-type-6.svg",
];

// Deterministic card type based on index, shuffled to avoid repeating patterns
const CARD_ORDER = [4, 0, 3, 2, 1, 5, 3, 0, 2, 5, 1, 4, 0, 3, 5, 1, 4, 2, 5, 0, 3, 1, 2, 4];

export function getCardType(index: number): string {
  return CARD_TYPES[CARD_ORDER[index % CARD_ORDER.length]];
}

interface ReadCardGridProps {
  entries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
  onCardClick: (id: string, cardIndex: number) => void;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "\u2026";
}

export function ReadCardGrid({ entries, onCardClick }: ReadCardGridProps) {
  // Ensure we have enough cards to fill the grid (at least 24 for 3 rows of 8)
  const minCards = 24;
  const displayEntries = entries.length >= minCards
    ? entries
    : [...entries, ...entries, ...entries].slice(0, minCards);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 px-4 py-4 md:px-6 md:py-6">
      {displayEntries.map((entry, i) => (
        <button
          key={`${entry.id}-${i}`}
          onClick={() => onCardClick(entry.id, i)}
          className="relative aspect-[287/405] w-full cursor-pointer transition-transform duration-200 hover:scale-105 hover:z-10"
        >
          <Image
            alt=""
            src={getCardType(i)}
            fill
            className="object-contain pointer-events-none"
          />
          <p className="absolute inset-0 flex items-center justify-center font-handwritten text-[clamp(8px,0.9vw,14px)] leading-[1.3] text-card-navy text-center px-[15%] pt-[20%] pb-[10%]">
            {truncate(entry.content, 80)}
          </p>
        </button>
      ))}
    </div>
  );
}
