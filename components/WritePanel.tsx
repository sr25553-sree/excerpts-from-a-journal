"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { getRandomPrompt } from "@/lib/prompts";
import { saveEntryId } from "@/lib/myJournal";

const MAX_LENGTH = 5000;

const CARD_TYPES = [
  { id: 1, src: "/images/card-type-1.svg", color: "#f4f4ed", border: "#FF661E" },
  { id: 2, src: "/images/card-type-2.svg", color: "#F995D6", border: null },
  { id: 3, src: "/images/card-type-3.svg", color: "#FF661E", border: null },
  { id: 4, src: "/images/card-type-4.svg", color: "#DDD431", border: null },
  { id: 5, src: "/images/card-type-5.svg", color: "#87A4FF", border: null },
  { id: 6, src: "/images/card-type-6.svg", color: "#f4f4ed", border: "#DDD431" },
  // card-type-6 reused with a different swatch color for the 7th option
];

// Swatch colors matching the Figma — 7 colored circles
const SWATCHES = [
  { cardId: 1, fill: "#f4f4ed", stroke: "#FF661E" },   // cream with orange dashed outline
  { cardId: 2, fill: "#F995D6", stroke: null },          // pink
  { cardId: 3, fill: "#FF661E", stroke: null },          // orange
  { cardId: 4, fill: "#DDD431", stroke: null },          // yellow
  { cardId: 5, fill: "#87A4FF", stroke: null },          // blue
  { cardId: 6, fill: "#f4f4ed", stroke: "#DDD431" },    // cream with yellow outline
  { cardId: 5, fill: "#B4A7D6", stroke: null },          // lavender (reuses card 5)
];

const JOURNAL_SHADOW =
  "102.395px 35.373px 29.788px 0px rgba(0,0,0,0), 65.16px 22.341px 27.926px 0px rgba(0,0,0,0.01), 37.235px 13.032px 24.202px 0px rgba(0,0,0,0.05), 16.756px 5.585px 16.756px 0px rgba(0,0,0,0.09), 3.723px 1.862px 9.309px 0px rgba(0,0,0,0.1)";

interface WritePanelProps {
  onDismiss?: () => void;
}

type Phase = "writing" | "picking" | "posting" | "posted";

