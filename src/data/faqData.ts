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
    shortAnswer: "Het grootste nederlands politie forum en politie discussie platform waar Nederland over politie praat.",
    longAnswer: "Politie Forum Nederland is het grootste nederlands politie forum en politie discussie platform waar professionals en geïnteresseerden dagelijks politie praat voeren. Onze politie community biedt een ruimte waar iedereen kan discussiëren over actuele politiezaken, veiligheid, criminaliteit, rechtspraak en justitie in Nederland.",
  },
  {
    question: "Hoe kan ik lid worden van de politie community?",
    shortAnswer: "Klik op Inloggen → Registreren; sluit je gratis aan bij onze politie community en praat mee.",
    longAnswer: "Sluit je gratis aan bij onze politie community door te klikken op 'Inloggen' en vervolgens 'Registreren'. Meld je aan met e-mail of Google Sign-In en begin direct met politie discussie. Na registratie kun je deelnemen aan forum politie gesprekken en reageren op politie nieuws.",
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
  {
    question: "Wat is het verschil tussen politie forum en politie discussie?",
    shortAnswer: "Politie forum is het platform, politie discussie zijn de gesprekken - beide samen vormen onze community.",
    longAnswer: "Politie Forum Nederland is het platform waar politie discussie plaatsvindt. Ons forum politie biedt gestructureerde categorieën en topics, terwijl politie discussie verwijst naar de dagelijkse gesprekken en politie praat tussen leden. Als politie community combineren we beide: georganiseerd forum met levendige discussies.",
  },
  {
    question: "Waarom kiezen voor dit nederlands politie forum?",
    shortAnswer: "10.000+ leden, dagelijks actueel nieuws, unieke Crime Map, en de meest actieve politie community.",
    longAnswer: "Dit nederlands politie forum onderscheidt zich door 10.000+ actieve leden, dagelijks politie nieuws, een unieke interactieve Crime Map met landelijke misdaaddata, en professionele politie discussie. Ons forum politie staat open voor professionals én geïnteresseerden. Als grootste politie community van Nederland bieden we een veilige plek waar iedereen over politie praat.",
  },
  {
    question: "Waar kan ik politie forum sollicitatie tips vinden?",
    shortAnswer: "In de categorie 'Werving & Sollicitatie' vind je de beste politie sollicitatie tips van ervaren agenten.",
    longAnswer: "Onze politie forum sollicitatie sectie biedt exclusieve tips van actieve en voormalige politieagenten. Je vindt er politie sollicitatie voorbereiding, motivatiebrief voorbeelden, interview ervaringen en praktische politie forum sollicitatie adviezen. Honderden leden delen hun politie sollicitatie succesverhalen en helpen aspiranten met hun politie forum sollicitatie vragen.",
  },
  {
    question: "Hoe bereid ik me voor op het politie forum assessment?",
    shortAnswer: "Ons forum biedt gedetailleerde politie assessment ervaringen, oefenmateriaal en begeleiding van leden die het assessment succesvol doorliepen.",
    longAnswer: "Het politie forum assessment onderdeel bevat uitgebreide informatie over de politie assessment procedure. Je vindt er politie forum assessment ervaringen van recente kandidaten, oefenvragen, tijdlijn overzichten en tips voor elk onderdeel. Veel leden delen hun politie assessment scores en feedback. Onze politie forum assessment community helpt je met voorbereiding op gesprekken, fysieke testen en psychologische screenings.",
  },
];

// Export with 'answer' property for schema.org FAQPage (use shortAnswer for optimal rich results)
export const faqData: { question: string; answer: string }[] = rawFaq.map(item => ({
  question: item.question,
  answer: item.shortAnswer ? item.shortAnswer : autoShorten(item.longAnswer),
}));
