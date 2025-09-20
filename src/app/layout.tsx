import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import localFont from 'next/font/local'

import Header from "@/components/header";
import Footer from "@/components/footer";

import "./global.css";

const jetbrainsMono = localFont({
  src: [
    {
      path: './fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/JetBrainsMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/JetBrainsMono-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/JetBrainsMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains-mono'
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.className}>
      <body className="h-screen flex flex-col p-8">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
