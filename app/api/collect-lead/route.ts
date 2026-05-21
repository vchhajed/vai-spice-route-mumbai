import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const siteId = process.env.NEXT_PUBLIC_SITE_ID;

    const { error } = await supabase.from("leads").insert({
      site_id: siteId,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() ?? null,
      message: message?.trim() ?? null,
      status: "new",
    });

    if (error) throw error;

    await supabase.from("page_views").upsert(
      { site_id: siteId, date: new Date().toISOString().slice(0, 10), count: 1 },
      { onConflict: "site_id,date", ignoreDuplicates: false }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[collect-lead]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
