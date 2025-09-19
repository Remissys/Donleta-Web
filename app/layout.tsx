import type { Metadata } from "next";
import { Roboto_Mono } from 'next/font/google'

import "./_css/globals.css";

import Footer from "./footer";
import Header from "./header";

const robotoMono = Roboto_Mono({
  weight: '400',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Donleta",
  description: "Genshin Impact casual competition!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoMono.className}>
      <body>
        <Header/>
        <div className="main-content">
          {children}
        </div>
        <Footer/>
      </body>
      </html>
  );
}
