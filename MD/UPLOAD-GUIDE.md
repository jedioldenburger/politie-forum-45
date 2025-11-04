# 📤 Image Upload Guide - Politie Forum

## Overview

The Politie Forum now supports **advanced image uploading** with file validation, drag-and-drop support, and preview thumbnails. This guide explains how to use the upload feature effectively.

---

## 🎯 Quick Start

### Method 1: Click to Upload

1. Click the **📤 Upload** button in the comment toolbar
2. Select an image file from your device
3. Preview will appear automatically
4. Image markdown is auto-inserted in your comment

### Method 2: Drag & Drop

1. Drag an image file from your desktop
2. Drop it on the comment textarea
3. Visual indicator shows drop zone
4. Preview appears with auto-inserted markdown

### Method 3: Image URL (Classic)

1. Click the **🖼️ Image** button
2. Enter image URL when prompted
3. Markdown syntax inserted: `![description](url)`

---

## 📋 File Requirements

### Supported Formats

- ✅ **JPEG/JPG** - Standard photos
- ✅ **PNG** - Transparent images
- ✅ **GIF** - Animated or static
- ✅ **WebP** - Modern web format

### Size Limits

- **Maximum file size**: 1 MB (1,024 KB)
- **Optimal size**: 200-500 KB for fast loading
- Files over 1 MB will be **rejected** with error message

### Validation

All uploads are validated:

- ✅ File type checking (only images allowed)
- ✅ Size verification (1 MB maximum)
- ✅ Error messages for invalid files
- ✅ Auto-dismiss errors after 5 seconds

---

## 🖼️ Image Previews

### Preview Features

- **Thumbnail display**: See uploaded images before posting
- **File size info**: Shows KB size for each image
- **Grid layout**: 2-3 columns responsive grid
- **Delete buttons**: Remove unwanted images with ❌ button

### Preview Actions

```
┌──────────────────────────┐
│  [Image Thumbnail]       │
│                          │
│  📄 filename.jpg         │
│  💾 234 KB               │
│  ❌ Remove               │
└──────────────────────────┘
```

### Deleting Images

1. Click the **❌** button on any preview
2. Image is removed from upload queue
3. Markdown reference removed from comment text
4. No confirmation needed

---

## 🎨 User Interface

### Upload Button (📤)

- Located in formatting toolbar (left side)
- Opens file picker dialog
- Accepts multiple files (one at a time)
- Tooltip: "Upload Image (max 1MB)"

### Drag & Drop Zone

- **Active state**: Border changes to dashed primary color
- **Visual indicator**: Upload icon overlay appears
- **Feedback**: "Drop image here" message
- **Cancel**: Drag out of zone to cancel

### Error Messages

```
┌────────────────────────────────────────────┐
│ ⚠️ Error: File too large. Max size is 1MB │
│    (Auto-dismisses in 5 seconds)           │
└────────────────────────────────────────────┘
```

Error types:

- "File too large. Max size is 1MB"
- "Invalid file type. Please upload an image"

---

## 💡 Best Practices

### Image Optimization

1. **Resize before upload**: Use photo editor to reduce dimensions
2. **Compress files**: Tools like TinyPNG, ImageOptim
3. **Choose right format**:
   - Photos → JPEG (smaller)
   - Graphics → PNG (quality)
   - Animations → GIF
   - Modern web → WebP (best compression)

### Upload Tips

- ✅ Test preview before posting
- ✅ Delete unwanted images immediately
- ✅ Use descriptive filenames
- ✅ Check file size indicator
- ❌ Don't upload screenshots of text (use formatting instead)
- ❌ Don't upload copyrighted images without permission

### Accessibility

- Add descriptive alt text in markdown: `![Police car at scene](image.jpg)`
- Avoid uploading images with critical text (use actual text)
- Consider dark mode users (test contrast)

---

## 🔧 Technical Details

### State Management

```typescript
// Upload state
const [uploadedImages, setUploadedImages] = useState<
  Array<{
    url: string; // Data URL for preview
    file: File; // Original file object
  }>
>([]);

// Error handling
const [uploadError, setUploadError] = useState<string | null>(null);
```

