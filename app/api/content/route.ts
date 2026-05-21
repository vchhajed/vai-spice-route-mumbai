import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { content as staticContent } from "@/lib/content";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const siteId = process.env.NEXT_PUBLIC_SITE_ID!;

export const revalidate = 60;

export async function GET() {
  const { data } = await supabase
    .from("site_content")
    .select("content_json")
    .eq("site_id", siteId)
    .single();

  return NextResponse.json(data?.content_json ?? staticContent);
}

export async function PATCH(req: NextRequest) {
  const patch = await req.json();

  const { data: existing } = await supabase
    .from("site_content")
    .select("content_json")
    .eq("site_id", siteId)
    .single();

  const base = existing?.content_json ?? staticContent;
  const merged = deepMerge(base, patch);

  await supabase.from("site_content").upsert({ site_id: siteId, content_json: merged, updated_at: new Date().toISOString() });

  return NextResponse.json({ success: true });
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge((target[key] as Record<string, unknown>) ?? {}, source[key] as Record<string, unknown>);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
