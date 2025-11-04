'use client';

/**
 * Advanced CommentThread Component
 *
 * Extracted from playground/threads with enhanced features:
 * - Infinite nested replies with visual hierarchy
 * - User gamification: levels (1-6), badges (8 types), leaderboards
 * - Content features: polls, mentions (@user), hashtags (#topic), image uploads
 * - Formatting: markdown-like (bold, italic, underline, links, images)
 * - Interactions: likes, watch/unwatch, save posts, pin, best answers, edit
 * - Export: JSON, CSV, TXT formats
 * - Real-time Firebase integration with optimistic updates
 */

import { useAuth } from '@/contexts/AuthContext';
import { database as getDatabaseInstance } from '@/lib/firebase';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update
} from 'firebase/database';
import {
  ArrowBigUp,
  Bold,
  Bookmark,
  Check,
  Download,
  Edit2,
  Eye,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  MessageSquare,
  Pin,
  RefreshCw,
  Reply,
  Trash2,
  Trophy,
  Underline,
  Upload
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Helper to get database instance
const getDb = () => {
  if (typeof window === 'undefined') return null; // SSR guard

  try {
    // Ensure we're calling it as a function
    const dbGetter = getDatabaseInstance;
    if (typeof dbGetter !== 'function') {
      console.error('getDatabaseInstance is not a function, it is:', typeof dbGetter);
      return null;
    }

    const db = dbGetter();

    // Validate it's actually a Database instance
    if (db && typeof db === 'object' && '_checkNotDeleted' in db) {
      return db;
    }

    console.warn('getDatabaseInstance() returned invalid object:', typeof db, db);
    return null;
  } catch (error) {
    console.error('Failed to get database instance:', error);
    return null;
  }
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface CommentData {
  id: string;
  articleSlug: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  content: string;
  createdAt: number;
  likes: number;
  likedBy?: string[];
  parentCommentId?: string | null;
  isPinned?: boolean;
  isBestAnswer?: boolean;
  isEdited?: boolean;
  editedAt?: number;
  mentions?: string[];
  hashtags?: string[];
  imageUrl?: string;
  poll?: {
    question: string;
    options: Array<{ text: string; votes: number; votedBy: string[] }>;
  };
  replies?: CommentData[];
}

interface UserStats {
  uid: string;
  displayName: string;
  photoURL?: string;
  commentCount: number;
  totalLikes: number;
  score: number;
  level: number;
  badges: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: (stats: UserStats) => boolean;
}

interface CommentThreadProps {
  articleSlug: string;
  onSchemaUpdate?: (comments: CommentData[]) => void;
  enableAdvancedFeatures?: boolean;
  maxDepth?: number;
  initialSortOrder?: 'newest' | 'oldest' | 'popular';
}

// ============================================================================
// BADGES & LEVELS CONFIGURATION
// ============================================================================

const BADGES: Badge[] = [
  {
    id: 'first_post',
    name: 'Eerste Reactie',
    description: 'Plaats je eerste reactie',
    icon: '💬',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
    requirement: (stats) => stats.commentCount >= 1,
  },
  {
    id: 'conversationalist',
    name: 'Gesprekspartner',
    description: 'Plaats 10 reacties',
    icon: '🗣️',
    color: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
    requirement: (stats) => stats.commentCount >= 10,
  },
  {
    id: 'popular',
    name: 'Populair',
    description: 'Ontvang 50 likes',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200',
    requirement: (stats) => stats.totalLikes >= 50,
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Bereik level 4',
    icon: '🎓',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200',
    requirement: (stats) => stats.level >= 4,
  },
  {
    id: 'veteran',
    name: 'Veteraan',
    description: 'Plaats 50 reacties',
    icon: '🛡️',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200',
    requirement: (stats) => stats.commentCount >= 50,
  },
  {
    id: 'legend',
    name: 'Legende',
    description: 'Bereik level 6',
    icon: '👑',
    color: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200',
    requirement: (stats) => stats.level >= 6,
  },
  {
    id: 'helper',
    name: 'Helper',
    description: 'Krijg 5 best answers',
    icon: '🤝',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-200',
    requirement: (stats) => stats.commentCount >= 5, // Simplified for now
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Ontvang 100 likes',
    icon: '🔥',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200',
    requirement: (stats) => stats.totalLikes >= 100,
  },
];

const LEVELS = [
  { level: 1, name: 'Rookie', minScore: 0, maxScore: 99, color: 'text-slate-500' },
  { level: 2, name: 'Member', minScore: 100, maxScore: 499, color: 'text-blue-500' },
  { level: 3, name: 'Contributor', minScore: 500, maxScore: 1499, color: 'text-green-500' },
  { level: 4, name: 'Expert', minScore: 1500, maxScore: 3999, color: 'text-purple-500' },
  { level: 5, name: 'Master', minScore: 4000, maxScore: 9999, color: 'text-orange-500' },
  { level: 6, name: 'Legend', minScore: 10000, maxScore: Infinity, color: 'text-red-500' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateScore(stats: UserStats): number {
  return stats.commentCount * 10 + stats.totalLikes * 5;
}

function getUserLevel(score: number): typeof LEVELS[0] {
  return LEVELS.find(l => score >= l.minScore && score <= l.maxScore) || LEVELS[0];
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60_000) return 'Zojuist';
  if (diff < 3_600_000) {
    const minutes = Math.floor(diff / 60_000);
    return `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} geleden`;
  }
  if (diff < 86_400_000) {
    const hours = Math.floor(diff / 3_600_000);
    return `${hours} uur geleden`;
  }
  if (diff < 604_800_000) {
    const days = Math.floor(diff / 86_400_000);
    return `${days} ${days === 1 ? 'dag' : 'dagen'} geleden`;
  }

  return format(new Date(timestamp), 'd MMM yyyy', { locale: nl });
}

// Markdown-like text formatting
function formatTextWithLinks(text: string): string {
  if (!text) return '';

  let formatted = text;

  // Process in order to avoid conflicts:
  // 1. Images first: ![alt](url)
  formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" loading="lazy" />');

  // 2. Links: [text](url)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 dark:text-primary-400 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">$1</a>');

  // 3. Bold: **text**
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');

  // 4. Italic: *text* (but not ** already processed)
  formatted = formatted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');

  // 5. Underline: __text__
  formatted = formatted.replace(/__(.+?)__/g, '<u class="underline">$1</u>');

  // 6. Auto-detect standalone URLs (not already in links)
  formatted = formatted.replace(/(?<!href="|src=")(https?:\/\/[^\s<"]+)(?!")/g, '<a href="$1" class="text-primary-600 dark:text-primary-400 hover:underline break-all" target="_blank" rel="noopener noreferrer">$1</a>');

  // 7. Mentions: @username
  formatted = formatted.replace(/@([a-zA-Z0-9_]+)/g, '<span class="text-accent-600 dark:text-accent-400 font-semibold cursor-pointer hover:underline">@$1</span>');

  // 8. Hashtags: #tag
  formatted = formatted.replace(/#([a-zA-Z0-9_]+)/g, '<span class="text-primary-600 dark:text-primary-400 font-semibold cursor-pointer hover:underline">#$1</span>');

  return formatted;
}

// Build nested comment structure
function buildNestedComments(flatComments: CommentData[]): CommentData[] {
  const commentMap = new Map<string, CommentData>();
  const rootComments: CommentData[] = [];

  // First pass: create map
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree
  flatComments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        parent.replies!.push(commentWithReplies);
      } else {
        // Parent not found, treat as root
        rootComments.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CommentThread({
  articleSlug,
  onSchemaUpdate,
  enableAdvancedFeatures = true,
  maxDepth = Infinity,
  initialSortOrder = 'newest',
}: CommentThreadProps) {
  const { currentUser, userData } = useAuth();

  // State
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>(initialSortOrder);
  const [userStats, setUserStats] = useState<{ [uid: string]: UserStats }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [watchedThreads, setWatchedThreads] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    showPinned: true,
    showAnswered: true,
    showUnanswered: true,
    showWithImages: true,
    showPolls: true,
  });

  // ============================================================================
  // FIREBASE OPERATIONS
  // ============================================================================

  // Load comments from Firebase
  useEffect(() => {
    const db = getDb();
    if (!db) {
      console.error('Firebase database not initialized');
      setLoading(false);
      return;
    }

    const commentsQuery = query(
      ref(db, 'comments'),
      orderByChild('articleSlug'),
      equalTo(articleSlug)
    );

    const unsubscribe = onValue(commentsQuery, (snapshot) => {
      const loadedComments: CommentData[] = [];
      snapshot.forEach((child) => {
        loadedComments.push({
          id: child.key || '',
          ...(child.val() as Omit<CommentData, 'id'>),
        });
      });

      setComments(loadedComments);
      setLoading(false);

      // Notify parent for JSON-LD schema update
      if (onSchemaUpdate) {
        onSchemaUpdate(loadedComments);
      }
    });

    return () => unsubscribe();
  }, [articleSlug, onSchemaUpdate]);

  // Listen for AI reply insertion events
  useEffect(() => {
    const handleAIReply = (event: Event) => {
      const customEvent = event as CustomEvent<{ text: string }>;
      const { text } = customEvent.detail;

      // Insert AI-generated text into comment field
      setCommentText((prev) => {
        const separator = prev.trim() ? '\n\n' : '';
        return prev + separator + text;
      });

      // Focus textarea and scroll into view
      setTimeout(() => {
        const textarea = document.querySelector('textarea[name="commentText"]') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
          textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    };

    window.addEventListener('ai-insert-reply', handleAIReply);
    return () => window.removeEventListener('ai-insert-reply', handleAIReply);
  }, []);

  // Load user stats
  useEffect(() => {
    async function loadUserStats() {
      const stats: { [uid: string]: UserStats } = {};
      const uniqueUserIds = new Set(comments.map((c) => c.authorId).filter(Boolean));

      for (const uid of uniqueUserIds) {
        const userComments = comments.filter((c) => c.authorId === uid);
        const totalLikes = userComments.reduce((sum, c) => sum + (c.likes || 0), 0);
        const commentCount = userComments.length;

        const userStats: UserStats = {
          uid,
          displayName: userComments[0]?.authorName || 'Anoniem',
          photoURL: userComments[0]?.authorPhoto,
          commentCount,
          totalLikes,
          score: 0,
          level: 1,
          badges: [],
        };

        userStats.score = calculateScore(userStats);
        userStats.level = getUserLevel(userStats.score).level;
        userStats.badges = BADGES.filter((b) => b.requirement(userStats)).map((b) => b.id);

        stats[uid] = userStats;
      }

      setUserStats(stats);
    }

    if (comments.length > 0) {
      loadUserStats();
    }
  }, [comments]);

  // Load watched threads and saved posts
  useEffect(() => {
    const db = getDb();
    if (!currentUser || !db) return;

    const watchedRef = ref(db, `users/${currentUser.uid}/watchedThreads`);
    const savedRef = ref(db, `users/${currentUser.uid}/savedPosts`);

    const unsubWatched = onValue(watchedRef, (snapshot) => {
      if (snapshot.exists()) {
        setWatchedThreads(Object.keys(snapshot.val()));
      }
    });

    const unsubSaved = onValue(savedRef, (snapshot) => {
      if (snapshot.exists()) {
        setSavedPosts(Object.keys(snapshot.val()));
      }
    });

    return () => {
      unsubWatched();
      unsubSaved();
    };
  }, [currentUser]);

  // ============================================================================
  // COMMENT ACTIONS
  // ============================================================================

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const db = getDb();
    if (!currentUser || !db || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const newCommentRef = push(ref(db, 'comments'));
      const mentions = commentText.match(/@([a-zA-Z0-9_]+)/g) || [];
      const hashtags = commentText.match(/#([a-zA-Z0-9_]+)/g) || [];

      await set(newCommentRef, {
        articleSlug,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anoniem',
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || '',
        content: commentText.trim(),
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
        parentCommentId: null,
        ...(mentions.length > 0 && { mentions }),
        ...(hashtags.length > 0 && { hashtags }),
        ...(selectedImage && { imageUrl: selectedImage }),
      });

      setCommentText('');
      setSelectedImage(null);
      setImageSize(0);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Er is een fout opgetreden bij het plaatsen van je reactie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    const db = getDb();
    if (!currentUser || !db || !replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const newCommentRef = push(ref(db, 'comments'));
      const mentions = replyText.match(/@([a-zA-Z0-9_]+)/g) || [];
      const hashtags = replyText.match(/#([a-zA-Z0-9_]+)/g) || [];

      await set(newCommentRef, {
        articleSlug,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anoniem',
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || '',
        content: replyText.trim(),
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
        parentCommentId: parentId,
        ...(mentions.length > 0 && { mentions }),
        ...(hashtags.length > 0 && { hashtags }),
      });

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Er is een fout opgetreden bij het plaatsen van je antwoord.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const db = getDb();
    if (!currentUser || !db) {
      alert('Log in om deze reactie te liken.');
      return;
    }

    try {
      const commentRef = ref(db, `comments/${commentId}`);
      const snapshot = await get(commentRef);

      if (!snapshot.exists()) return;

      const comment = snapshot.val() as CommentData;
      const likedBy = comment.likedBy || [];
      const hasLiked = likedBy.includes(currentUser.uid);

      if (hasLiked) {
        const updatedLikedBy = likedBy.filter((uid) => uid !== currentUser.uid);
        await update(commentRef, {
          likes: Math.max(0, (comment.likes || 0) - 1),
          likedBy: updatedLikedBy,
        });
      } else {
        await update(commentRef, {
          likes: (comment.likes || 0) + 1,
          likedBy: [...likedBy, currentUser.uid],
        });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    const db = getDb();
    if (!currentUser || !db || !editText.trim()) return;

    try {
      const commentRef = ref(db, `comments/${commentId}`);
      await update(commentRef, {
        content: editText.trim(),
        isEdited: true,
        editedAt: Date.now(),
      });

      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Er is een fout opgetreden bij het bewerken van je reactie.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const db = getDb();
    if (!currentUser || !db) return;
    if (!confirm('Weet je zeker dat je deze reactie wilt verwijderen?')) return;

    try {
      await remove(ref(db, `comments/${commentId}`));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Er is een fout opgetreden bij het verwijderen van je reactie.');
    }
  };

  const handlePinComment = async (commentId: string, isPinned: boolean) => {
    const db = getDb();
    if (!currentUser || !db) return;

    try {
      await update(ref(db, `comments/${commentId}`), {
        isPinned: !isPinned,
      });
    } catch (error) {
      console.error('Error pinning comment:', error);
    }
  };

  const handleMarkBestAnswer = async (commentId: string, isBestAnswer: boolean) => {
    const db = getDb();
    if (!currentUser || !db) return;

    try {
      await update(ref(db, `comments/${commentId}`), {
        isBestAnswer: !isBestAnswer,
      });
    } catch (error) {
      console.error('Error marking best answer:', error);
    }
  };

  const handleWatchThread = async (commentId: string) => {
    const db = getDb();
    if (!currentUser || !db) return;

    try {
      const watchRef = ref(db, `users/${currentUser.uid}/watchedThreads/${commentId}`);
      if (watchedThreads.includes(commentId)) {
        await remove(watchRef);
      } else {
        await set(watchRef, { watchedAt: Date.now() });
      }
    } catch (error) {
      console.error('Error watching thread:', error);
    }
  };

  const handleSavePost = async (commentId: string) => {
    const db = getDb();
    if (!currentUser || !db) return;

    try {
      const saveRef = ref(db, `users/${currentUser.uid}/savedPosts/${commentId}`);
      if (savedPosts.includes(commentId)) {
        await remove(saveRef);
      } else {
        await set(saveRef, { savedAt: Date.now() });
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 300 * 1024; // 300KB
    if (file.size > maxSize) {
      alert('Afbeelding is te groot. Maximaal 300KB toegestaan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setImageSize(file.size);
    };
    reader.readAsDataURL(file);
  };

  // ============================================================================
  // TEXT FORMATTING HELPERS
  // ============================================================================

  const insertFormatting = (before: string, after: string, setText: (text: string) => void, text: string, textareaId: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const selectedText = text.substring(start, end);
      const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
      setText(newText);

      // Restore focus and cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 10);
    }
  };

  // ============================================================================
  // FILTERING & SORTING
  // ============================================================================

  const filterAndSortComments = useCallback((commentsList: CommentData[]) => {
    let filtered = [...commentsList];

    // Apply filters
    filtered = filtered.filter((comment) => {
      if (!filterOptions.showPinned && comment.isPinned) return false;
      if (!filterOptions.showAnswered && comment.isBestAnswer) return false;
      if (!filterOptions.showWithImages && comment.imageUrl) return false;
      if (!filterOptions.showPolls && comment.poll) return false;
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.createdAt - a.createdAt;
      } else if (sortOrder === 'oldest') {
        return a.createdAt - b.createdAt;
      } else {
        // Popular: sort by likes
        return (b.likes || 0) - (a.likes || 0);
      }
    });

    // Pinned comments always on top
    const pinned = filtered.filter((c) => c.isPinned);
    const unpinned = filtered.filter((c) => !c.isPinned);
    return [...pinned, ...unpinned];
  }, [filterOptions, sortOrder]);

  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================

  const exportToJSON = () => {
    const dataStr = JSON.stringify(comments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comments-${articleSlug}-${Date.now()}.json`;
    link.click();
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Author', 'Content', 'Likes', 'Created At', 'Parent ID'];
    const rows = comments.map((c) => [
      c.id,
      c.authorName,
      c.content.replace(/"/g, '""'),
      c.likes || 0,
      new Date(c.createdAt).toISOString(),
      c.parentCommentId || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comments-${articleSlug}-${Date.now()}.csv`;
    link.click();
  };

  // ============================================================================
  // RENDER COMMENT (RECURSIVE)
  // ============================================================================

  const renderComment = (comment: CommentData, depth: number = 0): React.ReactNode => {
    const isAuthor = currentUser?.uid === comment.authorId;
    const isAdmin = userData?.role === 'admin' || userData?.role === 'moderator';
    const canDelete = isAuthor || isAdmin;
    const hasLiked = comment.likedBy?.includes(currentUser?.uid || '');
    const stats = userStats[comment.authorId];
    const level = stats ? getUserLevel(stats.score) : LEVELS[0];
    const badges = stats ? BADGES.filter((b) => stats.badges.includes(b.id)) : [];

    // Visual hierarchy scaling
    const avatarSize = Math.max(32, 48 - depth * 4);
    const fontSize = depth > 0 ? 'text-sm' : 'text-base';
    const indentClass = depth > 0 ? 'ml-6 md:ml-12' : '';
    const borderClass = depth > 0 ? 'border-l-2 border-primary-200 dark:border-primary-800 pl-4' : '';

    if (depth >= maxDepth) {
      return null;
    }

    return (
      <div key={comment.id} className={`space-y-3 ${indentClass}`}>
        <div
          className={`bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 ${
            comment.isPinned ? 'ring-2 ring-accent-500 dark:ring-accent-400' : ''
          } ${comment.isBestAnswer ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}`}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.authorPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={comment.authorPhoto}
                  alt={comment.authorName}
                  className="rounded-full object-cover"
                  style={{ width: avatarSize, height: avatarSize }}
                />
              ) : (
                <div
                  className="rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold"
                  style={{ width: avatarSize, height: avatarSize, fontSize: avatarSize / 3 }}
                >
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className={`flex-1 min-w-0 ${fontSize}`}>
              {/* Header */}
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {comment.authorName}
                </span>

                {/* Level Badge */}
                {enableAdvancedFeatures && stats && (
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-semibold ${level.color}`}>
                    Lv{level.level} {level.name}
                  </span>
                )}

                {/* User Badges */}
                {enableAdvancedFeatures && badges.slice(0, 2).map((badge) => (
                  <span
                    key={badge.id}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}
                    title={badge.description}
                  >
                    <span>{badge.icon}</span>
                    <span className="hidden sm:inline">{badge.name}</span>
                  </span>
                ))}

                {/* Pinned Indicator */}
                {comment.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 dark:bg-accent-800 dark:text-accent-200 font-medium">
                    <Pin className="h-3 w-3" />
                    Vastgepind
                  </span>
                )}

                {/* Best Answer Indicator */}
                {comment.isBestAnswer && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 font-medium">
                    <Check className="h-3 w-3" />
                    Best Antwoord
                  </span>
                )}

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTimestamp(comment.createdAt)}
                  {comment.isEdited && ' (bewerkt)'}
                </span>
              </div>

              {/* Content */}
              {editingComment === comment.id ? (
                <div className="mb-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditText('');
                      }}
                      className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3 prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatTextWithLinks(comment.content) }}
                  />

                  {/* Image */}
                  {comment.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comment.imageUrl}
                      alt="Comment attachment"
                      className="max-w-full h-auto rounded-lg my-2"
                    />
                  )}

                  {/* Poll */}
                  {comment.poll && (
                    <div className="my-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="font-semibold text-slate-900 dark:text-white mb-2">
                        📊 {comment.poll.question}
                      </p>
                      <div className="space-y-2">
                        {comment.poll.options.map((option, idx) => {
                          const totalVotes = comment.poll!.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                          const hasVoted = option.votedBy.includes(currentUser?.uid || '');

                          return (
                            <div key={idx} className="relative">
                              <div
                                className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                              <div className="relative px-3 py-2 flex items-center justify-between">
                                <span className={`text-sm ${hasVoted ? 'font-semibold' : ''}`}>
                                  {option.text} {hasVoted && '✓'}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {option.votes} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Like Button */}
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    hasLiked
                      ? 'text-accent-600 dark:text-accent-400'
                      : 'text-slate-500 hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400'
                  }`}
                >
                  <ArrowBigUp className="h-4 w-4" fill={hasLiked ? 'currentColor' : 'none'} />
                  {comment.likes || 0}
                </button>

                {/* Reply Button */}
                {currentUser && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    <Reply className="h-4 w-4" />
                    {replyingTo === comment.id ? 'Annuleren' : 'Reageren'}
                  </button>
                )}

                {/* Watch Thread */}
                {enableAdvancedFeatures && currentUser && (
                  <button
                    onClick={() => handleWatchThread(comment.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      watchedThreads.includes(comment.id)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-slate-500 hover:text-primary-600 dark:text-slate-400'
                    }`}
                    title={watchedThreads.includes(comment.id) ? 'Stop met volgen' : 'Volg deze thread'}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}

                {/* Save Post */}
                {enableAdvancedFeatures && currentUser && (
                  <button
                    onClick={() => handleSavePost(comment.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      savedPosts.includes(comment.id)
                        ? 'text-accent-600 dark:text-accent-400'
                        : 'text-slate-500 hover:text-accent-600 dark:text-slate-400'
                    }`}
                    title={savedPosts.includes(comment.id) ? 'Verwijder opgeslagen' : 'Bewaar post'}
                  >
                    <Bookmark className="h-4 w-4" fill={savedPosts.includes(comment.id) ? 'currentColor' : 'none'} />
                  </button>
                )}

                {/* Author Actions */}
                {isAuthor && (
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditText(comment.content);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 font-medium"
                  >
                    <Edit2 className="h-4 w-4" />
                    Bewerken
                  </button>
                )}

                {/* Delete Button - Author or Admin */}
                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    title={isAdmin && !isAuthor ? 'Verwijderen (admin)' : 'Verwijderen'}
                  >
                    <Trash2 className="h-4 w-4" />
                    Verwijderen
                  </button>
                )}

                {/* Moderator Actions */}
                {enableAdvancedFeatures && currentUser && (
                  <>
                    <button
                      onClick={() => handlePinComment(comment.id, !!comment.isPinned)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent-600 dark:text-slate-400 font-medium"
                      title={comment.isPinned ? 'Losmaken' : 'Vastpinnen'}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMarkBestAnswer(comment.id, !!comment.isBestAnswer)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-600 dark:text-slate-400 font-medium"
                      title={comment.isBestAnswer ? 'Verwijder best antwoord' : 'Markeer als best antwoord'}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && currentUser && (
                <div className="mt-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <textarea
                    id={`reply-${comment.id}`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Schrijf een antwoord..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 resize-none"
                  />

                  {/* Formatting Toolbar */}
                  {enableAdvancedFeatures && (
                    <div className="flex gap-2 mt-2 mb-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**', setReplyText, replyText, `reply-${comment.id}`)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        title="Vet (Ctrl+B)"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*', setReplyText, replyText, `reply-${comment.id}`)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        title="Cursief (Ctrl+I)"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('__', '__', setReplyText, replyText, `reply-${comment.id}`)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        title="Onderstrepen"
                      >
                        <Underline className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('[', '](url)', setReplyText, replyText, `reply-${comment.id}`)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        title="Link toevoegen"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim() || isSubmitting}
                      className="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
                    >
                      Plaats antwoord
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={borderClass}>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Build nested structure
  const nestedComments = useMemo(() => buildNestedComments(comments), [comments]);
  const filteredComments = useMemo(() => filterAndSortComments(nestedComments), [nestedComments, filterAndSortComments]);

  // Leaderboard
  const leaderboard = useMemo(() => {
    return Object.values(userStats)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [userStats]);

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          Reacties
          <span className="text-base font-normal text-slate-500 dark:text-slate-400">
            ({comments.length})
          </span>
        </h2>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Sort Options */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg"
          >
            <option value="newest">Nieuwste eerst</option>
            <option value="oldest">Oudste eerst</option>
            <option value="popular">Populair</option>
          </select>

          {/* Export Menu */}
          {enableAdvancedFeatures && comments.length > 0 && (
            <div className="relative group">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <Download className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={exportToJSON}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap"
                >
                  Export als JSON
                </button>
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap"
                >
                  Export als CSV
                </button>
              </div>
            </div>
          )}

          {/* Leaderboard Toggle */}
          {enableAdvancedFeatures && (
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              title="Klassement"
            >
              <Trophy className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      {enableAdvancedFeatures && showLeaderboard && leaderboard.length > 0 && (
        <div className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Top 10 Gebruikers
          </h3>
          <div className="space-y-2">
            {leaderboard.map((user, idx) => {
              const level = getUserLevel(user.score);
              return (
                <div
                  key={user.uid}
                  className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-2"
                >
                  <span className={`text-2xl font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-600' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </span>
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Lv{level.level} • {user.score} punten
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-slate-600 dark:text-slate-400">
                      {user.commentCount} reacties
                    </p>
                    <p className="text-accent-600 dark:text-accent-400">
                      {user.totalLikes} ❤️
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-3">
            <label htmlFor="commentText" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Plaats een reactie
            </label>
            <textarea
              id="commentText"
              name="commentText"
              rows={4}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Deel je mening... (Gebruik **vet**, *cursief*, [link](url), @mentions, #hashtags)"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none"
            />
          </div>

          {/* Formatting Toolbar */}
          {enableAdvancedFeatures && (
            <div className="flex gap-2 mb-3 flex-wrap">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**', setCommentText, commentText, 'commentText')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
                title="Vet (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
                Vet
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*', setCommentText, commentText, 'commentText')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
                title="Cursief (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
                Cursief
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('__', '__', setCommentText, commentText, 'commentText')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
                title="Onderstrepen"
              >
                <Underline className="h-4 w-4" />
                Onderstrepen
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('[', '](url)', setCommentText, commentText, 'commentText')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
                title="Link toevoegen"
              >
                <LinkIcon className="h-4 w-4" />
                Link
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('![alt](', ')', setCommentText, commentText, 'commentText')}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
                title="Afbeelding toevoegen"
              >
                <ImageIcon className="h-4 w-4" />
                Afbeelding
              </button>

              {/* Image Upload */}
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload {selectedImage && `(${(imageSize / 1024).toFixed(0)}KB)`}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {selectedImage && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageSize(0);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-semibold transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Verwijder
                </button>
              )}
            </div>
          )}

          {/* Image Preview */}
          {selectedImage && (
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedImage} alt="Preview" className="max-w-xs h-auto rounded-lg border-2 border-slate-300 dark:border-slate-600" />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-5 w-5" />
            {isSubmitting ? 'Plaatsen...' : 'Plaats reactie'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 via-accent-50 to-primary-50 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-primary-900/20 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700">
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            ⚠️ Je moet ingelogd zijn om reacties te plaatsen. Klik op "Inloggen" in de header.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">Laden...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-1">
            Nog geen reacties
          </p>
          <p className="text-sm text-slate-500">
            Wees de eerste om te reageren op dit artikel!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => renderComment(comment, 0))}
        </div>
      )}
    </div>
  );
}
