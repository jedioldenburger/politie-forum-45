"use client";

import {
  clearAllComments,
  clearDiscussionData,
  initializeDatabase,
  resetUserMetrics,
  seedSampleComments,
  seedSampleDiscussions,
  seedSampleUsers,
  type AdminActionResult,
} from "@/lib/initDatabase";
import { useState } from "react";

type ActionKey =
  | "initCategories"
  | "seedDiscussions"
  | "clearDiscussions"
  | "seedComments"
  | "clearComments"
  | "seedUsers"
  | "resetUserStats";

type ButtonVariant = "primary" | "secondary" | "danger";

type ActionStatus = {
  state: "idle" | "loading" | "success" | "error";
  message?: string;
};

type AdminActionConfig = {
  id: ActionKey;
  title: string;
  description: string;
  buttonLabel: string;
  loadingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  run: () => Promise<AdminActionResult>;
  variant?: ButtonVariant;
};

type ActionGroup = {
  id: string;
  title: string;
  description: string;
  actions: AdminActionConfig[];
};

const ACTION_GROUPS: ActionGroup[] = [
  {
    id: "categories",
    title: "Categoriebeheer",
    description:
      "Herstel de standaard forumstructuur of initialiseer een lege database met vaste categorieën.",
    actions: [
      {
        id: "initCategories",
        title: "Initialiseer categorieën",
        description:
          "Overschrijft alle bestaande categorieën met de standaard indeling voor het Politie Forum.",
        buttonLabel: "Categorieën Initialiseren",
        loadingLabel: "Categorieën worden ingesteld...",
        successMessage: "Categorieën zijn opnieuw ingesteld.",
        errorMessage: "Kon de categorieën niet initialiseren.",
        run: initializeDatabase,
        variant: "primary",
      },
    ],
  },
  {
    id: "discussions",
    title: "Discussiebeheer",
    description:
      "Plaats voorbeeldtopics voor nieuwe demo-omgevingen of maak de huidige discussiedata leeg.",
    actions: [
      {
        id: "seedDiscussions",
        title: "Plaats voorbeeldtopics",
        description:
          "Voegt een handvol voorbeeldtopics en -berichten toe voor demo- of testdoeleinden.",
        buttonLabel: "Demo-discussies toevoegen",
        loadingLabel: "Discussies worden aangemaakt...",
        successMessage: "Demo-discussies toegevoegd.",
        errorMessage: "Kon de demo-discussies niet toevoegen.",
        run: seedSampleDiscussions,
        variant: "secondary",
      },
      {
        id: "clearDiscussions",
        title: "Leeg discussies",
        description:
          "Verwijdert alle topics en berichten uit de database. Dit kan niet ongedaan worden gemaakt.",
        buttonLabel: "Topics & Berichten verwijderen",
        loadingLabel: "Discussies worden verwijderd...",
        successMessage: "Topics en berichten verwijderd.",
        errorMessage: "Kon de discussiegegevens niet verwijderen.",
        run: clearDiscussionData,
        variant: "danger",
      },
    ],
  },
  {
    id: "comments",
    title: "Reactiebeheer",
    description:
      "Beheer nieuwsreacties: voeg voorbeeldreacties toe of maak de bestaande lijst leeg.",
    actions: [
      {
        id: "seedComments",
        title: "Plaats voorbeeldreacties",
        description:
          "Voegt voorbeeldreacties toe aan geselecteerde nieuwsartikelen zodat de commentaarfunctie getest kan worden.",
        buttonLabel: "Demo-reacties toevoegen",
        loadingLabel: "Reacties worden aangemaakt...",
        successMessage: "Demo-reacties toegevoegd.",
        errorMessage: "Kon de demo-reacties niet toevoegen.",
        run: seedSampleComments,
        variant: "secondary",
      },
      {
        id: "clearComments",
        title: "Leeg reacties",
        description:
          "Verwijdert alle reacties uit de database. Gebruik dit voor een schone start of na tests.",
        buttonLabel: "Reacties verwijderen",
        loadingLabel: "Reacties worden verwijderd...",
        successMessage: "Reacties verwijderd.",
        errorMessage: "Kon de reacties niet verwijderen.",
        run: clearAllComments,
        variant: "danger",
      },
    ],
  },
  {
    id: "users",
    title: "Gebruikersbeheer",
    description:
      "Voeg demo-accounts toe voor demo's of zet de statistieken van bestaande gebruikers terug.",
    actions: [
      {
        id: "seedUsers",
        title: "Plaats demo-gebruikers",
        description:
          "Voegt enkele voorbeeldaccounts toe (admin, moderator en leden) met voorbeeldstatistieken.",
        buttonLabel: "Demo-gebruikers toevoegen",
        loadingLabel: "Gebruikers worden aangemaakt...",
        successMessage: "Demo-gebruikers toegevoegd.",
        errorMessage: "Kon de demo-gebruikers niet toevoegen.",
        run: seedSampleUsers,
        variant: "secondary",
      },
      {
        id: "resetUserStats",
        title: "Reset statistieken",
        description:
          "Zet het aantal posts en reputatie van alle gebruikers terug naar nul.",
        buttonLabel: "Gebruikersstatistieken resetten",
        loadingLabel: "Statistieken worden gereset...",
        successMessage: "Gebruikersstatistieken gereset.",
        errorMessage: "Kon de statistieken niet resetten.",
        run: resetUserMetrics,
        variant: "danger",
      },
    ],
  },
];

