// No longer a client component
import React from "react";
// Removed: import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import Link from "next/link"; // Import Link for navigation

const About = () => {
  // Removed: const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sobre o Projeto</h1>
      <p className="mb-6 text-center max-w-prose">
        Este é o Vacation Planner, uma ferramenta projetada para ajudar você a encontrar os melhores períodos para tirar suas férias, otimizando seus dias de descanso ao considerar feriados nacionais, estaduais e municipais.
      </p>
      {/* Use Link for navigation back to home */}
      <Link href="/" passHref legacyBehavior>
        <Button label="Voltar para a Calculadora" icon="pi pi-arrow-left" />
      </Link>
    </div>
  );
};

export default About;

