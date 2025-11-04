# Politie Forum Nederland 🚔

Een modern, gebruiksvriendelijk forum platform voor discussies over de Nederlandse politie, sollicitaties, opleidingen en ervaringen.

## 🎨 Design

- **Kleuren**: Donkerblauw (primary) en Rood (accent)
- **Taal**: Nederlands
- **Responsive**: Volledig responsive design voor mobiel, tablet en desktop
- **Toegankelijk**: WCAG 2.1 compliant

## ✨ Features

### Huidige Features

- ✅ Modern, clean design met dark mode support
- ✅ **Firebase integratie**
  - ✅ Firebase Realtime Database
  - ✅ Firebase Authentication (Email/Password + Google)
  - ✅ Firebase Storage ready
- ✅ **Gebruikersauthenticatie**
  - ✅ Inloggen met email/password
  - ✅ Registreren met email
  - ✅ Google Sign-In
  - ✅ Gebruikersprofiel beheer
- ✅ Categorieën overzicht met real-time data
- ✅ Topics lijst met real-time updates
- ✅ Zoekfunctionaliteit UI
- ✅ Responsive navigatie
- ✅ Forum statistieken dashboard

### SEO Optimalisatie

### Toekomstige Features (Roadmap)

- 🔲 Topic aanmaken functionaliteit
- 🔲 Reageren op topics
- 🔲 Private berichten
- 🔲 Notificaties systeem
- 🔲 Moderatie tools
- 🔲 Likes/upvotes systeem
- 🔲 Real-time chat
- 🔲 Volledige zoekfunctionaliteit
- 🔲 Tags en filtering
- 🔲 Avatar uploads
- 🔲 Email notificaties
- 🔲 Notificaties
- 🔲 Moderatie tools
- 🔲 Likes/upvotes systeem
- 🔲 Database integratie (PostgreSQL/MongoDB)
- 🔲 Real-time updates met WebSockets
- 🔲 Volledige zoekfunctionaliteit
- 🔲 Tags en filtering
- 🔲 Avatar uploads
- 🔲 Email notificaties

## 🚀 Aan de slag

### Vereisten

- Node.js 18.x of hoger
- npm, yarn, pnpm of bun

### Installatie

### Installatie

1. **Installeer dependencies:**

   ```bash
   npm install
   ```

2. **Configureer Firebase:**

   - De Firebase configuratie staat al in `.env.local`
   - Voor productie: vervang met je eigen Firebase credentials

3. **Initialiseer de database:**

   - Start de dev server (stap 4)
   - Navigeer naar [http://localhost:3001/admin](http://localhost:3001/admin)
   - Klik op "Database Initialiseren" om categorieën aan te maken

4. **Start de development server:**

   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigeer naar [http://localhost:3001](http://localhost:3001)

```bash
# Build
npm run build
```

politie-forum-45/
├── src/
│ ├── app/
│ │ ├── admin/
│ │ │ └── page.tsx # Database initialisatie pagina
│ │ ├── layout.tsx # Root layout met AuthProvider
│ │ ├── page.tsx # Homepage met forum overzicht
│ │ ├── globals.css # Globale styles
│ │ ├── robots.ts # SEO robots.txt
│ │ ├── sitemap.ts # Dynamische sitemap
│ │ └── opengraph-image.tsx # OG image generator
│ ├── components/
│ │ └── AuthModal.tsx # Inlog/registratie modal
│ ├── contexts/
│ │ └── AuthContext.tsx # Firebase authenticatie context
│ ├── lib/
│ │ ├── firebase.ts # Firebase configuratie
│ │ ├── database.ts # Database functies
│ │ ├── types.ts # TypeScript types
│ │ └── initDatabase.ts # Database seed script
├── public/ # Statische bestanden
├── .env.local # Firebase configuratie (environment variables)
├── .github/
│ └── copilot-instructions.md # Project documentatie
├── tailwind.config.ts # Tailwind configuratie met custom kleuren
├── next.config.js # Next.js configuratie
├── tsconfig.json # TypeScript configuratie
└── package.json # Dependencies en scripts

```public/ # Statische bestanden
├── .github/
│   └── copilot-instructions.md # Project documentatie
├── tailwind.config.ts          # Tailwind configuratie met custom kleuren
├── next.config.js              # Next.js configuratie
├── tsconfig.json               # TypeScript configuratie
└── package.json                # Dependencies en scripts
## 🛠️ Technologieën

- **Framework**: Next.js 15.5 (App Router)
- **Taal**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth (Email/Password + Google)
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Datum formatting**: date-fns
- **Font**: Inter (Google Fonts)
- **Build Tool**: Turbopack
- `primary-600`: #004bbf
- `primary-500`: #0056e0 (Basis)

### Accent (Rood)
- `accent-900`: #800000 (Donkerste)
- `accent-700`: #b30000
- `accent-600`: #cc0000
- `accent-500`: #e60000 (Basis)
- `accent-400`: #ff1a1a

## 🛠️ Technologieën

- **Framework**: Next.js 15.5 (App Router)
- **Taal**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Build Tool**: Turbopack

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔍 SEO Checklist

- [x] Meta titles en descriptions
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Structured data ready
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Semantic HTML
- [x] Alt texts voor afbeeldingen
- [x] Canonical URLs ready
- [ ] Schema.org markup (implementeren bij database integratie)
- [ ] Google Analytics integratie
- [ ] Google Search Console setup

## 📝 Licentie

Copyright © 2025 Politie Forum Nederland

## 🤝 Bijdragen

Dit is een privé project. Voor vragen of suggesties, neem contact op via info@politie-forum.nl

## 📞 Contact

- **Website**: politie-forum.nl
- **Email**: info@politie-forum.nl

---

**Let op**: Dit is een forum platform in ontwikkeling. Sommige features zijn nog niet geïmplementeerd. Zie de roadmap voor geplande functionaliteiten.
```
