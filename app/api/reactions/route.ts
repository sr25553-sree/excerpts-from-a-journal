import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { REACTION_TYPES } from "@/lib/types";
import type { ReactionType } from "@/lib/types";

export async function POST(request: NextRequest) {
  let body: { entryId?: string; type?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { entryId, type } = body;

  if (!entryId || typeof entryId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid entryId" },
      { status: 400 }
    );
  }

  if (!type || !REACTION_TYPES.includes(type as ReactionType)) {
    return NextResponse.json(
      { error: "Invalid reaction type" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { error } = await supabase
    .from("reactions")
    .insert({ entry_id: entryId, type });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save reaction" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
