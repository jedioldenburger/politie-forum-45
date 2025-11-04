# News Ripper to Forum - Complete Workflow

**Datum**: 7 oktober 2025
**Status**: ✅ Geïntegreerd met Forum Systeem

---

## 🎯 Overzicht

De **News Ripper** haalt automatisch nieuwsartikelen op van RSS feeds, herschrijft ze met AI, en publiceert ze als forum topics met unieke URL slugs.

---

## 🔄 Complete Workflow

### 1. **Artikel Ophalen** (RSS Feed)
```
NU.nl / Politie.nl RSS → Extract artikel → Check duplicaten
```

**Opties**:
- Menu optie 8: NU.nl artikelen (gefilterd op crime/politie)
- Menu optie 11: Politie.nl artikelen (alle berichten)

**Output**: `articles_raw` (Firestore)

---

### 2. **Artikel Verwerken** (Selenium Scraping)
```
Raw artikel → Selenium ophaal volledige tekst → articles_full
```

**Opties**:
- Menu optie 9: Verwerk NU.nl artikelen
- Menu optie 12: Verwerk Politie.nl artikelen

**Output**: `articles_full` (Firestore) met `processed: false`

---

### 3. **AI Herschrijving + Forum Post** (Groq AI)
```
articles_full → Groq AI rewriter → Forum topic + Static HTML
```

**Menu optie 10**: Advanced AI Rewriter

**Dit doet het systeem**:

#### A. Artikel Herschrijven
- ✅ Titel genereren (max 160 tekens)
- ✅ Volledige tekst herschrijven in gekozen stijl
- ✅ HTML formatting (h3, p tags, spacing)
- ✅ Categorie bepalen (AI classificatie)
- ✅ Tags genereren (3 relevante tags)
- ✅ Samenvatting maken (59 tekens)

#### B. URL Slug Genereren
```python
def create_url_slug(title):
    # Verwijder stopwoorden en cijfers
    # Neem eerste 4 belangrijke woorden
    # Maak URL-veilige slug
    # Output: "aanhouding-geweldsincident-rotterdam"
```

**Voorbeeld transformatie**:
```
Input:  "Twee aanhoudingen na geweldsincident in Rotterdam"
Output: "aanhouding-geweldsincident-rotterdam"
URL:    https://politie-forum.nl/forum/aanhouding-geweldsincident-rotterdam/
```

#### C. Forum Topic Aanmaken (Firebase Realtime DB)
```javascript
{
  title: "Aanhouding na Geweldsincident Rotterdam",
  categoryId: "cat1",  // Algemeen
  authorId: "rss-bot",
  authorName: "Politie Nieuws Bot",
  content: "<h3>Politie Rotterdam...</h3><p>...</p>",
  createdAt: 1696723200000,
  updatedAt: 1696723200000,
  views: 0,
  repliesCount: 0,
  isPinned: false,
  isLocked: false,
  slug: "aanhouding-geweldsincident-rotterdam",
  sourceUrl: "https://nu.nl/...",
  tags: ["Rotterdam", "Geweld", "Arrestatie"],
  category: "Nieuws"
}
```

**Locatie**: `topics/{auto-generated-id}`

#### D. Static HTML Genereren
```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <title>Aanhouding na Geweldsincident Rotterdam - Politie Forum</title>
    <!-- SEO meta tags -->
    <!-- Open Graph -->
    <!-- Twitter Card -->
    <!-- Schema.org NewsArticle -->
</head>
<body>
    <h1>Aanhouding na Geweldsincident Rotterdam</h1>
    <div class="meta">📅 2025-10-07 | 📂 Nieuws</div>
    <article>
        <!-- AI-herschreven content -->
    </article>
    <div class="tags">
        <span class="tag">Rotterdam</span>
        <span class="tag">Geweld</span>
        <span class="tag">Arrestatie</span>
    </div>
</body>
</html>
```

**Locatie**: `/public/forum/{slug}/index.html`

---

## 📂 Database Structuur

### Firestore (Opslag)

```
articles_raw/           # Ruwe RSS artikelen
├── {doc-id}
│   ├── title
│   ├── link
│   ├── timestamp
│   └── body (kort)

articles_full/          # Volledige artikelen
├── {doc-id}
│   ├── title
│   ├── link
│   ├── body (volledig)
│   ├── timestamp
│   ├── source
│   └── processed: false

articles_rewritten/     # Herschreven artikelen
├── {doc-id}
│   ├── title
│   ├── original_title
│   ├── link
│   ├── summary
│   ├── full_text (HTML)
│   ├── slug
│   ├── category
│   ├── tags[]
│   ├── url
│   ├── topicId
│   └── processed: true
```

