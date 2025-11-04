# 🔗 Links & Images Guide - Comment Formatting

## ✨ New Features Added

### 1. **Smart Link Button** 🔗

The link button now works with selected text!

#### **Method 1: Link Selected Text** (Recommended)

1. **Type or paste** text in comment box
2. **Select** the text you want to turn into a link
3. **Click** the 🔗 Link button
4. **Enter** the URL when prompted
5. ✅ Text becomes a clickable link!

**Example:**

```
1. Type: Check out Google
2. Select: "Google"
3. Click 🔗 button
4. Enter: https://google.com
5. Result: Check out [Google](https://google.com)
```

**Displays as:** Check out [Google](https://google.com) ← clickable!

---

#### **Method 2: Create New Link**

1. **Click** the 🔗 Link button
2. **Enter** link text (what users will see)
3. **Enter** the URL
4. ✅ Link is inserted!

**Example:**

```
1. Click 🔗 button
2. Enter text: "Official Website"
3. Enter URL: https://example.com
4. Result: [Official Website](https://example.com)
```

---

#### **Method 3: Manual Syntax**

You can also type the markdown syntax directly:

```
[text to display](https://url.com)
```

**Example:**

```
Visit [our forum](https://politie-forum.nl) for updates
```

**Displays as:** Visit [our forum](https://politie-forum.nl) for updates

---

### 2. **Image Embedding** 🖼️

Add images to your comments using **three methods**!

#### **Method 1: Upload Image** 📤 (New!)

Upload images directly from your device with validation and preview!

1. **Click** the 📤 Upload button in toolbar
2. **Select** image file (or drag & drop on textarea)
3. **Preview** appears with file size
4. ✅ Image markdown auto-inserted!

**Features:**

- ✅ **Drag & Drop** - Drag files onto comment box
- ✅ **File validation** - Max 1MB, images only
- ✅ **Preview thumbnails** - See before posting
- ✅ **Delete button** - Remove unwanted uploads
- ✅ **Error messages** - Clear feedback for issues

**Supported formats:**

- JPG/JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)

**File limits:**

- Maximum size: **1 MB** (1,024 KB)
- Optimal size: 200-500 KB for fast loading
- Over 1MB? Compress first or use URL method

**How to use:**

```
1. Click 📤 Upload button
2. Choose "photo.jpg" (450 KB)
3. Preview shows thumbnail
4. Markdown inserted: ![Image](data:image/jpeg;base64,...)
5. Post comment!
```

**Drag & Drop:**

```
1. Drag image file from desktop
2. Drop on comment textarea
3. Visual indicator appears
4. Preview loads automatically
5. Ready to post!
```

---

#### **Method 2: Image URL** 🖼️ (Classic)

Use external image URLs (no file upload needed).

1. **Click** the 🖼️ Image button
2. **Enter** image URL (must be a direct link to image)
3. **Enter** description (optional, for accessibility)
4. ✅ Image is embedded!

**Syntax:**

```
![Image description](https://example.com/image.jpg)
```

**Example:**

```
Look at this evidence:
![Crime scene photo](https://example.com/photo.jpg)
```

**Supported formats:**

- JPG/JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)
- SVG (`.svg`)

---

#### **Method 3: Manual Markdown**

Type the markdown syntax directly:

```
![alt text](image-url-here)
```

**Example:**

```
![Police car](https://photos.com/car.jpg)
```

---

**Image styling (all methods):**

- ✅ Auto-resizes to fit comment width
- ✅ Maintains aspect ratio
- ✅ Rounded corners
- ✅ Border and shadow
- ✅ Lazy loading (performance)
- ✅ Dark mode compatible

---

## 🎯 **Complete Syntax Reference**

| Feature    | Syntax        | Example                        |
| ---------- | ------------- | ------------------------------ |
| **Bold**   | `**text**`    | `**Important**`                |
| **Italic** | `*text*`      | `*emphasis*`                   |
| **Code**   | `` `code` ``  | `` `const x = 1` ``            |
| **Quote**  | `> text`      | `> Citation here`              |
| **List**   | `- item`      | `- First point`                |
| **Link**   | `[text](url)` | `[Google](https://google.com)` |
| **Image**  | `![alt](url)` | `![Photo](https://pic.jpg)`    |

