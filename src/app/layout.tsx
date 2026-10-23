import "@/app/globals.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './fontawesome'; // This imports the configuration we made earlier
import { Noto_Sans_Mono, Nixie_One } from "next/font/google";
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const noto = Noto_Sans_Mono({ subsets: ["latin"], variable: "--font-body" });
const nixieOne = Nixie_One({ subsets: ["latin"], weight: "400", variable: "--font-heading" });
config.autoAddCss = false; // Tell FontAwesome to not add its own CSS since we did it above

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${SITE_NAME} — Blog` }] },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image", creator: "@shandya" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${noto.variable} ${nixieOne.variable} ${noto.className}`}>{children}</body>
    </html>
  );
}
