"use client";

import { FAQItem } from "@/data/news";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

// Re-export for backward compatibility
export type { FAQItem };

interface ArticleFAQProps {
  faqs: FAQItem[];
  articleTitle: string;
}

export default function ArticleFAQ({ faqs, articleTitle }: ArticleFAQProps) {
  const [isOpen, setIsOpen] = useState(true); // Expanded by default for better UX

  if (!faqs || faqs.length === 0) return null;

  return (
    <section
      id="faq"
      className="my-12"
    >
      {/* Collapsible Header - Forum Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Sluit veelgestelde vragen" : "Open veelgestelde vragen"}
        aria-expanded={isOpen}
        aria-controls="faq-content"
        className={`w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-left">
            <h2 id="faq-heading" className="text-xl font-bold text-primary-900 dark:text-primary-400">
              Veelgestelde Vragen (FAQ)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {faqs.length} essentiële vraag{faqs.length !== 1 ? 'en' : ''} over dit artikel
            </p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div
          id="faq-content"
          className="bg-white dark:bg-slate-800 rounded-b-lg shadow-lg p-8 border-t border-slate-200 dark:border-slate-700"
        >

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
              >
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50">
                  <h3
                    className="font-semibold text-slate-900 dark:text-white mb-3"
                  >
                    {faq.question}
                  </h3>
                  <div
                    className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                  >
                    <div
                      className="text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none"
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 italic">
            Heeft u nog vragen over dit onderwerp? Plaats een reactie hieronder.
          </p>
        </div>
      )}
    </section>
  );
}
