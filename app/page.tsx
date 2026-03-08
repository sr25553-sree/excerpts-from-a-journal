import { createServerClient } from "@/lib/supabase/server";
import { HoneycombGrid } from "@/components/HoneycombGrid";

const PAGE_SIZE = 24;

const SAMPLE_ENTRIES = [
  { id: "sample-1", content: "Today I watched the rain fall for an hour and felt nothing but peace. Sometimes doing nothing is the most productive thing.", created_at: "2026-03-01T10:00:00Z", mood: "peaceful" },
  { id: "sample-2", content: "I told someone I loved them today. They didn't say it back. But I'm glad I said it anyway.", created_at: "2026-03-02T10:00:00Z", mood: "reflective" },
  { id: "sample-3", content: "The coffee shop on 5th street closed down. I never even knew the barista's name but I'll miss her smile.", created_at: "2026-03-03T10:00:00Z", mood: "melancholy" },
  { id: "sample-4", content: "Spent the whole day reorganizing my bookshelf. Not by genre or author — by the feeling each book gives me.", created_at: "2026-03-04T10:00:00Z", mood: "reflective" },
  { id: "sample-5", content: "My grandmother called today just to tell me she dreamt about me. We talked for two hours about nothing important.", created_at: "2026-03-05T10:00:00Z", mood: "grateful" },
  { id: "sample-6", content: "I realized I've been apologizing for things that aren't my fault. Today I practiced saying 'thank you' instead of 'sorry'.", created_at: "2026-03-06T10:00:00Z", mood: "hopeful" },
  { id: "sample-7", content: "Walked home the long way. Found a street I've never been on after living here for three years.", created_at: "2026-02-28T10:00:00Z", mood: "curious" },
  { id: "sample-8", content: "Some days I write to remember. Other days I write to forget. Today I'm not sure which one this is.", created_at: "2026-02-27T10:00:00Z", mood: "reflective" },
  { id: "sample-9", content: "The sunset was so beautiful tonight that I pulled over just to watch. A stranger next to me did the same. We never spoke.", created_at: "2026-02-26T10:00:00Z", mood: "peaceful" },
  { id: "sample-10", content: "I forgave someone today. Not for them — for me. It felt like putting down a bag I didn't know I was carrying.", created_at: "2026-02-25T10:00:00Z", mood: "hopeful" },
  { id: "sample-11", content: "Made pancakes at 2am because I couldn't sleep. They were the best pancakes I've ever made.", created_at: "2026-02-24T10:00:00Z", mood: "peaceful" },
  { id: "sample-12", content: "I keep a list of things that make me smile. Today I added 'the sound of pages turning in a quiet room'.", created_at: "2026-02-23T10:00:00Z", mood: "grateful" },
  { id: "sample-13", content: "Told my friend the truth even though it was hard. Real love isn't comfortable — it's honest.", created_at: "2026-02-22T10:00:00Z", mood: "reflective" },
  { id: "sample-14", content: "Planted a seed today. I won't see it grow for months but something about that feels right.", created_at: "2026-02-21T10:00:00Z", mood: "hopeful" },
  { id: "sample-15", content: "I don't know who I'm becoming but I think I like her. She's quieter, kinder, less afraid.", created_at: "2026-02-20T10:00:00Z", mood: "hopeful" },
  { id: "sample-16", content: "The world feels heavy today. But even heavy things can be carried if you rest along the way.", created_at: "2026-02-19T10:00:00Z", mood: "melancholy" },
  { id: "sample-17", content: "Read an old letter I wrote to myself five years ago. I've become everything I hoped I would.", created_at: "2026-02-18T10:00:00Z", mood: "grateful" },
  { id: "sample-18", content: "Sometimes the bravest thing is to stay. To sit with the discomfort and not run.", created_at: "2026-02-17T10:00:00Z", mood: "reflective" },
  { id: "sample-19", content: "A child waved at me from a bus window today. I waved back. We both laughed. That was enough.", created_at: "2026-02-16T10:00:00Z", mood: "peaceful" },
  { id: "sample-20", content: "Cleaned out my closet and found a ticket stub from a concert I went to alone. Best night of my life.", created_at: "2026-02-15T10:00:00Z", mood: "grateful" },
];

export default async function FeedPage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("entries")
    .select("id, content, created_at, mood")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE + 1);

  const dbEntries = data ?? [];
  const entries = dbEntries.length > 0 ? dbEntries.slice(0, PAGE_SIZE) : SAMPLE_ENTRIES;

  return (
    <HoneycombGrid initialEntries={entries} />
  );
}
