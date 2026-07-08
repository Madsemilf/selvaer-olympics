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

async function getBlobStore() {
  const { getStore } = await import('@netlify/blobs');
  try {
    return getStore('results');
  } catch (err) {
    if (err instanceof Error && err.name === 'MissingBlobsEnvironmentError') return null;
    throw err;
  }
}

export async function getPlacements(): Promise<Placements> {
  const store = await getBlobStore();
  if (!store) return readLocal();
  return (await store.get('placements', { type: 'json' })) ?? {};
}

export async function setPlacements(data: Placements): Promise<void> {
  const store = await getBlobStore();
  if (!store) { await writeLocal(data); return; }
  await store.setJSON('placements', data);
}
