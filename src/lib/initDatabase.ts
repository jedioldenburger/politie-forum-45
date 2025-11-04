// Scripted helpers to seed and manage Firebase demo data from the admin UI

import {
  Database,
  get,
  ref,
  set,
  update,
} from "firebase/database";
import { database } from "./firebase";

export type AdminActionResult = {
  success: boolean;
  message?: string;
};

const sampleCategories = {
  "criminaliteit-opsporing": {
    name: "Criminaliteit & Opsporing",
    description:
      "Discussies over opsporingsmethoden, misdrijven, cold cases en actuele onderzoeken binnen Nederland en België.",
    icon: "Search",
    topicsCount: 0,
    postsCount: 0,
    order: 1,
    createdAt: Date.now(),
  },
  "specialisaties-eenheden": {
    name: "Specialisaties & Eenheden",
    description:
      "Informatie, ervaringen en analyses over gespecialiseerde politie-eenheden en hun werkveld.",
    icon: "Target",
    topicsCount: 0,
    postsCount: 0,
    order: 2,
    createdAt: Date.now(),
  },
  "technologie-middelen": {
    name: "Technologie & Middelen",
    description:
      "Bespreek politievoertuigen, bodycams, software, drones en technologische vernieuwingen.",
    icon: "Cpu",
    topicsCount: 0,
    postsCount: 0,
    order: 3,
    createdAt: Date.now(),
  },
  "cybersecurity-digitale-veiligheid": {
    name: "Cybersecurity & Digitale Veiligheid",
    description:
      "Alles over digitale misdaad, cyberbeveiliging, forensische technologie en kunstmatige intelligentie bij de politie.",
    icon: "Shield",
    topicsCount: 0,
    postsCount: 0,
    order: 4,
    createdAt: Date.now(),
  },
  "internationale-politie-europol": {
    name: "Internationale Politie & Europol",
    description:
      "Focus op internationale samenwerking tussen politiediensten, Europol, Interpol en grensoverschrijdende criminaliteit.",
    icon: "Globe",
    topicsCount: 0,
    postsCount: 0,
    order: 5,
    createdAt: Date.now(),
  },
  "rechtspraak-beleid": {
    name: "Rechtspraak & Beleid",
    description:
      "Bespreek recente rechtspraak, wetswijzigingen, juridische procedures en beleidskaders rond veiligheid en justitie.",
    icon: "Scale",
    topicsCount: 0,
    postsCount: 0,
    order: 6,
    createdAt: Date.now(),
  },
  "advocaten-rechtbanken": {
    name: "Advocaten & Rechtbanken",
    description:
      "Praktische ervaringen, uitspraken en inzichten vanuit advocatuur en rechtspraak.",
    icon: "Gavel",
    topicsCount: 0,
    postsCount: 0,
    order: 7,
    createdAt: Date.now(),
  },
  "burgerparticipatie-wijkveiligheid": {
    name: "Burgerparticipatie & Wijkveiligheid",
    description:
      "Samenwerking tussen burgers en politie: buurtpreventie, meldpunten en lokale veiligheid.",
    icon: "Users",
    topicsCount: 0,
    postsCount: 0,
    order: 8,
    createdAt: Date.now(),
  },
  "publieke-veiligheid-maatschappij": {
    name: "Publieke Veiligheid & Maatschappij",
    description:
      "Brede maatschappelijke thema's rond ordehandhaving, evenementenveiligheid en overheidsbeleid.",
    icon: "AlertCircle",
    topicsCount: 0,
    postsCount: 0,
    order: 9,
    createdAt: Date.now(),
  },
  "community-cafe-off-topic": {
    name: "Community Café / Off Topic",
    description:
      "Een plek voor informele gesprekken, humor en ontspanning buiten het politiewerk.",
    icon: "Coffee",
    topicsCount: 0,
    postsCount: 0,
    order: 10,
    createdAt: Date.now(),
  },
};

function requireDatabase(): Database {
  if (!database) {
    throw new Error(
      "Firebase database not initialized. Please check your environment variables."
    );
  }
  return database;
}

export async function initializeDatabase(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    await set(ref(db, "categories"), sampleCategories);

    const total = Object.keys(sampleCategories).length;
    return {
      success: true,
      message: `Categorieën opnieuw ingesteld (${total} categorieën).`,
    };
  } catch (error) {
    console.error("❌ Fout bij initialiseren database:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens initialiseren van de database.",
    };
  }
}

export async function seedSampleUsers(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    const users = createSampleUsers();
    await set(ref(db, "users"), users);

    return {
      success: true,
      message: `Demo-gebruikers toegevoegd (${Object.keys(users).length}).`,
    };
  } catch (error) {
    console.error("❌ Fout bij toevoegen van demo-gebruikers:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens aanmaken van demo-gebruikers.",
    };
  }
}

