import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ContextProvider } from "@/components/ContentProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palladium Genesis NFT",
  description:
    "Collect the very first Circuit Breaker NFT and join the elite OGs of Palladium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.ico" />
      </head>
      <body className={cn(inter.className)}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
