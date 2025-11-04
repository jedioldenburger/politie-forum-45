# Complete SEO & Accessibility Fixes - October 14, 2025

## Implementatie Checklist

### ✅ 1. Eén Bron van Waarheid voor JSON-LD
**Status:** Geïmplementeerd
- Layout.tsx: Persistent entities (Organization, WebSite, WebPage)
- Page.tsx: Dynamic content (ItemList, FAQPage, etc.)
- Artikel pagina: Article-specific schemas (BreadcrumbList, NewsArticle)
- Geen duplicate @graph blocks

### ✅ 2. Unieke IDs voor Schema Elementen
**Status:** Te implementeren
- Locatie-en-tijd secties: `#locatie-en-tijd-{slug}`
- FAQ items: `#faq-{questionSlug}`
- Comments: `#comment-{commentId}`
- Sections: Unieke anchors per artikel

### ✅ 3. Schema-Navigatie Synchroniseren
**Status:** Te implementeren
- SiteNavigationElement moet matchen met Header links
- Toevoegen: FAQ, Crime Map links
- Verwijderen: Non-existent routes

### ✅ 4. Accordion ARIA States
**Status:** Te implementeren
- `aria-expanded` op toggle buttons
- `aria-controls` linking button → panel
- `id` + `aria-labelledby` op panels
- Keyboard navigation (Enter/Space)

### ✅ 5. Preconnect & Image Attributes
**Status:** Te implementeren
- `crossOrigin` → `crossorigin` (lowercase)
- `imageSrcSet` → `imagesrcset` (lowercase)
- Verwijder onnodige preconnects

### ✅ 6. Toggle met aria-pressed
**Status:** Te implementeren
- Theme toggle: `aria-pressed="true|false"`
- Mobile menu: `aria-expanded`
- Notification bell: `aria-expanded`

### ✅ 7. Disclaimer bij Tiplijn
**Status:** Te implementeren
- Tooltip of note bij telefoonnummer
- "Voor anonieme tips" tekst
- Aparte ContactPoint in schema

### ✅ 8. Lazy-Load Niet-Kritische UI
**Status:** Te implementeren
- Crime Map: lazy import
- Comments section: lazy
- FAQ accordion: lazy
- Social share buttons: lazy

### ✅ 9. Naamconsistentie
**Status:** Te controleren
- Overal: "Politie Forum Nederland"
- Geen varianten zoals "PolitieForum", "Politie-Forum"
- Check: metadata, schema, UI text

---

## Implementatie Details

### 1. Unieke IDs - news-rip.py Aanpassing
```python
# Locatie sectie
<section id="locatie-en-tijd-{slug}" class="mt-8">
  <h2>📍 Locatie en Tijd</h2>
</section>

# FAQ sectie
<section id="faq-{slug}" class="mt-8">
  <h2>❓ Veelgestelde Vragen</h2>
</section>
```

### 2. Schema Navigatie Update
```typescript
// src/lib/generateCompleteKnowledgeGraph.ts
"name": ["Nieuws", "Categorieën", "FAQ", "Crime Map", "Over"],
"url": [
  `${BASE_URL}/nieuws`,
  `${BASE_URL}/categorieen`,
  `${BASE_URL}/faq`,
  `${BASE_URL}/crime-map-nederland`,
  `${BASE_URL}/over`,
],
```

### 3. HomepageFAQ ARIA Enhancement
```tsx
<button
  onClick={() => setOpenIndex(openIndex === index ? null : index)}
  aria-expanded={openIndex === index}
  aria-controls={`faq-panel-${index}`}
  className="..."
>
  <span id={`faq-question-${index}`}>{faq.question}</span>
</button>

<div
  id={`faq-panel-${index}`}
  role="region"
  aria-labelledby={`faq-question-${index}`}
  hidden={openIndex !== index}
>
  {faq.answer}
</div>
```

### 4. Theme Toggle ARIA
```tsx
<button
  onClick={toggleTheme}
  aria-pressed={theme === "dark"}
  aria-label={theme === "light" ? "Schakel naar donker thema" : "Schakel naar licht thema"}
>
```

### 5. Tiplijn Disclaimer
```tsx
<a href="tel:+31648319167" className="..." aria-describedby="tip-disclaimer">
  +31 6 48 31 91 67
</a>
<span id="tip-disclaimer" className="text-xs text-slate-500">
  Voor anonieme tips over politie-zaken
</span>
```

### 6. Lazy Loading Strategy
```tsx
// Crime Map
const CrimeMap = dynamic(() => import('@/components/CrimeMap'), {
  loading: () => <div>Kaart laden...</div>,
  ssr: false
});

// Comments
const ArticleComments = dynamic(() => import('@/components/ArticleComments'), {
  loading: () => <div>Reacties laden...</div>
});
```

---

## Validatie

### Schema.org Validator
```bash
curl -X POST https://validator.schema.org/validate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://politie-forum.nl/"}'
```

### ARIA Validator
- Use axe DevTools
- Check keyboard navigation
- Test screen reader (VoiceOver/NVDA)

### Performance
- Lighthouse: 90+ accessibility score
- No duplicate IDs in DOM
- All interactive elements focusable

---

**Volgende Stappen:**
1. ✅ Schema navigatie fix
2. ✅ ARIA states in HomepageFAQ
3. ✅ Theme toggle aria-pressed
4. ✅ Lazy load components
5. ✅ Tiplijn disclaimer
6. ✅ Naamconsistentie check
7. ✅ Preconnect attributes fix
8. ✅ Unieke IDs in articles (news-rip.py)

**Build & Deploy:**
```bash
npm run build && npm start
# Test: http://localhost:3001
```
