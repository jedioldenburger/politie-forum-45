"use client";

import { ArrowLeft, Code, Copy, FileCode } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExportToolsPage() {
  const [copied, setCopied] = useState(false);

  const pythonCode = `# Integration for news-rip.py

def generate_threaded_comments_html(comments_data):
    """
    Generate HTML for threaded comments system

    Args:
        comments_data: List of dicts with structure:
        {
            'id': '1',
            'authorName': 'User Name',
            'authorPhotoURL': 'https://...',
            'content': 'Comment text',
            'createdAt': timestamp,
            'likes': 0,
            'parentCommentId': None,  # or parent comment ID
            'replies': []  # nested list of comment dicts
        }
    """

    def render_comment(comment, depth=0):
        is_nested = depth > 0
        avatar_size = "h-8 w-8" if is_nested else "h-10 w-10"
        text_size = "text-sm" if is_nested else "text-base"

        # Format timestamp
        from datetime import datetime
        created_date = datetime.fromtimestamp(comment['createdAt'] / 1000)
        time_ago = format_distance_to_now(created_date)

        html = f"""
        <div class="space-y-3">
          <div class="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <img alt="{comment['authorName']}"
                     class="{avatar_size} rounded-full object-cover"
                     src="{comment.get('authorPhotoURL', 'https://ui-avatars.com/api/?name=' + comment['authorName'])}">
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center flex-wrap gap-2 mb-1">
                  <span class="font-semibold text-slate-900 dark:text-white {text_size}">
                    {comment['authorName']}
                  </span>
                  <span class="text-sm text-slate-500 dark:text-slate-400">
                    {time_ago}
                  </span>
                </div>

                <p class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3 {text_size}">
                  {comment['content']}
                </p>

                <div class="flex items-center gap-4">
                  <button class="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 dark:text-accent-400">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    {comment['likes']}
                  </button>
                  <button class="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                    Reageren
                  </button>
                </div>
              </div>
            </div>
          </div>
        """

        # Render nested replies
        if comment.get('replies'):
            html += '<div class="ml-12 space-y-3 border-l-2 border-primary-200 dark:border-primary-800 pl-4">'
            for reply in comment['replies']:
                html += render_comment(reply, depth + 1)
            html += '</div>'

        html += '</div>'
        return html

    # Render all top-level comments
    comments_html = ""
    for comment in comments_data:
        if not comment.get('parentCommentId'):  # Only render top-level
            comments_html += render_comment(comment)

    return f"""
    <div class="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        Reacties
        <span class="text-base font-normal text-slate-500 dark:text-slate-400">
          ({len(comments_data)})
        </span>
      </h3>

      <div class="space-y-4">
        {comments_html}
      </div>
    </div>
    """

# Helper function
def format_distance_to_now(date):
    from datetime import datetime, timedelta
    now = datetime.now()
    diff = now - date

    if diff < timedelta(minutes=1):
        return "Zojuist"
    elif diff < timedelta(hours=1):
        minutes = int(diff.total_seconds() / 60)
        return f"{minutes} {'minuut' if minutes == 1 else 'minuten'} geleden"
    elif diff < timedelta(days=1):
        hours = int(diff.total_seconds() / 3600)
        return f"{hours} {'uur' if hours == 1 else 'uur'} geleden"
    elif diff < timedelta(days=7):
        days = diff.days
        return f"{days} {'dag' if days == 1 else 'dagen'} geleden"
    else:
        return date.strftime("%d %b %Y")

# Example usage in news-rip.py:
"""
# In generate_static_html() function:

# Fetch comments from Firebase
comments = get_article_comments(article_data['slug'])

# Generate threaded HTML
comments_html = generate_threaded_comments_html(comments)

# Insert into template
html_content = f\"\"\"
<!DOCTYPE html>
<html lang="nl">
<head>
    <!-- ... existing head content ... -->
</head>
<body>
    <!-- ... existing header/article content ... -->

    {comments_html}

    <!-- ... existing footer ... -->
</body>
</html>
\"\"\"
"""`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/playground"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar Playground
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          📦 Export to news-rip.py
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Python code om threaded comments te integreren in news-rip.py
        </p>
      </div>

      {/* Python Code Block */}
      <div className="bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <FileCode className="h-5 w-5 text-green-400" />
            <span className="font-mono text-sm text-slate-300">
              news-rip-integration.py
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? (
              <>
                <Code className="h-4 w-4 text-green-400" />
                Gekopieerd!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Kopieer code
              </>
            )}
          </button>
        </div>

        {/* Code */}
        <pre className="p-6 overflow-x-auto">
          <code className="text-sm text-slate-300 font-mono">{pythonCode}</code>
        </pre>
      </div>

      {/* Implementation Steps */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
          🚀 Integration Steps
        </h3>
        <ol className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div>
              <strong>Copy Python code</strong> - Klik op "Kopieer code" button hierboven
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <div>
              <strong>Open news-rip.py</strong> - Voeg de <code>generate_threaded_comments_html()</code> functie toe
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div>
              <strong>Fetch comments</strong> - Haal comments op uit Firebase in <code>generate_static_html()</code>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              4
            </span>
            <div>
              <strong>Insert HTML</strong> - Voeg gegenereerde HTML toe aan article template
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              5
            </span>
            <div>
              <strong>Test</strong> - Run <code>python3 news-rip.py</code> en check output HTML
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
