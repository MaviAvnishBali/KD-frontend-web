import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cinzel, Cormorant_Garamond } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { CustomCursor } from "./components/ui/CustomCursor";
import { SmoothScroll } from "./components/ui/SmoothScroll";
import { FloatingWidgets } from "./components/ui/FloatingWidgets";
import { ScrollProgress } from "./components/ui/ScrollProgress";
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kila Darbar | Royal Mughal Dining Experience",
    template: "%s | Kila Darbar",
  },
  description:
    "Experience the grandeur of Royal Mughal cuisine at Kila Darbar. Authentic flavors, regal ambiance, and an unforgettable dining experience.",
  keywords: ["Kila Darbar", "Mughal restaurant", "Royal dining", "biryani", "kebab", "luxury restaurant"],
  authors: [{ name: "Kila Darbar" }],
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} ${cinzel.variable} ${cormorant.variable} font-sans antialiased bg-obsidian text-ivory overflow-x-hidden`}
      >
        <SmoothScroll>
          <Providers>
            <CustomCursor />
            <ScrollProgress />
            {children}
            <FloatingWidgets />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  borderRadius: "0",
                  background: "#1a0a0b",
                  color: "#F8F4E9",
                  border: "1px solid rgba(212,175,55,0.3)",
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "16px",
                },
                success: { iconTheme: { primary: "#D4AF37", secondary: "#111" } },
              }}
            />
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
