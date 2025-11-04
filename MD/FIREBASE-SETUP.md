# Politie Forum - Firebase Setup Gids

## 🎉 Welkom!

Je forum is nu volledig geïntegreerd met Firebase! Hier is een korte handleiding om te beginnen.

## 🚀 Eerste Stappen

### 1. Start het Forum

Het forum draait nu op: **http://localhost:3001**

### 2. Initialiseer de Database

1. Ga naar: **http://localhost:3001/admin**
2. Klik op "Database Initialiseren"
3. Dit maakt de 4 standaard categorieën aan:
   - Algemeen
   - Sollicitatie & Selectie
   - Politieacademie
   - Werkenbijdepolitie

### 3. Maak een Account

1. Klik op "Inloggen" in de navigatiebalk
2. Ga naar het "Registreren" tabblad
3. Vul je gegevens in:
   - Gebruikersnaam
   - Email
   - Wachtwoord (minimaal 6 tekens)
4. Of gebruik "Inloggen met Google"

## 📊 Firebase Database Structuur

```
firebase-database/
├── categories/
│   ├── cat1/
│   │   ├── name: "Algemeen"
│   │   ├── description: "..."
│   │   ├── topicsCount: 0
│   │   └── postsCount: 0
│   └── ...
├── topics/
│   └── {topicId}/
│       ├── title: "Topic titel"
│       ├── categoryId: "cat1"
│       ├── authorId: "user123"
│       ├── content: "..."
│       ├── views: 0
│       └── repliesCount: 0
├── posts/
│   └── {postId}/
│       ├── topicId: "topic123"
│       ├── authorId: "user123"
│       ├── content: "..."
│       └── likes: 0
└── users/
    └── {userId}/
        ├── displayName: "Gebruiker"
        ├── email: "user@example.com"
        ├── role: "user"
        ├── posts: 0
        └── reputation: 0
```

## 🔧 Firebase Configuratie

De Firebase configuratie staat in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
# etc.
```

## 🎨 Beschikbare Functies

### Authenticatie

- ✅ Email/Password registratie
- ✅ Email/Password inloggen
- ✅ Google Sign-In
- ✅ Uitloggen
- ✅ Gebruikersprofiel

### Database

- ✅ Real-time categorieën
- ✅ Real-time topics
- ✅ Statistieken tracking
- ✅ Gebruikers management

### API Functies (src/lib/database.ts)

```typescript
// Categorieën
getCategories();
createCategory(category);

// Topics
getTopicsByCategory(categoryId);
getRecentTopics(limit);
getTopic(topicId);
createTopic(topic);
updateTopicViews(topicId);

// Posts
getPostsByTopic(topicId);
createPost(post);
likePost(postId, userId);

// Users
getUser(userId);
createUser(userId, userData);
updateUser(userId, updates);

// Real-time listeners
subscribeToTopics(categoryId, callback);
subscribeToTopic(topicId, callback);
subscribeToPosts(topicId, callback);
```

## 🔐 Firebase Security Rules (Belangrijk!)

Voor productie moet je Firebase Security Rules instellen in de Firebase Console:

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
        ".write": "auth != null"
      }
    },
    "posts": {
      ".read": true,
      "$postId": {
        ".write": "auth != null"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $userId"
      }
    }
  }
}
```

## 📝 Volgende Stappen

1. **Test de authenticatie**

   - Maak een test account
   - Log in met Google
   - Bekijk je profiel

2. **Voeg test data toe**

   - De database is nu geïnitialiseerd met categorieën
   - Topics en posts moeten handmatig worden toegevoegd
   - Implementeer de "Nieuw Topic" functionaliteit

3. **Bekijk Firebase Console**
   - Ga naar: https://console.firebase.google.com
   - Selecteer project: "blockchainkix-com-fy"
   - Bekijk Realtime Database data
   - Controleer Authentication gebruikers

## 🐛 Troubleshooting

**Server start niet?**

```bash
npm run dev
```

**Firebase errors?**

- Controleer `.env.local` bestaat
- Controleer Firebase configuratie in console
- Zorg dat Realtime Database is enabled in Firebase

**Authenticatie werkt niet?**

- Controleer of Email/Password auth is enabled in Firebase
- Controleer of Google Sign-In is geconfigureerd
- Voeg authorized domains toe in Firebase Console

## 🎯 Next Features to Build

1. Topic aanmaken pagina (`/topic/nieuw`)
2. Topic detail pagina (`/topic/[id]`)
3. Post reply functionaliteit
4. Gebruikersprofiel pagina
5. Zoekfunctionaliteit
6. Moderatie tools
7. Private berichten

## 📞 Support

Voor vragen over het forum of Firebase integratie:

- Email: info@politie-forum.nl
- Check README.md voor meer details

---

**Happy coding! 🚀**
