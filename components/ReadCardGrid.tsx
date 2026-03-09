"use client";

import Image from "next/image";
import type { Entry } from "@/lib/types";

const CARD_TYPES = [
  "/images/card-type-1.svg",
  "/images/card-type-2.svg",
  "/images/card-type-3.svg",
  "/images/card-type-4.svg",
  "/images/card-type-5.svg",
  "/images/card-type-6.svg",
];

function getCardType(index: number): string {
  return CARD_TYPES[index % CARD_TYPES.length];
}

interface ReadCardGridProps {
  entries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
  onCardClick: (id: string) => void;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "\u2026";
}

export function ReadCardGrid({ entries, onCardClick }: ReadCardGridProps) {
  return (
    <div className="grid grid-cols-8 gap-3 px-4 py-4 w-max min-w-full">
      {entries.map((entry, i) => (
        <button
          key={entry.id}
          onClick={() => onCardClick(entry.id)}
          className="relative w-[160px] h-[226px] cursor-pointer transition-transform duration-200 hover:scale-105 hover:z-10 shrink-0"
        >
          <Image
            alt=""
            src={getCardType(i)}
            fill
            className="object-contain pointer-events-none"
          />
          <p className="absolute inset-0 flex items-center justify-center font-biro text-[11px] leading-[14px] text-card-navy text-center px-5 pt-6 pb-4">
            {truncate(entry.content, 80)}
          </p>
        </button>
      ))}
    </div>
  );
}
