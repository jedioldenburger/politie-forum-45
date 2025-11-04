import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/ai/summarize-thread
 *
 * Generates an AI summary of a discussion thread.
 *
 * POST body:
 * {
 *   articleSlug: string,
 *   articleTitle: string,
 *   comments: Array<{ author: string, content: string, likes: number }>
 * }
 *
 * Returns:
 * {
 *   summary: string (2-3 sentence overview)
 * }
 *
 * Implementation: Uses Groq API (same as news-rip.py)
 * Model: llama-3.1-8b-instant (fast, cost-effective)
 */
export async function POST(request: NextRequest) {
  try {
    const { articleTitle, comments } = await request.json();

    if (!comments || comments.length === 0) {
      return NextResponse.json(
        { error: 'No comments provided' },
        { status: 400 }
      );
    }

    // Build prompt for AI
    const commentSummary = comments
      .slice(0, 20)
      .map((c: any, idx: number) => `${idx + 1}. ${c.author}: "${c.content.substring(0, 200)}..." (${c.likes} likes)`)
      .join('\n');

    const prompt = `Schrijf een korte Nederlandse samenvatting (2-3 zinnen) van deze discussie over het artikel "${articleTitle}".

REACTIES:
${commentSummary}

Geef een objectieve samenvatting van de belangrijkste standpunten en thema's in de discussie. Gebruik vriendelijke, neutrale taal.

SAMENVATTING:`;

    // Call Groq API (or OpenAI, Anthropic, etc.)
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Fallback if no API key
      return NextResponse.json({
        summary: `Er zijn ${comments.length} reacties op dit artikel met verschillende meningen en perspectieven. De discussie behandelt belangrijke aspecten van dit nieuwsbericht.`,
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Je bent een behulpzame assistent die discussies samenvat in het Nederlands. Wees kort, objectief en vriendelijk.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim() || 'Geen samenvatting beschikbaar.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating thread summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
