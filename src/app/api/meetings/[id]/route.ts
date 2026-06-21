import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'meetings.json');

function readMeetings(): any[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeMeetings(meetings: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(meetings, null, 2));
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const meetings = readMeetings();
  const meeting = meetings.find(m => m.id === params.id);
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(meeting);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const meetings = readMeetings();
  const idx = meetings.findIndex(m => m.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  meetings[idx] = { ...meetings[idx], ...body, id: params.id };
  writeMeetings(meetings);
  return NextResponse.json(meetings[idx]);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const meetings = readMeetings();
  const filtered = meetings.filter(m => m.id !== params.id);
  if (filtered.length === meetings.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  writeMeetings(filtered);
  return NextResponse.json({ success: true });
}
