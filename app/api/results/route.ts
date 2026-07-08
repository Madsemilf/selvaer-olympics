import { NextRequest, NextResponse } from 'next/server';
import { getPlacements, setPlacements } from '@/lib/storage';
import type { Placements } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getPlacements();
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/results failed:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Placements = await request.json();
    await setPlacements(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/results failed:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