export async function resetUserMetrics(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      return {
        success: true,
        message: "Geen gebruikers gevonden om bij te werken.",
      };
    }

    const users = snapshot.val() as Record<string, any>;
    const updates: Record<string, number> = {};
    let updatedUsers = 0;

    Object.entries(users).forEach(([userId, data]) => {
      let touched = false;

      if ((data?.posts ?? 0) !== 0) {
        updates[`users/${userId}/posts`] = 0;
        touched = true;
      }

      if ((data?.reputation ?? 0) !== 0) {
        updates[`users/${userId}/reputation`] = 0;
        touched = true;
      }

      if (touched) {
        updatedUsers += 1;
      }
    });

    if (Object.keys(updates).length === 0) {
      return {
        success: true,
        message: "Gebruikersstatistieken stonden al op nul.",
      };
    }

    await update(ref(db), updates);

    return {
      success: true,
      message: `Statistieken opnieuw ingesteld voor ${updatedUsers} gebruiker(s).`,
    };
  } catch (error) {
    console.error("❌ Fout bij resetten van gebruikersstatistieken:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens resetten van gebruikersstatistieken.",
    };
  }
}

export async function seedSampleDiscussions(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    const topics = createSampleTopics();
    const posts = createSamplePosts();

    await Promise.all([
      set(ref(db, "topics"), topics),
      set(ref(db, "posts"), posts),
    ]);

    return {
      success: true,
      message: `Demo-discussies toegevoegd (${Object.keys(topics).length} topics, ${Object.keys(posts).length} berichten).`,
    };
  } catch (error) {
    console.error("❌ Fout bij toevoegen van demo-discussies:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens toevoegen van demo-discussies.",
    };
  }
}

export async function clearDiscussionData(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    const [topicsSnapshot, postsSnapshot] = await Promise.all([
      get(ref(db, "topics")),
      get(ref(db, "posts")),
    ]);

    const topicsCount = topicsSnapshot.exists()
      ? Object.keys(topicsSnapshot.val()).length
      : 0;
    const postsCount = postsSnapshot.exists()
      ? Object.keys(postsSnapshot.val()).length
      : 0;

    if (topicsCount === 0 && postsCount === 0) {
      return {
        success: true,
        message: "Geen topics of berichten gevonden om te verwijderen.",
      };
    }

    await Promise.all([
      set(ref(db, "topics"), null),
      set(ref(db, "posts"), null),
    ]);

    return {
      success: true,
      message: `Topics en berichten verwijderd (${topicsCount} topics, ${postsCount} berichten).`,
    };
  } catch (error) {
    console.error("❌ Fout bij opschonen van discussies:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens opschonen van discussies.",
    };
  }
}

export async function seedSampleComments(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    const comments = createSampleComments();
    await set(ref(db, "comments"), comments);

    return {
      success: true,
      message: `Demo-reacties toegevoegd (${Object.keys(comments).length}).`,
    };
  } catch (error) {
    console.error("❌ Fout bij toevoegen van demo-reacties:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens toevoegen van demo-reacties.",
    };
  }
}

export async function clearAllComments(): Promise<AdminActionResult> {
  try {
    const db = requireDatabase();
    const commentsRef = ref(db, "comments");
    const snapshot = await get(commentsRef);

    if (!snapshot.exists()) {
      return {
        success: true,
        message: "Geen reacties gevonden om te verwijderen.",
      };
    }

    const count = Object.keys(snapshot.val()).length;
    await set(commentsRef, null);

    return {
      success: true,
      message: `Reacties verwijderd (${count}).`,
    };
  } catch (error) {
    console.error("❌ Fout bij verwijderen van reacties:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Onbekende fout tijdens verwijderen van reacties.",
    };
  }
}

function createSampleUsers() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return {
    admin_demo: {
      email: "beheer@politieforum.nl",
      displayName: "Forum Beheer",
      nickname: "Beheerder",
      bio: "Beheer en moderatie van het Politie Forum.",
      location: "Utrecht",
      createdAt: now - 365 * day,
      role: "admin",
      posts: 128,
      reputation: 4200,
    },
    moderator_01: {
      email: "moderator@politieforum.nl",
      displayName: "Sanne van Dijk",
      nickname: "SanneMod",
      bio: "Moderator met focus op community-richtlijnen en ondersteuning.",
      location: "Rotterdam",
      createdAt: now - 220 * day,
      role: "moderator",
      posts: 86,
      reputation: 2100,
    },
    demo_user_1: {
      email: "mark.vanbergen@example.com",
      displayName: "Mark van Bergen",
      nickname: "MarkVB",
      createdAt: now - 90 * day,
      role: "user",
      posts: 14,
      reputation: 120,
    },
    demo_user_2: {
      email: "sarah.jansen@example.com",
      displayName: "Sarah Jansen",
      nickname: "Sarah_Politie",
      createdAt: now - 65 * day,
      role: "user",
      posts: 27,
      reputation: 350,
    },
    demo_user_3: {
      email: "politie.aspirant@example.com",
      displayName: "Lucas Meijer",
      nickname: "Aspirant2025",
      createdAt: now - 30 * day,
      role: "user",
      posts: 6,
      reputation: 45,
    },
  };
}

