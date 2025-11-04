import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Verklaring - Politie Forum Nederland",
  description: "Lees onze privacy verklaring en ontdek hoe wij omgaan met uw persoonsgegevens.",
  alternates: {
    canonical: "https://politie-forum.nl/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
