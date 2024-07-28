"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TabMenu } from "primereact/tabmenu";
import { updateLocaleOptions } from "primereact/api";
import ptBrLocale from "@/infrastructure/primelocale/pt-br.json";

const MainHeader = () => {
  const pathName = usePathname();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      label: "Melhores dias",
      icon: "pi pi-calculator",
      command: () => router.push("/"),
    },
    {
      icon: "pi pi-question",
      command: () => router.push("/sobre"),
    },
  ];

  useEffect(() => {
    switch (pathName) {
      case "/sobre":
        setActiveIndex(1);
        break;
      default:
        setActiveIndex(0);
        break;
    }
  });

  updateLocaleOptions(ptBrLocale["pt-br"], "pt-br");

  return (
    <div className="bg-white ps-3">
      <div className="lg:container mx-auto flex items-center justify-between">
        <h1 className="font-light text-sm md:text-xl">Planejador de férias</h1>
        <TabMenu model={items} activeIndex={activeIndex} key={activeIndex} />
      </div>
    </div>
  );
};

export default MainHeader;
