/**
 * Microdata Navigation Components
 * Provides schema.org microdata markup for SEO
 */

import Link from "next/link";

// Site Navigation with Microdata
export function MicrodataNav() {
  return (
    <nav
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
      aria-label="Hoofdmenu"
      className="flex gap-6"
    >
      <Link href="/nieuws" itemProp="url">
        <span itemProp="name">Nieuws</span>
      </Link>
      <Link href="/categorieen" itemProp="url">
        <span itemProp="name">Categorieën</span>
      </Link>
      <Link href="/over" itemProp="url">
        <span itemProp="name">Over</span>
      </Link>
      <Link href="/contact" itemProp="url">
        <span itemProp="name">Contact</span>
      </Link>
    </nav>
  );
}

// Breadcrumb Navigation with Microdata
interface BreadcrumbItem {
  name: string;
  href: string;
  position: number;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function MicrodataBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className="text-sm text-gray-600"
    >
      {items.map((item, index) => (
        <span
          key={item.position}
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link itemProp="item" href={item.href}>
            <span itemProp="name">{item.name}</span>
          </Link>
          <meta itemProp="position" content={item.position.toString()} />
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}

// Logo with Microdata
export function MicrodataLogo() {
  return (
    <Link href="https://politie-forum.nl" itemProp="url">
      <img
        src="/logo.svg"
        alt="Politie Forum Nederland"
        itemProp="logo"
        className="h-10 w-auto"
      />
    </Link>
  );
}

// Forum Thread List with Microdata
interface ForumThread {
  id: string;
  title: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  author: string;
  replyCount?: number;
  viewCount?: number;
}

interface ThreadListProps {
  threads: ForumThread[];
  title?: string;
}

export function MicrodataThreadList({
  threads,
  title = "Recente discussies",
}: ThreadListProps) {
  return (
    <section
      itemScope
      itemType="https://schema.org/ItemList"
      aria-labelledby="recent-threads"
    >
      <h2 id="recent-threads" className="text-2xl font-bold mb-4">
        {title}
      </h2>
      <meta
        itemProp="itemListOrder"
        content="https://schema.org/ItemListOrderDescending"
      />
      <meta itemProp="name" content={title} />

      <div className="space-y-4">
        {threads.map((thread, index) => (
          <article
            key={thread.id}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="border-b pb-4"
          >
            <meta itemProp="position" content={(index + 1).toString()} />
            <Link
              itemProp="url"
              href={`/topic/${thread.slug}`}
              className="block hover:bg-gray-50 p-2 rounded"
            >
              <span
                itemProp="name"
                className="text-lg font-semibold text-blue-700"
              >
                {thread.title}
              </span>
            </Link>

            <div
              itemProp="item"
              itemScope
              itemType="https://schema.org/DiscussionForumPosting"
              className="text-sm text-gray-600 mt-2"
            >
              <meta itemProp="headline" content={thread.title} />
              <meta itemProp="datePublished" content={thread.datePublished} />
              <meta itemProp="dateModified" content={thread.dateModified} />

              <div
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
              >
                <meta itemProp="name" content={thread.author} />
              </div>

              <div className="flex gap-4 text-xs">
                <span>
                  Geplaatst:{" "}
                  {new Date(thread.datePublished).toLocaleDateString("nl-NL")}
                </span>
                {thread.replyCount !== undefined && (
                  <>
                    <span>•</span>
                    <span>{thread.replyCount} reacties</span>
                    <div
                      itemProp="interactionStatistic"
                      itemScope
                      itemType="https://schema.org/InteractionCounter"
                      style={{ display: "none" }}
                    >
                      <meta
                        itemProp="interactionType"
                        content="https://schema.org/CommentAction"
                      />
                      <meta
                        itemProp="userInteractionCount"
                        content={thread.replyCount.toString()}
                      />
                    </div>
                  </>
                )}
                {thread.viewCount !== undefined && (
                  <>
                    <span>•</span>
                    <span>{thread.viewCount} weergaven</span>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Forum Post Detail with Microdata (for individual thread pages)
interface ForumPostProps {
  title: string;
  datePublished: string;
  dateModified: string;
  author: string;
  content: string;
  replyCount?: number;
}

export function MicrodataForumPost({
  title,
  datePublished,
  dateModified,
  author,
  content,
  replyCount,
}: ForumPostProps) {
  return (
    <main itemScope itemType="https://schema.org/DiscussionForumPosting">
      <h1 itemProp="headline" className="text-3xl font-bold mb-4">
        {title}
      </h1>

      <div className="text-sm text-gray-600 mb-6">
        <time itemProp="datePublished" dateTime={datePublished}>
          {new Date(datePublished).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {dateModified !== datePublished && (
          <>
            {" • "}
            Laatst bijgewerkt:{" "}
            <time itemProp="dateModified" dateTime={dateModified}>
              {new Date(dateModified).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </>
        )}
      </div>

      <div itemProp="author" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content={author} />
        <p className="text-sm font-semibold mb-4">Door: {author}</p>
      </div>

      <article itemProp="articleBody" className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {replyCount !== undefined && replyCount > 0 && (
        <div
          itemProp="interactionStatistic"
          itemScope
          itemType="https://schema.org/InteractionCounter"
          style={{ display: "none" }}
        >
          <meta
            itemProp="interactionType"
            content="https://schema.org/CommentAction"
          />
          <meta
            itemProp="userInteractionCount"
            content={replyCount.toString()}
          />
        </div>
      )}
    </main>
  );
}
