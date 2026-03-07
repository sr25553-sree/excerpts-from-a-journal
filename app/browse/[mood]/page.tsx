import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { FeedList } from "@/components/FeedList";
import { PageShell } from "@/components/PageShell";
import { MOODS } from "@/lib/types";
import type { Mood } from "@/lib/types";

const PAGE_SIZE = 10;

interface PageProps {
  params: Promise<{ mood: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { mood } = await params;
  return {
    title: `${mood} — Excerpts from a Journal`,
    description: `Entries tagged with ${mood}.`,
  };
}

export default async function BrowseMoodPage({ params }: PageProps) {
  const { mood } = await params;

  if (!MOODS.includes(mood as Mood)) {
    notFound();
  }

  const supabase = createServerClient();

  const { data } = await supabase
    .from("entries")
    .select("id, content, created_at, mood")
    .eq("is_approved", true)
    .eq("mood", mood)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE + 1);

  const entries = data ?? [];
  const hasMore = entries.length > PAGE_SIZE;
  const visibleEntries = hasMore ? entries.slice(0, PAGE_SIZE) : entries;
  const nextCursor = hasMore
    ? visibleEntries[visibleEntries.length - 1].created_at
    : null;

  if (visibleEntries.length === 0) {
    return (
      <PageShell>
        <div className="py-20 text-center">
          <p className="font-serif text-lg font-light italic text-ink-faint">
            No one has written about {mood} yet.
          </p>
          <p className="mt-4 font-sans text-sm text-ink-faint">
            <a
              href="/write"
              className="underline underline-offset-4 hover:text-ink transition-colors duration-300"
            >
              Maybe you will be the first.
            </a>
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div>
        <div className="mb-10">
          <h1 className="font-serif text-lg font-light italic text-ink-faint">
            entries about{" "}
            <span className="text-ink not-italic">{mood}</span>
          </h1>
        </div>
        <FeedList
          initialEntries={visibleEntries}
          initialCursor={nextCursor}
          initialHasMore={hasMore}
          mood={mood}
        />
      </div>
    </PageShell>
  );
}
