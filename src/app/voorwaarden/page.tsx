import { Metadata } from "next";
import VoorwaardenClient from "./VoorwaardenClient";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden - Politie Forum Nederland",
  description: "Lees de algemene voorwaarden voor het gebruik van Politie Forum Nederland.",
};

export default function VoorwaardenPage() {
  return <VoorwaardenClient />;
}
