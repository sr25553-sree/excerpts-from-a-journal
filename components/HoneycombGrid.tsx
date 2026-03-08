"use client";

import { useState, useCallback, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { CollageCard } from "./CollageCard";
import { CollageTitleBlock } from "./CollageTitleBlock";
import { EntryOverlay } from "./EntryOverlay";
import type { Entry } from "@/lib/types";

// Card dimensions
const CARD_W_MOBILE = 128.449;
const CARD_H_MOBILE = 133.857;
const CARD_W_DESKTOP = 343.355;
const CARD_H_DESKTOP = 357.812;
const GAP_MOBILE = 12;
const GAP_DESKTOP = 16;

const COLS = 7;
const ROWS = 5;
const TITLE_ROW = 2;
const TITLE_COL_START = 2;
const TITLE_COL_END = 3;

const FRICTION = 0.95;
const VELOCITY_STOP = 0.5;
const DRAG_THRESHOLD = 5;

function cellPosition(row: number, col: number, cardW: number, cardH: number, gap: number) {
  const stepX = cardW + gap;
  const stepY = cardH + gap;
  const offsetX = row % 2 !== 0 ? stepX / 2 : 0;
  return {
    left: col * stepX + offsetX,
    top: row * stepY,
  };
}

interface HoneycombGridProps {
  initialEntries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
}

export function HoneycombGrid({ initialEntries }: HoneycombGridProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const didDragRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef(0);

  const panState = useRef({
    panX: 0,
    panY: 0,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    isPanning: false,
    velocityX: 0,
    velocityY: 0,
    lastMoveTime: 0,
    lastMoveX: 0,
    lastMoveY: 0,
    totalDist: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const layout = useMemo(() => {
    if (!mounted) return null;

    const isMobile = window.innerWidth < 768;
    const cardW = isMobile ? CARD_W_MOBILE : CARD_W_DESKTOP;
    const cardH = isMobile ? CARD_H_MOBILE : CARD_H_DESKTOP;
    const gap = isMobile ? GAP_MOBILE : GAP_DESKTOP;

    // Build cell list, skipping title cells
    const cells: { row: number; col: number; left: number; top: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === TITLE_ROW && (c === TITLE_COL_START || c === TITLE_COL_END)) continue;
        const pos = cellPosition(r, c, cardW, cardH, gap);
        cells.push({ row: r, col: c, ...pos });
      }
    }

    // Title position (spans 2 card widths + gap)
    const titlePos = cellPosition(TITLE_ROW, TITLE_COL_START, cardW, cardH, gap);
    const titleW = cardW * 2 + gap;
    const titleH = cardH;

    // Grid bounding box
    const stepX = cardW + gap;
    const maxRowOffset = stepX / 2; // odd row offset
    const gridW = COLS * stepX + maxRowOffset;
    const gridH = ROWS * (cardH + gap);

    // Center title in viewport
    const titleCenterX = titlePos.left + titleW / 2;
    const titleCenterY = titlePos.top + titleH / 2;
    const initialPanX = window.innerWidth / 2 - titleCenterX;
    const initialPanY = window.innerHeight / 2 - titleCenterY;

    return { cardW, cardH, gap, cells, titlePos, titleW, titleH, gridW, gridH, initialPanX, initialPanY };
  }, [mounted]);

  // Set initial pan position
  useLayoutEffect(() => {
    if (!layout || !contentRef.current) return;
    panState.current.panX = layout.initialPanX;
    panState.current.panY = layout.initialPanY;
    contentRef.current.style.transform = `translate3d(${layout.initialPanX}px, ${layout.initialPanY}px, 0)`;
  }, [layout]);

  const applyTransform = useCallback(() => {
    if (!contentRef.current) return;
    const { panX, panY } = panState.current;
    contentRef.current.style.transform = `translate3d(${panX}px, ${panY}px, 0)`;
  }, []);

  // Inertia animation
  const startInertia = useCallback(() => {
    const animate = () => {
      const s = panState.current;
      s.velocityX *= FRICTION;
      s.velocityY *= FRICTION;

      if (Math.abs(s.velocityX) < VELOCITY_STOP && Math.abs(s.velocityY) < VELOCITY_STOP) {
        s.velocityX = 0;
        s.velocityY = 0;
        return;
      }

      s.panX += s.velocityX;
      s.panY += s.velocityY;
      applyTransform();
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [applyTransform]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Don't pan if overlay is open
    if (selectedEntryId) return;

    cancelAnimationFrame(animFrameRef.current);
    const s = panState.current;
    s.isPanning = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.startPanX = s.panX;
    s.startPanY = s.panY;
    s.velocityX = 0;
    s.velocityY = 0;
    s.lastMoveTime = Date.now();
    s.lastMoveX = e.clientX;
    s.lastMoveY = e.clientY;
    s.totalDist = 0;
    didDragRef.current = false;

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [selectedEntryId]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const s = panState.current;
    if (!s.isPanning) return;

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    s.totalDist = Math.sqrt(dx * dx + dy * dy);

    if (s.totalDist > DRAG_THRESHOLD) {
      didDragRef.current = true;
    }

    s.panX = s.startPanX + dx;
    s.panY = s.startPanY + dy;
    applyTransform();

    // Track velocity
    const now = Date.now();
    const dt = now - s.lastMoveTime;
    if (dt > 0) {
      const vx = (e.clientX - s.lastMoveX) / dt * 16; // normalize to ~60fps frame
      const vy = (e.clientY - s.lastMoveY) / dt * 16;
      s.velocityX = vx * 0.4 + s.velocityX * 0.6; // exponential moving average
      s.velocityY = vy * 0.4 + s.velocityY * 0.6;
    }
    s.lastMoveTime = now;
    s.lastMoveX = e.clientX;
    s.lastMoveY = e.clientY;
  }, [applyTransform]);

  const handlePointerUp = useCallback(() => {
    const s = panState.current;
    if (!s.isPanning) return;
    s.isPanning = false;

    // Start inertia if there's velocity
    if (Math.abs(s.velocityX) > VELOCITY_STOP || Math.abs(s.velocityY) > VELOCITY_STOP) {
      startInertia();
    }
  }, [startInertia]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (selectedEntryId) return;
    cancelAnimationFrame(animFrameRef.current);
    const s = panState.current;
    s.panX -= e.deltaX;
    s.panY -= e.deltaY;
    applyTransform();
  }, [applyTransform, selectedEntryId]);

  const handleCardClick = useCallback((id: string) => {
    if (!didDragRef.current) {
      setSelectedEntryId(id);
    }
  }, []);

  if (!mounted || !layout) {
    return null;
  }

  const { cardW, cardH, cells, titlePos, titleW, titleH, gridW, gridH } = layout;
  const entriesToPlace = cells.slice(0, initialEntries.length);

  return (
    <>
      <div
        ref={viewportRef}
        className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          ref={contentRef}
          className="will-change-transform"
          style={{ width: gridW, height: gridH, position: "relative" }}
        >
          {/* Cards */}
          {entriesToPlace.map((cell, i) => (
            <div
              key={initialEntries[i].id}
              style={{
                position: "absolute",
                left: cell.left,
                top: cell.top,
                width: cardW,
                height: cardH,
              }}
            >
              <CollageCard entry={initialEntries[i]} onClick={handleCardClick} />
            </div>
          ))}

          {/* Title block */}
          <div
            style={{
              position: "absolute",
              left: titlePos.left,
              top: titlePos.top,
              width: titleW,
              height: titleH,
            }}
          >
            <CollageTitleBlock />
          </div>
        </div>
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
