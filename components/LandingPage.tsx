"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CollageCard } from "./CollageCard";
import { CollageTitleBlock } from "./CollageTitleBlock";
import { EntryOverlay } from "./EntryOverlay";
import type { Entry } from "@/lib/types";

type Tab = "write" | "read";

interface LandingPageProps {
  initialEntries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
}

export function LandingPage({ initialEntries }: LandingPageProps) {
  const [tab, setTab] = useState<Tab>("write");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [entries, setEntries] = useState(initialEntries);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardClick = useCallback((id: string) => {
    setSelectedEntryId(id);
  }, []);

  // Load more entries when scrolled near end
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || tab !== "read") return;

    const handleScroll = () => {
      if (loading) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollWidth - scrollLeft - clientWidth < 400) {
        // Could load more here if pagination is needed
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [tab, loading]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Toggle */}
        <div className="flex justify-center pt-8 md:pt-12">
          <div className="inline-flex rounded-full bg-[rgba(216,216,216,0.4)] p-1">
            <button
              onClick={() => setTab("write")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === "write"
                  ? "bg-[rgba(255,251,153,0.8)] text-black shadow-sm"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setTab("read")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                tab === "read"
                  ? "bg-[rgba(255,251,153,0.8)] text-black shadow-sm"
                  : "text-ink-light hover:text-ink"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Write View */}
        {tab === "write" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="py-16 md:py-24">
                <CollageTitleBlock />
              </div>
            </div>
          </div>
        )}

        {/* Read View */}
        {tab === "read" && (
          <div className="flex-1 flex flex-col pt-8 md:pt-12">
            <div
              ref={scrollRef}
              className="flex-1 overflow-x-auto"
            >
              <div className="flex gap-3 md:gap-4 px-4 md:px-8 pb-8 min-h-0 items-start flex-wrap content-start">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="shrink-0 w-[128.449px] h-[133.857px] md:w-[343.355px] md:h-[357.812px]"
                  >
                    <CollageCard entry={entry} onClick={handleCardClick} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedEntryId && (
        <EntryOverlay
          entryId={selectedEntryId}
          onClose={() => setSelectedEntryId(null)}
        />
      )}
    </>
  );
}
