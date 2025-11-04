"use client";

import { rawFaq } from "@/data/faqData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
// Force Turbopack cache refresh - Oct 20, 2025 19:45 UTC

// Helper voor trimming wanneer shortAnswer niet handmatig is gezet
function autoShorten(text: string, max = 160): string {
  if (text.length <= max) return text;
  // Niet midden in een woord afkappen
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 40 ? slice.slice(0, lastSpace) : slice) + '…';
}

interface HomepageFAQProps {
  mode?: 'short' | 'long'; // short = snippet (homepage), long = volledige (/faq)
}

export default function HomepageFAQ({ mode = 'short' }: HomepageFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [sectionExpanded, setSectionExpanded] = useState(false);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleSection = () => {
    setSectionExpanded(!sectionExpanded);
  };

  const displayedFaq = mode === 'short' ? rawFaq.slice(0, 4) : rawFaq;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="faq-heading">
      <button
        onClick={toggleSection}
        aria-label={sectionExpanded ? "Sluit veelgestelde vragen" : "Open veelgestelde vragen"}
        aria-expanded={sectionExpanded}
        aria-controls="faq-content"
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
      >
        <h2 id="faq-heading" className="text-xl font-bold text-blue-900 dark:text-blue-400">
          Veelgestelde Vragen (FAQ)
        </h2>
        {sectionExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0" aria-hidden="true" focusable="false" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400 flex-shrink-0" aria-hidden="true" focusable="false" />
        )}
      </button>

      {sectionExpanded && (
        <div id="faq-content" className="divide-y divide-slate-200 dark:divide-slate-700">
          {displayedFaq.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
                aria-label={`${expandedIndex === index ? 'Sluit' : 'Open'} vraag: ${faq.question}`}
                className="w-full flex items-start justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <div className="flex-1 pr-4">
                  <h3 id={`faq-question-${index}`} className="text-lg font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </div>
              </button>

              {expandedIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="px-6 pb-6 text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  {mode === 'short' ? (faq.shortAnswer ? faq.shortAnswer : autoShorten(faq.longAnswer)) : faq.longAnswer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
