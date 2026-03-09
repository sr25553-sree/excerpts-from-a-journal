import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export default async function AboutPage() {
  const supabase = createServerClient();
  const { count } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true });

  return (
    <div className="bg-white relative min-h-screen overflow-hidden">
      {/* Floral background */}
      <div className="absolute inset-0">
        <Image
          alt=""
          src="/images/floral.png"
          fill
          className="object-cover pointer-events-none"
          priority
        />
      </div>

      {/* Top-right nav links */}
      <div
        className="hidden md:flex absolute right-[100px] top-[80px] items-center gap-[40px] z-10"
        style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 400, fontSize: "20px", color: "#7B7B7B" }}
      >
        <Link href="/about" className="no-underline" style={{ color: "#000" }}>
          About
        </Link>
        <Link href="/my-journal" className="no-underline hover:text-black transition-colors whitespace-nowrap" style={{ color: "inherit" }}>
          My journal
        </Link>
      </div>

      {/* Letter content */}
      <div className="relative z-[1] flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-[664px] text-center font-handwritten text-[25px] leading-[30px] text-black">
          <p className="mb-[30px]">Dear friend,</p>
          <p className="mb-[30px]">
            I know there&apos;s a version of you that exists only when no one&apos;s watching. The one who replays conversations. Who stares at the wall a second too long. Who feels things so specifically it seems impossible anyone else could understand.
          </p>
          <p className="mb-[30px]">
            This journal is for that version of you. The idea is simple. Read what someone else felt, and the loneliness loosens just a little. Write what you&apos;ve been carrying, and the weight shifts.
          </p>
          <p className="mb-[30px]">
            That&apos;s the whole thing. A page for what you feel. A reminder that feeling it doesn&apos;t make you fragile. It makes you honest.
          </p>
          <p className="mb-[30px]">Welcome to Excerpts from a Journal.</p>
          <p>
            love,
            <br />
            Sree
          </p>
        </div>
      </div>

      {/* Journal counter */}
      <p
        className="absolute left-1/2 -translate-x-1/2 bottom-[50px] text-[14px] md:text-[20px] text-center whitespace-nowrap z-[1]"
        style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 400, color: "#7B7B7B" }}
      >
        {(count ?? 0).toLocaleString()} journals written so far
      </p>
    </div>
  );
}
