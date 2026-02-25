import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import { Instagram, Youtube } from "lucide-react"; // Ícones para o grid vertical

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ipaquiraz.com.br"),
  title: {
    default: "Igreja Presbiteriana em Aquiraz",
    template: "%s | Igreja Presbiteriana de Aquiraz"
  },
  description: "Igreja Presbiteriana em Aquiraz. Cultos, eventos, programação e comunidade cristã reformada no Ceará.",
  keywords: [
    "igreja presbiteriana aquiraz",
    "igreja reformada aquiraz",
    "culto aquiraz",
    "igreja no eusébio",
    "igreja presbiteriana ceará"
   ],
    openGraph: {
    title: "Igreja Presbiteriana de Aquiraz",
    description: "Conheça nossa igreja em Aquiraz.",
    type: "website",
    locale: "pt_BR"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable}`}>
      <head>
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Church",
              name: "Igreja Presbiteriana de Aquiraz",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Aquiraz",
                addressRegion: "CE",
                addressCountry: "BR",
              },
            }),
          }}
        />
      
        {/* Google Analytics - Instalado corretamente para Next.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4Z28X4NVF7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4Z28X4NVF7');
          `}
        </Script>
      </head>
      <body className="bg-ipa-creme antialiased selection:bg-ipa-verde selection:text-white font-sans">
        <Navbar />
        
        <main className="min-h-screen pt-20">
          {children}
        </main>

        <footer className="bg-ipa-escuro text-ipa-creme py-16 px-6 border-t border-ipa-verde/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 text-center md:text-left">
            
            {/* Coluna 1: Identidade e Logo IPB */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="relative w-20 h-20">
                <Image 
                  src="/ipb-logo-removebg-preview.png" 
                  alt="Logo IPB" 
                  fill 
                  className="object-contain brightness-0 invert opacity-80" 
                />
              </div>
              <h3 className="text-lg font-black tracking-tighter uppercase leading-tight">
                Igreja Presbiteriana <br /> de Aquiraz
              </h3>
            </div>

            {/* Coluna 2: Endereço Atualizado */}
            <div>
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Endereço</h4>
              <p className="text-sm opacity-70 leading-relaxed font-medium">
                R. Açucena, 95 <br />
                Parques das Flores <br />
                Aquiraz - CE, 61700-000
              </p>
            </div>

            {/* Coluna 3: Acesso Rápido */}
            <div>
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Links</h4>
              <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest text-ipa-dourado">
                <a href="/contato" className="hover:text-white transition-colors">Pedido de Oração</a>
                <a href="/dizimos" className="hover:text-white transition-colors">Dízimos e Ofertas</a>
                <a href="/quem-somos" className="hover:text-white transition-colors">Quem Somos</a>
              </div>
            </div>

            {/* Coluna 4: Redes Sociais - Grid Vertical */}
            <div>
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Siga-nos</h4>
              <div className="flex flex-col gap-4 items-center md:items-start">
                <a 
                  href="https://www.instagram.com/ipaquiraz" 
                  target="_blank" 
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-ipa-dourado transition-all">
                    <Instagram size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-bold tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">@ipaquiraz</span>
                </a>
                
                <a 
                  href="https://www.youtube.com/@ipaquiraz" 
                  target="_blank" 
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-red-600 transition-all">
                    <Youtube size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-bold tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">@ipaquiraz</span>
                </a>
              </div>
            </div>

            {/* Coluna 5: CTA WhatsApp */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-black mb-6 uppercase text-[11px] tracking-[0.2em] text-white">Contato</h4>
              <a 
                href="https://wa.me/5585900000000" 
                className="bg-white/5 border border-white/10 px-8 py-3 rounded-full text-[10px] font-black tracking-widest hover:bg-white hover:text-ipa-verde transition-all text-center"
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