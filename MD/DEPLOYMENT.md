# 🚀 Deployment Checklist - Politie Forum

## Pre-Deployment Checklist

### 1. Firebase Configuration

- [ ] Verify Firebase project settings in console
- [ ] Update `.env.local` with production credentials
- [ ] Set up Firebase Security Rules (see below)
- [ ] Enable required authentication methods
- [ ] Configure authorized domains for OAuth

### 2. Security Rules

#### Realtime Database Rules

```json
{
  "rules": {
    "categories": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "topics": {
      ".read": true,
      "$topicId": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['title', 'categoryId', 'authorId', 'authorName', 'content', 'createdAt'])"
      }
    },
    "posts": {
      ".read": true,
      "$postId": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['topicId', 'authorId', 'authorName', 'content', 'createdAt'])"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $userId",
        ".validate": "newData.hasChildren(['email', 'displayName', 'role', 'createdAt'])"
      }
    }
  }
}
```

#### Storage Rules (when implementing file uploads)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    match /attachments/{topicId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### 3. Environment Variables

Create `.env.production` for production deployment:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_production_db_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_production_measurement_id
```

### 4. Code Quality

- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run build` successfully
- [ ] Test all authentication flows
- [ ] Test data creation and real-time updates
- [ ] Verify SEO metadata
- [ ] Test responsive design on mobile

### 5. Performance

- [ ] Enable Next.js Image Optimization
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images and assets
- [ ] Test loading times

### 6. Analytics & Monitoring

- [ ] Set up Google Analytics (GA4)
- [ ] Configure Firebase Analytics
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor Firebase usage and quotas

## Deployment Platforms

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables in Vercel:**

1. Go to Project Settings → Environment Variables
2. Add all `NEXT_PUBLIC_FIREBASE_*` variables
3. Set for Production, Preview, and Development

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

**firebase.json:**

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Post-Deployment Tasks

### 1. Domain Configuration

- [ ] Configure custom domain (politie-forum.nl)
- [ ] Set up SSL certificate (auto with Vercel/Netlify)
- [ ] Update Firebase authorized domains
- [ ] Configure DNS records

### 2. Firebase Setup

- [ ] Add production domain to authorized domains
- [ ] Enable email verification
- [ ] Set up email templates
- [ ] Configure SMTP for custom emails (optional)

### 3. SEO

- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain in Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Set up robots.txt verification

### 4. Monitoring

- [ ] Set up uptime monitoring
- [ ] Configure alerting for errors
- [ ] Monitor Firebase quotas
- [ ] Track user analytics

### 5. Backup & Recovery

- [ ] Set up automated database backups
- [ ] Document recovery procedures
- [ ] Test backup restoration

## Security Checklist

- [ ] Enable App Check (Firebase)
- [ ] Set up rate limiting
- [ ] Implement CAPTCHA for registration
- [ ] Add content moderation
- [ ] Set up abuse reporting
- [ ] Configure password policies
- [ ] Enable 2FA (future feature)

## Maintenance Plan

### Daily

- Monitor error logs
- Check Firebase usage
- Review new user registrations

### Weekly

- Review forum content
- Check analytics
- Backup database
- Update dependencies

### Monthly

- Security audit
- Performance review
- User feedback review
- Feature planning

## Scaling Considerations

### When to Scale

- 1000+ daily active users → Consider Firebase Blaze plan
- 10k+ topics → Implement pagination
- Slow queries → Add database indexes
- High traffic → Enable CDN
- Storage limits → Implement cleanup policies

### Firebase Pricing

- **Spark (Free)**:

  - 1GB storage
  - 10GB bandwidth/month
  - 100 simultaneous connections

- **Blaze (Pay as you go)**:
  - Unlimited storage
  - Unlimited bandwidth
  - Unlimited connections
  - $1/GB storage
  - $0.15/GB bandwidth

## Support & Documentation

- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create for bug tracking
- Community Forum: For user support

## Emergency Contacts

- Firebase Support: https://firebase.google.com/support
- Vercel Support: https://vercel.com/support
- Developer: [Your contact info]

---

**Last Updated**: October 3, 2025
**Version**: 1.0.0
