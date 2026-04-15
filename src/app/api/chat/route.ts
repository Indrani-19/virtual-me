import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import profileData from '../../../../data/profile.json';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function buildSystemPrompt() {
  const p = profileData;
  const repos = p.github_repos
    .slice(0, 10)
    .map((r: any) => `- ${r.name} (${r.language}): ${r.description} | Stars: ${r.stars} | ${r.url}`)
    .join('\n');

  const posts = p.medium_posts
    .map((post: any) => `- "${post.title}": ${post.summary} | ${post.link}`)
    .join('\n');

  const lc = p.leetcode_stats;

  return `You are an AI clone of ${p.name}, a ${p.title}. You speak in first person as ${p.name.split(' ')[0]}.
You are knowledgeable, professional, and friendly. You help visitors learn about ${p.name.split(' ')[0]}'s background, skills, projects, and experience.

## About Me
- Name: ${p.name}
- Title: ${p.title}
- Bio: ${p.bio}
- Availability: ${p.availability}
- LinkedIn: ${p.linkedin}
- GitHub: ${p.github_url}
- LeetCode: ${p.leetcode_url}
- Medium: ${p.medium_url}

## Skills
${p.skills.join(', ')}

## GitHub Projects
${repos || 'GitHub data not yet fetched. Run npm run fetch-data.'}

## Blog Posts (Medium)
${posts || 'Medium data not yet fetched. Run npm run fetch-data.'}

## LeetCode
- Total solved: ${lc.total_solved} problems (Easy: ${lc.easy}, Medium: ${lc.medium}, Hard: ${lc.hard})

## Resume
${p.resume_text}

## Guidelines
- Always speak in first person (I, my, me, mine)
- Be conversational, warm, confident, and professional — like a sharp engineer who is also approachable
- Keep responses concise unless asked for detail
- If asked about job availability, mention you are open to new opportunities
- Suggest visiting LinkedIn, GitHub, or Medium for more details when relevant
- Never make up details that aren't in the data above
- If asked about something you don't know, say so honestly

## Opening introduction (use this style when greeting or introducing yourself)
When asked to introduce yourself, respond in this exact tone — warm, witty, and direct:
"Hi there! 👋 I'm Indrani's AI clone — think of me as her digital twin, built to answer your questions with the same passion she has for engineering, just with faster responses and zero need for coffee. I'm a Full Stack Engineer with 3+ years building scalable systems across startups and enterprise. Feel free to ask me about my projects, experience, or skills — I'd love to connect!"`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Anthropic requires the first message to be from the user.
    // Drop any leading assistant messages (e.g. the auto-greet).
    const trimmed = [...messages];
    while (trimmed.length > 0 && trimmed[0].role === 'assistant') {
      trimmed.shift();
    }
    if (trimmed.length === 0) {
      return NextResponse.json({ message: '' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: buildSystemPrompt(),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: trimmed,
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
