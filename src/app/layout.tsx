import React from "react";
import { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";
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
      <body className="bg-slate-100">
        <PrimeReactProvider value={{ locale: "pt-br" }}>
          <MainHeader />
          <div className="lg:container mx-auto">{children}</div>
        </PrimeReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
