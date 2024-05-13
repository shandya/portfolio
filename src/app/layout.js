import { Noto_Sans_Mono } from "next/font/google";
import "@/app/globals.css";

const noto = Noto_Sans_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "Shandy Ardiansyah",
  description: "Portfolio page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
