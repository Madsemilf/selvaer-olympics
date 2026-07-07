import { NextRequest, NextResponse } from 'next/server';
import { getPlacements, setPlacements } from '@/lib/storage';
import type { Placements } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPlacements();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body: Placements = await request.json();
  await setPlacements(body);
  return NextResponse.json({ ok: true });
}
