// /app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Zorg dat dit in de Node runtime draait (niet Edge) en altijd dynamisch is
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleRevalidate(secret: string, path?: string) {
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { message: "REVALIDATE_SECRET not configured" },
      { status: 500 }
    );
  }
  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Target pad (default/fallback = / zodat Populaire Forum Artikelen meeververst)
  const targetPath = path || "/";

  // Revalidate de doelpagina (bv. /nieuws/slug)
  revalidatePath(targetPath);

  // Revalidate indexen/overzichten die de nieuwe content tonen
  revalidatePath("/nieuws"); // nieuwsindex
  revalidatePath("/forum");  // forum (Populaire Forum Artikelen blok)

  return NextResponse.json({
    revalidated: true,
    path: targetPath,
    timestamp: new Date().toISOString(),
  });
}

// POST /api/revalidate  { secret, path?: string }
export async function POST(request: NextRequest) {
  try {
    const { secret, path } = await request.json();
    if (!secret) {
      return NextResponse.json({ message: "Missing secret" }, { status: 400 });
    }
    return handleRevalidate(secret, path);
  } catch (e) {
    console.error("Revalidation error (POST):", e);
    return NextResponse.json(
      { message: "Error processing POST revalidate", error: String(e) },
      { status: 500 }
    );
  }
}

// GET /api/revalidate?secret=...&path=/nieuws/slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret") || "";
    const path = searchParams.get("path") || undefined;

    if (!secret) {
      return NextResponse.json({ message: "Missing secret" }, { status: 400 });
    }
    return handleRevalidate(secret, path);
  } catch (e) {
    console.error("Revalidation error (GET):", e);
    return NextResponse.json(
      { message: "Error processing GET revalidate", error: String(e) },
      { status: 500 }
    );
  }
}
