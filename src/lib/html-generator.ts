/**
 * Static HTML Generator for Forum Articles
 * Generates clean HTML files with proper SEO, header, footer, and forum comments
 */

import { RewrittenArticle } from "./groq-rewriter";

/**
 * Extract URL slug from original Politie.nl URL
 * Example: https://www.politie.nl/nieuws/2025/oktober/4/08-man-aangehouden-en-aanhanger-in-beslag-genomen.html
 * Returns: man-aangehouden-en-aanhanger-in-beslag-genomen
 */
export function extractSlugFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Extract filename without .html
    const filename = pathname.split("/").pop()?.replace(".html", "") || "";

    // Remove leading numbers and hyphens (e.g., "08-" or "4-")
    const cleanSlug = filename.replace(/^\d+-/, "");

    return cleanSlug || "article";
  } catch (error) {
    console.error("Error extracting slug:", error);
    return "article";
  }
}

/**
 * Generate NewsArticle and DiscussionForumPosting JSON-LD for SEO
 */
function generateArticleJsonLd(
  article: RewrittenArticle,
  slug: string,
  publishDate: string
): string {
  const baseUrl = "https://politie-forum.nl";
  const articleUrl = `${baseUrl}/forum/${slug}/`;

  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsArticle",
      "headline": ${JSON.stringify(article.title)},
      "description": ${JSON.stringify(article.content.substring(0, 200) + "...")},
      "author": {
        "@type": "Organization",
        "name": "Politie Nieuws Bot",
        "url": "${baseUrl}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Politie Forum Nederland",
        "logo": {
          "@type": "ImageObject",
          "url": "${baseUrl}/politie_forum_logo_pack/android-chrome-512x512.png"
        }
      },
      "datePublished": "${publishDate}",
      "dateModified": "${publishDate}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${articleUrl}"
      },
      "articleBody": ${JSON.stringify(article.content)},
      "url": "${articleUrl}",
      "inLanguage": "nl-NL",
      "isAccessibleForFree": true
    },
    {
      "@type": "DiscussionForumPosting",
      "headline": ${JSON.stringify(article.title)},
      "text": ${JSON.stringify(article.content)},
      "datePublished": "${publishDate}",
      "author": {
        "@type": "Person",
        "name": "Politie Nieuws Bot"
      },
      "url": "${articleUrl}",
      "discussionUrl": "${articleUrl}#comments",
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": 0
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "${baseUrl}"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Forum",
          "item": "${baseUrl}/forum"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": ${JSON.stringify(article.title)},
          "item": "${articleUrl}"
        }
      ]
    }
  ]
}
</script>`;
}

/**
 * Generate complete static HTML file
 */
export function generateStaticHTML(
  article: RewrittenArticle,
  slug: string,
  publishDate: string
): string {
  const baseUrl = "https://politie-forum.nl";
  const articleUrl = `${baseUrl}/forum/${slug}/`;

  // Convert markdown content to HTML paragraphs
  const contentHtml = article.content
    .split("\n\n")
    .map((para) => {
      // Check if it's a header
      if (para.startsWith("# ")) {
        return `<h2>${para.replace("# ", "")}</h2>`;
      }
      if (para.startsWith("## ")) {
        return `<h3>${para.replace("## ", "")}</h3>`;
      }
      // Check for links
      const withLinks = para.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:underline">$1</a>'
      );
      return `<p>${withLinks}</p>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="nl-NL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | Politie Forum Nederland</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="${article.content.substring(0, 160).replace(/"/g, "&quot;")}...">
    <meta name="keywords" content="politie nieuws, ${article.categories.join(", ")}, politie forum, nederland">
    <meta name="author" content="Politie Nieuws Bot">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${articleUrl}">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.content.substring(0, 200).replace(/"/g, "&quot;")}...">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:site_name" content="Politie Forum Nederland">
    <meta property="og:locale" content="nl_NL">
    <meta property="og:image" content="${baseUrl}/og/politie-forum-1200x630.png">
    <meta property="article:published_time" content="${publishDate}">
    <meta property="article:author" content="Politie Nieuws Bot">
    <meta property="article:section" content="Politie Nieuws">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${article.title}">
    <meta name="twitter:description" content="${article.content.substring(0, 200).replace(/"/g, "&quot;")}...">
    <meta name="twitter:image" content="${baseUrl}/og/politie-forum-1200x630.png">

    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="${baseUrl}/politie_forum_logo_pack/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="${baseUrl}/politie_forum_logo_pack/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="${baseUrl}/politie_forum_logo_pack/apple-touch-icon.png">

    <!-- Tailwind CSS CDN (for production, use built CSS) -->
    <script src="https://cdn.tailwindcss.com"></script>

    ${generateArticleJsonLd(article, slug, publishDate)}
