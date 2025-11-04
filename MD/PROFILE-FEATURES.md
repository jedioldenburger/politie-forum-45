# 👤 Profile Page Features

## ✅ Implemented Features

### 1. **Profile Picture Upload**

- **Drag & Drop Support**: Drag images directly onto your avatar
- **Click to Upload**: Click the avatar to select a file
- **URL Support**: Paste a URL to use an external image
- **Validation**:
  - Maximum file size: 2MB
  - Allowed formats: JPG, PNG, GIF, WebP
  - Real-time preview before saving
- **Base64 Storage**: Images are converted to base64 for direct storage in Firebase

### 2. **Profile Information**

- **Full Name**: Your complete name
- **Nickname/Username**: Display name shown on comments and posts
- **Bio**: Up to 500 characters about yourself
- **Location**: Optional location field (e.g., "Amsterdam, Nederland")
- **Website/Social**: Optional URL for your website or social media

### 3. **Account Statistics**

- **Posts**: Number of forum posts
- **Reputation**: Community reputation score
- **Role**: User, Moderator, or Admin badge
- **Member Since**: Registration date

### 4. **User Experience**

- **Real-time Preview**: See changes before saving
- **Success/Error Messages**: Clear feedback on save operations
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode Support**: Full dark mode compatibility

## 🎨 Design Features

### Upload Area

```
┌─────────────────────────────────────┐
│  [Avatar Preview]    Upload Box     │
│                                      │
│                   📤 Upload          │
│                   • JPG, PNG, GIF    │
│                   • Max 2MB          │
│                   • Square (400x400) │
└─────────────────────────────────────┘
```

### Visual Feedback

- ✅ **Green notification** on successful upload
- ❌ **Red notification** on errors (file too large, wrong type)
- 🔄 **Loading state** during save
- ❌ **Remove button** to delete uploaded image

## 📝 How to Use

### Upload a Profile Picture

**Method 1: Drag & Drop**

1. Go to `/profiel` page
2. Drag an image file onto your avatar
3. See instant preview
4. Click "Profiel opslaan" to save

**Method 2: Click to Upload**

1. Hover over your avatar
2. Click when the upload icon appears
3. Select image from your computer
4. Click "Profiel opslaan" to save

**Method 3: URL**

1. Paste an image URL in the URL field
2. Preview appears automatically
3. Click "Profiel opslaan" to save

### Edit Profile Information

1. **Navigate** to `/profiel`
2. **Fill in** your information:
   - Full name (required if no nickname)
   - Nickname (shows in comments)
   - Bio (optional, max 500 chars)
   - Location (optional)
   - Website (optional)
3. **Save** your changes
4. **Success message** appears

## 🔐 Security Features

- **Authentication Required**: Must be logged in to access
- **User-specific Data**: Each user can only edit their own profile
- **File Validation**: Only images accepted, size limits enforced
- **Email Protection**: Email cannot be changed (read-only)

## 💾 Data Storage

### Firebase Realtime Database Structure

```json
{
  "users": {
    "userId123": {
      "uid": "userId123",
      "email": "user@example.com",
      "displayName": "Jan van der Berg",
      "photoURL": "data:image/jpeg;base64,...",
      "bio": "Politieagent sinds 2015...",
      "location": "Amsterdam, Nederland",
      "website": "https://example.nl",
      "createdAt": 1234567890,
      "role": "user",
      "posts": 42,
      "reputation": 156
    }
  }
}
```

## 🚀 Future Enhancements

Potential additions:

- [ ] Cover photo upload
- [ ] Social media links (Twitter, LinkedIn, Instagram)
- [ ] Skills/badges system
- [ ] Activity timeline
- [ ] Privacy settings (hide email, location)
- [ ] Two-factor authentication
- [ ] Account deletion
- [ ] Profile visibility settings (public/private)

## 🎯 Key Components

### State Management

```typescript
const [displayName, setDisplayName] = useState("");
const [nickname, setNickname] = useState("");
const [photoURL, setPhotoURL] = useState("");
const [bio, setBio] = useState("");
const [location, setLocation] = useState("");
const [website, setWebsite] = useState("");
const [uploadedImage, setUploadedImage] = useState<{ url; file } | null>(null);
```

### Image Upload Handler

- File type validation
- File size validation (2MB max)
- Base64 conversion
- Preview generation
- Error handling

### Form Submission

- Async save operation
- Image conversion (if uploaded)
- Firebase update
- Success/error feedback
- State cleanup

## 📱 Responsive Behavior

### Mobile (< 768px)

- Stacked layout
- Full-width inputs
- Simplified statistics grid (2 columns)

### Desktop (≥ 768px)

- Side-by-side avatar and upload area
- 4-column statistics grid
- Larger preview images

## ♿ Accessibility

- Clear labels for all inputs
- Keyboard navigation support
- Screen reader friendly
- High contrast error messages
- Focus states on interactive elements

## 🎨 Visual Design

### Colors

- **Primary**: Blue for main actions
- **Accent**: Red for emphasis
- **Success**: Green for confirmations
- **Error**: Red for errors
- **Neutral**: Slate grays for text and borders

### Spacing

- Consistent padding and margins
- Clear visual hierarchy
- Generous touch targets (mobile)

### Animations

- Smooth transitions on hover
- Fade in/out for messages
- Scale effects on interactive elements

---

**Ready to use!** Visit `/profiel` while logged in to start customizing your profile! 🎉
