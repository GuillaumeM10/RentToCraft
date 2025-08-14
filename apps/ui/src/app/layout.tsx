import type { Metadata, Viewport } from "next";

import { Inter } from "next/font/google";

import "./main.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/auth.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentToCraft - Location d'outils entre particuliers",
  description: "Louez et partagez des outils facilement avec RentToCraft",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RentToCraft",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RentToCraft" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <ErrorBoundary>
          <AuthProvider>
            <ToastContainer />
            <main id="main-content" role="main">
              {children}
            </main>
            <ScrollToTop />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
