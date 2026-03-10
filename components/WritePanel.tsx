"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getRandomPrompt } from "@/lib/prompts";
import { saveEntryId } from "@/lib/myJournal";

const MAX_LENGTH = 5000;

interface WritePanelProps {
  onSubmitted?: () => void;
}

export function WritePanel({ onSubmitted }: WritePanelProps) {
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [entryId, setEntryId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlaceholder(getRandomPrompt());
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || status === "submitting") return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await response.json();
      saveEntryId(data.id);
      setEntryId(data.id);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }, [content, status]);

  const handleReset = useCallback(() => {
    setContent("");
    setEntryId(null);
    setStatus("idle");
    setPlaceholder(getRandomPrompt());
  }, []);

  if (status === "submitted" && entryId) {
    return (
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[90vw] max-w-[1072px] h-[496px] bg-[#f7f7f7] rounded-[45px] flex flex-col items-center justify-center gap-6 px-8">
        <p className="font-handwritten text-[35px] text-black text-center">
          Your words are out in the world now.
        </p>
        <div className="flex gap-8">
          <a
            href={`/read/${entryId}`}
            className="font-handwritten text-[22px] text-[#b0b0b0] underline underline-offset-4 hover:text-black transition-colors"
          >
            read your entry
          </a>
          <button
            onClick={handleReset}
            className="font-handwritten text-[22px] text-[#b0b0b0] underline underline-offset-4 hover:text-black transition-colors cursor-pointer"
          >
            write another
          </button>
        </div>
      </div>
    );
  }

  const isOverLimit = content.length > MAX_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit && status !== "submitting";

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[90vw] max-w-[1072px] h-[496px] bg-[#f7f7f7] rounded-[45px] overflow-hidden">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={status === "submitting"}
        autoFocus
        className="w-full h-full resize-none border-0 bg-transparent px-[54px] pt-[53px] pb-[80px] font-handwritten text-[35.199px] leading-[1.4] text-black placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 disabled:opacity-50"
      />

      {/* Submit button — 64px circle, bottom-right inside panel */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="absolute bottom-[20px] right-[20px] w-[64px] h-[64px] rounded-full bg-[#272727] flex items-center justify-center cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-default"
      >
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      {/* Error message */}
      {status === "error" && (
        <p className="absolute bottom-[30px] left-[54px] font-handwritten text-[18px] text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
