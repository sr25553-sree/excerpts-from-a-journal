"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ReadCardGrid } from "./ReadCardGrid";
import { EntryOverlay } from "./EntryOverlay";
import type { Entry } from "@/lib/types";

type Tab = "write" | "read";

const CARD_SHADOW =
  "41.727px 14.415px 12.139px 0px rgba(0,0,0,0), 26.554px 9.104px 11.38px 0px rgba(0,0,0,0.01), 15.174px 5.311px 9.863px 0px rgba(0,0,0,0.05), 6.828px 2.276px 6.828px 0px rgba(0,0,0,0.09), 1.517px 0.759px 3.793px 0px rgba(0,0,0,0.1)";

interface LandingPageProps {
  initialEntries: Pick<Entry, "id" | "content" | "created_at" | "mood">[];
}

export function LandingPage({ initialEntries }: LandingPageProps) {
  const [tab, setTab] = useState<Tab>("write");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleCardClick = useCallback((id: string) => {
    setSelectedEntryId(id);
  }, []);

  const isWrite = tab === "write";

  return (
    <>
      <div className="bg-white relative min-h-screen overflow-hidden">
        {/* === FLORAL BACKGROUND — fades with write view === */}
        <div
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: isWrite ? 1 : 0,
            transitionDuration: isWrite ? "500ms" : "400ms",
            transitionDelay: isWrite ? "350ms" : "0ms",
          }}
        >
          <Image
            alt=""
            src="/images/floral.png"
            fill
            className="object-cover pointer-events-none"
            priority
          />
        </div>

        {/* === NAV TOGGLE — always visible === */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[calc(50%-394.06px)] -translate-y-1/2 scale-[0.8] backdrop-blur-[1.852px] bg-[rgba(0,0,0,0.03)] border-[1.235px] border-[rgba(0,0,0,0.06)] border-solid flex gap-[6px] items-start p-[6.175px] rounded-[61.75px] z-10">
          {/* Write tab */}
          <button
            onClick={() => setTab("write")}
            className="flex items-center justify-center overflow-clip px-[37.05px] py-[19.76px] relative rounded-[61.75px] shrink-0 cursor-pointer"
            style={
              isWrite
                ? {
                    background: "rgba(252,255,84,0.94)",
                    boxShadow:
                      "0px 4.94px 17.29px 0px rgba(0,0,0,0.05), 0px 1.235px 0px 0px rgba(0,0,0,0.1)",
                  }
                : undefined
            }
          >
            <span
              className="capitalize font-medium leading-normal text-[20px] whitespace-nowrap relative shrink-0"
              style={{ fontFamily: "'Helvetica Neue', sans-serif", color: isWrite ? "#0e0e0e" : "#5f5f5f" }}
            >
              Write
            </span>
            {isWrite && (
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2.47px_0px_0px_rgba(255,255,255,0.5)]" />
            )}
          </button>

          {/* Read tab */}
          <button
            onClick={() => setTab("read")}
            className="flex items-center justify-center overflow-clip px-[30.875px] py-[18.525px] relative rounded-[61.75px] shrink-0 cursor-pointer"
            style={
              !isWrite
                ? {
                    background: "rgba(252,255,84,0.94)",
                    boxShadow:
                      "0px 4.94px 17.29px 0px rgba(0,0,0,0.05), 0px 1.235px 0px 0px rgba(0,0,0,0.1)",
                  }
                : undefined
            }
          >
            <span
              className="capitalize font-medium leading-normal text-[20px] whitespace-nowrap relative shrink-0"
              style={{ fontFamily: "'Helvetica Neue', sans-serif", color: !isWrite ? "#0e0e0e" : "#5f5f5f" }}
            >
              Read
            </span>
            {!isWrite && (
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2.47px_0px_0px_rgba(255,255,255,0.5)]" />
            )}
          </button>
        </div>

        {/* === WRITE VIEW — fades out first, fades in after read exits === */}
        <div
          className={`absolute inset-0 transition-opacity ease-in-out ${
            isWrite ? "" : "pointer-events-none"
          }`}
          style={{
            opacity: isWrite ? 1 : 0,
            transitionDuration: isWrite ? "500ms" : "400ms",
            transitionDelay: isWrite ? "350ms" : "0ms",
          }}
        >
          {/* Photo cards strip — positioned above viewport, peeking in */}
          <div
            className="absolute left-[-45px] top-[-511px] h-[367.82px] w-[260.075px] overflow-clip"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[379.626px] w-[259.744px]">
              <Image alt="" src="/images/card-asset41.svg" fill className="object-contain" />
            </div>
          </div>

          <div
            className="absolute left-[272.87px] top-[-511px] h-[367.82px] w-[260.075px] overflow-clip"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <Image alt="" src="/images/card-frame.svg" fill className="object-contain" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[352.38px] w-[244.305px] bg-[#f4f4ed]" />
          </div>

          <div
            className="absolute left-[589.83px] top-[-511px] h-[367.82px] w-[260.075px] overflow-clip"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[269.734px] w-[258.836px]">
              <Image alt="" src="/images/card-asset61.svg" fill className="object-contain" />
            </div>
          </div>

          <div
            className="absolute left-[907.7px] top-[-511px] h-[367.82px] w-[260.075px] overflow-clip"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[367.82px] w-[259.744px]">
              <Image alt="" src="/images/card-asset42.svg" fill className="object-contain" />
            </div>
          </div>

          <div
            className="absolute left-[1225.57px] top-[-511px] h-[367.82px] w-[260.075px] overflow-clip"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[367.82px] w-[263.377px] overflow-clip">
              <Image alt="" src="/images/card-group.svg" fill className="object-contain" />
            </div>
          </div>

          {/* Title */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[314px] w-[676px] h-[209px] text-center">
            <h1 className="font-handwritten text-[100px] leading-[93.846px] text-black">
              <span className="block">excerpts from</span>
              <span className="block">a journal</span>
            </h1>
          </div>

          {/* CTA Button */}
          <div
            className="absolute left-[calc(50%+13.5px)] top-[calc(50%+112px)] -translate-x-1/2 -translate-y-1/2 flex items-start p-[12.437px] rounded-[145.097px] bg-[rgba(216,216,216,0.82)] shadow-[0px_3.109px_0px_0px_rgba(255,255,255,0.1)]"
          >
            <Link
              href="/write"
              className="flex items-center justify-center overflow-clip px-[62.184px] py-[30px] relative rounded-[153.388px] shrink-0 no-underline"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 317.37 94' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.20000000298023224'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(19.855 5.0917 -1.0002 5.8809 89.31 -9.7917)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgb(39, 39, 39) 0%, rgb(39, 39, 39) 100%)",
                boxShadow:
                  "0px 5.736px 4.589px 0px rgba(0,0,0,0.12), 0px 6.218px 6.218px 0px rgba(0,0,0,0.14), 0px 207.282px 165.825px 0px rgba(0,0,0,0.15), 0px 86.597px 69.278px 0px rgba(0,0,0,0.15), 0px 46.299px 37.039px 0px rgba(0,0,0,0.14), 0px 25.955px 20.764px 0px rgba(0,0,0,0.14), 0px 13.784px 11.028px 0px rgba(0,0,0,0.13), 0px 5.736px 4.589px 0px rgba(0,0,0,0.12)",
              }}
            >
              <span className="font-sans text-[27px] leading-[33.165px] text-white text-center whitespace-nowrap relative">
                write something
              </span>
              {/* Inner highlight + bottom bevel */}
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2.073px_0px_0px_rgba(255,255,255,0.3),inset_0px_-6.218px_0px_0px_#080808]" />
            </Link>
            {/* Outer pill inner shadow */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_4.146px_0px_rgba(0,0,0,0.08)]" />
          </div>
        </div>

        {/* === READ VIEW — fades in after write exits, fades out first === */}
        <div
          className={`absolute inset-0 top-[120px] transition-opacity ease-in-out ${
            isWrite ? "pointer-events-none" : ""
          }`}
          style={{
            opacity: isWrite ? 0 : 1,
            transitionDuration: isWrite ? "400ms" : "500ms",
            transitionDelay: isWrite ? "0ms" : "350ms",
          }}
        >
          <div className="h-full overflow-y-auto">
            <ReadCardGrid entries={initialEntries} onCardClick={handleCardClick} />
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
