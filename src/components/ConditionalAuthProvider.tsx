"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Global AuthProvider wrapper.
 *
 * Aanpassing: Voorheen laadden we Firebase Auth alleen op specifieke routes
 * (login/register/profiel/etc.) om performance te sparen. Hierdoor kreeg de
 * login modal op de homepage/artikelpagina's een stub context ("Auth not loaded").
 *
 * We laden Auth nu altijd zodat de inlogfunctionaliteit overal direct werkt.
 * Performance impact is beperkt en acceptabel tegenover UX winst.
 * Indien later gewenst kan een lazy load variant geïntroduceerd worden
 * (bv. dynamic import bij eerste klik op 'Inloggen').
 */
export function ConditionalAuthProvider({ children }: { children: ReactNode }) {
  // In de toekomst: detecteer bestaande session via localStorage en lazy inject.
  // Voor nu: altijd AuthProvider.
  usePathname(); // behouden indien later route-based optimalisatie terugkomt
  return <AuthProvider>{children}</AuthProvider>;
}
