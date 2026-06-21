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

export async function GET() {
  const meetings = readMeetings();
  return NextResponse.json(meetings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const meetings = readMeetings();
  const newMeeting = {
    id: String(Date.now()),
    title: body.title,
    date: body.date,
    discussed: body.discussed || '',
    actionItems: body.actionItems || [],
    attachments: body.attachments || [],
  };
  meetings.push(newMeeting);
  writeMeetings(meetings);
  return NextResponse.json(newMeeting, { status: 201 });
}
