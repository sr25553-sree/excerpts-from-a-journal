"use client";

import { useState, useEffect, useCallback } from "react";
import { EntryBody } from "./EntryBody";
import { MoodTag } from "./MoodTag";
import { ReactionBar } from "./ReactionBar";
import { relativeTime } from "@/lib/time";
import type { Mood } from "@/lib/types";

interface EntryData {
  id: string;
  content: string;
  created_at: string;
  mood: string | null;
}

interface EntryOverlayProps {
  entryId: string;
  onClose: () => void;
}

export function EntryOverlay({ entryId, onClose }: EntryOverlayProps) {
  const [entry, setEntry] = useState<EntryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchEntry() {
      try {
        const res = await fetch(`/api/entries/${entryId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setEntry(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEntry();
    return () => {
      cancelled = true;
    };
  }, [entryId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-parchment ${
        closing ? "animate-overlay-out" : "animate-overlay-in"
      }`}
    >
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-[65ch] px-6 py-12 md:py-20">
          <div className="mb-10">
            <button
              onClick={handleClose}
              className="font-sans text-sm text-ink-faint underline underline-offset-4 transition-colors duration-300 hover:text-ink"
            >
              back
            </button>
          </div>

          {loading && (
            <p className="py-20 text-center font-serif text-lg font-light italic text-ink-faint">
              loading...
            </p>
          )}

          {!loading && !entry && (
            <p className="py-20 text-center font-serif text-lg font-light italic text-ink-faint">
              This entry could not be found.
            </p>
          )}

          {!loading && entry && (
            <article className="animate-fade-in">
              <EntryBody content={entry.content} />

              {entry.mood && (
                <div className="mt-8">
                  <MoodTag mood={entry.mood as Mood} />
                </div>
              )}

              <div className="mt-8">
                <ReactionBar entryId={entry.id} />
              </div>

              <div className="mt-12 border-t border-rule pt-8">
                <div className="font-sans text-xs text-ink-faint">
                  {relativeTime(entry.created_at)}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
