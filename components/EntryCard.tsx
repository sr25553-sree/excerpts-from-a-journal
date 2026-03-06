import Link from "next/link";
import { relativeTime } from "@/lib/time";
import { MoodTag } from "./MoodTag";
import type { Entry } from "@/lib/types";
import type { Mood } from "@/lib/types";

interface EntryCardProps {
  entry: Pick<Entry, "id" | "content" | "created_at" | "mood">;
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <article className="group py-8">
      <Link
        href={`/read/${entry.id}`}
        className="block no-underline text-ink"
      >
        <div
          className="max-h-48 overflow-hidden font-serif text-base font-light leading-[1.8] text-ink"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          {entry.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-4 font-sans text-xs text-ink-faint transition-colors duration-300 group-hover:text-accent">
          {relativeTime(entry.created_at)}
          <span className="mx-2">&mdash;</span>
          read more
        </div>
      </Link>
      {entry.mood && (
        <div className="mt-2">
          <MoodTag mood={entry.mood as Mood} />
        </div>
      )}
    </article>
  );
}
