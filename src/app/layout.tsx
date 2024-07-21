import React from "react";
import { Metadata } from "next";
import "primereact/resources/themes/soho-light/theme.css";
// primereact/resources/themes/tailwind-light/theme.css
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "@/styles/globals.css";

import MainHeader from "@/components/MainHeader";

export const metadata: Metadata = {
  title: {
    default: "Planejador de férias",
    template: "%s | Seu tempo importa",
  },
  description: "Encontre os melhores dias para suas férias",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-br">
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
      </head>
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
