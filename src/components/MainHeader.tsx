"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { updateLocaleOptions } from "primereact/api";
import ptBrLocale from "@/infrastructure/primelocale/pt-br.json";

const MainHeader = () => {
  const router = useRouter();

  const menuRight = useRef<Menu>(null);
  const items = [
    {
      label: "Melhorias dias de férias",
      icon: "pi pi-calculator",
      url: "/",
    },
    {
      label: "Sobre",
      icon: "pi pi-question",
      url: "/sobre",
    },
  ];

  const toggleMenu = (event: React.MouseEvent) => {
    if (menuRight.current && event) menuRight.current.toggle(event);
  };

  useEffect(() => {
    updateLocaleOptions(ptBrLocale["pt-br"], "pt-br");
  });

  return (
    <div className="flex">
      <h1>Planejador de férias</h1>;
      <Button
        icon="pi pi-align-right"
        className="mr-2"
        onClick={toggleMenu}
        aria-controls="popup_menu_right"
        aria-haspopup
      />
      <Menu model={items} popup ref={menuRight} id="popup_menu_right" />
    </div>
  );
};

export default MainHeader;
