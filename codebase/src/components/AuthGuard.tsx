"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isLoggedIn, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Verwende einen kurzen Timeout, um sicherzustellen, dass der Zustand vollständig geladen ist
    const timer = setTimeout(() => {
      // // console.log('AuthGuard check:', { isLoggedIn, isAdmin, requireAdmin });
      
      // Wenn nicht angemeldet, zur Login-Seite umleiten
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }

      // Wenn Admin-Zugriff erforderlich ist und Benutzer kein Admin ist, zur Fehlerseite umleiten
      if (requireAdmin && !isAdmin) {
        router.push('/not-found');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoggedIn, isAdmin, requireAdmin, router]);

  // Wenn nicht angemeldet oder Admin-Zugriff erforderlich, aber kein Admin ist, nichts rendern
  if (!isLoggedIn || (requireAdmin && !isAdmin)) {
    return null;
  }

  // Ansonsten die Kinder-Komponenten rendern
  return <>{children}</>;
}
