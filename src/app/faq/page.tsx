// app/faq/page.tsx
import HomepageFAQ from "@/components/HomepageFAQ";
import { faqData } from "@/data/faqData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen - Politie Forum Nederland",
  description:
    "Veelgestelde vragen over Politie Forum Nederland. Vind antwoorden over politie, veiligheid, criminaliteit en meer.",
  alternates: {
    canonical: "https://politie-forum.nl/faq",
  },
  openGraph: {
    title: "Veelgestelde Vragen - Politie Forum Nederland",
    description: "Veelgestelde vragen over Politie Forum Nederland",
    url: "https://politie-forum.nl/faq",
    type: "website",
  },
};

export default function FAQPage() {
  // Generate standalone FAQPage schema for this dedicated page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Standalone FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 0) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Veelgestelde Vragen
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Vind antwoorden op de meest gestelde vragen over Politie Forum Nederland
            </p>
          </div>

          {/* FAQ Component */}
          <HomepageFAQ mode="long" />

          {/* Contact CTA */}
          <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Staat je vraag er niet tussen?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Neem contact met ons op via{" "}
              <a
                href="mailto:info@politie-forum.nl"
                className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                info@politie-forum.nl
              </a>{" "}
              of bel{" "}
              <a
                href="tel:+31648319167"
                className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                +31 6 48 31 91 67
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
