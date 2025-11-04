import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Use Node.js runtime (firebase-admin requires Node.js built-in modules)
export const runtime = "nodejs";
export const alt = "Politie Forum Nederland";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

// Lazy import firebase-admin (only available in Node.js runtime)
async function fetchArticle(slug: string) {
  const { getServerArticle } = await import("@/lib/firebaseAdmin");
  return getServerArticle(slug);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    let { slug } = params;

    // Strip .jpg extension if present (for bot compatibility)
    slug = slug.replace(/\.jpg$/, '');

    // Fetch article from Firebase
    const article = await fetchArticle(slug);

    if (!article) {
      return new Response("Article not found", { status: 404 });
    }

    // Load Inter font for crisp typography
    const fontData = await fetch(
      new URL("https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff")
    ).then((res) => res.arrayBuffer());

    // Use article image if available, otherwise branded fallback
    const bgImage = article.imageUrl || "https://politie-forum.nl/og/politie-forum-1200x630.png";

    // Format date in Dutch
    const publishDate = new Date(article.publishedAt).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Truncate title if too long (max 100 chars for good display)
    const title = article.title.length > 100
      ? article.title.slice(0, 97) + "..."
      : article.title;

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            backgroundColor: "#001f5c", // primary-900
          }}
        >
          {/* Background with overlay */}
          <img
            src={bgImage}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.35) blur(1px)",
            }}
          />

          {/* Dark gradient overlay for better text contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,31,92,0.4) 0%, rgba(0,31,92,0.85) 100%)",
            }}
          />

          {/* Brand bar - top left */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 50,
              display: "flex",
              gap: 16,
              alignItems: "center",
              padding: "12px 20px",
              background: "rgba(0,31,92,0.9)",
              borderRadius: 12,
              border: "2px solid rgba(230,0,0,0.8)", // accent-500
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L4 7V13C4 18 8 21.5 12 22C16 21.5 20 18 20 13V7L12 2Z"
                fill="#e60000"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            <span
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Politie Forum Nederland
            </span>
          </div>

          {/* Category + Date badges */}
          <div
            style={{
              position: "absolute",
              bottom: 180,
              left: 50,
              display: "flex",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 24,
                color: "white",
                fontWeight: 600,
                background: "rgba(230,0,0,0.9)", // accent-500
                padding: "10px 18px",
                borderRadius: 8,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {article.category || "Nieuws"}
            </span>
            <span
              style={{
                fontSize: 24,
                color: "#e2e8f0",
                fontWeight: 500,
                background: "rgba(0,31,92,0.8)",
                padding: "10px 18px",
                borderRadius: 8,
              }}
            >
              {publishDate}
            </span>
          </div>

          {/* Article title - bottom, with safe padding */}
          <div
            style={{
              position: "absolute",
              left: 50,
              right: 50,
              bottom: 50,
              display: "flex",
              color: "white",
              fontSize: 56,
              lineHeight: 1.15,
              fontWeight: 800,
              textShadow: "0 4px 12px rgba(0,0,0,0.8)",
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            weight: 700,
            style: "normal",
          },
        ],
        headers: {
          // Cache for 24h, stale-while-revalidate for 7 days
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "Content-Type": "image/jpeg",
        },
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
