import Link from "next/link";
import type { Mood } from "@/lib/types";

interface MoodTagProps {
  mood: Mood;
  linkable?: boolean;
}

export function MoodTag({ mood, linkable = true }: MoodTagProps) {
  const tag = (
    <span className="inline-block font-sans text-xs text-ink-faint/70 italic">
      {mood}
    </span>
  );

  if (!linkable) return tag;

  return (
    <Link
      href={`/browse/${mood}`}
      className="inline-block no-underline hover:text-accent transition-colors duration-300"
    >
      {tag}
    </Link>
  );
}
