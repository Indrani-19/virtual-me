import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const TO = 'indraniinapakolla@gmail.com';

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface Entry {
  id: string;
  name: string;
  message: string;
  ts: string;
}

async function sendEmailNotification(entry: Entry) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const time = new Date(entry.ts).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  await transporter.sendMail({
    from: `"Virtual Me Feedback" <${user}>`,
    to: TO,
    subject: `💬 New feedback from ${entry.name}`,
    text: `From: ${entry.name}\nTime: ${time} PT\n\n${entry.message}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0a0d26;color:#e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:20px 24px">
          <h2 style="margin:0;font-size:18px;color:#fff">💬 New Feedback</h2>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8;color:#e0e7ff">virtual-me portfolio</p>
        </div>
        <div style="padding:20px 24px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <div style="width:36px;height:36px;border-radius:50%;background:rgba(99,102,241,0.2);border:1.5px solid rgba(99,102,241,0.4);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#a78bfa">
              ${entry.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight:600;font-size:14px;color:#c7d2fe">${entry.name}</div>
              <div style="font-size:11px;color:#64748b">${time} PT</div>
            </div>
          </div>
          <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:10px;padding:14px 16px">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#94a3b8">${entry.message.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function GET() {
  const { data, error } = await supabase()
    .from('feedback')
    .select('*')
    .order('ts', { ascending: false })
    .limit(60);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { name, message } = await req.json();
  const msg = (message ?? '').trim().slice(0, 500);
  if (!msg) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  const entry = {
    name: (name ?? '').trim().slice(0, 50) || 'Anonymous',
    message: msg,
  };

  const { data, error } = await supabase()
    .from('feedback')
    .insert(entry)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  sendEmailNotification(data).catch(err =>
    console.warn('Email notification failed:', err.message)
  );

  return NextResponse.json({ entry: data }, { status: 201 });
}
