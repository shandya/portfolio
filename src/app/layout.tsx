import "@/app/globals.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './fontawesome'; // This imports the configuration we made earlier
import { Noto_Sans_Mono, Nixie_One } from "next/font/google";

const noto = Noto_Sans_Mono({ subsets: ["latin"], variable: "--font-body" });
const nixieOne = Nixie_One({ subsets: ["latin"], weight: "400", variable: "--font-heading" });
config.autoAddCss = false; // Tell FontAwesome to not add its own CSS since we did it above

export const metadata = {
  title: "Shandy Ardiansyah",
  description: "Portfolio Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${noto.variable} ${nixieOne.variable} ${noto.className}`}>{children}</body>
    </html>
  );
}
