import { createServerClient } from "@/lib/supabase/server";
import { CollageTitleBlock } from "@/components/CollageTitleBlock";
import { CollageGrid } from "@/components/CollageGrid";

const PAGE_SIZE = 24;

export default async function FeedPage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("entries")
    .select("id, content, created_at, mood")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE + 1);

  const entries = data ?? [];
  const hasMore = entries.length > PAGE_SIZE;
  const visibleEntries = hasMore ? entries.slice(0, PAGE_SIZE) : entries;
  const nextCursor = hasMore
    ? visibleEntries[visibleEntries.length - 1].created_at
    : null;

  // Split entries: some before title, rest after
  const topEntries = visibleEntries.slice(0, Math.min(6, visibleEntries.length));
  const bottomEntries = visibleEntries.slice(Math.min(6, visibleEntries.length));

  if (visibleEntries.length === 0) {
    return (
      <div>
        <CollageTitleBlock />
        <div className="py-20 text-center">
          <p className="font-serif text-lg font-light italic text-ink-faint">
            No one has written anything yet.
          </p>
          <p className="mt-4 font-sans text-sm text-ink-faint">
            <a
              href="/write"
              className="underline underline-offset-4 hover:text-ink transition-colors duration-300"
            >
              Be the first.
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CollageGrid
        initialEntries={visibleEntries}
        initialCursor={nextCursor}
        initialHasMore={hasMore}
        topCount={topEntries.length}
      />
    </div>
  );
}
