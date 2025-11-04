import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground | Politie Forum Nederland",
  description: "Development playground for testing new features",
  robots: "noindex, nofollow", // Don't index playground pages
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {children}
    </div>
  );
}
