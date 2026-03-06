"use client";

import { MOODS } from "@/lib/types";
import type { Mood } from "@/lib/types";

interface MoodPickerProps {
  selected: Mood | null;
  onChange: (mood: Mood | null) => void;
}

export function MoodPicker({ selected, onChange }: MoodPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((mood) => (
        <button
          key={mood}
          type="button"
          onClick={() => onChange(selected === mood ? null : mood)}
          className={`rounded-full border px-3 py-1 font-sans text-xs transition-colors duration-200 ${
            selected === mood
              ? "border-accent bg-accent/10 text-accent"
              : "border-rule text-ink-faint hover:border-ink-faint hover:text-ink-light"
          }`}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
