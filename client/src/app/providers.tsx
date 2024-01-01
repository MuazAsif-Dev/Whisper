"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" disableTransitionOnChange>
        <SessionProvider session={session}>{children}</SessionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
