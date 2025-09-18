import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

import "./global.css";

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['700'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