function createSampleTopics() {
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  return {
    "topic-ops-001": {
      title: "Nieuwe cold-case aanpak binnen eenheden",
      categoryId: "criminaliteit-opsporing",
      authorId: "moderator_01",
      authorName: "SanneMod",
      content:
        "Wat zijn jullie ervaringen met de vernieuwde cold-case aanpak? Welke tools werken goed en waar lopen jullie tegenaan?",
      createdAt: now - 12 * hour,
      updatedAt: now - 2 * hour,
      views: 186,
      repliesCount: 4,
      isPinned: true,
      isLocked: false,
      lastReply: {
        userId: "demo_user_2",
        userName: "Sarah_Politie",
        timestamp: now - 2 * hour,
      },
    },
    "topic-tech-002": {
      title: "Ervaringen met realtime drone-ondersteuning",
      categoryId: "technologie-middelen",
      authorId: "demo_user_1",
      authorName: "MarkVB",
      content:
        "In onze regio testen we realtime drone-ondersteuning bij aanhoudingen. Hoe gaat dit in andere teams?",
      createdAt: now - 26 * hour,
      updatedAt: now - 5 * hour,
      views: 254,
      repliesCount: 7,
      isPinned: false,
      isLocked: false,
      lastReply: {
        userId: "demo_user_3",
        userName: "Aspirant2025",
        timestamp: now - 5 * hour,
      },
    },
    "topic-community-003": {
      title: "Buurtparticipatie na recente inbraakgolven",
      categoryId: "burgerparticipatie-wijkveiligheid",
      authorId: "demo_user_2",
      authorName: "Sarah_Politie",
      content:
        "Welke buurtinitiatieven werken bij jullie om bewoners actief te betrekken na een serie inbraken?",
      createdAt: now - 3 * hour,
      updatedAt: now - hour,
      views: 78,
      repliesCount: 2,
      isPinned: false,
      isLocked: false,
      lastReply: {
        userId: "admin_demo",
        userName: "Beheerder",
        timestamp: now - hour,
      },
    },
  };
}

function createSamplePosts() {
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  return {
    "post-ops-001": {
      topicId: "topic-ops-001",
      authorId: "demo_user_2",
      authorName: "Sarah_Politie",
      content:
        "Wij werken met een centraal dashboard waar cold-cases automatisch prioriteit krijgen op basis van nieuwe input.",
      createdAt: now - 3 * hour,
      updatedAt: now - 2 * hour,
      likes: 6,
      likedBy: ["admin_demo", "demo_user_3"],
    },
    "post-tech-002": {
      topicId: "topic-tech-002",
      authorId: "demo_user_1",
      authorName: "MarkVB",
      content:
        "De realtime video helpt enorm, maar we hebben soms vertraging op de verbinding. We testen nu een 5G-backup.",
      createdAt: now - 8 * hour,
      likes: 4,
      likedBy: ["moderator_01"],
    },
    "post-community-003": {
      topicId: "topic-community-003",
      authorId: "admin_demo",
      authorName: "Beheerder",
      content:
        "Wij delen een toolkit met flyers en een WhatsApp-protocol. Werkt goed om bewoners snel te informeren.",
      createdAt: now - hour,
      likes: 2,
      likedBy: ["demo_user_1", "demo_user_2"],
    },
  };
}

function createSampleComments() {
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  return {
    "comment-news-001": {
      articleSlug: "politieacademie-intake-2025-inschrijving-geopend",
      authorId: "demo_user_3",
      authorName: "Aspirant2025",
      content:
        "Super nieuws dat de inschrijving weer open is. Heeft iemand tips voor de selectiegesprekken?",
      createdAt: now - 2 * hour,
      likes: 3,
      likedBy: {
        admin_demo: true,
        demo_user_2: true,
      },
    },
    "comment-news-002": {
      articleSlug: "politieacademie-intake-2025-inschrijving-geopend",
      authorId: "moderator_01",
      authorName: "SanneMod",
      content:
        "Zorg dat je concrete voorbeelden hebt van samenwerken en omgaan met stress. En lees de kernwaarden!",
      createdAt: now - hour,
      likes: 5,
      likedBy: {
        admin_demo: true,
        demo_user_1: true,
        demo_user_3: true,
      },
      parentCommentId: "comment-news-001",
    },
    "comment-news-003": {
      articleSlug: "nieuwe-bodycams-live-streaming-politie",
      authorId: "demo_user_1",
      authorName: "MarkVB",
      content:
        "Wij draaien al mee in de pilot. Vooral de live opnames helpen de meldkamer echt vooruit.",
      createdAt: now - 5 * hour,
      likes: 1,
      likedBy: {
        moderator_01: true,
      },
    },
  };
}

export { sampleCategories };
