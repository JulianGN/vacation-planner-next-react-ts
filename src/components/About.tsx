"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

const About = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Sobre o projeto</h1>;
      <Button label="Voltar" onClick={() => router.push("/")} />
    </div>
  );
};

export default About;
