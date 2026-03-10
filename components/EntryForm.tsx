"use client";

import { useState, useEffect, useCallback } from "react";
import { getRandomPrompt } from "@/lib/prompts";
import { MoodPicker } from "./MoodPicker";
import { saveEntryId } from "@/lib/myJournal";
import type { Mood } from "@/lib/types";

const MAX_LENGTH = 5000;

export function EntryForm() {
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [entryId, setEntryId] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPlaceholder(getRandomPrompt());
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, mood }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await response.json();
      saveEntryId(data.id);
      setEntryId(data.id);
      setStatus("submitted");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setStatus("error");
    }
  }, [content, status]);

  const handleReset = useCallback(() => {
    setContent("");
    setMood(null);
    setEntryId(null);
    setStatus("idle");
    setPlaceholder(getRandomPrompt());
  }, []);

  if (status === "submitted" && entryId) {
    return (
      <div className="animate-fade-in space-y-6 py-12 text-center">
        <p className="font-serif text-lg font-light italic leading-relaxed text-ink">
          Your words are out in the world now.
        </p>
        <div className="space-y-3 font-sans text-sm text-ink-faint">
          <p>
            <a
              href={`/read/${entryId}`}
              className="text-accent underline underline-offset-4 hover:text-ink transition-colors duration-300"
            >
              read your entry
            </a>
          </p>
          <p>
            <button
              onClick={handleReset}
              className="text-ink-faint underline underline-offset-4 hover:text-ink transition-colors duration-300"
            >
              write another
            </button>
          </p>
        </div>
      </div>
    );
  }

  const remaining = MAX_LENGTH - content.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining < 200 && remaining >= 0;

  return (
    <div className="animate-fade-in">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={status === "submitting"}
        className="w-full resize-none border-0 bg-transparent font-serif text-lg font-light leading-[1.8] text-ink placeholder:text-ink-faint/50 placeholder:italic focus:outline-none focus:ring-0 disabled:opacity-50"
        rows={12}
        autoFocus
      />

      <div className="mt-4 mb-2">
        <p className="mb-3 font-sans text-xs text-ink-faint">
          how does this feel?
        </p>
        <MoodPicker selected={mood} onChange={setMood} />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-rule pt-6">
        <span
          className={`font-sans text-xs transition-opacity duration-300 ${
            isNearLimit || isOverLimit ? "opacity-100" : "opacity-0"
          } ${isOverLimit ? "text-red-600" : "text-ink-faint"}`}
        >
          {remaining.toLocaleString()} characters remaining
        </span>

        <button
          onClick={handleSubmit}
          disabled={
            !content.trim() || isOverLimit || status === "submitting"
          }
          className="font-sans text-sm text-ink-faint underline underline-offset-4 transition-colors duration-300 hover:text-ink disabled:no-underline disabled:opacity-30 disabled:hover:text-ink-faint"
        >
          {status === "submitting"
            ? "leaving your words..."
            : "leave this here"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-4 font-sans text-xs text-red-600/80">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
