"use client";

import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import {
  ArrowLeft,
  Award,
  Bell,
  BellOff,
  Bold,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Code,
  Copy,
  Crown,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  MessageSquare,
  Pin,
  Printer,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  Star,
  Target,
  ThumbsUp,
  Trash2,
  Trophy,
  Underline,
  User,
  X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: number;
  likes: number;
  likedBy?: { [uid: string]: boolean };
  parentCommentId?: string;
  replies?: Comment[]; // Nested replies
  isPinned?: boolean;
  isBestAnswer?: boolean;
  editedAt?: number;
  imageUrl?: string; // Uploaded image
  imageSize?: number; // Image size in bytes
  links?: string[]; // Extracted URLs from content
  mentions?: string[]; // @username mentions
  hashtags?: string[]; // #topic hashtags
  watchers?: { [uid: string]: boolean }; // Thread watchers
  pollData?: {
    question: string;
    options: { id: string; text: string; votes: number; voters: string[] }[];
    allowChangeVote: boolean;
    endsAt?: number;
  };
}

interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'reply' | 'like' | 'watch' | 'poll';
  commentId: string;
  fromUserId: string;
  fromUserName: string;
  message: string;
  read: boolean;
  createdAt: number;
}

interface SavedPost {
  userId: string;
  commentId: string;
  savedAt: number;
}

interface UserStats {
  userId: string;
  userName: string;
  photoURL?: string;
  commentsCount: number;
  likesReceived: number;
  bestAnswers: number;
  badges: string[];
  level: number;
  score: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  type: 'comments' | 'likes' | 'bestAnswers' | 'replies' | 'streak';
}

const PLAYGROUND_ARTICLE_SLUG = "playground-threaded-demo";

const BADGES: Badge[] = [
  { id: 'first-post', name: 'Eerste Post', description: 'Plaats je eerste reactie', icon: '🎯', color: 'bg-blue-500', requirement: 1, type: 'comments' },
  { id: 'conversationalist', name: 'Prater', description: 'Plaats 10 reacties', icon: '💬', color: 'bg-green-500', requirement: 10, type: 'comments' },
  { id: 'popular', name: 'Populair', description: 'Ontvang 25 likes', icon: '⭐', color: 'bg-yellow-500', requirement: 25, type: 'likes' },
  { id: 'expert', name: 'Expert', description: 'Krijg 3 beste antwoorden', icon: '🏆', color: 'bg-purple-500', requirement: 3, type: 'bestAnswers' },
  { id: 'veteran', name: 'Veteraan', description: 'Plaats 50 reacties', icon: '🎖️', color: 'bg-red-500', requirement: 50, type: 'comments' },
  { id: 'legend', name: 'Legende', description: 'Ontvang 100 likes', icon: '👑', color: 'bg-orange-500', requirement: 100, type: 'likes' },
  { id: 'helper', name: 'Helper', description: 'Plaats 20 antwoorden', icon: '🤝', color: 'bg-teal-500', requirement: 20, type: 'replies' },
  { id: 'on-fire', name: 'On Fire', description: '7 dagen streak', icon: '🔥', color: 'bg-pink-500', requirement: 7, type: 'streak' },
];

const getUserLevel = (score: number): number => {
  if (score < 100) return 1;
  if (score < 250) return 2;
  if (score < 500) return 3;
  if (score < 1000) return 4;
  if (score < 2500) return 5;
  return 6;
};

const getLevelName = (level: number): string => {
  const levels = ['Rookie', 'Member', 'Regular', 'Expert', 'Master', 'Legend'];
  return levels[level - 1] || 'Rookie';
};

const calculateScore = (stats: Partial<UserStats>): number => {
  return (stats.commentsCount || 0) * 10 +
         (stats.likesReceived || 0) * 5 +
         (stats.bestAnswers || 0) * 50;
};

