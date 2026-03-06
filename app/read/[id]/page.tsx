import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { EntryBody } from "@/components/EntryBody";
import { RandomButton } from "@/components/RandomButton";
import { MoodTag } from "@/components/MoodTag";
import { ReactionBar } from "@/components/ReactionBar";
import { relativeTime } from "@/lib/time";
import type { Mood } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerClient();

  const { data } = await supabase
    .from("entries")
    .select("content")
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (!data) {
    return { title: "Not Found — Excerpts from a Journal" };
  }

  const description =
    data.content.length > 150
      ? data.content.slice(0, 147) + "..."
      : data.content;

  return {
    title: "An Entry — Excerpts from a Journal",
    description,
    openGraph: {
      title: "An Entry — Excerpts from a Journal",
      description,
    },
  };
}

export default async function EntryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: entry } = await supabase
    .from("entries")
    .select("id, content, created_at, mood")
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (!entry) {
    notFound();
  }

  return (
    <article>
      <EntryBody content={entry.content} />

      {entry.mood && (
        <div className="mt-8">
          <MoodTag mood={entry.mood as Mood} />
        </div>
      )}

      <div className="mt-8">
        <ReactionBar entryId={entry.id} />
      </div>

      <div className="mt-12 border-t border-rule pt-8">
        <div className="flex items-center justify-between font-sans text-xs text-ink-faint">
          <span>{relativeTime(entry.created_at)}</span>
          <RandomButton />
        </div>
      </div>
    </article>
  );
}
