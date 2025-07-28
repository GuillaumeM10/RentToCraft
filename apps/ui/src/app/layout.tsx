import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./main.scss";
import { AuthProvider } from "./contexts/auth.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentToCraft - Location d'outils entre particuliers",
  description: "Louez et partagez des outils facilement avec RentToCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
