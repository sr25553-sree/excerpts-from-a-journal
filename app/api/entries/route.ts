import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { MOODS } from "@/lib/types";
import type { Mood } from "@/lib/types";

const PAGE_SIZE = 10;
const MAX_CONTENT_LENGTH = 5000;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const moodParam = searchParams.get("mood");
  const limit = Math.min(
    parseInt(searchParams.get("limit") || String(PAGE_SIZE), 10),
    50
  );

  const supabase = createServerClient();

  // Fetch specific entries by IDs (for "My journal")
  const idsParam = searchParams.get("ids");
  if (idsParam) {
    const ids = idsParam.split(",").slice(0, 100);
    const { data, error } = await supabase
      .from("entries")
      .select("id, content, created_at, mood, location, entry_date")
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch entries" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data ?? [], nextCursor: null, hasMore: false });
  }

  let query = supabase
    .from("entries")
    .select("id, content, created_at, mood, location, entry_date")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  if (moodParam) {
    query = query.eq("mood", moodParam);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }

  const hasMore = data.length > limit;
  const entries = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore
    ? entries[entries.length - 1].created_at
    : null;

  return NextResponse.json({ entries, nextCursor, hasMore });
}

export async function POST(request: NextRequest) {
  let body: { content?: string; mood?: string; location?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = body.content?.trim();

  if (!content || content.length < 1) {
    return NextResponse.json(
      { error: "Entry cannot be empty" },
      { status: 400 }
    );
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `Entry cannot exceed ${MAX_CONTENT_LENGTH} characters` },
      { status: 400 }
    );
  }

  const mood = body.mood?.trim() || null;
  if (mood !== null && !MOODS.includes(mood as Mood)) {
    return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
  }

  const location = body.location?.trim().slice(0, 200) || null;

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("entries")
    .insert({ content, mood, location })
    .select("id, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { id: data.id, created_at: data.created_at },
    { status: 201 }
  );
}
