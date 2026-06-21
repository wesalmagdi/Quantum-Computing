import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'timeline.json');

export async function GET() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return NextResponse.json(JSON.parse(raw));
}
