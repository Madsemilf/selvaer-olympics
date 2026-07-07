import fs from 'fs/promises';
import path from 'path';
import type { Placements } from './types';

const LOCAL_PATH = path.join(process.cwd(), 'data', 'results.json');

async function readLocal(): Promise<Placements> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

async function writeLocal(data: Placements): Promise<void> {
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2));
}

export async function getPlacements(): Promise<Placements> {
  if (!process.env.NETLIFY) return readLocal();
  const { getStore } = await import('@netlify/blobs');
  return (await getStore('results').get('placements', { type: 'json' })) ?? {};
}

export async function setPlacements(data: Placements): Promise<void> {
  if (!process.env.NETLIFY) { await writeLocal(data); return; }
  const { getStore } = await import('@netlify/blobs');
  await getStore('results').setJSON('placements', data);
}
