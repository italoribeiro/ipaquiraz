"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, Trash2, Camera, Loader2, Instagram, Globe, Facebook } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AutoresPage() {
  const [autores, setAutores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estados do Form
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [redes, setRedes] = useState({ instagram: "", facebook: "", site: "" });

  const fetchAutores = async () => {
    const { data } = await supabase.from("site_post_authors").select("*").order("nome");
    setAutores(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAutores(); }, []);

  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    const { error } = await supabase.from("site_post_authors").insert([{
      nome, bio, foto_url: fotoUrl, redes_social_json: redes
    }]);

    if (!error) {
      setNome(""); setBio(""); setFotoUrl("");
      setRedes({ instagram: "", facebook: "", site: "" });
      fetchAutores();
    }
    setSalvando(false);
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Excluir autor?")) {
      await supabase.from("site_post_authors").delete().eq("id", id);
      fetchAutores();
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-ipa-verde">CARREGANDO AUTORES...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2 mb-10">
        <Users size={32} /> Escritores & Autores
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleAdicionar} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Nome Completo</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Bio / Mini Currículo</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm h-20 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Camera size={10}/> URL da Foto</label>
            <input type="url" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} placeholder="https://..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs" />
          </div>
          
          <div className="pt-4 space-y-3">
             <p className="text-[10px] font-black uppercase text-ipa-dourado tracking-widest">Redes Sociais</p>
             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                <Instagram size={14} className="text-pink-500"/>
                <input type="text" placeholder="Instagram URL" value={redes.instagram} onChange={e => setRedes({...redes, instagram: e.target.value})} className="bg-transparent text-xs outline-none w-full" />
             </div>
             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                <Globe size={14} className="text-blue-400"/>
                <input type="text" placeholder="Site Pessoal" value={redes.site} onChange={e => setRedes({...redes, site: e.target.value})} className="bg-transparent text-xs outline-none w-full" />
             </div>
          </div>

          <button type="submit" disabled={salvando} className="w-full bg-ipa-verde text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-ipa-escuro shadow-lg shadow-ipa-verde/20 transition-all">
            {salvando ? "Salvando..." : "Cadastrar Autor"}
          </button>
        </form>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {autores.map(autor => (
            <div key={autor.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md">
                    <img src={autor.foto_url || 'https://ui-avatars.com/api/?name='+autor.nome} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-ipa-escuro uppercase text-sm">{autor.nome}</h4>
                    <p className="text-[9px] font-mono text-gray-300 truncate w-32">{autor.id}</p>
                  </div>
                </div>
                <button onClick={() => handleExcluir(autor.id)} className="text-gray-200 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
              </div>
              <p className="text-xs text-gray-500 mt-4 line-clamp-2 italic">"{autor.bio || 'Sem biografia...'}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}