const STATUS_COLORS: Record<ActionStatus["state"], string> = {
  idle: "text-slate-500 dark:text-slate-400",
  loading: "text-amber-600 dark:text-amber-400",
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-red-600 dark:text-red-400",
};

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 hover:bg-primary-700",
  secondary: "bg-slate-800 hover:bg-slate-900",
  danger: "bg-red-600 hover:bg-red-700",
};

export default function AdminPage() {
  const [statuses, setStatuses] = useState<Record<ActionKey, ActionStatus>>({});
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);

  const updateStatus = (id: ActionKey, status: ActionStatus) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const handleAction = async (action: AdminActionConfig) => {
    if (activeAction) return;

    setActiveAction(action.id);
    updateStatus(action.id, {
      state: "loading",
      message: action.loadingLabel ?? "Bezig met uitvoeren...",
    });

    try {
      const result = await action.run();
      const state: ActionStatus["state"] = result.success
        ? "success"
        : "error";
      const message =
        result.message ??
        (result.success
          ? action.successMessage ?? "Actie voltooid."
          : action.errorMessage ?? "Actie mislukt.");

      updateStatus(action.id, { state, message });
    } catch (error) {
      console.error(`❌ Admin-actie ${action.id} mislukt:`, error);
      updateStatus(action.id, {
        state: "error",
        message:
          action.errorMessage ??
          "Er is een onverwachte fout opgetreden tijdens deze actie.",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const getStatus = (id: ActionKey): ActionStatus =>
    statuses[id] ?? { state: "idle", message: "" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Database Beheer
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Gebruik onderstaande acties om demo-data te plaatsen, de database op
            te schonen of gebruikersstatistieken te beheren. Deze acties voeren
            directe wijzigingen uit in Firebase.
          </p>
        </div>

        {ACTION_GROUPS.map((group) => (
          <section
            key={group.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <div className="border-b border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {group.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {group.description}
              </p>
            </div>
            <div className="p-6 space-y-6">
              {group.actions.map((action) => {
                const status = getStatus(action.id);
                const isLoading = status.state === "loading";
                const isBlocked =
                  activeAction !== null && activeAction !== action.id;
                const variant = action.variant ?? "secondary";

                return (
                  <div
                    key={action.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {action.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {action.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAction(action)}
                        disabled={isLoading || isBlocked}
                        className={`inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]}`}
                      >
                        {isLoading
                          ? action.loadingLabel ?? "Bezig..."
                          : action.buttonLabel}
                      </button>
                    </div>
                    {status.state !== "idle" && status.message ? (
                      <p
                        className={`mt-4 text-sm ${STATUS_COLORS[status.state]}`}
                      >
                        {status.message}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Informatie
          </h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li>• Database: Firebase Realtime Database</li>
            <li>• Regio: Europe-West1</li>
            <li>• Authenticatie: Email/Password + Google</li>
            <li>• Storage: Firebase Storage</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
