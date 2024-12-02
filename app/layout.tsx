
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ContextProvider } from "@/components/ContentProvider";
import Head from "next/head";
import "./favicon.webp";

const inter = Inter({ subsets: ["latin"] });

interface CustomMetadata {
  title: string;
  description: string;
  image: string;
}

export const metadata: CustomMetadata = {
  title: "Palladium Alpha NFT",
  description:
    "Collect the very first Circuit Breaker NFT and join the elite OGs of Palladium",
  image: "/metaimage.jpeg",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" /> 
        <link rel="icon" href="/metaimage.jpeg" />{" "}
        <meta property="og:image" content={metadata.image} />{" "}
      </Head>
      <body className={cn(inter.className)}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