### Firebase Realtime Database (Forum)

```
topics/                 # Forum topics
├── {topic-id}
│   ├── title
│   ├── categoryId
│   ├── authorId
│   ├── content
│   ├── createdAt
│   ├── slug
│   ├── sourceUrl
│   └── tags[]

categories/
├── cat1/
│   ├── topicsCount (auto update)
│   └── ...
```

---

## 🚀 Gebruik

### Stap 1: RSS Artikelen Ophalen

```bash
python3 news-rip.py
# Menu: 11 (Politie.nl artikelen)
# Voer aantal in: 5
```

**Output**:
```
✅ Processing article: Aanhouding na geweldsincident
✅ Article saved with ID: abc123
📊 Summary: 5 articles saved, 0 duplicates skipped
```

---

### Stap 2: Artikelen Verwerken

```bash
python3 news-rip.py
# Menu: 12 (Verwerk politie.nl artikelen)
```

**Output**:
```
🔍 Checking article: Aanhouding...
📝 Processing Politie.nl article...
✅ Saved full politie.nl article (ID: def456)
📊 Summary: 5 processed, 0 duplicates, 0 errors
```

---

### Stap 3: AI Herschrijving + Forum Post

```bash
python3 news-rip.py
# Menu: 4 (Kies schrijfstijl)
# Keuze: 2 (Normal)

# Menu: 10 (Advanced AI Rewriter)
```

**Output**:
```
🚀 Starting Advanced Rewriting with Groq AI:
   Style: Normal
   Language: Dutch
   AI Model: Groq (mixtral-8x7b-32768)
   Output: Forum Topics + Static HTML

🔄 Processing article 1/3
✨ Applied HTML formatting
✅ Saved to Firestore: Aanhouding na Geweldsincident...
✅ Created forum topic with ID: -NxYz123abc
🌐 Forum URL: https://politie-forum.nl/topic/-NxYz123abc
📄 Static URL: https://politie-forum.nl/forum/aanhouding-geweldsincident-rotterdam/
✅ Generated static HTML: /public/forum/aanhouding-geweldsincident-rotterdam/index.html

📊 Rewriting Summary:
   ✅ Articles rewritten and posted to forum: 3
   ⚠️ Duplicates skipped: 0
   ❌ Errors: 0
```

---

## 🔗 URL Structuur

### Forum Topic (Dynamic)
```
https://politie-forum.nl/topic/{firebase-id}
```
- Dynamische Next.js pagina
- Real-time updates
- User comments mogelijk
- Firebase data

### Static HTML (SEO)
```
https://politie-forum.nl/forum/{slug}/
```
- Statische HTML pagina
- Razendsnel laden
- Perfect voor Google
- Direct indexeerbaar

---

## ⚙️ Configuratie

### AI Schrijfstijlen (Menu 4)

1. **Technical** - Professioneel, formeel, gedetailleerd
2. **Normal** - Standaard nieuwsstijl (★ aanbevolen)
3. **Easy** - Eenvoudig, begrijpelijk, korte zinnen
4. **Populair** - Levendig, aantrekkelijk, emotioneel
5. **News Reader** - Professionele nieuwslezer stijl

### RSS Bronnen

**NU.nl** (Crime/Politie gefilterd):
- Algemeen, Binnenland, Buitenland, Opmerkelijk

**Politie.nl** (Alle berichten):
- Algemeen politienieuws Nederland

### Duplicate Detectie

Controleert op:
- ✅ Identieke URL (meest betrouwbaar)
- ✅ Identieke titel (fallback)

Voorkomt:
- ❌ Dubbele RSS imports
- ❌ Dubbele processing
- ❌ Dubbele forum posts

---

## 🏗️ Technische Details

### Slug Generatie Algoritme

```python
1. Verwijder apostrofes en speciale tekens
2. Split titel in woorden
3. Filter stopwoorden (de, het, een, van, etc.)
4. Filter cijfers
5. Neem eerste 4 belangrijke woorden
6. Join met hyphens
7. Lowercase + cleanup
8. Verwijder dubbele hyphens
```

**Voorbeelden**:
```
"Drie aanhoudingen na inbraak in winkel"
→ ["aanhoudingen", "inbraak", "winkel"]
→ "aanhoudingen-inbraak-winkel"

"Politie zoekt getuigen van ongeval op A12"
→ ["politie", "zoekt", "getuigen", "ongeval"]
→ "politie-zoekt-getuigen-ongeval"
```