---

## 📝 **Real-World Examples**

### Example 1: News Comment with Link

```
**Breaking:** New policy announced!

Read the full article: [Official Statement](https://gov.nl/statement)

Key points:
- Budget increase
- Timeline changes
- New regulations
```

---

### Example 2: Technical Discussion with Image

```
I found the issue in the code:

![Screenshot of error](https://i.imgur.com/example.png)

The problem is in `config.js` line 42.

**Solution:** Use [this patch](https://github.com/fix)
```

---

### Example 3: Evidence Sharing

```
> Officer reported: "Suspect fled scene"

**Visual evidence:**
![Security camera footage](https://evidence.com/cam1.jpg)

**Timeline:**
- 14:30 - Initial report
- 14:35 - Camera footage captured
- 14:40 - Suspect identified

More info: [Case File #12345](https://cases.nl/12345)
```

---

### Example 4: Multi-Media Comment

```
**Case Update** 🚔

**Photos from scene:**
![Photo 1](https://example.com/img1.jpg)
![Photo 2](https://example.com/img2.jpg)

**Related articles:**
- [News Report](https://news.nl/article)
- [Official Statement](https://police.nl/statement)

> "We are investigating all leads" - Chief Inspector

**Evidence summary:**
```

items_found = 3
suspects = 2

```

Contact: [Tips Hotline](tel:+31-800-8000)
```

---

## 🎨 **Toolbar Overview**

```
┌────────────────────────────────────────────────┐
│  B  I  <>  "  •  🔗  �  �🖼️  😊                │
│  ↓  ↓  ↓   ↓  ↓  ↓   ↓   ↓   ↓                 │
│  Bold                                           │
│     Italic                                      │
│        Code                                     │
│           Quote                                 │
│              List                               │
│                 Link (smart selection!)         │
│                    Upload (file picker!)        │
│                       Image (URL method)        │
│                          Emoji                  │
└────────────────────────────────────────────────┘
```

---

## 💡 **Pro Tips**

### **For Links:**

1. ✅ **Select first, link second** - Fastest method!
2. ✅ Copy URL before clicking link button
3. ✅ Use descriptive link text (not "click here")
4. ✅ Links open in new tab automatically
5. ✅ URLs auto-detected even without formatting

### **For Images (Upload):**

1. ✅ **Compress before upload** - Use TinyPNG, ImageOptim
2. ✅ **Resize large photos** - 1920x1080 is usually enough
3. ✅ **Check file size** - Preview shows KB size
4. ✅ **Delete mistakes** - Use ❌ button on preview
5. ✅ **Drag & drop** - Faster than clicking Upload
6. ✅ **Use WebP format** - Best compression (smallest files)

### **For Images (URL):**

