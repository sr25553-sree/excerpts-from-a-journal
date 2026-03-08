import Link from "next/link";

export function CollageTitleBlock() {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <h1 className="font-handwritten text-5xl leading-tight tracking-wide text-ink text-center md:text-7xl md:leading-tight">
        EXCERPTS
        <br />
        FROM
        <br />
        A JOURNAL
      </h1>
      <Link
        href="/write"
        className="mt-10 inline-block rounded-full bg-gradient-to-b from-neutral-700 to-neutral-950 px-10 py-4 font-sans text-base font-medium text-white no-underline shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:scale-105 active:scale-100"
      >
        Write now
      </Link>
    </div>
  );
}
