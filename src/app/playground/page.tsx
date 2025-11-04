"use client";

import {
  ArrowRight,
  Award,
  BarChart3,
  Code,
  Edit3,
  MessageSquare,
  Zap
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    id: "threads",
    title: "Threaded Replies",
    description: "Test nested comment system met onbeperkte diepte",
    icon: MessageSquare,
    status: "ready",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "editor",
    title: "Rich Text Editor",
    description: "TipTap editor met formatting, media, @mentions",
    icon: Edit3,
    status: "planned",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "polls",
    title: "Polls & Surveys",
    description: "Interactieve polls in topics met live resultaten",
    icon: BarChart3,
    status: "planned",
    color: "from-green-500 to-green-600",
  },
  {
    id: "reputation",
    title: "Reputation System",
    description: "Badges, punten, leaderboard, privileges",
    icon: Award,
    status: "planned",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "ai",
    title: "AI Features",
    description: "Auto-summarize, smart replies, content moderation",
    icon: Zap,
    status: "planned",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "export",
    title: "Export Tools",
    description: "Generate static HTML, Python code voor news-rip.py",
    icon: Code,
    status: "ready",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function PlaygroundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          🎨 Development Playground
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Test nieuwe forum features in een geïsoleerde omgeving.
          Werkende implementaties kunnen direct worden geëxporteerd naar <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">news-rip.py</code>
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isReady = feature.status === "ready";

          return (
            <Link
              key={feature.id}
              href={isReady ? `/playground/${feature.id}` : "#"}
              className={`group relative bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg transition-all ${
                isReady
                  ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {isReady ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                    ✓ Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full">
                    ⏳ Planned
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {feature.description}
              </p>

              {/* Arrow (only for ready features) */}
              {isReady && (
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Test feature</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          📊 Development Roadmap
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {features.filter(f => f.status === "ready").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Features Ready
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {features.filter(f => f.status === "planned").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              In Planning
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {features.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Features
            </div>
          </div>
        </div>
      </div>

      {/* Back to Forum */}
      <div className="mt-8 text-center">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
        >
          ← Terug naar forum
        </Link>
      </div>
    </div>
  );
}
