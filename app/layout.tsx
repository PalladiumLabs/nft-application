// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { cn } from "../lib/utils";
// import { ContextProvider } from "@/components/ContentProvider";
// import Head from "next/head";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Palladium Genesis NFT",
//   description:
//     "Collect the very first Circuit Breaker NFT and join the elite OGs of Palladium",
//   image: "/favicon.webp",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <Head>
//         <link rel="icon" href="/favicon.webp" />
//         <meta property="og:image" content={metadata.image} />
//        <link rel="icon" href="/path/to/your/favicon.ico" />
//       </Head>
//       <body className={cn(inter.className)}>
//         <ContextProvider>{children}</ContextProvider>
//       </body>
//     </html>
//   );
// }

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
  title: "Palladium Ignition NFT",
  description:
    "Collect the penultimate NFT of Circuit Breaker ",
  image: "/metaimage.jpeg",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" /> {/* Specify the favicon */}
        <link rel="icon" href="/metaimage.jpeg" />{" "}
        {/* Specify the meta image */}
        <meta property="og:image" content={metadata.image} />{" "}
        {/* Set meta image */}
      </Head>
      <body className={cn(inter.className)}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
