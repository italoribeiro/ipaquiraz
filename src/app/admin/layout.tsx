// src/app/admin/layout.tsx
import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, FolderTree, LogOut } from "lucide-react";

export const metadata = {
  title: "Painel Administrativo | IP Aquiraz",
  robots: "noindex, nofollow", 
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-ipa-verde text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <span className="font-black tracking-widest text-lg uppercase">
            IP Aquiraz <span className="text-ipa-dourado">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider">
            <LayoutDashboard size={18} className="text-ipa-dourado" /> Dashboard
          </Link>
          <Link href="/admin/sermoes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider">
            <BookOpen size={18} className="text-ipa-dourado" /> Sermões
          </Link>
          <Link href="/admin/categorias" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider">
            <FolderTree size={18} className="text-ipa-dourado" /> Categorias
          </Link>
          <Link href="/admin/autores" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold uppercase tracking-wider">
            <Users size={18} className="text-ipa-dourado" /> Autores
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}