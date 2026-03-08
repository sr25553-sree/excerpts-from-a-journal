"use client";

import type { Entry } from "@/lib/types";

interface CollageCardProps {
  entry: Pick<Entry, "id" | "content" | "created_at" | "mood">;
  onClick: (id: string) => void;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "\u2026";
}

export function CollageCard({ entry, onClick }: CollageCardProps) {
  return (
    <button
      onClick={() => onClick(entry.id)}
      className="block w-[128.449px] h-[133.857px] cursor-pointer bg-[rgba(255,251,153,0.2)] shadow-[1px_2px_0.795px_0px_rgba(55,55,55,0.3)] overflow-clip transition-transform duration-200 hover:scale-105 hover:z-10"
    >
      <p className="font-biro text-[12px] leading-[15px] text-card-navy text-center px-2 pt-3">
        {truncate(entry.content, 120)}
      </p>
    </button>
  );
}
