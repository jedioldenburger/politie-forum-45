# 🏅 Badge System - Quick Reference

## 🎯 Badge Awards (Automatic)

| Action | Badge | Emoji | Trigger |
|--------|-------|-------|---------|
| Post 1st comment | Nieuw lid | 💬 | `userCommentCount === 1` |
| Post 10+ comments | Actief Lid | 🔥 | `userCommentCount >= 10` |
| Get 10+ likes | Top Reactie | ⭐ | `comment.likes >= 10` |

---

## 📂 Key Files

```
src/components/ArticleComments.tsx  # Badge logic + UI
database.rules.json                 # Security rules
MD/BADGE-SYSTEM-COMPLETE.md        # Full documentation
```

---

## 🔧 Core Functions

### Award Badge
```typescript
await addBadge(uid, 'firstComment');
```

### Get User Badges
```typescript
const badges = await getUserBadges(uid);
// Returns: ['firstComment', 'activeMember']
```

### Display Badge
```tsx
{userBadges[authorId]?.map((badgeKey) => {
  const badge = BADGE_CONFIG[badgeKey];
  return <span className={badge.className}>{badge.emoji} {badge.label}</span>;
})}
```

---

## 🔒 Security Rules (Deployed ✅)

### What's Protected ❌
- Manual badge creation
- Editing others' comments
- Negative like counts
- Unauthorized data access

### What's Allowed ✅
- Post own comments
- Like/unlike comments
- Update own profile
- Read public data

---

## 🚀 Deploy

```bash
# Deploy security rules
firebase deploy --only database

# Deploy application
npm run build
vercel --prod
```

---

## 🧪 Test Locally

```bash
npm run dev
```

1. Post comment → Get "💬 Nieuw lid"
2. Post 10 comments → Get "🔥 Actief Lid"
3. Get 10 likes → Author gets "⭐ Top Reactie"

---

## 📊 Firebase Structure

```
/users/{uid}/badges/
  firstComment: { earnedAt: 1728393600000 }
  activeMember: { earnedAt: 1728480000000 }
  communityStar: { earnedAt: 1728566400000 }
```

---

## 🎨 Badge Config

```typescript
const BADGE_CONFIG = {
  firstComment: {
    label: 'Nieuw lid',
    emoji: '💬',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
  },
  communityStar: {
    label: 'Top Reactie',
    emoji: '⭐',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
  },
  activeMember: {
    label: 'Actief Lid',
    emoji: '🔥',
    className: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
  }
};
```

---

**Status**: ✅ Production Ready
**Last Updated**: October 8, 2025
