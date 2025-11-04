import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Verklaring - Politie Forum Nederland",
  description: "Lees onze privacy verklaring en ontdek hoe wij omgaan met uw persoonsgegevens.",
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
