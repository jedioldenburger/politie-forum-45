'use client';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx global>{`
        .article-content p {
          margin-bottom: 1.5rem;
          line-height: 1.75;
          color: rgb(51 65 85);
        }

        .dark .article-content p {
          color: rgb(203 213 225);
        }

        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          color: rgb(15 23 42);
        }

        .dark .article-content h2 {
          color: rgb(248 250 252);
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: rgb(30 41 59);
        }

        .dark .article-content h3 {
          color: rgb(241 245 249);
        }

        .article-content ul,
        .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content a {
          color: rgb(0 75 191);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .dark .article-content a {
          color: rgb(96 165 250);
        }

        .article-content a:hover {
          color: rgb(230 0 0);
        }

        .dark .article-content a:hover {
          color: rgb(252 165 165);
        }

        .article-content blockquote {
          border-left: 4px solid rgb(0 75 191);
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgb(71 85 105);
        }

        .dark .article-content blockquote {
          border-left-color: rgb(96 165 250);
          color: rgb(148 163 184);
        }

        .article-content img {
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .article-content code {
          background-color: rgb(241 245 249);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: ui-monospace, monospace;
        }

        .dark .article-content code {
          background-color: rgb(30 41 59);
        }
      `}</style>
    </article>
  );
}
