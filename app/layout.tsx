import type { Metadata } from "next";
import { Fugaz_One, Open_Sans } from 'next/font/google'
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Head from "./head";
import Logout from "./components/Logout";

export const metadata: Metadata = {
  title: "Broodl",
  description: "Track your daily mood every day of the year!",
};

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })
const openSans = Open_Sans({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
        <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className }>Broodl</h1>
      </Link>
      <Logout />
    </header>
  )

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={'text-indigo-500 ' + fugaz.className} >Created with 🤍  ...and ☕</p>
    </footer>  
  )

  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body
          className={`w-full max-width-[1000px] mx-auto text-sm sm:text-base 
            min-h-screen flex flex-col text-slate-800 ${openSans.className}`
          }>
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
