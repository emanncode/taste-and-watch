import { NextResponse } from 'next/server';
import { searchMedia } from '@/lib/services/media';

export async function GET() {
  try {
    const res = await searchMedia("a", 1);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