1. ✅ Use **direct image URLs** (ending in .jpg, .png, etc.)
2. ✅ Upload to [Imgur](https://imgur.com) for easy hosting
3. ✅ Add descriptions for accessibility
4. ✅ Images auto-resize to fit
5. ✅ Multiple images? Put each on new line

### **Getting Image URLs:**

- **Upload sites:** Imgur, Imgbb, Postimages
- **Right-click** image → "Copy Image Address"
- Make sure URL ends with image extension (.jpg, .png)

---

## 🚫 **Common Issues & Fixes**

### **Issue: Link not working**

❌ `[text] (url)` - Extra space
✅ `[text](url)` - No spaces!

❌ `[text](url missing https)` - No protocol
✅ `[text](https://url.com)` - Include https://

### **Issue: Image not showing**

❌ `![alt] (url)` - Extra space
✅ `![alt](url)` - No spaces!

❌ `![alt](https://page.com)` - Not direct link
✅ `![alt](https://site.com/image.jpg)` - Direct image

❌ `![alt](file:///local.jpg)` - Local file
✅ `![alt](https://imgur.com/abc.jpg)` - Online URL

### **Issue: Upload "File too large"**

❌ File is 1.5 MB - Over limit
✅ Compress to <1MB using TinyPNG
✅ Reduce dimensions (e.g., 1920→1280)
✅ Convert to WebP format
✅ Use Image URL method instead

### **Issue: Upload not working**

Check:

1. ✅ File is image type (JPG/PNG/GIF/WebP)
2. ✅ File size under 1MB (check preview)
3. ✅ Browser supports FileReader API
4. ✅ Try drag & drop instead

### **Issue: Preview not appearing**

Solutions:

1. ✅ Wait 1-2 seconds for large files
2. ✅ Refresh page and try again
3. ✅ Check file isn't corrupted
4. ✅ Try smaller file first

### **Issue: Selected text not linking**

Make sure you:

1. ✅ Actually **selected** the text (highlight it)
2. ✅ Clicked link button **while text is selected**
3. ✅ Entered valid URL with https://

---

## 🎓 **Quick Start Guide**

### **Beginner - Just Links**

```
Check this out: https://example.com
```

→ Auto-converts to clickable link!

### **Intermediate - Named Links**

```
1. Type: Visit the website
2. Select: "website"
3. Click 🔗
4. Enter: https://site.com
```

→ Visit the [website](https://site.com)

### **Advanced - Links + Images**

```
**Evidence Report**

![Photo](https://evidence.jpg)

Full report: [Download PDF](https://docs.com/report.pdf)
```

---

## 📱 **Mobile Usage**

### **On Mobile:**

1. **Long-press** to select text
2. Tap **🔗** button
3. Enter URL in popup
4. ✅ Done!

**For images:**

1. Tap **🖼️** button
2. Paste image URL
3. Add description
4. ✅ Image embedded!

---

## 🔒 **Security & Privacy**

### **Safe Link Practices:**

- ✅ All links open in **new tab**
- ✅ Security attributes added automatically
- ✅ No tracking or redirects
- ⚠️ Be cautious of suspicious URLs
- ⚠️ Verify sources before clicking

### **Image Privacy:**

- ℹ️ Images load from external servers
- ℹ️ Your IP may be logged by image host
- ℹ️ Use trusted image hosts (Imgur, etc.)
- ⚠️ Don't embed sensitive/private images

---

## 🎉 **What's New Summary**

### **Link Button Upgrade:**

- ✅ **Smart selection** - Select text → Click button → Enter URL
- ✅ **Dual mode** - Works with or without selection
- ✅ **Better UX** - Clearer prompts and workflow

### **Image Upload Feature:** 📤 (NEW!)

- ✅ **File picker** - Upload images from device
- ✅ **Drag & drop** - Drop files on comment box
- ✅ **File validation** - 1MB max, images only
- ✅ **Preview thumbnails** - See before posting
- ✅ **Delete button** - Remove unwanted images
- ✅ **Error handling** - Clear feedback messages
- ✅ **Auto-insert** - Markdown added automatically

### **Image URL Support:**

- ✅ **New button** - 🖼️ Image button added to toolbar
- ✅ **Full embedding** - Images display inline
- ✅ **Auto-styling** - Responsive, bordered, shadowed
- ✅ **Accessibility** - Alt text support
- ✅ **Performance** - Lazy loading enabled

### **Enhanced Formatting:**

- ✅ Markdown-style links: `[text](url)`
- ✅ Markdown-style images: `![alt](url)`
- ✅ Backward compatible with plain URLs
- ✅ Works with all other formatting (bold, italic, etc.)

---

## 🚀 **Try It Now!**

### **Test Link:**

1. Type: "Visit Google"
2. Select: "Google"
3. Click 🔗
4. Enter: https://google.com

### **Test Image Upload:**

1. Click � Upload
2. Select image file (<1MB)
3. See preview with file size
4. Delete with ❌ if needed
5. Post comment!

### **Test Drag & Drop:**

1. Drag image from desktop
2. Drop on comment box
3. See upload indicator
4. Preview loads
5. Ready to post!

---

## 📊 **Before & After**

### **Before:**

❌ Only plain URL links
❌ No image support
❌ Manual markdown typing only

### **After:**

✅ Smart link button with selection
✅ **Advanced file upload with validation**
✅ **Drag & drop support**
✅ **Image previews with thumbnails**
✅ Full image embedding (URL method)
✅ Toolbar buttons for easy formatting
✅ Markdown syntax support
✅ Auto-detection of URLs
✅ Beautiful image styling

---

**Your comments are now more powerful than ever!** 🎨🔗📤🖼️

For detailed upload instructions, see **[Upload Guide](UPLOAD-GUIDE.md)**
