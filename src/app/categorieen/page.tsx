import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Categorieën - Politie Forum Nederland",
  description: "Bekijk alle forumcategorieën over politie, criminaliteit, veiligheid en justitie. Van politie sollicitatie tot cybercrime en forensisch onderzoek.",
  alternates: {
    canonical: "https://politie-forum.nl/categorieen",
  },
  openGraph: {
    title: "Categorieën | Politie Forum Nederland",
    description: "Bekijk alle forumcategorieën over politie, criminaliteit, veiligheid en justitie.",
    url: "https://politie-forum.nl/categorieen",
    type: "website",
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
