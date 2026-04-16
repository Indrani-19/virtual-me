import { NextRequest, NextResponse } from 'next/server';

function cleanForTTS(raw: string): string {
  return raw
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, '') // strip emojis & non-printable chars
    .replace(/\*\*([^*]+)\*\*/g, '$1')            // bold
    .replace(/[*_`#]/g, '')                        // other markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')       // links
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000);                               // ElevenLabs free tier: safe limit
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const cleaned = cleanForTTS(text ?? '');
    if (!cleaned) return NextResponse.json({ error: 'No text' }, { status: 400 });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleaned,
          model_id: 'eleven_flash_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', response.status, err);
      return NextResponse.json({ error: 'TTS failed', detail: err }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Speak API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
