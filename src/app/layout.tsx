import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: '--font-dancing',
});

export const metadata: Metadata = {
  title: "Reemember",
  description: "Remember your notes and reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} ${dancingScript.variable}`}>
        <Providers>

          {children}

        </Providers>
      </body>
    </html>
  );
}
