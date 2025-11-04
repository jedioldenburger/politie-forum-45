"use client";

import AuthModal from "@/components/AuthModal";
import ArticleComments from "@/components/ArticleComments";
import Header from "@/components/Header";
import JsonLdArticleWithDiscussion from "@/components/JsonLdArticleWithDiscussion";
import { NewsArticle } from "@/data/news";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Share2,
  User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BASE_URL = "https://politie-forum.nl";

interface ArticleClientProps {
  article: NewsArticle;
  slug: string;
}

export default function ArticleClient({ article, slug }: ArticleClientProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const toIsoStringWithFallback = (value?: string | null) => {
    if (!value) {
      return new Date().toISOString();
    }

    if (/T.*(Z|[+-]\d{2}:\d{2})$/.test(value)) {
      return value;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();
  };

  // Image upload handler with validation
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 1024 * 1024; // 1MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "❌ Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed."
      );
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setUploadError(
        `❌ File too large! Maximum size is 1MB. Your file: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImages([...uploadedImages, { url: imageUrl, file }]);

      // Auto-insert image markdown into comment
      const imageName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setComment(
        comment + (comment ? "\n" : "") + `![${imageName}](${imageUrl})`
      );
      setUploadError(null);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);

    // Remove from comment text
    const imageToRemove = uploadedImages[index];
    setComment(
      comment.replace(
        new RegExp(
          `!\\[.*?\\]\\(${imageToRemove.url.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}\\)`,
          "g"
        ),
        ""
      )
    );
  };

  // Drag and drop handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageUpload(e.dataTransfer.files);
  };

  // Enhanced text formatting with markdown-like syntax
  const formatCommentText = (text: string) => {
    // Split by lines to handle blockquotes and code blocks
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code block (```)
      if (line.trim().startsWith("```")) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre
            key={i}
            className="my-3 p-4 bg-slate-900 dark:bg-slate-950 rounded-lg overflow-x-auto border border-slate-700"
          >
            <code className="text-sm text-green-400 font-mono">
              {codeLines.join("\n")}
            </code>
          </pre>
        );
        i++;
        continue;
      }

      // Blockquote (>)
      if (line.trim().startsWith(">")) {
        const quoteText = line.replace(/^>\s*/, "");
        elements.push(
          <blockquote
            key={i}
            className="my-2 pl-4 border-l-4 border-primary-500 dark:border-primary-400 italic text-slate-600 dark:text-slate-400"
          >
            {formatInlineText(quoteText)}
          </blockquote>
        );
        i++;
        continue;
      }

      // List items (- or *)
      if (line.trim().match(/^[-*]\s/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
          listItems.push(lines[i].replace(/^[-*]\s*/, ""));
          i++;
        }
        elements.push(
          <ul key={i} className="my-2 ml-6 list-disc space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-300">
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Regular line
      if (line.trim()) {
        elements.push(
          <p key={i} className="my-1">
            {formatInlineText(line)}
          </p>
        );
      } else {
        elements.push(<br key={i} />);
      }
      i++;
    }

    return <div className="whitespace-pre-wrap">{elements}</div>;
  };

  // Format inline text (bold, italic, links, inline code, images)
  const formatInlineText = (text: string) => {
    const parts: (string | React.ReactNode)[] = [];
    let currentText = text;
    let key = 0;

    // Process in order: Images, markdown links, URLs, inline code, bold, italic
    const imageRegex = /!\[([^\]]*)\]\(([^\)]+)\)/g;
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const codeRegex = /`([^`]+)`/g;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const italicRegex = /\*([^*]+)\*/g;

    // First, handle images and markdown links, then plain URLs
    const imageParts = currentText.split(imageRegex);

    imageParts.forEach((part, idx) => {
      // Every 3rd item starting from index 0 is text, index 1 is alt, index 2 is url
      if (idx % 3 === 0) {
        // Process markdown links in this text part
        const linkParts = part.split(linkRegex);

        linkParts.forEach((linkPart, linkIdx) => {
          // Every 3rd item starting from index 0 is text, index 1 is link text, index 2 is url
          if (linkIdx % 3 === 0) {
            // Process plain URLs in this part
            const urlParts = linkPart.split(urlRegex);

            urlParts.forEach((urlPart, urlIdx) => {
              if (urlPart.match(urlRegex)) {
                parts.push(
                  <a
                    key={`url-${key++}`}
                    href={urlPart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 underline underline-offset-2 font-medium break-all transition-colors"
                  >
                    {urlPart}
                  </a>
                );
              } else {
                // Process other formatting in non-URL parts
                const segments: (string | React.ReactNode)[] = [];
                const combined = urlPart.split(
                  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
                );

                combined.forEach((segment) => {
                  // Inline code
                  if (segment.match(/^`[^`]+`$/)) {
                    const code = segment.slice(1, -1);
                    segments.push(
                      <code
                        key={`code-${key++}`}
                        className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-primary-600 dark:text-primary-400"
                      >
                        {code}
                      </code>
                    );
                  }
                  // Bold
                  else if (segment.match(/^\*\*[^*]+\*\*$/)) {
                    const boldText = segment.slice(2, -2);
                    segments.push(
                      <strong
                        key={`bold-${key++}`}
                        className="font-bold text-slate-900 dark:text-white"
                      >
                        {boldText}
                      </strong>
                    );
                  }
                  // Italic
                  else if (segment.match(/^\*[^*]+\*$/)) {
                    const italicText = segment.slice(1, -1);
                    segments.push(
                      <em key={`italic-${key++}`} className="italic">
                        {italicText}
                      </em>
                    );
                  }
                  // Plain text
                  else if (segment) {
                    segments.push(segment);
                  }
                });

                parts.push(...segments);
              }
            });
          } else if (linkIdx % 3 === 1) {
            // This is link text - skip, we'll use it in the next iteration
          } else if (linkIdx % 3 === 2) {
            // This is the URL for a markdown link [text](url)
            const linkText = linkParts[linkIdx - 1];
            let linkUrl = linkPart;
            // Ensure URL has protocol
            if (!linkUrl.match(/^https?:\/\//)) {
              linkUrl = "https://" + linkUrl;
            }
            parts.push(
              <a
                key={`link-${key++}`}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 underline underline-offset-2 font-medium transition-colors"
              >
                {linkText}
              </a>
            );
          }
        });
      } else if (idx % 3 === 1) {
        // This is image alt text - skip
      } else if (idx % 3 === 2) {
        // This is the image URL ![alt](url)
        const altText = imageParts[idx - 1];
        const imageUrl = part;
        parts.push(
          // eslint-disable-next-line @next/next/no-img-element -- Comment images can be data URLs or remote sources outside Next Image control
          <img
            key={`img-${key++}`}
            src={imageUrl}
            alt={altText || "Comment image"}
            className="max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700 my-2 shadow-md"
            loading="lazy"
          />
        );
      }
    });

    return <>{parts}</>;
  };

  // Get top-level comments (no parent)
  const topLevelComments = comments.filter((c) => !c.parentCommentId);

  // Get replies for a specific comment
  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parentCommentId === commentId);
  };

  const loadComments = useCallback(async () => {
    if (!slug) return;

    try {
      const commentsData = await getCommentsByArticle(slug);
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    // Load initial comments
    loadComments();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToComments(slug, (updatedComments) => {
      setComments(updatedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug, loadComments]);

  // Update comment author names and photos from user profiles
  useEffect(() => {
    const updateCommentsWithUserData = async () => {
      if (comments.length === 0) return;

      const updatedComments = await Promise.all(
        comments.map(async (comment) => {
          try {
            const userData = await getUser(comment.authorId);
            if (userData) {
              return {
                ...comment,
                authorName: userData.nickname || userData.displayName,
                authorPhotoURL: userData.photoURL,
              };
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
          return comment;
        })
      );

      // Only update if there are actual changes
      const hasChanges = updatedComments.some(
        (updated, index) =>
          updated.authorName !== comments[index].authorName ||
          updated.authorPhotoURL !== comments[index].authorPhotoURL
      );

      if (hasChanges) {
        setComments(updatedComments);
      }
    };

    updateCommentsWithUserData();
  }, [comments]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".share-menu-container")) {
          setShareMenuOpen(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareMenuOpen]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser || submitting || comment.length > 500)
      return;

    setSubmitting(true);
    try {
      const commentData: any = {
        articleSlug: slug,
        authorId: currentUser.uid,
        authorName:
          userData?.nickname ||
          userData?.displayName ||
          currentUser.email ||
          "Anoniem",
        content: comment,
        createdAt: Date.now(),
        likes: 0,
      };

      // Only add optional fields if they have values
      if (currentUser.photoURL) {
        commentData.authorPhotoURL = currentUser.photoURL;
      }
      if (replyingTo) {
        commentData.parentCommentId = replyingTo;
      }

      // Add uploaded images if any
      if (uploadedImages.length > 0) {
        commentData.images = uploadedImages.map((img) => img.url);
      }

      const newCommentId = await createComment(commentData);

      // Create notification for parent comment author if this is a reply
      if (replyingTo) {
        const parentComment = comments.find((c) => c.id === replyingTo);
        if (parentComment && parentComment.authorId !== currentUser.uid) {
          await createNotification({
            userId: parentComment.authorId,
            type: "reply",
            title: "Nieuwe reactie op je bericht",
            message: `${
              userData?.nickname || userData?.displayName || "Iemand"
            } heeft gereageerd op je bericht: "${comment.substring(0, 50)}${
              comment.length > 50 ? "..." : ""
            }"`,
            link: `/nieuws/${slug}#comment-${newCommentId}`,
            read: false,
            createdAt: Date.now(),
          });
        }
      }

      setComment("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
      setUploadedImages([]);
      setUploadError(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Er is een fout opgetreden bij het plaatsen van je reactie.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const commentToLike = comments.find((c) => c.id === commentId);
      const alreadyLiked = commentToLike?.likedBy?.includes(currentUser.uid);

      await likeComment(commentId, currentUser.uid);

      // Create notification only if not already liked and not liking own comment
      if (
        !alreadyLiked &&
        commentToLike &&
        commentToLike.authorId !== currentUser.uid
      ) {
        await createNotification({
          userId: commentToLike.authorId,
          type: "like",
          title: "Iemand vindt je bericht leuk",
          message: `${
            userData?.nickname || userData?.displayName || "Iemand"
          } vindt je bericht leuk`,
          link: `/nieuws/${slug}#comment-${commentId}`,
          read: false,
          createdAt: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const articleImageUrl = article.imageUrl
    ? article.imageUrl.startsWith("http")
      ? article.imageUrl
      : `${BASE_URL}${article.imageUrl}`
    : `${BASE_URL}/og/politie-forum-1200x630.png`;
  const articleKeywords = article.tags?.length
    ? article.tags.join(", ")
    : "politie, nieuws, Nederland";
  const articleDescription = article.excerpt?.trim() || article.title;
  const articlePublishedAt = toIsoStringWithFallback(article.publishedAt);
  const articleUpdatedAt = toIsoStringWithFallback(
    article.updatedAt || article.publishedAt
  );
  const articleSlug = article.slug || slug;

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <JsonLdArticleWithDiscussion
          headline={article.title}
          description={articleDescription}
          datePublished={articlePublishedAt}
          dateModified={articleUpdatedAt}
          slug={articleSlug}
          image={articleImageUrl}
          commentCount={comments.length}
          category={article.category}
          keywords={articleKeywords}
        />

        <article
          className="container mx-auto px-4 py-8 max-w-4xl"
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          {/* Back Button */}
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Terug naar nieuws</span>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-sm font-medium rounded-full"
                itemProp="articleSection"
              >
                {article.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.publishedAt} itemProp="datePublished">
                    {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span itemProp="author">{article.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span
                    itemProp="interactionStatistic"
                    itemScope
                    itemType="https://schema.org/InteractionCounter"
                  >
                    <meta
                      itemProp="interactionType"
                      content="https://schema.org/ViewAction"
                    />
                    <span itemProp="userInteractionCount">245</span>
                  </span>
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                <Share2 className="h-4 w-4" />
                Delen
              </button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Comments Section */}
          <ArticleComments articleSlug={slug} />

          {/* Publisher Info (hidden but for SEO) */}
          <div
            itemProp="publisher"
            itemScope
            itemType="https://schema.org/Organization"
            style={{ display: "none" }}
          >
            <span itemProp="name">Politie Forum Nederland</span>
            <span itemProp="url">https://politie-forum.nl</span>
            <div
              itemProp="logo"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              <span itemProp="url">https://politie-forum.nl/logo.png</span>
            </div>
          </div>
        </article>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
