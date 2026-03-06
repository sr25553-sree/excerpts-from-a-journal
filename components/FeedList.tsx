"use client";

import { useState, useCallback } from "react";
import { EntryCard } from "./EntryCard";
import type { Entry } from "@/lib/types";

interface FeedListProps {
  initialEntries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
  initialCursor: string | null;
  initialHasMore: boolean;
  mood?: string | null;
}

export function FeedList({
  initialEntries,
  initialCursor,
  initialHasMore,
  mood,
}: FeedListProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);

    try {
      let url = `/api/entries?cursor=${encodeURIComponent(cursor)}`;
      if (mood) {
        url += `&mood=${encodeURIComponent(mood)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();

      setEntries((prev) => [...prev, ...data.entries]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      // Silently fail — the user can try again
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, mood]);

  return (
    <div>
      <div className="divide-y divide-rule">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="font-sans text-sm text-ink-faint underline underline-offset-4 transition-colors duration-300 hover:text-ink disabled:opacity-50"
          >
            {loading ? "loading..." : "more entries"}
          </button>
        </div>
      )}
    </div>
  );
}
