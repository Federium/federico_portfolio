import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import "./global.css";

import { Merriweather } from 'next/font/google'

const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={merriweather.className}>
      <body className="max-w-3xl mx-auto p-4">
      <main>{children}</main>
      <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
