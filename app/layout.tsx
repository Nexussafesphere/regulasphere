import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ToastContainer from "@/components/shared/ToastContainer";
import LanguageProvider from "@/components/shared/LanguageProvider";
import FloatingActions from "@/components/shared/FloatingActions";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RegulaSphere | AI-Powered Compliance for Nigerian Businesses",
  description:
    "Stay compliant. Stay ahead. RegulaSphere helps Nigerian businesses avoid regulatory fines through AI-powered compliance tracking.",
  keywords: [
    "compliance",
    "Nigeria",
    "AI",
    "regulatory",
    "NDPC",
    "NITDA",
    "CAC",
    "NRS",
    "fintech",
    "RegulaSphere",
  ],
  openGraph: {
    title: "RegulaSphere | AI-Powered Compliance",
    description:
      "Stay compliant. Stay ahead. AI-powered compliance for Nigerian businesses.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-off-white antialiased">
        <LanguageProvider>
          <ToastContainer>
            <Navbar />
            <main className="flex-1 w-full max-w-full min-w-0">{children}</main>
            <Footer />
            <FloatingActions />
          </ToastContainer>
        </LanguageProvider>
      </body>
    </html>
  );
}