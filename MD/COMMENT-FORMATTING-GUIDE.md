# 📝 Comment Formatting Guide

## Overview

The comment section now supports **rich text formatting** with markdown-like syntax, allowing users to create beautiful, expressive comments with formatting, links, quotes, and more!

---

## 🎨 **Formatting Toolbar**

At the top of the comment box, you'll find a toolbar with formatting buttons:

| Button         | Function          | Shortcut     | Output           |
| -------------- | ----------------- | ------------ | ---------------- |
| **B** (Bold)   | Make text bold    | `**text**`   | **text**         |
| _I_ (Italic)   | Make text italic  | `*text*`     | _text_           |
| `<>` (Code)    | Inline code       | `` `code` `` | `code`           |
| **"** (Quote)  | Create blockquote | `> quote`    | > quote          |
| **•** (List)   | Create list item  | `- item`     | • item           |
| **🔗** (Link)  | Insert link       | Paste URL    | [clickable link] |
| **😊** (Emoji) | Insert emoji      | Click picker | 😊               |

---

## ✍️ **Formatting Syntax**

### 1. **Bold Text**

Make text stand out with bold formatting.

**Syntax:**

```
**This text is bold**
```

**Result:**
**This text is bold**

---

### 2. **Italic Text**

Emphasize text with italics.

**Syntax:**

```
*This text is italic*
```

**Result:**
_This text is italic_

---

### 3. **Inline Code**

Highlight code snippets or technical terms.

**Syntax:**

```
Use `const` instead of `var`
```

**Result:**
Use `const` instead of `var`

**Styling:**

- Light gray background
- Monospace font
- Primary color text
- Rounded corners

---

### 4. **Code Blocks**

Display multi-line code with syntax preservation.

**Syntax:**

````
```
function greet() {
  console.log("Hello!");
}
```
````

**Result:**

```
function greet() {
  console.log("Hello!");
}
```

**Styling:**

- Dark background (slate-900)
- Green code text
- Monospace font
- Horizontal scroll for long lines
- Border and padding

---

### 5. **Blockquotes**

Quote text from articles or other comments.

**Syntax:**

```
> This is a quoted text
> It can span multiple lines
```

**Result:**

> This is a quoted text
> It can span multiple lines

**Styling:**

- Left border (4px primary color)
- Italic text
- Indented with padding
- Muted text color

---

### 6. **Lists**

Create bullet-point lists.

**Syntax:**

```
- First item
- Second item
- Third item
```

**Result:**

- First item
- Second item
- Third item

**Alternative:** Use `*` instead of `-`

```
* Item one
* Item two
```

**Styling:**

- Bullet points
- Indented
- Proper spacing

---

### 7. **Links**

Automatically convert URLs to clickable links.

**Automatic Link Detection:**

```
Check out https://example.com for more info
```

