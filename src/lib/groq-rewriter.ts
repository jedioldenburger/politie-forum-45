/**
 * Groq AI Integration for Article Rewriting
 * Uses Groq's free tier to rewrite Politie.nl RSS articles for forum posting
 */

import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface RewrittenArticle {
  title: string;
  content: string;
  originalLink: string;
  categories: string[];
}

/**
 * Rewrite a police news article using Groq AI
 * Makes it more engaging for forum discussion while keeping facts accurate
 */
export async function rewriteArticleWithGroq(
  originalTitle: string,
  originalContent: string,
  originalLink: string,
  categories: string[] = []
): Promise<RewrittenArticle | null> {
  try {
    const prompt = `Je bent een Nederlandse politie nieuwsredacteur. Herschrijf het volgende politiebericht voor een forum.

BELANGRIJKE REGELS:
- Behoud ALLE feiten en details exact zoals ze zijn
- Maak de titel pakkend maar professioneel
- Schrijf de content in helder Nederlands
- Voeg een korte inleiding toe die discussie uitnodigt
- Eindig met een vraag aan de community
- Gebruik alinea's voor leesbaarheid
- Voeg ALTIJD onderaan toe: "Bron: ${originalLink}"
- Maximaal 300 woorden

ORIGINELE TITEL:
${originalTitle}

ORIGINELE CONTENT:
${originalContent}

Geef het resultaat in dit JSON formaat:
{
  "title": "herschreven titel",
  "content": "herschreven content met bron link onderaan"
}`;

    // Timeout protection: 8s max for Groq API
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Groq API timeout')), 8000)
    );

    const chatCompletion = await Promise.race([
      groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile", // Free tier model
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
      timeoutPromise
    ]);

    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) {
      console.error("No response from Groq API");
      return null;
    }

    const parsed = JSON.parse(response);

    return {
      title: parsed.title || originalTitle,
      content: parsed.content || originalContent,
      originalLink,
      categories,
    };
  } catch (error) {
    console.error("Error rewriting article with Groq:", error);
    return null;
  }
}

/**
 * Batch rewrite multiple articles with rate limiting for free tier
 * Free tier: 30 requests per minute, 14,400 per day
 */
export async function rewriteArticlesBatch(
  articles: Array<{
    title: string;
    content: string;
    link: string;
    categories?: string[];
  }>,
  delayMs: number = 2000 // 2 seconds between requests to respect rate limits
): Promise<RewrittenArticle[]> {
  const rewritten: RewrittenArticle[] = [];

  for (const article of articles) {
    console.log(`Rewriting article: ${article.title.substring(0, 50)}...`);

    const result = await rewriteArticleWithGroq(
      article.title,
      article.content,
      article.link,
      article.categories
    );

    if (result) {
      rewritten.push(result);
      console.log(`✅ Rewritten: ${result.title.substring(0, 50)}...`);
    } else {
      console.log(`❌ Failed to rewrite: ${article.title}`);
    }

    // Rate limiting delay
    if (articles.indexOf(article) < articles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return rewritten;
}
