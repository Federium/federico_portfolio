import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";


import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['700'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
      <main>{children}</main>
      <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
