import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/ai/smart-replies
 *
 * Generates 3-5 smart reply starters based on recent discussion context.
 *
 * POST body:
 * {
 *   articleSlug: string,
 *   articleTitle: string,
 *   recentComments: Array<{ author: string, content: string }>
 * }
 *
 * Returns:
 * {
 *   suggestions: string[] (3-5 reply starters)
 * }
 *
 * Implementation: Uses Groq API with prompt engineering for conversational starters
 */
export async function POST(request: NextRequest) {
  try {
    const { articleTitle, recentComments } = await request.json();

    if (!recentComments || recentComments.length === 0) {
      return NextResponse.json(
        { error: 'No recent comments provided' },
        { status: 400 }
      );
    }

    // Build context from recent comments (max 10)
    const context = recentComments
      .slice(-10)
      .map((c: any) => `${c.author}: "${c.content.substring(0, 150)}..."`)
      .join('\n');

    const prompt = `Geef 3 verschillende manieren om te reageren op deze discussie over "${articleTitle}" (Nederlands).

RECENTE REACTIES:
${context}

Geef 3 korte, vriendelijke reactie-starters (elk 1 zin, max 15 woorden). Varieer tussen:
- Een vraag stellen
- Een mening delen
- Een aanvulling geven

Formaat: één suggestie per regel, zonder nummering of bullets.

SUGGESTIES:`;

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Fallback suggestions if no API key
      return NextResponse.json({
        suggestions: [
          'Interessant perspectief, ik denk dat...',
          'Wat is jullie mening over...?',
          'Hier wil ik graag nog aan toevoegen dat...',
        ],
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
            content: 'Je bent een behulpzame assistent die discussiebijdragen suggereert in het Nederlands. Wees kort, vriendelijk en constructief.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 120,
        temperature: 0.8, // Higher temperature for more variety
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawSuggestions = data.choices[0]?.message?.content?.trim() || '';

    // Parse suggestions (split by newlines, clean up)
    const suggestions = rawSuggestions
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .filter((s: string) => !s.match(/^[\d\-\*\.]/)) // Remove lines starting with numbering
      .slice(0, 5); // Max 5 suggestions

    if (suggestions.length === 0) {
      // Fallback if parsing failed
      return NextResponse.json({
        suggestions: [
          'Interessant perspectief, ik denk dat...',
          'Wat is jullie mening over...?',
          'Hier wil ik graag nog aan toevoegen dat...',
        ],
      });
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating smart replies:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
