import { NextResponse } from "next/server";
import { searchMedia } from "@/lib/services/media";

export async function GET() {
  try {
    const res = await searchMedia("a", 1);
    return NextResponse.json(res);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
