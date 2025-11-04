import type { Metadata } from "next";
import NieuwsDisclaimerClient from "./NieuwsDisclaimerClient";

export const metadata: Metadata = {
  title: "Nieuws & Media Disclaimer | Politie Forum Nederland",
  description:
    "Disclaimer voor nieuwsartikelen: bronvermelding, AI-gebruik, redactionele principes, correctiebeleid en verificatie van politie-gerelateerde content.",
  alternates: {
    canonical: "https://politie-forum.nl/nieuws-disclaimer",
  },
  openGraph: {
    url: "https://politie-forum.nl/nieuws-disclaimer",
    type: "website",
    title: "Nieuws & Media Disclaimer | Politie Forum Nederland",
    description:
      "Disclaimer voor nieuwsartikelen: bronvermelding, AI-gebruik, redactionele principes, correctiebeleid en verificatie van politie-gerelateerde content.",
  },
  icons: {
    icon: [
      { url: "/police_badge_icon_16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/police_badge_icon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/police_badge_icon_512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function NieuwsDisclaimerPage() {
  return <NieuwsDisclaimerClient />;
}