### HTML Generatie

**Template features**:
- ✅ Responsive design
- ✅ SEO meta tags (title, description)
- ✅ Open Graph (Facebook)
- ✅ Twitter Card
- ✅ Schema.org NewsArticle
- ✅ Custom styling (politie-forum kleuren)
- ✅ Tag badges
- ✅ Back to forum link

---

## 📊 Performance

### Processing Speed

- **RSS fetch**: ~2-3 sec per artikel (Selenium)
- **AI rewrite**: ~5-8 sec per artikel (Groq)
- **Forum post**: ~1 sec per artikel (Firebase)
- **HTML generate**: <1 sec per artikel

**Totaal**: ~10-15 sec per artikel

### Rate Limiting

- ⏳ 3 sec wachttijd tussen artikelen
- 📦 Max 3 artikelen per batch (aanpasbaar)
- 🔄 Kan meerdere keren draaien

### Duplicate Prevention

- ✅ Check bij RSS import (articles_raw)
- ✅ Check bij processing (articles_full)
- ✅ Check bij rewriting (articles_rewritten)
- ✅ Auto-skip duplicaten op alle niveaus

---

## 🎯 Best Practices

### Workflow Aanbevelingen

1. **Dagelijks Draaien**:
   ```bash
   # Ochtend: Haal nieuwe artikelen op
   python3 news-rip.py → Menu 11 (20 artikelen)

   # Middag: Verwerk + Publiceer
   python3 news-rip.py → Menu 12
   python3 news-rip.py → Menu 10
   ```

2. **Schrijfstijl Kiezen**:
   - **Politie.nl**: Normal of News Reader (officieel)
   - **NU.nl**: Normal of Populair (toegankelijk)

3. **Aantal Artikelen**:
   - Start: 5-10 artikelen (test)
   - Dagelijks: 20-30 artikelen
   - Bulk: 50+ (met pauzes)

### Troubleshooting

**Probleem**: "No AI client available"
```bash
# Check Groq API key in news-rip.py
groq_api_key = "gsk_..."  # Regel 336
```

**Probleem**: "Firebase error"
```bash
# Check service account key
ls -la news_ripper_key.json
# Of: ./news_ripper_key.json
```

**Probleem**: "Selenium error"
```bash
# Check ChromeDriver
chromedriver --version
# Installeer: brew install chromedriver
```

---

## 📈 Resultaten

### Output Per Artikel

✅ **Firestore**:
- `articles_raw` - Ruwe RSS data
- `articles_full` - Volledige tekst
- `articles_rewritten` - AI versie

✅ **Firebase Realtime DB**:
- `topics/{id}` - Forum topic
- `categories/cat1` - Updated count

✅ **Static Files**:
- `/public/forum/{slug}/index.html`

✅ **URLs**:
- Forum: `/topic/{firebase-id}` (dynamic)
- Static: `/forum/{slug}/` (SEO)

---

## 🔮 Toekomstige Uitbreidingen

### Geplande Features

- [ ] **Automatische Categorisatie**: AI kiest juiste forum categorie
- [ ] **Image Extractie**: Download + resize artikel afbeeldingen
- [ ] **Auto-tagging**: Meer geavanceerde tag generatie
- [ ] **Sentiment Analyse**: Mark urgent/belangrijke nieuws
- [ ] **Duplicate Content Check**: AI-based similarity detection
- [ ] **Multi-language**: Engels/Duits ondersteuning
- [ ] **Cron Automation**: Dagelijks om 12:00 automatisch draaien

### API Integration

Mogelijk maken via API endpoint:
```typescript
// POST /api/news-to-forum
{
  "source": "politie.nl",
  "count": 5,
  "style": "Normal"
}
```

---

## ✅ Checklist Nieuwe Artikel

- [ ] RSS feed ophalen (Menu 11)
- [ ] Artikelen verwerken (Menu 12)
- [ ] Schrijfstijl kiezen (Menu 4)
- [ ] AI rewriter draaien (Menu 10)
- [ ] Check forum topic aangemaakt
- [ ] Check static HTML gegenereerd
- [ ] Verify URLs werkend
- [ ] Test op duplicate prevention

---

**Conclusie**: Volledig geautomatiseerde pipeline van RSS → AI Rewrite → Forum Topic + Static HTML! 🎉
