import type { Metadata } from "next";
import DisclaimerClient from "./DisclaimerClient";

export const metadata: Metadata = {
  title: "Algemene Disclaimer | Politie Forum Nederland",
  description:
    "Lees de algemene disclaimer van Politie Forum Nederland over aansprakelijkheid, gebruikersinhoud, externe links en medisch/juridisch advies.",
  alternates: {
    canonical: "https://politie-forum.nl/disclaimer",
  },
  openGraph: {
    url: "https://politie-forum.nl/disclaimer",
    type: "website",
    title: "Algemene Disclaimer | Politie Forum Nederland",
    description:
      "Lees de algemene disclaimer van Politie Forum Nederland over aansprakelijkheid, gebruikersinhoud, externe links en medisch/juridisch advies.",
  },
  icons: {
    icon: [
      { url: "/police_badge_icon_16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/police_badge_icon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/police_badge_icon_512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
