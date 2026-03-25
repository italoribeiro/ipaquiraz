import Navbar from "../../components/layout/navbar";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ipa-creme antialiased selection:bg-ipa-verde selection:text-white font-sans">
      <Navbar />
      
      <main className="min-h-screen pt-20">
        {children}
      </main>

      <footer className="bg-ipa-escuro text-ipa-creme py-16 px-6 border-t border-ipa-verde/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white">© 2026 Igreja Presbiteriana de Aquiraz</p>
        </div>
      </footer>
    </div>
  );
}