"use client";

import { useState, useEffect } from "react";
import { getEntryIds } from "@/lib/myJournal";
import { ReadCardGrid } from "./ReadCardGrid";
import type { Entry } from "@/lib/types";

type EntryPreview = Pick<Entry, "id" | "content" | "created_at" | "mood">;

interface MyJournalViewProps {
  onCardClick: (id: string, cardIndex: number) => void;
  onWriteClick: () => void;
}

export function MyJournalView({ onCardClick, onWriteClick }: MyJournalViewProps) {
  const [entries, setEntries] = useState<EntryPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getEntryIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    fetch(`/api/entries?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-handwritten text-[20px] text-[#7B7B7B]">loading your journals...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <p className="font-handwritten text-[25px] leading-[30px] text-black text-center px-6">
          You haven&apos;t written anything yet.
        </p>
        <button
          onClick={onWriteClick}
          className="font-handwritten text-[18px] text-[#7B7B7B] underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
        >
          write something
        </button>
      </div>
    );
  }

  return <ReadCardGrid entries={entries} onCardClick={onCardClick} />;
}