export default function ThreadsPlayground() {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [useLiveData, setUseLiveData] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [filterOptions, setFilterOptions] = useState({
    showPinned: true,
    showAnswered: true,
    showUnanswered: true,
    showWithImages: true,
    showPolls: true
  });
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number>(0);

  // New feature states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [watchedThreads, setWatchedThreads] = useState<string[]>([]);
  const [creatingPoll, setCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [allowChangeVote, setAllowChangeVote] = useState(true);
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [replyImageSize, setReplyImageSize] = useState<number>(0);

  // Formatting functions
  const insertFormatting = (prefix: string, suffix: string, placeholder: string = '') => {
    const textarea = document.getElementById('commentText') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newComment.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = newComment.substring(0, start) + prefix + textToInsert + suffix + newComment.substring(end);

    setNewComment(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newPosition = start + prefix.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertBold = () => insertFormatting('**', '**', 'vetgedrukte tekst');
  const insertItalic = () => insertFormatting('*', '*', 'cursieve tekst');
  const insertUnderline = () => insertFormatting('__', '__', 'onderstreepte tekst');

  const insertLink = () => {
    const url = prompt('Voer de URL in:');
    const text = prompt('Voer de linktekst in:') || url;
    if (url) {
      insertFormatting(`[${text}](`, ')', url);
    }
  };

  const insertImageLink = () => {
    const url = prompt('Voer de afbeeldings-URL in:');
    const alt = prompt('Voer de alt-tekst in:') || 'afbeelding';
    if (url) {
      insertFormatting(`![${alt}](`, ')', url);
    }
  };

  // Parse mentions and hashtags from text
  const parseMentionsAndHashtags = (text: string) => {
    const mentions = text.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];
    const hashtags = text.match(/#(\w+)/g)?.map(h => h.slice(1)) || [];
    return { mentions, hashtags };
  };

  // Watch/Unwatch thread
  // Watch/Unwatch thread (optimized with optimistic updates)
  const toggleWatchThread = (commentId: string) => {
    if (!currentUser) return;

    const isWatching = watchedThreads.includes(commentId);

    // Optimistic UI update (instant feedback)
    setWatchedThreads(prev =>
      isWatching ? prev.filter(id => id !== commentId) : [...prev, commentId]
    );

    // Firebase update in background (don't await)
    (async () => {
      try {
        const { ref, update } = await import("firebase/database");
        const { database } = await import("@/lib/firebase");
        if (!database) return;

        const commentRef = ref(database, `comments/${commentId}`);
        await update(commentRef, {
          [`watchers/${currentUser.uid}`]: isWatching ? null : true
        });
      } catch (error) {
        console.error("Error toggling watch:", error);
        // Rollback on error
        setWatchedThreads(prev =>
          isWatching ? [...prev, commentId] : prev.filter(id => id !== commentId)
        );
      }
    })();
  };

  // Save/Unsave post (optimized with optimistic updates)
  const toggleSavePost = (commentId: string) => {
    if (!currentUser) return;

    const isSaved = savedPosts.includes(commentId);

    // Optimistic UI update (instant feedback)
    if (isSaved) {
      setSavedPosts(prev => prev.filter(id => id !== commentId));
    } else {
      setSavedPosts(prev => [...prev, commentId]);
    }

    // Firebase update in background (don't await)
    (async () => {
      try {
        const { ref, set, remove } = await import("firebase/database");
        const { database } = await import("@/lib/firebase");
        if (!database) return;

        const savedRef = ref(database, `savedPosts/${currentUser.uid}/${commentId}`);

        if (isSaved) {
          await remove(savedRef);
        } else {
          await set(savedRef, { savedAt: Date.now() });
        }
      } catch (error) {
        console.error("Error toggling save:", error);
        // Rollback on error
        if (isSaved) {
          setSavedPosts(prev => [...prev, commentId]);
        } else {
          setSavedPosts(prev => prev.filter(id => id !== commentId));
        }
      }
    })();
  };

  // Create notification
  const createNotification = async (
    userId: string,
    type: Notification['type'],
    commentId: string,
    message: string
  ) => {
    if (!currentUser || userId === currentUser.uid) return;

    try {
      const { ref, push, set } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");
      if (!database) return;

      const notificationRef = ref(database, `notifications/${userId}`);
      const newNotificationRef = push(notificationRef);
      await set(newNotificationRef, {
        type,
        commentId,
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName || 'Anonymous',
        message,
        read: false,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // Filter and sort comments based on user preferences
  const filterAndSortComments = (commentsList: Comment[]): Comment[] => {
    let filtered = [...commentsList];

    // Apply filters
    if (!filterOptions.showPinned) {
      filtered = filtered.filter(c => !c.isPinned);
    }
    if (!filterOptions.showAnswered) {
      filtered = filtered.filter(c => !c.isBestAnswer && !c.replies?.some(r => r.isBestAnswer));
    }
    if (!filterOptions.showUnanswered) {
      filtered = filtered.filter(c => c.isBestAnswer || c.replies?.some(r => r.isBestAnswer) || (c.replies && c.replies.length > 0));
    }
    if (!filterOptions.showWithImages) {
      filtered = filtered.filter(c => !c.imageUrl);
    }
    if (!filterOptions.showPolls) {
      filtered = filtered.filter(c => !c.pollData);
    }

    // Apply sorting
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortOrder === 'popular') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    // Always keep pinned items at top if showing them
    if (filterOptions.showPinned) {
      const pinned = filtered.filter(c => c.isPinned);
      const unpinned = filtered.filter(c => !c.isPinned);
      return [...pinned, ...unpinned];
    }

    return filtered;
  };

  // Vote on poll
  const voteOnPoll = async (commentId: string, optionId: string) => {
    if (!currentUser) return;

    try {
      const { ref, get, update } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");
      if (!database) return;

      const commentRef = ref(database, `comments/${commentId}`);
      const snapshot = await get(commentRef);
      const comment = snapshot.val();

      if (!comment?.pollData) return;

      const pollData = comment.pollData;
      const hasVoted = pollData.options.some((opt: any) =>
        opt.voters?.includes(currentUser.uid)
      );

      if (hasVoted && !pollData.allowChangeVote) {
        alert('Je hebt al gestemd en kunt je stem niet wijzigen');
        return;
      }

      // Remove previous vote if changing
      const updatedOptions = pollData.options.map((opt: any) => ({
        ...opt,
        voters: opt.voters?.filter((id: string) => id !== currentUser.uid) || [],
        votes: opt.voters?.filter((id: string) => id !== currentUser.uid).length || 0
      }));

      // Add new vote
      const newOptions = updatedOptions.map((opt: any) => {
        if (opt.id === optionId) {
          return {
            ...opt,
            voters: [...(opt.voters || []), currentUser.uid],
            votes: (opt.voters || []).length + 1
          };
        }
        return opt;
      });

      await update(commentRef, {
        'pollData/options': newOptions
      });

      await loadCommentsFromFirebase();
    } catch (error) {
      console.error("Error voting on poll:", error);
    }
  };

  // Load comments from Firebase or use sample data
  useEffect(() => {
    if (useLiveData) {
      loadCommentsFromFirebase();
    } else {
      loadSampleData();
    }
  }, [useLiveData]);

  async function loadCommentsFromFirebase() {
    try {
      setLoading(true);
      const { ref, get, query, orderByChild } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        console.warn("Firebase not initialized, using sample data");
        loadSampleData();
        return;
      }

      const commentsRef = ref(database, "comments");
      const commentsQuery = query(commentsRef, orderByChild("articleSlug"));
      const snapshot = await get(commentsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const allComments = Object.keys(data)
          .filter((key) => data[key].articleSlug === PLAYGROUND_ARTICLE_SLUG)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt); // Newest first

        // Build nested structure
        const nested = buildNestedComments(allComments);
        setComments(nested);
        calculateUserStats(nested); // Calculate user stats
      } else {
        setComments([]);
        setUserStats([]); // Clear stats if no comments
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  }

  function loadSampleData() {
    const sampleComments: Comment[] = [
      {
        id: "sample1",
        authorId: "user1",
        authorName: "Jedi Xcom",
        authorPhotoURL:
          "https://lh3.googleusercontent.com/a/ACg8ocLjCLqEzVw2hCUqsLgZR5f3F0miP1MB3LXYPKucExn7LAbngpfA=s96-c",
        content: "Dit is een top-level comment met nested replies (SAMPLE DATA)",
        createdAt: Date.now() - 1000 * 60 * 15,
        likes: 3,
        replies: [
          {
            id: "sample2",
            authorId: "user2",
            authorName: "Agent Smith",
            content: "Eerste nested reply - diepte niveau 1",
            createdAt: Date.now() - 1000 * 60 * 10,
            likes: 1,
            parentCommentId: "sample1",
            replies: [
              {
                id: "sample3",
                authorId: "user1",
                authorName: "Jedi Xcom",
                content: "Nested reply op niveau 2 - kan oneindig diep!",
                createdAt: Date.now() - 1000 * 60 * 5,
                likes: 2,
                parentCommentId: "sample2",
              },
            ],
          },
          {
            id: "sample4",
            authorId: "user3",
            authorName: "Moderator",
            content: "Nog een reply op niveau 1",
            createdAt: Date.now() - 1000 * 60 * 3,
            likes: 0,
            parentCommentId: "sample1",
          },
        ],
      },
      {
        id: "sample5",
        authorId: "user2",
        authorName: "Agent Smith",
        content: "Tweede top-level comment zonder replies (SAMPLE DATA)",
        createdAt: Date.now() - 1000 * 60 * 20,
        likes: 1,
      },
    ];

    setComments(sampleComments);
    setLoading(false);
  }

  function buildNestedComments(flatComments: any[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create all comment objects
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build the tree
    flatComments.forEach((comment) => {
      const commentObj = commentMap.get(comment.id)!;
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentObj);
        } else {
          rootComments.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments;
  }

  // Calculate user stats from comments
  const calculateUserStats = useCallback((commentsData: Comment[]) => {
    const statsMap = new Map<string, UserStats>();

    const processComment = (comment: Comment) => {
      if (!statsMap.has(comment.authorId)) {
        statsMap.set(comment.authorId, {
          userId: comment.authorId,
          userName: comment.authorName,
          commentsCount: 0,
          likesReceived: 0,
          bestAnswers: 0,
          badges: [],
          level: 1,
          score: 0
        });
      }

      const stats = statsMap.get(comment.authorId)!;
      stats.commentsCount++;
      stats.likesReceived += comment.likes || 0;
      if (comment.isBestAnswer) stats.bestAnswers++;

      // Process replies recursively
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => processComment(reply));
      }
    };

    commentsData.forEach(comment => processComment(comment));

    // Calculate scores and assign badges
    const statsArray = Array.from(statsMap.values()).map(stats => {
      const score = calculateScore(stats);
      const level = getUserLevel(score);
      const earnedBadges: string[] = [];

      // Award badges
      if (stats.commentsCount >= 1) earnedBadges.push('first-post');
      if (stats.commentsCount >= 10) earnedBadges.push('conversationalist');
      if (stats.likesReceived >= 50) earnedBadges.push('popular');
      if (stats.bestAnswers >= 5) earnedBadges.push('expert');
      if (stats.commentsCount >= 100) earnedBadges.push('veteran');
      if (score >= 1000) earnedBadges.push('legend');
      if (stats.bestAnswers >= 10) earnedBadges.push('helper');

      return { ...stats, score, level, badges: earnedBadges };
    });

    // Sort by score descending
    statsArray.sort((a, b) => b.score - a.score);
    setUserStats(statsArray);
  }, []);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const { ref, push, set } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        alert("Firebase not initialized");
        return;
      }

      // Extract URLs, mentions, and hashtags from comment
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const links = newComment.match(urlRegex) || [];
      const { mentions, hashtags } = parseMentionsAndHashtags(newComment);

      const commentsRef = ref(database, "comments");
      const newCommentRef = push(commentsRef);

      const commentData: any = {
        articleSlug: PLAYGROUND_ARTICLE_SLUG,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || "Anonymous",
        content: newComment,
        createdAt: Date.now(),
        likes: 0,
      };

      // Fetch user's custom photoURL from Firebase database
      try {
        const { ref, get } = await import("firebase/database");
        const { database } = await import("@/lib/firebase");
        if (database) {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            if (userData.photoURL && userData.photoURL.trim()) {
              commentData.authorPhotoURL = userData.photoURL;
            }
          }
        }
      } catch (error) {
        console.log("Could not fetch user photo, using default");
      }

      // Fallback to currentUser.photoURL if no custom photo
      if (!commentData.authorPhotoURL && currentUser.photoURL && currentUser.photoURL.trim()) {
        commentData.authorPhotoURL = currentUser.photoURL;
      }

      // Only add optional fields if they have values
      if (selectedImage) {
        commentData.imageUrl = selectedImage;
        commentData.imageSize = imageSize;
      }
      if (links.length > 0) {
        commentData.links = links;
      }
      if (mentions.length > 0) {
        commentData.mentions = mentions;
      }
      if (hashtags.length > 0) {
        commentData.hashtags = hashtags;
      }

      await set(newCommentRef, commentData);

      // Create notifications for mentioned users
      if (mentions.length > 0) {
        // TODO: Look up user IDs from usernames and create notifications
        console.log('Mentioned users:', mentions);
      }

      setNewComment("");
      setSelectedImage(null);
      setImageSize(0);
      await loadCommentsFromFirebase();
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Fout bij plaatsen reactie");
    }
  }

  async function handleSubmitReply(commentId: string) {
    if (!replyText.trim() || !currentUser) return;

    try {
      const { ref, push, set } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        alert("Firebase not initialized");
        return;
      }

      // Extract URLs from reply
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const links = replyText.match(urlRegex) || [];

      const commentsRef = ref(database, "comments");
      const newReplyRef = push(commentsRef);

      const replyData: any = {
        articleSlug: PLAYGROUND_ARTICLE_SLUG,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || "Anonymous",
        content: replyText,
        createdAt: Date.now(),
        likes: 0,
        likedBy: {},
        parentCommentId: commentId,
      };

      // Fetch user's custom photoURL from Firebase database
      try {
        const { ref: dbRef, get } = await import("firebase/database");
        const { database: db } = await import("@/lib/firebase");
        if (db) {
          const userRef = dbRef(db, `users/${currentUser.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            if (userData.photoURL && userData.photoURL.trim()) {
              replyData.authorPhotoURL = userData.photoURL;
            }
          }
        }
      } catch (error) {
        console.log("Could not fetch user photo, using default");
      }

      // Fallback to currentUser.photoURL if no custom photo
      if (!replyData.authorPhotoURL && currentUser.photoURL && currentUser.photoURL.trim()) {
        replyData.authorPhotoURL = currentUser.photoURL;
      }

      // Only add optional fields if they have values
      if (replyImage) {
        replyData.imageUrl = replyImage;
        replyData.imageSize = replyImageSize;
      }
      if (links.length > 0) {
        replyData.links = links;
      }

      await set(newReplyRef, replyData);

      setReplyText("");
      setReplyingTo(null);
      setReplyImage(null);
      setReplyImageSize(0);
      await loadCommentsFromFirebase();
    } catch (error) {
      console.error("Error creating reply:", error);
      alert("Fout bij plaatsen reply");
    }
  }

  // Like/Unlike comment (optimized with optimistic updates)
  function handleLikeComment(commentId: string) {
    if (!currentUser) {
      alert("Je moet ingelogd zijn om te liken");
      return;
    }

    // Find comment in current state
    const findComment = (comments: Comment[]): Comment | null => {
      for (const c of comments) {
        if (c.id === commentId) return c;
        if (c.replies) {
          const found = findComment(c.replies);
          if (found) return found;
        }
      }
      return null;
    };

    const comment = findComment(comments);
    if (!comment) return;

    const hasLiked = comment.likedBy?.[currentUser.uid];

    // Optimistic UI update (instant feedback)
    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          const likedBy = { ...(c.likedBy || {}) };
          if (hasLiked) {
            delete likedBy[currentUser.uid];
            return { ...c, likes: Math.max(0, (c.likes || 0) - 1), likedBy };
          } else {
            likedBy[currentUser.uid] = true;
            return { ...c, likes: (c.likes || 0) + 1, likedBy };
          }
        }
        if (c.replies) {
          return { ...c, replies: updateCommentLikes(c.replies) };
        }
        return c;
      });
    };

    setComments(updateCommentLikes(comments));

    // Firebase update in background (don't await)
    (async () => {
      try {
        const { ref, get, update } = await import("firebase/database");
        const { database } = await import("@/lib/firebase");
        if (!database) return;

        const commentRef = ref(database, `comments/${commentId}`);
        const snapshot = await get(commentRef);

        if (snapshot.exists()) {
          const comment = snapshot.val();
          const likedBy = comment.likedBy || {};
          const hadLiked = likedBy[currentUser.uid];

          if (hadLiked) {
            delete likedBy[currentUser.uid];
            await update(commentRef, {
              likes: Math.max(0, (comment.likes || 0) - 1),
              likedBy,
            });
          } else {
            likedBy[currentUser.uid] = true;
            await update(commentRef, {
              likes: (comment.likes || 0) + 1,
              likedBy,
            });
          }
        }
      } catch (error) {
        console.error("Error liking comment:", error);
        // Rollback on error - reload from Firebase
        loadCommentsFromFirebase();
      }
    })();
  }

  // Handle image upload (max 300kb)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isReply: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Alleen afbeeldingen zijn toegestaan');
      return;
    }

    // Check file size (300KB = 307200 bytes)
    if (file.size > 307200) {
      alert('Afbeelding is te groot! Maximum 300KB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isReply) {
        setReplyImage(base64String);
        setReplyImageSize(file.size);
      } else {
        setSelectedImage(base64String);
        setImageSize(file.size);
      }
    };
    reader.readAsDataURL(file);
  };

  // Enhanced text formatting with markdown-like syntax + mentions + hashtags
  const formatTextWithLinks = (text: string) => {
    let processedText = text;
    const elements: React.ReactNode[] = [];

    // Process formatting including mentions and hashtags
    const segments = processedText.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|https?:\/\/[^\s]+|@\w+|#\w+)/g);

    segments.forEach((segment, index) => {
      if (!segment) return;

      // Mention: @username
      if (segment.startsWith('@')) {
        elements.push(
          <span
            key={index}
            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
            onClick={() => alert(`Profiel van ${segment.slice(1)}`)}
          >
            {segment}
          </span>
        );
      }
      // Hashtag: #topic
      else if (segment.startsWith('#')) {
        elements.push(
          <span
            key={index}
            className="text-purple-600 dark:text-purple-400 font-semibold cursor-pointer hover:underline"
            onClick={() => alert(`Zoek posts met ${segment}`)}
          >
            {segment}
          </span>
        );
      }
      // Bold: **text**
      else if (segment.startsWith('**') && segment.endsWith('**')) {
        elements.push(<strong key={index}>{segment.slice(2, -2)}</strong>);
      }
      // Italic: *text*
      else if (segment.startsWith('*') && segment.endsWith('*') && !segment.startsWith('**')) {
        elements.push(<em key={index}>{segment.slice(1, -1)}</em>);
      }
      // Underline: __text__
      else if (segment.startsWith('__') && segment.endsWith('__')) {
        elements.push(<u key={index}>{segment.slice(2, -2)}</u>);
      }
      // Image: ![alt](url)
      else if (segment.startsWith('![')) {
        const match = segment.match(/!\[(.*?)\]\((.*?)\)/);
        if (match && match[2] && (match[2].startsWith('http://') || match[2].startsWith('https://') || match[2].startsWith('data:image'))) {
          elements.push(
            <img
              key={index}
              src={match[2]}
              alt={match[1]}
              className="max-w-sm rounded-lg my-2 border border-slate-300 dark:border-slate-600"
            />
          );
        } else if (match) {
          // Invalid URL, show as text
          elements.push(<span key={index} className="text-red-500 text-xs">⚠️ Ongeldige afbeeldings-URL (gebruik http:// of https://)</span>);
        }
      }
      // Link: [text](url)
      else if (segment.startsWith('[')) {
        const match = segment.match(/\[(.*?)\]\((.*?)\)/);
        if (match && match[2] && (match[2].startsWith('http://') || match[2].startsWith('https://') || match[2].startsWith('#'))) {
          elements.push(
            <a
              key={index}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {match[1]}
            </a>
          );
        } else if (match) {
          // Invalid URL, show as text with the link text
          elements.push(<span key={index}>{match[1]} <span className="text-red-500 text-xs">(ongeldige link)</span></span>);
        }
      }
      // Plain URL
      else if (segment.match(/^https?:\/\//)) {
        elements.push(
          <a
            key={index}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            {segment}
          </a>
        );
      }
      // Plain text
      else {
        elements.push(<span key={index}>{segment}</span>);
      }
    });

    return elements;
  };

  // Render a single comment and its nested replies
  const renderComment = (comment: Comment, depth: number = 0) => {
    const isNested = depth > 0;
    const avatarSize = isNested ? "h-8 w-8" : "h-10 w-10";
    const textSize = isNested ? "text-sm" : "text-base";
    const isLiked = comment.likedBy?.[currentUser?.uid || ""];

    return (
      <div key={comment.id} className="space-y-3">
        {/* Comment Card */}
        <div
          className={`bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 ${
            isNested ? "text-sm" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.authorPhotoURL && comment.authorPhotoURL.trim() && (comment.authorPhotoURL.startsWith('http') || comment.authorPhotoURL.startsWith('data:image')) ? (
                <>
                  <img
                    alt={comment.authorName}
                    className={`${avatarSize} rounded-full object-cover bg-slate-200 dark:bg-slate-700`}
                    src={comment.authorPhotoURL}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.log('Image failed to load:', comment.authorPhotoURL);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    onLoad={() => console.log('Image loaded successfully:', comment.authorPhotoURL)}
                  />
                  <div
                    className={`${avatarSize} rounded-full bg-primary-600 text-white items-center justify-center font-bold`}
                    style={{ fontSize: isNested ? '0.75rem' : '1rem', display: 'none' }}
                  >
                    {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                </>
              ) : (
                <div
                  className={`${avatarSize} rounded-full bg-primary-600 text-white flex items-center justify-center font-bold`}
                  style={{ fontSize: isNested ? '0.75rem' : '1rem' }}
                  title={`No photo URL: ${comment.authorPhotoURL || 'undefined'}`}
                >
                  {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span
                  className={`font-semibold text-slate-900 dark:text-white ${
                    isNested ? "text-sm" : ""
                  }`}
                >
                  {comment.authorName}
                </span>
                {comment.authorId === currentUser?.uid && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 ${
                      isNested ? "text-[10px]" : "text-xs"
                    }`}
                    title="Jij"
                  >
                    <span>👤</span>
                    <span>Jij</span>
                  </span>
                )}
                {/* User badges */}
                {(() => {
                  const userStat = userStats.find(s => s.userId === comment.authorId);
                  if (!userStat) return null;

                  const levelName = getLevelName(userStat.level);
                  const levelColor = userStat.level >= 5 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                                    userStat.level >= 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';

                  return (
                    <>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${levelColor} ${
                          isNested ? "text-[10px]" : "text-xs"
                        }`}
                        title={`Level ${userStat.level} - ${userStat.score} punten`}
                      >
                        {userStat.level >= 5 ? '👑' : userStat.level >= 3 ? '⭐' : '🔰'} {levelName}
                      </span>
                      {userStat.badges.length > 0 && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 ${
                            isNested ? "text-[10px]" : "text-xs"
                          }`}
                          title={`${userStat.badges.length} badges: ${userStat.badges.map(b => BADGES.find(badge => badge.id === b)?.name).join(', ')}`}
                        >
                          🏆 {userStat.badges.length}
                        </span>
                      )}
                    </>
                  );
                })()}
                {comment.isPinned && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 ${
                      isNested ? "text-[10px]" : "text-xs"
                    }`}
                    title="Vastgepind door moderator"
                  >
                    <Pin className="h-3 w-3" /> Pinned
                  </span>
                )}
                {comment.isBestAnswer && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 ${
                      isNested ? "text-[10px]" : "text-xs"
                    }`}
                    title="Beste antwoord"
                  >
                    <CheckCircle className="h-3 w-3" /> Best Answer
                  </span>
                )}
                <span
                  className={`text-slate-500 dark:text-slate-400 ${
                    isNested ? "text-xs" : "text-sm"
                  }`}
                >
                  {formatDistanceToNow(comment.createdAt, {
                    addSuffix: true,
                    locale: nl,
                  })}
                  {comment.editedAt && (
                    <span className="ml-1 text-xs" title={`Bewerkt op ${new Date(comment.editedAt).toLocaleString('nl-NL')}`}>
                      (bewerkt)
                    </span>
                  )}
                </span>
              </div>

              {/* Content */}
              <div className={`text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3 ${textSize}`}>
                {formatTextWithLinks(comment.content)}
              </div>

              {/* Image attachment */}
              {comment.imageUrl && (
                <div className="mb-3">
                  <img
                    src={comment.imageUrl}
                    alt="Uploaded attachment"
                    className="max-w-full rounded-lg border-2 border-slate-200 dark:border-slate-700 max-h-96 object-contain"
                  />
                  {comment.imageSize && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {(comment.imageSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={!currentUser}
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    isNested ? "text-xs" : "text-sm"
                  } ${
                    isLiked
                      ? "text-accent-600 dark:text-accent-400"
                      : "text-slate-500 hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ThumbsUp
                    className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  {comment.likes || 0}
                </button>
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment.id ? null : comment.id
                    )
                  }
                  disabled={!currentUser}
                  className={`inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors ${
                    isNested ? "text-xs" : "text-sm"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <MessageSquare className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"} />
                  Reageren
                </button>

                {/* Watch/Unwatch Button */}
                {!isNested && !comment.parentCommentId && (
                  <button
                    onClick={() => toggleWatchThread(comment.id)}
                    disabled={!currentUser}
                    title={watchedThreads.includes(comment.id) ? "Stop met volgen" : "Volg thread"}
                    className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                      isNested ? "text-xs" : "text-sm"
                    } ${
                      watchedThreads.includes(comment.id)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {watchedThreads.includes(comment.id) ? (
                      <Bell className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"} fill="currentColor" />
                    ) : (
                      <BellOff className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"} />
                    )}
                  </button>
                )}

                {/* Save/Unsave Button */}
                <button
                  onClick={() => toggleSavePost(comment.id)}
                  disabled={!currentUser}
                  title={savedPosts.includes(comment.id) ? "Verwijder uit opgeslagen" : "Opslaan"}
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    isNested ? "text-xs" : "text-sm"
                  } ${
                    savedPosts.includes(comment.id)
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-slate-500 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {savedPosts.includes(comment.id) ? (
                    <BookmarkCheck className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"} fill="currentColor" />
                  ) : (
                    <Bookmark className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"} />
                  )}
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && currentUser && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <textarea
                    id={`replyText-${comment.id}`}
                    name={`replyText-${comment.id}`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder={`Reageer op ${comment.authorName}... (URLs worden automatisch klikbaar)`}
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none text-sm"
                    autoComplete="off"
                  />

                  {/* Reply image preview */}
                  {replyImage && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={replyImage}
                        alt="Preview"
                        className="max-w-xs rounded-lg border-2 border-slate-300 dark:border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReplyImage(null);
                          setReplyImageSize(0);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {(replyImageSize / 1024).toFixed(1)} KB / 300 KB
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Plaats reply
                    </button>

                    {/* Image upload for reply */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold cursor-pointer transition-colors text-sm">
                      <ImageIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                        setReplyImage(null);
                        setReplyImageSize(0);
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-12 space-y-3 border-l-2 border-primary-200 dark:border-primary-800 pl-4">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const exportHTML = () => {
    const html = document.querySelector(".comments-container")?.outerHTML || "";
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "threaded-comments.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHTML = () => {
    const html = document.querySelector(".comments-container")?.outerHTML || "";
    navigator.clipboard.writeText(html);
    alert("HTML copied to clipboard!");
  };

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
        <Link href="/playground" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold mb-4">
          <ArrowLeft className="h-4 w-4" />
          Terug naar Playground
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🧵 Threaded Replies Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Test onbeperkt geneste comments met visuele hiërarchie
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span className="font-semibold text-slate-900 dark:text-white">Controls & Export</span>
          </div>
          <div className="flex gap-2">
            <button onClick={copyHTML} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold text-sm transition-colors">
              <Copy className="h-4 w-4" />
              Copy HTML
            </button>
            <button onClick={exportHTML} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors">
              <Download className="h-4 w-4" />
              Download HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Source:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUseLiveData(true)}
              className={`min-w-[140px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${useLiveData ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
            >
              🔴 Live Firebase
            </button>
            <button
              onClick={() => setUseLiveData(false)}
              className={`min-w-[140px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${!useLiveData ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
            >
              📋 Sample Data
            </button>
          </div>
          <button
            onClick={() => useLiveData ? loadCommentsFromFirebase() : loadSampleData()}
            className="ml-auto inline-flex items-center justify-center gap-2 min-w-[100px] px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* User Controls */}
        {currentUser && (
          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">User:</span>
            </div>

          {/* Notifications Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative inline-flex items-center justify-center gap-2 min-w-[100px] px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

          {/* Saved Posts Button */}
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="inline-flex items-center justify-center gap-2 min-w-[140px] px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              Saved ({savedPosts.length})
            </button>

          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="inline-flex items-center justify-center gap-2 min-w-[100px] px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Trophy className="h-4 w-4" />
            Top {userStats.length}
          </button>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="inline-flex items-center justify-center gap-2 min-w-[100px] px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Award className="h-4 w-4" />
            Badges
          </button>
          </div>
        )}

        {/* Controls & Export Boxes Row */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Controls Box */}
          <div className="bg-slate-800 dark:bg-slate-900 rounded-xl border-2 border-slate-600 dark:border-slate-700 p-5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-5 w-5" />
              Controls
              {Object.values(filterOptions).filter(v => !v).length > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  {Object.values(filterOptions).filter(v => !v).length}
                </span>
              )}
            </h3>

            {/* Sort Options */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <List className="h-3 w-3" />
                SORTERING
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setSortOrder('newest')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortOrder === 'newest'
                      ? 'bg-primary-500 text-white font-semibold'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <SortDesc className="h-4 w-4" />
                  Nieuwste eerst
                </button>
                <button
                  onClick={() => setSortOrder('oldest')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortOrder === 'oldest'
                      ? 'bg-primary-500 text-white font-semibold'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <SortAsc className="h-4 w-4" />
                  Oudste eerst
                </button>
                <button
                  onClick={() => setSortOrder('popular')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortOrder === 'popular'
                      ? 'bg-primary-500 text-white font-semibold'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <Flame className="h-4 w-4" />
                  Populairste
                </button>
              </div>
            </div>

            {/* Filter Options */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <Filter className="h-3 w-3" />
                FILTERS
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOptions.showPinned}
                    onChange={(e) => setFilterOptions({...filterOptions, showPinned: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <Pin className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Vastgepinde berichten</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOptions.showAnswered}
                    onChange={(e) => setFilterOptions({...filterOptions, showAnswered: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Beantwoorde topics</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOptions.showUnanswered}
                    onChange={(e) => setFilterOptions({...filterOptions, showUnanswered: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">Onbeantwoorde topics</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOptions.showWithImages}
                    onChange={(e) => setFilterOptions({...filterOptions, showWithImages: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <ImageIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Met afbeeldingen</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={filterOptions.showPolls}
                    onChange={(e) => setFilterOptions({...filterOptions, showPolls: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">Peilingen</span>
                </label>
              </div>
            </div>
          </div>

          {/* Export Box */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-300 dark:border-green-700 p-5">
            <h3 className="font-bold text-green-900 dark:text-green-100 flex items-center gap-2 mb-4">
              <Download className="h-5 w-5" />
              Export
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const data = JSON.stringify(comments, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `forum-data-${Date.now()}.json`;
                  a.click();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-green-800/30 hover:bg-green-100 dark:hover:bg-green-800/50 text-slate-700 dark:text-green-100 text-sm transition-colors border border-green-200 dark:border-green-700"
              >
                <FileJson className="h-5 w-5 text-orange-500" />
                <div className="text-left">
                  <div className="font-semibold">JSON Format</div>
                  <div className="text-xs text-slate-500 dark:text-green-300">Alle data gestructureerd</div>
                </div>
              </button>

              <button
                onClick={() => {
                  const csvData = comments.map(c => `"${c.authorName}","${c.content.replace(/"/g, '""')}","${new Date(c.createdAt).toISOString()}","${c.likes}"`);
                  const csv = `"Auteur","Bericht","Datum","Likes"\n${csvData.join('\n')}`;
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `forum-data-${Date.now()}.csv`;
                  a.click();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-green-800/30 hover:bg-green-100 dark:hover:bg-green-800/50 text-slate-700 dark:text-green-100 text-sm transition-colors border border-green-200 dark:border-green-700"
              >
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
                <div className="text-left">
                  <div className="font-semibold">CSV/Excel</div>
                  <div className="text-xs text-slate-500 dark:text-green-300">Voor spreadsheets</div>
                </div>
              </button>

              <button
                onClick={() => {
                  const txtData = comments.map(c =>
                    `${c.authorName} (${new Date(c.createdAt).toLocaleString('nl-NL')}):\n${c.content}\n${c.likes} likes\n${'='.repeat(50)}`
                  ).join('\n\n');
                  const blob = new Blob([txtData], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `forum-data-${Date.now()}.txt`;
                  a.click();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-green-800/30 hover:bg-green-100 dark:hover:bg-green-800/50 text-slate-700 dark:text-green-100 text-sm transition-colors border border-green-200 dark:border-green-700"
              >
                <FileText className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-semibold">Tekstbestand</div>
                  <div className="text-xs text-slate-500 dark:text-green-300">Leesbare tekst</div>
                </div>
              </button>

              <div className="border-t border-green-200 dark:border-green-700 my-3"></div>

              <button
                onClick={() => window.print()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-green-800/30 hover:bg-green-100 dark:hover:bg-green-800/50 text-slate-700 dark:text-green-100 text-sm transition-colors border border-green-200 dark:border-green-700"
              >
                <Printer className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <div className="text-left">
                  <div className="font-semibold">Print Pagina</div>
                  <div className="text-xs text-slate-500 dark:text-green-300">Naar printer/PDF</div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Politie Forum',
                      text: `Bekijk dit forum met ${comments.length} berichten`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link gekopieerd naar klembord!');
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-green-800/30 hover:bg-green-100 dark:hover:bg-green-800/50 text-slate-700 dark:text-green-100 text-sm transition-colors border border-green-200 dark:border-green-700"
              >
                <Share2 className="h-5 w-5 text-sky-500" />
                <div className="text-left">
                  <div className="font-semibold">Deel Pagina</div>
                  <div className="text-xs text-slate-500 dark:text-green-300">Link kopiëren/delen</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leaderboard</h2>
              </div>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {userStats.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Nog geen gebruikers met statistieken
                </div>
              ) : (
                <div className="space-y-3">
                  {userStats.map((stat, index) => {
                    const isCurrentUser = currentUser?.uid === stat.userId;
                    const rank = index + 1;
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
                    const levelName = getLevelName(stat.level);

                    return (
                      <div
                        key={stat.userId}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          isCurrentUser
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 font-bold text-lg">
                          {medal || `#${rank}`}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {stat.userName}
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full font-semibold">
                                Jij
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                              stat.level >= 5 ? 'bg-purple-500 text-white' :
                              stat.level >= 3 ? 'bg-blue-500 text-white' :
                              'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                            }`}>
                              {levelName}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5" />
                              {stat.commentsCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {stat.likesReceived}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {stat.bestAnswers}
                            </span>
                            {stat.badges.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5" />
                                {stat.badges.length}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {stat.score}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">punten</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Badges Info Modal */}
      {showBadges && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Badges & Prestaties</h2>
              </div>
              <button
                onClick={() => setShowBadges(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BADGES.map((badge) => {
                  const Icon = {
                    'first-post': MessageSquare,
                    'conversationalist': Star,
                    'popular': ThumbsUp,
                    'expert': Award,
                    'veteran': Crown,
                    'legend': Trophy,
                    'helper': CheckCircle,
                    'on-fire': Flame
                  }[badge.id] || Award;

                  return (
                    <div
                      key={badge.id}
                      className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                          <Icon className={`h-6 w-6 ${badge.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                            {badge.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-lg px-3 py-2">
                        <strong>Vereiste:</strong> {badge.requirement}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Level Systeem
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Lvl 1 - Rookie</div>
                    <div className="text-xs text-slate-500">0-99 punten</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Lvl 2 - Member</div>
                    <div className="text-xs text-slate-500">100-249 punten</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Lvl 3 - Regular</div>
                    <div className="text-xs text-slate-500">250-499 punten</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">Lvl 4 - Veteran</div>
                    <div className="text-xs text-slate-500">500-999 punten</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-semibold text-purple-600 dark:text-purple-400">Lvl 5 - Expert</div>
                    <div className="text-xs text-slate-500">1000-1999 punten</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-semibold text-yellow-600 dark:text-yellow-400">Lvl 6 - Legend</div>
                    <div className="text-xs text-slate-500">2000+ punten</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <strong>Puntensysteem:</strong> Reactie = 10 punten • Like ontvangen = 5 punten • Best Answer = 50 punten
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="comments-container bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          Reacties
          <span className="text-base font-normal text-slate-500 dark:text-slate-400">({comments.length})</span>
        </h3>

        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label htmlFor="commentText" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Plaats een reactie
              </label>

              {/* Formatting toolbar */}
              <div className="flex items-center gap-1 mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 flex-wrap">
                <button
                  type="button"
                  onClick={insertBold}
                  title="Vetgedrukt **tekst**"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={insertItalic}
                  title="Cursief *tekst*"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={insertUnderline}
                  title="Onderstreept __tekst__"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <Underline className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                <button
                  type="button"
                  onClick={insertLink}
                  title="Link invoegen [tekst](url)"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={insertImageLink}
                  title="Afbeelding URL ![alt](url)"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <div className="ml-auto text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  **vet** • *cursief* • __onderstreept__
                </div>
              </div>

              <textarea
                id="commentText"
                name="commentText"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                required
                placeholder="Deel je mening... Gebruik **vet**, *cursief*, __onderstreept__, [link](url), ![alt](url)"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none"
                autoComplete="off"
              />
            </div>

            {/* Image preview */}
            {selectedImage && (
              <div className="mb-4 relative inline-block">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-xs rounded-lg border-2 border-slate-300 dark:border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageSize(0);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {(imageSize / 1024).toFixed(1)} KB / 300 KB
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="h-5 w-5" />
                Plaats reactie
              </button>

              {/* Image upload button */}
              <label className="inline-flex items-center gap-2 px-4 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold cursor-pointer transition-colors">
                <ImageIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Afbeelding</span>
                <span className="text-xs">(max 300KB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
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
                  className="inline-flex items-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-semibold transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  Verwijder
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Je moet ingelogd zijn om reacties te plaatsen. Klik op "Inloggen" in de header.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">Laden...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">Nog geen reacties</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {useLiveData ? "Plaats de eerste reactie!" : "Schakel naar Live Firebase om reacties te plaatsen"}
            </p>
          </div>
        ) : (
          <>
            {/* Filter Status Indicator */}
            {filterAndSortComments(comments).length !== comments.length && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Filter className="h-4 w-4" />
                    <span>
                      <strong>{filterAndSortComments(comments).length}</strong> van <strong>{comments.length}</strong> berichten getoond
                    </span>
                  </div>
                  <button
                    onClick={() => setFilterOptions({
                      showPinned: true,
                      showAnswered: true,
                      showUnanswered: true,
                      showWithImages: true,
                      showPolls: true
                    })}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold underline"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {filterAndSortComments(comments).map((comment) => renderComment(comment))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">💡 Implementation Notes</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Onbeperkte diepte</strong>: Recursieve rendering van nested replies</li>
          <li>• <strong>Visuele hiërarchie</strong>: Kleinere avatars/text bij diepere nesting</li>
          <li>• <strong>Firebase structuur</strong>: Gebruik <code>parentCommentId</code> field</li>
          <li>• <strong>Performance</strong>: Overweeg virtualisatie bij &gt;100 comments</li>
        </ul>
      </div>
    </div>
  </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
