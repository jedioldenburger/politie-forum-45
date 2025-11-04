import { Metadata } from "next";
import EigendomClient from "./EigendomClient";

export const metadata: Metadata = {
  title: "Eigendom & Copyright | Politie Forum Nederland",
  description:
    "Informatie over intellectueel eigendom, auteursrecht, gebruikersrechten en licenties op Politie Forum Nederland. Lees hoe we content en gebruikersdata beschermen.",
  keywords: [
    "eigendom", "copyright", "auteursrecht", "intellectueel eigendom",
    "gebruikersrechten", "content licentie", "data eigendom",
    "politie forum eigendom", "content bescherming", "auteursrechten",
  ],
  alternates: {
    canonical: "https://politie-forum.nl/eigendom",
  },
  openGraph: {
    url: "https://politie-forum.nl/eigendom",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Eigendom & Copyright | Politie Forum Nederland",
    description:
      "Informatie over intellectueel eigendom, auteursrecht, gebruikersrechten en licenties op Politie Forum Nederland.",
  },
  other: {
    "og:updated_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    title: "Eigendom & Copyright | Politie Forum Nederland",
    description: "Intellectueel eigendom, auteursrecht en gebruikersrechten op het politie forum",
  },
};

export default function EigendomPage() {
  return <EigendomClient />;
}
