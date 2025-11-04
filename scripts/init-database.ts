/**
 * Initialize Firebase Realtime Database with sample forum data
 *
 * Run: npm run init-db
 */

import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check configuration
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  console.error("❌ Firebase configuration is missing!");
  console.error("Make sure .env.local exists with all Firebase variables.");
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample data
const categories = {
  cat1: {
    name: "Algemeen",
    description:
      "Algemene discussies over de politie en veiligheid in Nederland",
    icon: "MessageSquare",
    topicsCount: 12,
    postsCount: 48,
    order: 1,
    createdAt: Date.now(),
  },
  cat2: {
    name: "Sollicitatie & Selectie",
    description:
      "Tips en ervaringen over solliciteren, assessments en de selectieprocedure",
    icon: "Users",
    topicsCount: 23,
    postsCount: 156,
    order: 2,
    createdAt: Date.now(),
  },
  cat3: {
    name: "Politieacademie",
    description: "Alles over de opleiding, modules en de tijd op de academie",
    icon: "TrendingUp",
    topicsCount: 18,
    postsCount: 92,
    order: 3,
    createdAt: Date.now(),
  },
  cat4: {
    name: "Werken bij de Politie",
    description:
      "Ervaringen uit de praktijk, werkroosters en carrièremogelijkheden",
    icon: "Shield",
    topicsCount: 31,
    postsCount: 187,
    order: 4,
    createdAt: Date.now(),
  },
  cat5: {
    name: "Vakbonden & Rechten",
    description:
      "Informatie over politievakbonden, arbeidsvoorwaarden en rechtspositie",
    icon: "Scale",
    topicsCount: 9,
    postsCount: 34,
    order: 5,
    createdAt: Date.now(),
  },
  cat6: {
    name: "Specialisaties",
    description:
      "Recherche, ME, hondengeleider, verkeer en andere specialismen",
    icon: "Target",
    topicsCount: 15,
    postsCount: 67,
    order: 6,
    createdAt: Date.now(),
  },
  cat7: {
    name: "Techniek & Middelen",
    description: "Politie-uitrusting, voertuigen, ICT en technische innovaties",
    icon: "Cpu",
    topicsCount: 7,
    postsCount: 28,
    order: 7,
    createdAt: Date.now(),
  },
  cat8: {
    name: "Off Topic",
    description: "Alles wat niet direct met politie te maken heeft",
    icon: "Coffee",
    topicsCount: 14,
    postsCount: 53,
    order: 8,
    createdAt: Date.now(),
  },
};

const sampleTopics = {
  topic1: {
    title: "Ervaringen met assessment center 2025?",
    categoryId: "cat2",
    authorId: "demo_user_1",
    authorName: "Mark van Bergen",
    content:
      "Ik heb volgende week mijn assessment center voor aspirant politieagent. Heeft iemand recent ervaring met de nieuwe procedure? Wat kan ik verwachten?\n\nSpecifiek ben ik benieuwd naar:\n- Hoe lang duurt de hele dag?\n- Wat voor oefeningen komen er?\n- Moet ik me zorgen maken over de fysieke test?\n\nAll tips zijn welkom!",
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    updatedAt: Date.now() - 30 * 60 * 1000, // 30 min ago
    views: 156,
    repliesCount: 8,
    isPinned: false,
    isLocked: false,
    lastReply: {
      userId: "demo_user_2",
      userName: "Sarah_Politie",
      timestamp: Date.now() - 30 * 60 * 1000,
    },
  },
  topic2: {
    title: "Politieacademie intake 2025 - inschrijving open!",
    categoryId: "cat3",
    authorId: "admin",
    authorName: "Forum Admin",
    content:
      "Beste forumleden,\n\nDe Politieacademie heeft zojuist aangekondigd dat de inschrijving voor intake 2025 nu open is!\n\n**Belangrijke data:**\n- Inschrijving sluit: 31 december 2024\n- Selectieproces: januari-februari 2025\n- Start opleiding: april 2025\n\n**Wat moet je doen:**\n1. Ga naar politieacademie.nl\n2. Maak een account aan\n3. Vul de sollicitatieformulier in\n4. Upload je diploma's en CV\n\nSucces aan iedereen die zich gaat aanmelden!",
    createdAt: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    updatedAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    views: 342,
    repliesCount: 24,
    isPinned: true,
    isLocked: false,
    lastReply: {
      userId: "demo_user_3",
      userName: "PolitieAspirant2025",
      timestamp: Date.now() - 1 * 60 * 60 * 1000,
    },
  },
  topic3: {
    title: "Vraag over CAO en salarisschalen",
    categoryId: "cat5",
    authorId: "demo_user_4",
    authorName: "JohnDoe_NL",
    content:
      "Ik ben benieuwd naar de huidige salarisschalen bij de politie. Ik zie dat er een nieuwe CAO is afgesloten met 5% verhoging.\n\nKan iemand uitleggen:\n- Wat zijn de startschalen voor aspirant?\n- Hoeveel verdien je als je bent afgestudeerd?\n- Hoe werken de periodieke verhogingen?\n- Wat zijn de toeslagen (onregelmatigheid, weekend, etc.)?\n\nBedankt!",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    updatedAt: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    views: 289,
    repliesCount: 15,
    isPinned: false,
    isLocked: false,
    lastReply: {
      userId: "demo_user_5",
      userName: "ErvarenAgent",
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
    },
  },
  topic4: {
    title: "Nieuwe bodycams - wat vinden jullie ervan?",
    categoryId: "cat7",
    authorId: "demo_user_6",
    authorName: "TechAgent",
    content:
      "Onze eenheid heeft vorige week de nieuwe bodycams met live-streaming functie gekregen. Ik ben benieuwd wat jullie ervan vinden.\n\n**Voordelen die ik zie:**\n- Betere beeldkwaliteit\n- Langere batterijduur\n- Live-streaming naar meldkamer\n- GPS tracking\n\n**Nadelen:**\n- Zwaarder dan oude model\n- Ingewikkelder menu\n- Soms verbindingsproblemen\n\nHoe gaat het bij jullie?",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    updatedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    views: 412,
    repliesCount: 31,
    isPinned: false,
    isLocked: false,
    lastReply: {
      userId: "demo_user_7",
      userName: "WijkagentAmsterdam",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
    },
  },
  topic5: {
    title: "Recherche opleiding - hoe kom je erin?",
    categoryId: "cat6",
    authorId: "demo_user_8",
    authorName: "AspirantRechercheur",
    content:
      "Ik werk nu 2 jaar als basisagent en wil graag door naar de recherche. Kan iemand me vertellen:\n\n1. Hoeveel ervaring moet je hebben?\n2. Wat is de selectieprocedure?\n3. Hoe lang duurt de opleiding?\n4. Welke specialisaties zijn er binnen recherche?\n5. Hoe zijn de doorgroeimogelijkheden?\n\nTips en ervaringen zijn zeer welkom!",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    updatedAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    views: 187,
    repliesCount: 12,
    isPinned: false,
    isLocked: false,
    lastReply: {
      userId: "demo_user_9",
      userName: "Rechercheur_010",
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
    },
  },
};

