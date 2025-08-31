import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const outfit = Outfit( { subsets: [ "latin" ] } );


export const metadata: Metadata = {
  title: "Reemember",
  description: "Remember your notes and reminders",
};

export default function RootLayout ( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body className={ `${ outfit.className } ` }>
        <Providers>
          { children }
        </Providers>
      </body>
    </html>
  );
}
