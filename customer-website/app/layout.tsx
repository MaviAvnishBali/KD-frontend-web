import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cinzel } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kila Darbar | Royal Mughal Dining Experience",
    template: "%s | Kila Darbar",
  },
  description:
    "Experience the grandeur of Royal Mughal cuisine at Kila Darbar. Authentic flavors, regal ambiance. Order online, book a table, or plan your special event.",
  keywords: [
    "Kila Darbar",
    "Mughal restaurant",
    "Royal dining",
    "biryani",
    "kebab",
    "online food order",
    "table reservation",
    "catering",
    "family restaurant",
  ],
  authors: [{ name: "Kila Darbar" }],
  creator: "Kila Darbar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kiladarbar.com",
    siteName: "Kila Darbar",
    title: "Kila Darbar | Royal Mughal Dining",
    description: "Experience authentic Royal Mughal cuisine.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kila Darbar",
    description: "Royal Mughal Dining Experience",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7C1D1D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cinzel.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  borderRadius: "8px",
                  background: "#1A0A0A",
                  color: "#FFF8F0",
                  border: "1px solid #7C1D1D",
                },
                success: { iconTheme: { primary: "#F59E0B", secondary: "#1A0A0A" } },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
