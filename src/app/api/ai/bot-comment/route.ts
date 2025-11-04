import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/ai/bot-comment
 *
 * Generates a contextual insight from the AI bot for threads with 5+ comments.
 * Bot comments are clearly labeled and include a disclaimer.
 *
 * POST body:
 * {
 *   articleSlug: string,
 *   articleTitle: string,
 *   commentCount: number,
 *   topComments: Array<{ author: string, content: string, likes: number }>
 * }
 *
 * Returns:
 * {
 *   comment: string (1-2 sentence insight)
 * }
 *
 * Implementation: Uses Groq API to generate thoughtful, context-aware insights
 */
export async function POST(request: NextRequest) {
  try {
    const { articleTitle, commentCount, topComments } = await request.json();

    if (!topComments || topComments.length === 0) {
      return NextResponse.json(
        { error: 'No comments provided' },
        { status: 400 }
      );
    }

    // Build context from top comments (most liked)
    const context = topComments
      .slice(0, 5)
      .map((c: any, idx: number) => `${idx + 1}. ${c.author}: "${c.content.substring(0, 200)}..." (${c.likes} likes)`)
      .join('\n');

    const prompt = `Je bent een forum bot die nuttige inzichten deelt in discussies. Schrijf 1-2 zinnen (max 30 woorden) die een waardevol perspectief toevoegen aan deze discussie over "${articleTitle}".

DISCUSSIE-CONTEXT:
- Artikel: "${articleTitle}"
- Aantal reacties: ${commentCount}

TOP REACTIES:
${context}

Geef een inzicht dat:
- Een patroon of thema in de discussie benoemt
- Een constructieve vraag stelt of perspectief biedt
- Vriendelijk en neutraal is
- GEEN advies geeft over juridische of medische zaken
- Discussie stimuleert zonder polarisatie

BOT INZICHT:`;

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Fallback if no API key
      return NextResponse.json({
        comment: `Er zijn al ${commentCount} reacties op dit artikel met interessante perspectieven. Het lijkt erop dat dit onderwerp veel mensen bezig houdt.`,
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
            content: 'Je bent een behulpzame forum bot die constructieve inzichten deelt in Nederlandse discussies. Wees kort, vriendelijk en stimulerend zonder te polariseren.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 80,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const comment = data.choices[0]?.message?.content?.trim() || 'Er zijn interessante standpunten in deze discussie. Wat vinden jullie het belangrijkste aspect?';

    // Clean up the comment (remove quotes if AI added them)
    const cleanComment = comment.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({ comment: cleanComment });
  } catch (error) {
    console.error('Error generating bot comment:', error);
    return NextResponse.json(
      { error: 'Failed to generate bot comment' },
      { status: 500 }
    );
  }
}
