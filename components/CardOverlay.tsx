"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

interface CardOverlayProps {
  content: string;
  cardSrc: string;
  location?: string | null;
  entryDate?: string | null;
  onClose: () => void;
}

export function CardOverlay({ content, cardSrc, location, entryDate, onClose }: CardOverlayProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 400);
  }, [onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity ease-in-out"
      style={{
        opacity: closing ? 0 : 1,
        transitionDuration: closing ? "400ms" : "500ms",
        transitionDelay: closing ? "0ms" : "0ms",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div
        className={`relative w-[85vw] max-w-[400px] aspect-[287/405] transition-transform duration-300 ease-out ${
          closing ? "scale-75" : "scale-100"
        }`}
        style={{ animationFillMode: "forwards" }}
      >
        <Image
          alt=""
          src={cardSrc}
          fill
          className="object-contain pointer-events-none"
        />
        <p className="absolute inset-0 flex items-center justify-center font-handwritten text-[14px] md:text-[18px] leading-[1.4] text-card-navy text-center px-[15%] pt-[15%] pb-[8%]">
          {content}
        </p>
      </div>

      {/* Location & date */}
      {(location || entryDate) && (
        <p
          className="relative mt-4 text-[13px] text-white/70 text-center"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          {[
            entryDate && new Date(entryDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            location,
          ].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="relative mt-6 px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm text-[15px] font-medium text-[#333] cursor-pointer hover:bg-white transition-colors shadow-md"
        style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
      >
        close
      </button>
    </div>
  );
}