const samplePosts = {
  post1: {
    topicId: "topic1",
    authorId: "demo_user_2",
    authorName: "Sarah_Politie",
    content:
      "Hey Mark! Ik heb vorig jaar mijn assessment gedaan, dus kan je wat tips geven:\n\n**Duur:** De hele dag duurt ongeveer 6-7 uur, van 8:00 tot 15:00.\n\n**Oefeningen:**\n- Praktijkscenario's (rollenspel)\n- Groepsopdracht met andere kandidaten\n- Presentatie houden\n- Gesprek met psycholoog\n- Fysieke test (cooper test)\n\n**Fysieke test:** Als je een beetje fit bent, moet dit geen probleem zijn. Ze verwachten geen topsporter, maar je moet wel het niveau halen. Oefen de cooper test een paar keer!\n\n**Tips:**\n- Wees jezelf\n- Denk hardop tijdens opdrachten\n- Samenwerken in groep is belangrijk\n- Zorg dat je uitgerust bent\n\nSucces!",
    createdAt: Date.now() - 30 * 60 * 1000, // 30 min ago
    likes: 12,
    likedBy: ["demo_user_1", "demo_user_3"],
  },
  post2: {
    topicId: "topic1",
    authorId: "demo_user_1",
    authorName: "Mark van Bergen",
    content:
      "Dank je wel Sarah! Super nuttig. Die cooper test ga ik zeker oefenen. Heb je nog tips voor de gesprekken? Wat voor vragen stellen ze?",
    createdAt: Date.now() - 25 * 60 * 1000, // 25 min ago
    likes: 3,
    likedBy: ["demo_user_2"],
  },
  post3: {
    topicId: "topic2",
    authorId: "demo_user_3",
    authorName: "PolitieAspirant2025",
    content:
      "Eindelijk! Ik heb al maanden gewacht op deze aankondiging. Ga meteen inschrijven. Weet iemand hoeveel plaatsen er zijn voor 2025?",
    createdAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    likes: 5,
    likedBy: [],
  },
};

async function initializeDatabase() {
  console.log("🚀 Starting database initialization...\n");

  try {
    // Set categories
    console.log("📁 Creating categories...");
    await set(ref(database, "categories"), categories);
    console.log("✅ Categories created: 8 categories\n");

    // Set topics
    console.log("💬 Creating sample topics...");
    await set(ref(database, "topics"), sampleTopics);
    console.log("✅ Topics created: 5 topics\n");

    // Set posts
    console.log("💭 Creating sample posts...");
    await set(ref(database, "posts"), samplePosts);
    console.log("✅ Posts created: 3 posts\n");

    console.log("🎉 Database initialized successfully!\n");
    console.log("You can now:");
    console.log("1. Visit http://localhost:3001 to see the forum");
    console.log("2. Click on categories to see topics");
    console.log("3. Register an account to participate");
    console.log("\n✨ Happy forum-ing!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