export function WritePanel({ onDismiss }: WritePanelProps) {
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [phase, setPhase] = useState<Phase>("writing");
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlaceholder(getRandomPrompt());
  }, []);

  const handleNext = useCallback(() => {
    if (content.trim().length > 0) {
      setPhase("picking");
    }
  }, [content]);

  const handlePost = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || phase === "posting") return;

    setPhase("posting");

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, location: location.trim() || undefined }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await response.json();
      saveEntryId(data.id);
      setEntryId(data.id);
      setPhase("posted");
    } catch {
      setPhase("picking");
    }
  }, [content, location, phase]);

  const handleReset = useCallback(() => {
    setContent("");
    setEntryId(null);
    setSelectedSwatch(0);
    setLocation("");
    setPhase("writing");
    setPlaceholder(getRandomPrompt());
  }, []);

  // === POSTED STATE ===
  if (phase === "posted" && entryId) {
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

  // === PAPER PICKER STATE ===
  if (phase === "picking" || phase === "posting") {
    const swatch = SWATCHES[selectedSwatch];
    const cardSrc = CARD_TYPES.find(c => c.id === swatch.cardId)?.src ?? CARD_TYPES[0].src;
    const canPost = phase === "picking";

    return (
      <>
        {/* Large journal card preview — left side, matching Figma position */}
        <div
          className="absolute left-[calc(50%-268.43px)] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[533.132px] h-[754px] overflow-hidden"
          style={{ boxShadow: JOURNAL_SHADOW }}
        >
          <Image
            alt=""
            src={cardSrc}
            fill
            className="object-cover pointer-events-none"
          />
          {/* Journal text — positioned at top: 342px per Figma, centered */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[342px] w-[389px]">
            <p className="font-handwritten text-[30px] leading-[35px] text-black text-center">
              {content}
            </p>
          </div>
        </div>

        {/* Right panel — anchored to match Figma */}
        <div className="absolute left-[calc(50%+100px)] top-1/2 -translate-y-1/2 flex flex-col items-center">
          {/* "pick a paper" label */}
          <p
            className="text-[20px] text-center whitespace-nowrap mb-[24px]"
            style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, color: "rgba(13,13,13,0.5)" }}
          >
            pick a paper
          </p>

          {/* Color circle swatches */}
          <div className="flex gap-[16px] mb-[50px]">
            {SWATCHES.map((sw, i) => (
              <button
                key={i}
                onClick={() => setSelectedSwatch(i)}
                className={`w-[40px] h-[40px] rounded-full cursor-pointer transition-transform ${
                  selectedSwatch === i ? "scale-110" : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: sw.fill,
                  border: selectedSwatch === i
                    ? `2px solid ${sw.stroke ?? sw.fill}`
                    : sw.stroke
                      ? `1.5px solid ${sw.stroke}`
                      : `1.5px solid rgba(0,0,0,0.08)`,
                  boxShadow: selectedSwatch === i
                    ? `0 0 0 3px white, 0 0 0 5px ${sw.stroke ?? sw.fill}`
                    : "none",
                }}
              />
            ))}
          </div>

          {/* Location input */}
          <div className="mb-[30px] w-full max-w-[340px]">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="where are you writing from?"
              maxLength={200}
              className="w-full bg-transparent border-b border-[rgba(0,0,0,0.15)] pb-[8px] font-handwritten text-[18px] text-black placeholder:text-[rgba(13,13,13,0.3)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] transition-colors text-center"
            />
          </div>

          {/* "Post your journal" button */}
          <div className="flex items-start p-[12.437px] rounded-[145.097px] bg-[rgba(216,216,216,0.82)] shadow-[0px_3.109px_0px_0px_rgba(255,255,255,0.1)] mb-[30px] relative">
            <button
              onClick={handlePost}
              disabled={!canPost}
              className="flex items-center justify-center overflow-clip px-[62.184px] py-[30px] relative rounded-[153.388px] shrink-0 cursor-pointer disabled:cursor-default"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 329.37 94' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.20000000298023224'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(20.606 5.0917 -1.038 5.8809 92.687 -9.7917)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgb(39, 39, 39) 0%, rgb(39, 39, 39) 100%)",
                boxShadow:
                  "0px 5.736px 4.589px 0px rgba(0,0,0,0.12), 0px 6.218px 6.218px 0px rgba(0,0,0,0.14), 0px 207.282px 165.825px 0px rgba(0,0,0,0.15), 0px 86.597px 69.278px 0px rgba(0,0,0,0.15), 0px 46.299px 37.039px 0px rgba(0,0,0,0.14), 0px 25.955px 20.764px 0px rgba(0,0,0,0.14), 0px 13.784px 11.028px 0px rgba(0,0,0,0.13), 0px 5.736px 4.589px 0px rgba(0,0,0,0.12)",
              }}
            >
              <span
                className="text-[27px] leading-[33.165px] text-center whitespace-nowrap relative"
                style={{ fontFamily: "'Helvetica Neue', sans-serif", color: canPost ? "white" : "#dadada" }}
              >
                {phase === "posting" ? "Posting..." : "Post your journal"}
              </span>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2.073px_0px_0px_rgba(255,255,255,0.3),inset_0px_-6.218px_0px_0px_#080808]" />
            </button>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_4.146px_0px_rgba(0,0,0,0.08)]" />
          </div>

          {/* "i don't want to post it" dismiss link */}
          <button
            onClick={onDismiss ?? handleReset}
            className="cursor-pointer underline decoration-solid text-center"
            style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 400, fontSize: "20px", color: "#7b7b7b" }}
          >
            i don&apos;t want to post it
          </button>
        </div>
      </>
    );
  }

  // === WRITING STATE ===
  const isOverLimit = content.length > MAX_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[90vw] max-w-[1072px] h-[496px] bg-[#f7f7f7] rounded-[45px] overflow-hidden">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full h-full resize-none border-0 bg-transparent px-[54px] pt-[53px] pb-[80px] font-handwritten text-[35.199px] leading-[1.4] text-black placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0"
      />

      <button
        onClick={handleNext}
        disabled={!canSubmit}
        className="absolute bottom-[20px] right-[20px] w-[64px] h-[64px] rounded-full bg-[#272727] flex items-center justify-center cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-default"
      >
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
