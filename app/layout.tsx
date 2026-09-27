import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AppContextProvider from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IncomingCallModal from "../components/IncomingCallModal";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://docify-health.com"),
  title: {
    default: "Docify - Book Doctor Appointments Online",
    template: "%s | Docify",
  },
  description: "Docify is a trusted online doctor appointment booking platform connecting patients with top verified doctors, specialists, and healthcare professionals.",
  keywords: [
    "doctor appointment",
    "book doctor online",
    "find doctors",
    "Docify healthcare",
    "medical consultation",
    "general physician",
    "gynecologist",
    "dermatologist",
    "pediatricians",
    "neurologist",
  ],
  authors: [{ name: "Docify Health" }],
  creator: "Docify",
  publisher: "Docify",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://docify-health.com",
    siteName: "Docify",
    title: "Docify - Book Doctor Appointments Online",
    description: "Connect with verified healthcare specialists and book instant doctor appointments with Docify.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docify - Book Doctor Appointments Online",
    description: "Book appointments with trusted healthcare specialists hassle-free.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.className} ${outfit.variable} antialiased bg-white text-zinc-800`}>
        <AppContextProvider>
          <div className="mx-4 sm:mx-[10%]">
            <ToastContainer position="top-right" autoClose={3000} />
            <IncomingCallModal />
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </div>
        </AppContextProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
