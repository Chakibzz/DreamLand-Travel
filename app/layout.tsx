import type { Metadata } from "next";
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CurrencyProvider } from "@/components/currency-context";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata, siteConfig, siteUrl } from "@/lib/seo";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const beVietnam = Be_Vietnam_Pro({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-be-vietnam" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({
    title: `${siteConfig.name} | Agence de voyage et tourisme a Boufarik`,
    description: siteConfig.description,
    path: "/",
  }),
  title: {
    default: `${siteConfig.name} | Agence de voyage et tourisme a Boufarik`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "agence de voyage Boufarik",
    "Dreamland Travel",
    "voyage organise Algerie",
    "Omra Algerie",
    "billetterie Algerie",
    "assistance visa",
    "transfert aeroport",
  ],
  category: "travel",
  icons: {
    icon: [
      { url: "/icon.png?v=20260524", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=20260524", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=20260524",
    apple: "/apple-icon.png?v=20260524",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${beVietnam.variable}`}>
      <body className="min-h-screen bg-[#f4ead8] text-[#22180d]">
        <AuthSessionProvider>
          <CurrencyProvider>
            <ScrollAnimations />
            <StructuredData />
            <Navbar />
            <main className="bg-[#f4ead8] pt-20 text-[#22180d]">{children}</main>
            <WhatsAppButton />
            <Footer />
          </CurrencyProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}


