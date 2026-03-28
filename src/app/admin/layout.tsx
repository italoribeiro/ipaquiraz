// src/app/admin/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FolderTree, 
  Library, 
  BookmarkCheck,
  LogOut,
  Menu,
  X,
  ImageIcon // <-- Adicionei o ícone de imagem aqui
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  // Função para fechar o menu ao clicar em um link no mobile
  const fecharMenu = () => setMenuAberto(false);

  // Lógica para verificar se a rota de banners está ativa
  const isBannersActive = pathname.startsWith('/admin/home/banners');

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* HEADER MOBILE (Visível apenas em telas pequenas) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-ipa-verde text-white flex items-center justify-between px-6 z-40 shadow-md">
        <span className="font-black tracking-widest text-sm uppercase">
          IP Aquiraz <span className="text-ipa-dourado">Admin</span>
        </span>
        <button 
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      {menuAberto && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={fecharMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-ipa-verde text-white flex flex-col shadow-2xl overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${menuAberto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* LOGO AREA */}
        <div className="hidden lg:flex p-8 border-b border-white/5 flex-col items-center">
          <span className="font-black tracking-widest text-lg uppercase leading-none">
            IP Aquiraz
          </span>
          <span className="text-ipa-dourado text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Painel Admin
          </span>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-8 mt-16 lg:mt-0">
          
          {/* DASHBOARD GERAL */}
          <div>
            <Link 
              href="/admin" 
              onClick={fecharMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider group ${pathname === '/admin' ? 'bg-ipa-dourado text-white' : 'hover:bg-white/10'}`}
            >
              <LayoutDashboard size={18} className={pathname === '/admin' ? 'text-white' : 'text-ipa-dourado group-hover:scale-110 transition-transform'} /> 
              Dashboard
            </Link>
          </div>

          {/* GRUPO 1: MINISTÉRIO DA PALAVRA */}
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              Ministério da Palavra
            </p>
            <Link href="/admin/sermoes" onClick={fecharMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <BookOpen size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Sermões
            </Link>
            <Link href="/admin/categorias" onClick={fecharMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <FolderTree size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Categorias
            </Link>
            <Link href="/admin/autores" onClick={fecharMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <Users size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Autores
            </Link>
          </div>

          {/* GRUPO 2: EDUCAÇÃO E EBD */}
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              Educação e EBD
            </p>
            <Link href="/admin/ebd/materiais" onClick={fecharMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <Library size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Biblioteca de Recursos
            </Link>
            <Link href="/admin/ebd/categorias" onClick={fecharMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <BookmarkCheck size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Categorias de Ensino
            </Link>
          </div>

          {/* --- NOVO GRUPO: SITE PRINCIPAL --- */}
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              Site Principal
            </p>
            <Link 
              href="/admin/home/banners" 
              onClick={fecharMenu} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[11px] font-bold uppercase tracking-wider group ${isBannersActive ? 'bg-ipa-dourado text-white' : 'hover:bg-white/10'}`}
            >
              <ImageIcon size={18} className={isBannersActive ? 'text-white' : 'text-ipa-dourado group-hover:scale-110 transition-transform'} /> 
              Banners da Home
            </Link>
          </div>

        </nav>

        {/* FOOTER DA SIDEBAR */}
        <div className="p-4 border-t border-white/5">
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest">
              <LogOut size={14} /> Sair do Painel
            </Link>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 pt-16 lg:pt-0 w-full">
        {children}
      </main>
    </div>
  );
}