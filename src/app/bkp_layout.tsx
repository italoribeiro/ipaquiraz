import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image"; // Importante para a logo no rodapé
import "./globals.css";
import Navbar from "../components/layout/navbar";

// Mantendo apenas a Inter para o visual Sans-Serif moderno solicitado
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Igreja Presbiteriana de Aquiraz - Fé Reformada em Aquiraz/CE",
  description: "Uma igreja bíblica, confessional e reformada. Junte-se a nós para cultuar ao Senhor. www.ipaquiraz.com.br",
  keywords: ["igreja presbiteriana", "aquiraz", "reforma protestante", "culto", "ebd", "fé reformada"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable}`}>
      <body className="bg-ipa-creme antialiased selection:bg-ipa-verde selection:text-white font-sans">
        <Navbar />
        
        <main className="min-h-screen pt-20">
          {children}
        </main>

        {/* Rodapé Institucional Ajustado */}
        <footer className="bg-ipa-escuro text-ipa-creme py-16 px-6 border-t border-ipa-verde/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            
            {/* Coluna 1: Logo IPB e Nome */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="relative w-20 h-20">
                <Image 
                  src="/ipb-logo-removebg-preview.png" 
                  alt="Logo IPB" 
                  fill 
                  className="object-contain brightness-0 invert opacity-80" 
                />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tighter uppercase leading-tight">
                  Igreja Presbiteriana <br /> de Aquiraz
                </h3>
              </div>
            </div>

            {/* Coluna 2: Endereço Atualizado */}
            <div>
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Endereço</h4>
              <p className="text-sm opacity-70 leading-relaxed font-medium">
                R. Açucena, 289 <br />
                Parques das Flores <br />
                Aquiraz - CE, 61700-000
              </p>
            </div>

            {/* Coluna 3: Links Rápidos */}
            <div>
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Links Rápidos</h4>
              <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest text-ipa-dourado">
                <a href="/contato" className="hover:text-white transition-colors">Pedido de Oração</a>
                <a href="/dizimos" className="hover:text-white transition-colors">Dízimos e Ofertas</a>
                <a href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</a>
              </div>
            </div>

            {/* Coluna 4: CTA WhatsApp */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Contato</h4>
              <a 
                href="https://wa.me/5585900000000" 
                className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black tracking-widest hover:bg-white hover:text-ipa-verde transition-all"
              >
                WHATSAPP
              </a>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center text-[9px] font-bold opacity-30 uppercase tracking-[0.3em]">
            © 2026 Igreja Presbiteriana de Aquiraz - Soli Deo Gloria
          </div>
        </footer>
      </body>
    </html>
  );
}