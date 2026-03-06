import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-serif text-lg font-light italic text-ink-faint">
        This page doesn&apos;t exist — or it was removed.
      </p>
      <p className="mt-6 font-sans text-sm text-ink-faint">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-ink transition-colors duration-300"
        >
          Return to the feed
        </Link>
      </p>
    </div>
  );
}