**Result:**
Check out [https://example.com](https://example.com) for more info

**Link Button Method:**

1. Click the 🔗 Link button
2. Enter URL (e.g., `https://google.com`)
3. Enter link text (optional)
4. Link is inserted

**Styling:**

- Primary blue color
- Underline
- Hover effect (accent color)
- Opens in new tab
- Secure (`rel="noopener noreferrer"`)

---

## 🎯 **Combining Formatting**

You can combine multiple formatting styles!

**Example:**

```
**Important:** Check out the `code` at https://github.com

> **Note:** This is a *quoted* text with `inline code`

- **Bold item**
- *Italic item*
- `Code item`
```

**Result:**
**Important:** Check out the `code` at https://github.com

> **Note:** This is a _quoted_ text with `inline code`

- **Bold item**
- _Italic item_
- `Code item`

---

## 🌟 **Examples**

### Example 1: Technical Discussion

```
I found a bug in the code:

```

function broken() {
return undefined;
}

```

**Solution:** Use `null` instead of `undefined`

> According to MDN: "undefined means a variable has been declared but not assigned"

Check https://developer.mozilla.org for more details
```

---

### Example 2: Structured Comment

```
**My Thoughts on the Article:**

- **Pro:** Great analysis
- **Con:** Missing sources
- *Overall:* Well written

> "The key point is accountability"

Read more at https://example.com/article
```

---

### Example 3: Quote & Reply

```
> User123 said: We should increase funding

**I disagree** for these reasons:

- Budget constraints
- Alternative solutions available
- Need more *research* first

See study: https://research.org/study
```

---

## 🎨 **Visual Styling**

### Parent Comments

- **Gradient background**: White to slate-50
- **Large avatars**: 56px (h-14)
- **Bold author names**
- **Formatted content** with all rich text features
- **Action buttons**: Like, Reply (with count), Heart

### Nested Replies

- **Subtle background**: Slate-50
- **Smaller avatars**: 40px (h-10)
- **Indented**: Left margin + border
- **Formatted content** with all rich text features
- **Like button** only

---

## 📱 **Mobile Optimization**

All formatting works perfectly on mobile devices:

- ✅ Touch-friendly toolbar buttons
- ✅ Responsive code blocks (horizontal scroll)
- ✅ Proper line breaks
- ✅ Readable font sizes
- ✅ Accessible color contrast

---

## 🔧 **Technical Details**

### Processing Order

1. **Block-level**: Code blocks (```) → Blockquotes (>) → Lists (-)
2. **Inline-level**: URLs → Inline code (`) → Bold (\*_) → Italic (_)

### Security Features

- ✅ URLs open in new tab with `target="_blank"`
- ✅ Security attributes: `rel="noopener noreferrer"`
- ✅ XSS protection (React escaping)
- ✅ No dangerous HTML allowed

### Performance

- **Fast rendering**: Optimized regex patterns
- **Efficient parsing**: Single-pass processing
- **Cached elements**: React key optimization
- **No external libraries**: Pure JavaScript implementation

---

## 🚀 **Quick Reference Card**

````
BOLD:       **text**
ITALIC:     *text*
CODE:       `code`
CODE BLOCK: ```code```
QUOTE:      > quote
LIST:       - item
LINK:       https://url.com
EMOJI:      Click 😊 button
````

---

## 💡 **Tips & Tricks**

### 1. **Selection Formatting**

Select text in the textarea, then click **Bold** or **Italic** button to wrap it automatically!

### 2. **Quick Quotes**

Click the Quote button to instantly add `> ` to start a quote.

### 3. **List Building**

Click List button, then keep typing with `- ` at the start of each line.

### 4. **Code Sharing**

For single-line code: use backticks
For multi-line code: use triple backticks

### 5. **Link with Text**

Use the Link button → Enter URL → Enter custom text → Get formatted link

---

## 🎯 **Best Practices**

### ✅ **Do This**

- Use **bold** for important points
- Use _italic_ for emphasis
- Use `code` for technical terms
- Use > quotes for citations
- Use - lists for organization
- Paste URLs directly (auto-detected)

### ❌ **Avoid This**

- Don't over-format (too much bold/italic)
- Don't use code blocks for regular text
- Don't nest formatting excessively
- Don't create very long lists (break them up)

---

## 🔮 **Future Enhancements**

Planned features:

- [ ] Markdown preview pane
- [ ] @ mentions with autocomplete
- [ ] Hashtag support
- [ ] Image embedding
- [ ] Tables
- [ ] Strikethrough (~~text~~)
- [ ] Spoiler tags
- [ ] Custom emoji reactions
- [ ] Comment drafts (auto-save)
- [ ] Copy formatted text

---

## 📊 **Comparison with Other Platforms**

| Feature        | Our Forum  | Reddit     | Twitter | Discord    |
| -------------- | ---------- | ---------- | ------- | ---------- |
| Bold           | ✅ `**`    | ✅ `**`    | ❌      | ✅ `**`    |
| Italic         | ✅ `*`     | ✅ `*`     | ❌      | ✅ `*`     |
| Code           | ✅ `` ` `` | ✅ `` ` `` | ❌      | ✅ `` ` `` |
| Quotes         | ✅ `>`     | ✅ `>`     | ❌      | ✅ `>`     |
| Lists          | ✅ `-`     | ✅ `-`     | ❌      | ❌         |
| Auto-links     | ✅         | ✅         | ✅      | ✅         |
| Nested replies | ✅         | ✅         | ✅      | ✅         |
| Emoji picker   | ✅         | ✅         | ✅      | ✅         |

**We match or exceed the formatting capabilities of major platforms!** 🎉

---

## 🐛 **Troubleshooting**

### Formatting not working?

- Make sure syntax is exact (`**text**`, not `** text **`)
- Check for proper opening/closing markers
- Verify no extra spaces in markers

### Link not clickable?

- Must start with `http://` or `https://`
- Check for typos in URL
- Ensure URL has no spaces

### Code block not showing?

- Must have ``` on separate lines
- Check for proper closing ```
- Ensure proper line breaks

---

## 📚 **Examples Library**

### Professional Comment

````
**Executive Summary**

After reviewing the policy changes, I have *three main concerns*:

- Budget allocation
- Timeline feasibility
- Stakeholder engagement

> "We must prioritize transparency" - Chief Commissioner

Reference: https://policy-docs.gov/2025/report

```javascript
const validate = (policy) => {
  return policy.isValid();
};
````

**Recommendation:** Delay implementation by 30 days

```

### Casual Discussion
```

**Great article!** 🎉

Some thoughts:

> The statistics are impressive

_However_, I wonder about:

- Long-term sustainability
- Regional variations
- Implementation costs

Check this study: https://example.com/study

Anyone else have `data` on this?

```

### Technical Support
```

**Issue:** Login not working

**Steps to reproduce:**

1. Navigate to login page
2. Enter credentials
3. Click submit

**Error message:**

```
Error 500: Internal Server Error
```

**Browser:** Chrome `v120.0.6099.129`
**OS:** macOS Sonoma

See screenshot: https://imgur.com/example

```

---

## 🎓 **Learning Path**

### Beginner (Week 1)
- ✅ Use bold for emphasis
- ✅ Paste links directly
- ✅ Add emojis

### Intermediate (Week 2)
- ✅ Use italic for style
- ✅ Create blockquotes
- ✅ Make simple lists

### Advanced (Week 3+)
- ✅ Inline code for terms
- ✅ Code blocks for snippets
- ✅ Combine multiple formats

---

## 📞 **Support**

Have questions about formatting? Check:
1. This guide (bookmark it!)
2. Toolbar tooltips (hover over buttons)
3. Placeholder text (shows examples)
4. Preview your comment before posting

**Happy commenting!** ✨
```