</head>
<body class="bg-slate-50 dark:bg-slate-900">

    <!-- Header (from main index) -->
    <header class="bg-primary-800 text-white shadow-lg border-b-[3px] border-white fixed w-full top-0 z-50" itemscope itemtype="https://schema.org/WPHeader">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo & Brand -->
                <div class="flex items-center gap-3">
                    <a href="${baseUrl}/" class="flex items-center gap-3 hover:opacity-90 transition-opacity" itemprop="url">
                        <img
                            src="${baseUrl}/politie_forum_logo_pack/android-chrome-192x192.png"
                            alt="Politie Forum Logo"
                            class="h-10 w-10"
                            itemprop="logo"
                        />
                        <div itemprop="name">
                            <span class="font-bold text-xl hidden sm:block">Politie Forum NL</span>
                        </div>
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-6" itemscope itemtype="https://schema.org/SiteNavigationElement">
                    <a href="${baseUrl}/" class="hover:text-accent-400 transition-colors" itemprop="url">
                        <span itemprop="name">Home</span>
                    </a>
                    <a href="${baseUrl}/forum" class="hover:text-accent-400 transition-colors" itemprop="url">
                        <span itemprop="name">Forum</span>
                    </a>
                    <a href="${baseUrl}/categorieen" class="hover:text-accent-400 transition-colors" itemprop="url">
                        <span itemprop="name">Categorieën</span>
                    </a>
                    <a href="${baseUrl}/nieuws" class="hover:text-accent-400 transition-colors" itemprop="url">
                        <span itemprop="name">Nieuws</span>
                    </a>
                </nav>

                <!-- Mobile Menu Button -->
                <button class="md:hidden text-white hover:text-accent-400 transition-colors" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Menu (hidden by default) -->
        <div id="mobile-menu" class="hidden md:hidden bg-primary-900 border-t border-primary-700">
            <nav class="px-4 py-4 space-y-2">
                <a href="${baseUrl}/" class="block py-2 hover:text-accent-400 transition-colors">Home</a>
                <a href="${baseUrl}/forum" class="block py-2 hover:text-accent-400 transition-colors">Forum</a>
                <a href="${baseUrl}/categorieen" class="block py-2 hover:text-accent-400 transition-colors">Categorieën</a>
                <a href="${baseUrl}/nieuws" class="block py-2 hover:text-accent-400 transition-colors">Nieuws</a>
            </nav>
        </div>
    </header>    <!-- Main Content -->
    <main class="pt-20 min-h-screen">
        <article class="max-w-4xl mx-auto px-4 py-12">

            <!-- Breadcrumb -->
            <nav class="mb-6 text-sm" aria-label="Breadcrumb">
                <ol class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <li><a href="/" class="hover:text-primary-600">Home</a></li>
                    <li>/</li>
                    <li><a href="/forum" class="hover:text-primary-600">Forum</a></li>
                    <li>/</li>
                    <li class="text-slate-900 dark:text-white">${article.title}</li>
                </ol>
            </nav>

            <!-- Article Header -->
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    ${article.title}
                </h1>
                <div class="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>📅 ${new Date(publishDate).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span>✍️ Politie Nieuws Bot</span>
                    ${article.categories.length > 0 ? `<span>🏷️ ${article.categories.join(", ")}</span>` : ""}
                </div>
            </header>

            <!-- Article Content -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-12">
                <div class="prose prose-slate dark:prose-invert max-w-none">
                    ${contentHtml}
                </div>
            </div>

            <!-- Original Source -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-12">
                <p class="text-sm text-blue-900 dark:text-blue-100">
                    📰 <strong>Originele bron:</strong>
                    <a href="${article.originalLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
                        ${article.originalLink}
                    </a>
                </p>
            </div>

            <!-- Comments Section (Firebase Integration) -->
            <section id="comments" class="mt-12">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    💬 Discussie
                </h2>

                <!-- Comment Form -->
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
                    <h3 class="font-semibold text-slate-900 dark:text-white mb-4">Plaats een reactie</h3>
                    <p class="text-slate-600 dark:text-slate-400 text-sm">
                        ℹ️ Reacties worden geladen via Firebase.
                        <a href="/" class="text-primary-600 hover:underline">Login</a> om te reageren.
                    </p>
                </div>

                <!-- Comments List -->
                <div id="comments-list" class="space-y-4">
                    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center text-slate-500">
                        Nog geen reacties. Wees de eerste om te reageren!
                    </div>
                </div>
            </section>

        </article>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white mt-20">
        <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">

                <!-- About -->
                <div>
                    <h3 class="font-bold text-lg mb-4">Politie Forum NL</h3>
                    <p class="text-slate-400 text-sm">
                        Het grootste Nederlandse forum over de politie, veiligheid en justitie.
                    </p>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="font-bold text-lg mb-4">Snelle Links</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/" class="text-slate-400 hover:text-white">Home</a></li>
                        <li><a href="/forum" class="text-slate-400 hover:text-white">Forum</a></li>
                        <li><a href="/categorieen" class="text-slate-400 hover:text-white">Categorieën</a></li>
                        <li><a href="/nieuws" class="text-slate-400 hover:text-white">Nieuws</a></li>
                    </ul>
                </div>

                <!-- Categories -->
                <div>
                    <h3 class="font-bold text-lg mb-4">Categorieën</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/categorieen/cat1" class="text-slate-400 hover:text-white">Algemeen</a></li>
                        <li><a href="/categorieen/cat2" class="text-slate-400 hover:text-white">Sollicitatie</a></li>
                        <li><a href="/categorieen/cat3" class="text-slate-400 hover:text-white">Academie</a></li>
                        <li><a href="/categorieen/cat4" class="text-slate-400 hover:text-white">Werken</a></li>
                    </ul>
                </div>

                <!-- Legal -->
                <div>
                    <h3 class="font-bold text-lg mb-4">Juridisch</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/privacy" class="text-slate-400 hover:text-white">Privacy</a></li>
                        <li><a href="/voorwaarden" class="text-slate-400 hover:text-white">Voorwaarden</a></li>
                        <li><a href="/contact" class="text-slate-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
                <p>&copy; ${new Date().getFullYear()} Politie Forum Nederland. Alle rechten voorbehouden.</p>
            </div>
        </div>
    </footer>

    <!-- Firebase Comments Integration (optional) -->
    <script type="module">
        // Mobile menu toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        }
        window.toggleMobileMenu = toggleMobileMenu;

        // Firebase will be integrated here for dynamic comments
        console.log('Forum article loaded: ${slug}');
    </script>

</body>
</html>`;
}
