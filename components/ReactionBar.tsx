"use client";

import { useState, useEffect, useCallback } from "react";
import type { ReactionType } from "@/lib/types";

interface ReactionBarProps {
  entryId: string;
}

const REACTIONS: { type: ReactionType; label: string }[] = [
  { type: "felt_this", label: "Felt this" },
  { type: "not_alone", label: "You\u2019re not alone" },
  { type: "thank_you", label: "Thank you for writing this" },
];

function getReactedSet(entryId: string): Set<ReactionType> {
  try {
    const raw = sessionStorage.getItem(`reactions:${entryId}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReactedSet(entryId: string, set: Set<ReactionType>): void {
  try {
    sessionStorage.setItem(`reactions:${entryId}`, JSON.stringify([...set]));
  } catch {
    // sessionStorage may be unavailable
  }
}

export function ReactionBar({ entryId }: ReactionBarProps) {
  const [reacted, setReacted] = useState<Set<ReactionType>>(new Set());
  const [submitting, setSubmitting] = useState<ReactionType | null>(null);

  useEffect(() => {
    setReacted(getReactedSet(entryId));
  }, [entryId]);

  const handleReact = useCallback(
    async (type: ReactionType) => {
      if (reacted.has(type) || submitting) return;

      setSubmitting(type);
      try {
        const response = await fetch("/api/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId, type }),
        });

        if (response.ok) {
          const updated = new Set(reacted);
          updated.add(type);
          setReacted(updated);
          saveReactedSet(entryId, updated);
        }
      } catch {
        // Silently fail
      } finally {
        setSubmitting(null);
      }
    },
    [entryId, reacted, submitting]
  );

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {REACTIONS.map(({ type, label }) => {
        const hasReacted = reacted.has(type);
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            disabled={hasReacted || submitting !== null}
            className={`font-sans text-xs transition-colors duration-300 ${
              hasReacted
                ? "text-accent italic"
                : "text-ink-faint underline underline-offset-4 hover:text-ink disabled:opacity-50"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
