// src/data/faqData.ts
// FAQ data for homepage and /faq page - separated from client component for server-side access

export interface FAQItem {
  question: string;
  shortAnswer: string; // 50–160 chars voor snippet / FAQ rich result
  longAnswer: string;  // Volledige uitleg op /faq
}

// Helper voor trimming wanneer shortAnswer niet handmatig is gezet
function autoShorten(text: string, max = 160): string {
  if (text.length <= max) return text;
  // Niet midden in een woord afkappen
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 40 ? slice.slice(0, lastSpace) : slice) + '…';
}

export const rawFaq: Omit<FAQItem, 'shortAnswer'> & { shortAnswer?: string }[] = [
  {
    question: "Wat is Politie Forum Nederland?",
    shortAnswer: "Het grootste onafhankelijke Nederlandse discussieplatform over politie, veiligheid en criminaliteit.",
    longAnswer: "Politie Forum Nederland is het grootste Nederlandse discussieplatform over politie, veiligheid, en criminaliteit. Wij bieden een ruimte waar professionals, studenten en geïnteresseerde burgers kunnen discussiëren over actuele politiezaken, rechtspraak en veiligheid in Nederland.",
  },
  {
    question: "Hoe kan ik lid worden van het forum?",
    shortAnswer: "Klik op Inloggen → Registreren en meld u aan met e‑mail of Google; daarna kunt u direct posten.",
    longAnswer: "U kunt zich gratis registreren door te klikken op 'Inloggen' en vervolgens 'Registreren' te kiezen. U kunt zich aanmelden met uw e-mailadres of via Google Sign-In. Na registratie kunt u direct deelnemen aan discussies en reageren op artikelen.",
  },
  {
    question: "Kan ik anoniem tips doorgeven?",
    shortAnswer: "Ja, via WhatsApp Tip Lijn, e‑mail of PGP. Voor spoed altijd 112 of 0900-8844.",
    longAnswer: "Ja, u kunt anoniem tips doorgeven via onze WhatsApp Tip Lijn (+31 6 48319167), via e-mail (tip@politie-forum.nl) of via onze versleutelde PGP-mail. Voor acute gevallen of ernstige misdrijven adviseren wij altijd contact op te nemen met de politie via 112 (spoed) of 0900-8844.",
  },
  {
    question: "Waar komt de nieuwsinhoud vandaan?",
    shortAnswer: "Uit o.a. politie.nl, rechtspraak.nl en grote media; redactie herschrijft alles voor context & uniekheid.",
    longAnswer: "We cureren nieuws uit o.a. politie.nl, rechtspraak.nl en grote NL-media en voegen context en discussie toe. Bronvermelding staat in elk artikel. Onze redactie controleert dagelijks op juistheid en actualiteit, en herschrijft alle artikelen voor unieke content en leesbaarheid.",
  },
  {
    question: "Is Politie Forum Nederland officieel verbonden aan de Nederlandse politie?",
    shortAnswer: "Nee, volledig onafhankelijk en niet gelieerd aan politie of overheid.",
    longAnswer: "Nee, Politie Forum Nederland is een onafhankelijk platform en niet officieel verbonden aan de Nederlandse politie of enige overheidsinstantie. Wij bieden een vrije en open ruimte voor discussie over politiegerelateerde onderwerpen.",
  },
  {
    question: "Hoe kan ik contact opnemen met de redactie?",
    shortAnswer: "Via info@politie-forum.nl, +31 6 48319167 of de contactpagina; aparte tipkanalen beschikbaar.",
    longAnswer: "U kunt contact opnemen via e-mail (info@politie-forum.nl), telefoon (+31 6 48319167), of via de contactpagina op onze website. Voor tips en meldingen kunt u gebruikmaken van onze Tip Lijn met WhatsApp-ondersteuning.",
  },
  {
    question: "Wat is de Crime Map Nederland?",
    shortAnswer: "Interactieve kaart met recente incidenten, dagelijks bijgewerkt voor inzicht in lokale criminaliteit.",
    longAnswer: "De Crime Map Nederland is een interactieve kaart waarop recente misdaadincidenten in Nederland worden weergegeven op basis van openbare politieberichten. De kaart helpt gebruikers inzicht te krijgen in criminaliteit in hun omgeving, wordt dagelijks bijgewerkt met nieuwe incidenten, en toont locaties, categorieën en tijdstippen van gemelde misdaden.",
  },
  {
    question: "Mag ik artikelen delen of citeren?",
    shortAnswer: "Ja, delen en citeren met bronvermelding; volledige overname alleen na toestemming.",
    longAnswer: "Ja, u mag artikelen delen via sociale media of citeren met bronvermelding. Wij waarderen het als u een link naar het originele artikel opneemt. Voor volledige reproductie van artikelen vragen wij u contact op te nemen met de redactie.",
  },
];

// Export with 'answer' property for schema.org FAQPage (use shortAnswer for optimal rich results)
export const faqData: { question: string; answer: string }[] = rawFaq.map(item => ({
  question: item.question,
  answer: item.shortAnswer ? item.shortAnswer : autoShorten(item.longAnswer),
}));
