import React from "react";
import { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";
import "@/styles/globals.css";

import MainHeader from "@/components/MainHeader";

export const metadata: Metadata = {
  title: `Deu férias!`,
  description: "Encontre os melhores dias para suas férias",
  icons: {
    icon: ["/favicon.svg", "/favicon.ico"],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-br">
      <body>
        <PrimeReactProvider value={{ locale: "pt-br" }}>
          <MainHeader />
          <div className="container mx-auto px-3">{children}</div>
        </PrimeReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