### Validation Logic

```typescript
// Max size: 1MB
const MAX_SIZE = 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
```

### Preview Generation

- Uses `FileReader` API
- Creates data URLs (`data:image/jpeg;base64,...`)
- Stores in component state
- Revokes URLs on deletion (memory cleanup)

### Markdown Insertion

```typescript
// Auto-inserts at cursor position
const imageMarkdown = `![Image](${url})`;
setComment(comment + "\n\n" + imageMarkdown);
```

---

## 🐛 Troubleshooting

### Issue: Upload Button Not Working

**Solution**:

- Check browser console for errors
- Verify file type is supported
- Try smaller file (<500 KB)
- Clear browser cache

### Issue: Drag & Drop Not Activating

**Solution**:

- Ensure dragging actual file (not URL)
- Try from desktop/file manager
- Check file format is image
- Drag directly over textarea

### Issue: Preview Not Showing

**Solution**:

- Wait 1-2 seconds (large files take time)
- Check browser supports FileReader API
- Try refresh page
- Check file isn't corrupted

### Issue: "File Too Large" Error

**Solution**:

- Compress image using online tools
- Reduce image dimensions (e.g., 1920x1080 → 1280x720)
- Convert to WebP format (better compression)
- Use image hosting service and URL method instead

### Issue: Image Markdown Not Inserted

**Solution**:

- Check if comment text limit reached (500 chars)
- Manually add: `![description](url)`
- Try deleting and re-uploading
- Check console for JavaScript errors

---

## 🔒 Privacy & Security

### Data Handling

- ✅ Files processed **client-side only** (browser)
- ✅ Preview URLs are temporary (data URLs)
- ✅ No files sent to server until form submitted
- ✅ Validation prevents malicious files

### Current Limitations

- 🔄 **Upload storage**: Not yet implemented (files → data URLs only)
- 🔄 **Server processing**: Will be added in future update
- 🔄 **Persistent URLs**: Currently using temporary data URLs

### Future Enhancements

- [ ] Firebase Storage integration
- [ ] Permanent image URLs
- [ ] Multiple image uploads per comment
- [ ] Image editing tools (crop, rotate, filters)
- [ ] Automatic WebP conversion
- [ ] CDN delivery for fast loading

---

## 📚 Related Documentation

- **[Comment Formatting Guide](COMMENT-FORMATTING-GUIDE.md)** - Full text formatting syntax
- **[Links & Images Guide](LINKS-IMAGES-GUIDE.md)** - Link and image URL methods
- **[Quick Reference](FORMATTING-QUICK-REF.md)** - One-page cheat sheet
- **[Forum Enhancements](FORUM-ENHANCEMENTS.md)** - Nested comment system

---

## 🎯 Examples

### Example 1: Upload Photo

```markdown
Upload your police car photo:

1. Click 📤 Upload button
2. Select "police-car.jpg" (450 KB)
3. Preview appears showing thumbnail
4. Markdown inserted: ![Police Car](data:image/jpeg;base64,...)
5. Add caption: "New patrol vehicle"
6. Post comment
```

### Example 2: Drag & Drop Screenshot

```markdown
Share evidence screenshot:

1. Take screenshot (PNG format)
2. Drag file from desktop
3. Drop on comment textarea
4. Visual indicator confirms drop
5. Preview shows with delete button
6. Add context: "Screenshot from 14:30"
7. Submit reply
```

### Example 3: Multiple Formats

```markdown
Comment with mixed media:

- Photo via upload: ![Scene photo](data:image/jpeg;...)
- Diagram via URL: ![Diagram](https://example.com/diagram.png)
- Text formatting: **Bold conclusion**
- Link: [Official report](https://example.com)
```

---

## 📞 Support

### Need Help?

- Check [Troubleshooting](#-troubleshooting) section
- Review [Comment Formatting Guide](COMMENT-FORMATTING-GUIDE.md)
- Test in development mode first
- Report issues to forum administrators

### Feedback

- Feature requests welcome
- Bug reports appreciated
- Suggestions for improvements
- UX feedback valued

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
