"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CollageCard } from "./CollageCard";
import { CollageTitleBlock } from "./CollageTitleBlock";
import { EntryOverlay } from "./EntryOverlay";
import type { Entry } from "@/lib/types";

interface CollageGridProps {
  initialEntries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
  initialCursor: string | null;
  initialHasMore: boolean;
  topCount?: number;
}

export function CollageGrid({
  initialEntries,
  initialCursor,
  initialHasMore,
  topCount = 8,
}: CollageGridProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const topEntries = entries.slice(0, topCount);
  const bottomEntries = entries.slice(topCount);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/entries?cursor=${encodeURIComponent(cursor)}&limit=20`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      setEntries((prev) => [...prev, ...data.entries]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        if (observerEntries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      {/* Top cards */}
      <div className="grid grid-cols-2 gap-3 px-3 justify-items-center sm:grid-cols-3 md:grid-cols-4 md:gap-4 md:px-6">
        {topEntries.map((entry) => (
          <CollageCard key={entry.id} entry={entry} onClick={setSelectedEntryId} />
        ))}
      </div>

      {/* Title block */}
      <CollageTitleBlock />

      {/* Bottom cards */}
      <div className="grid grid-cols-2 gap-3 px-3 justify-items-center sm:grid-cols-3 md:grid-cols-4 md:gap-4 md:px-6">
        {bottomEntries.map((entry) => (
          <CollageCard key={entry.id} entry={entry} onClick={setSelectedEntryId} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="py-8 text-center">
          {loading && (
            <span className="font-sans text-sm text-ink-faint">
              loading...
            </span>
          )}
        </div>
      )}

      {selectedEntryId && (
        <EntryOverlay
          entryId={selectedEntryId}
          onClose={() => setSelectedEntryId(null)}
        />
      )}
    </>
  );
}
