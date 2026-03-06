import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("get_random_entry");

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "No entries found" }, { status: 404 });
  }

  return NextResponse.json({ id: data[0].id });
}
