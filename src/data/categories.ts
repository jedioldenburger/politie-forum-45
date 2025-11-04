// Static category data for use when Firebase is not configured
// This ensures the site works even without Firebase connection

import { Category } from "@/lib/types";

export const staticCategories: Category[] = [
  {
    id: "criminaliteit-opsporing",
    name: "Criminaliteit & Opsporing",
    description:
      "Discussies over opsporingsmethoden, misdrijven, cold cases en actuele onderzoeken binnen Nederland en België.",
    icon: "Search",
    topicsCount: 0,
    postsCount: 0,
    order: 1,
    createdAt: Date.now(),
  },
  {
    id: "specialisaties-eenheden",
    name: "Specialisaties & Eenheden",
    description:
      "Informatie, ervaringen en analyses over gespecialiseerde politie-eenheden en hun werkveld.",
    icon: "Target",
    topicsCount: 0,
    postsCount: 0,
    order: 2,
    createdAt: Date.now(),
  },
  {
    id: "technologie-middelen",
    name: "Technologie & Middelen",
    description:
      "Bespreek politievoertuigen, bodycams, software, drones en technologische vernieuwingen.",
    icon: "Cpu",
    topicsCount: 0,
    postsCount: 0,
    order: 3,
    createdAt: Date.now(),
  },
  {
    id: "cybersecurity-digitale-veiligheid",
    name: "Cybersecurity & Digitale Veiligheid",
    description:
      "Alles over digitale misdaad, cyberbeveiliging, forensische technologie en kunstmatige intelligentie bij de politie.",
    icon: "Shield",
    topicsCount: 0,
    postsCount: 0,
    order: 4,
    createdAt: Date.now(),
  },
  {
    id: "internationale-politie-europol",
    name: "Internationale Politie & Europol",
    description:
      "Focus op internationale samenwerking tussen politiediensten, Europol, Interpol en grensoverschrijdende criminaliteit.",
    icon: "Globe",
    topicsCount: 0,
    postsCount: 0,
    order: 5,
    createdAt: Date.now(),
  },
  {
    id: "rechtspraak-beleid",
    name: "Rechtspraak & Beleid",
    description:
      "Bespreek recente rechtspraak, wetswijzigingen, juridische procedures en beleidskaders rond veiligheid en justitie.",
    icon: "Scale",
    topicsCount: 0,
    postsCount: 0,
    order: 6,
    createdAt: Date.now(),
  },
  {
    id: "advocaten-rechtbanken",
    name: "Advocaten & Rechtbanken",
    description:
      "Praktische ervaringen, uitspraken en inzichten vanuit advocatuur en rechtspraak.",
    icon: "Gavel",
    topicsCount: 0,
    postsCount: 0,
    order: 7,
    createdAt: Date.now(),
  },
  {
    id: "burgerparticipatie-wijkveiligheid",
    name: "Burgerparticipatie & Wijkveiligheid",
    description:
      "Samenwerking tussen burgers en politie: buurtpreventie, meldpunten en lokale veiligheid.",
    icon: "Users",
    topicsCount: 0,
    postsCount: 0,
    order: 8,
    createdAt: Date.now(),
  },
  {
    id: "publieke-veiligheid-maatschappij",
    name: "Publieke Veiligheid & Maatschappij",
    description:
      "Brede maatschappelijke thema's rond ordehandhaving, evenementenveiligheid en overheidsbeleid.",
    icon: "AlertCircle",
    topicsCount: 0,
    postsCount: 0,
    order: 9,
    createdAt: Date.now(),
  },
  {
    id: "community-cafe-off-topic",
    name: "Community Café / Off Topic",
    description:
      "Een plek voor informele gesprekken, humor en ontspanning buiten het politiewerk.",
    icon: "Coffee",
    topicsCount: 0,
    postsCount: 0,
    order: 10,
    createdAt: Date.now(),
  },
];

// Helper function to get all categories
export function getStaticCategories(): Category[] {
  return staticCategories;
}

// Helper function to get category by ID
export function getStaticCategoryById(id: string): Category | undefined {
  return staticCategories.find((cat) => cat.id === id);
}

// Helper function to get category by name
export function getStaticCategoryByName(name: string): Category | undefined {
  return staticCategories.find(
    (cat) => cat.name.toLowerCase() === name.toLowerCase()
  );
}
