"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Save, UserPlus, ArrowLeft, Loader2, Camera, Instagram, Globe, Facebook, AlertCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovoAutorPage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [redes, setRedes] = useState({ instagram: "", facebook: "", site: "" });

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    
    const { error } = await supabase
      .from("site_post_authors")
      .insert([{ 
        nome, 
        bio, 
        foto_url: fotoUrl, 
        redes_social_json: redes 
      }]);

    if (error) {
      setErro("Erro ao cadastrar autor. " + error.message);
      setSalvando(false);
    } else {
      router.push("/admin/posts/autores");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto font-sans">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase text-[10px] tracking-widest transition-colors">
        <ArrowLeft size={14} /> Voltar para lista
      </button>

      <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Foto e Redes */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-4">
             <div className="w-28 h-28 mx-auto rounded-full bg-gray-50 border-4 border-white shadow-xl overflow-hidden relative">
                <img src={fotoUrl || `https://ui-avatars.com/api/?name=${nome || 'Autor'}`} className="w-full h-full object-cover" alt="Preview" />
             </div>
             <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Camera size={12}/> URL da Foto</label>
                <input type="url" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} placeholder="https://..." className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none" />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
            <p className="text-[10px] font-black uppercase text-ipa-dourado tracking-widest">Links Sociais</p>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
              <Instagram size={18} className="text-pink-500" />
              <input type="text" placeholder="User ou URL Instagram" value={redes.instagram} onChange={e => setRedes({...redes, instagram: e.target.value})} className="bg-transparent text-xs outline-none w-full" />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
              <Globe size={18} className="text-blue-400" />
              <input type="text" placeholder="URL Website" value={redes.site} onChange={e => setRedes({...redes, site: e.target.value})} className="bg-transparent text-xs outline-none w-full" />
            </div>
          </div>
        </div>

        {/* Lado Direito: Dados */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h1 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
              <UserPlus size={28} /> Novo Autor
            </h1>

            {erro && <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold"><AlertCircle size={18}/> {erro}</div>}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-bold text-ipa-escuro" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Biografia</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm min-h-[150px] resize-none" placeholder="Conte um pouco sobre o autor..." />
              </div>
            </div>

            <button type="submit" disabled={salvando} className="w-full bg-ipa-verde text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all shadow-xl shadow-ipa-verde/20">
              {salvando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {salvando ? "CADASTRANDO..." : "CADASTRAR AUTOR"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}