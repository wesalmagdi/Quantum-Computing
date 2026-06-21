import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}`, name: file.name });
}
