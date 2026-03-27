import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visite a IPB em Aquiraz | Igreja Presbiteriana de Aquiraz",
  description: "Planeje sua visita à Igreja Presbiteriana de Aquiraz. Encontre nosso endereço, horários de culto e um formulário para programar sua visita ou enviar pedidos de oração. Estamos ansiosos para recebê-lo!",
  keywords: [
    "visitar igreja presbiteriana de aquiraz",
    "endereço igreja presbiteriana de aquiraz",
    "horário de culto igreja presbiteriana de aquiraz", 
    "programar visita igreja presbiteriana de aquiraz",
    "pedido de oração igreja presbiteriana de aquiraz",
    "fale conosco igreja presbiteriana de aquiraz", 
    "como chegar igreja presbiteriana de aquiraz",
    "formulário de visita igreja presbiteriana de aquiraz",
    "formulário de oração igreja presbiteriana de aquiraz", 
    "formulário fale conosco igreja presbiteriana de aquiraz",
    "igreja presbiteriana de aquiraz contato",
    "visite a igreja presbiteriana de aquiraz", 
    "programar visita à igreja presbiteriana de aquiraz",
    "pedidos de oração para igreja presbiteriana de aquiraz"
  ],
};

export default function VisitaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}