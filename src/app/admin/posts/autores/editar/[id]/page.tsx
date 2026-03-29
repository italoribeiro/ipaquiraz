"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Save, User, ArrowLeft, Loader2, Camera, Instagram, Globe, Facebook, AlertCircle, CheckCircle2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarAutorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [redes, setRedes] = useState({ instagram: "", facebook: "", site: "" });

  useEffect(() => {
    const fetchAutor = async () => {
      const { data, error } = await supabase.from("site_post_authors").select("*").eq("id", id).single();
      if (data) {
        setNome(data.nome);
        setBio(data.bio || "");
        setFotoUrl(data.foto_url || "");
        setRedes(data.redes_social_json || { instagram: "", facebook: "", site: "" });
      }
      setLoading(false);
    };
    fetchAutor();
  }, [id]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    const { error } = await supabase
      .from("site_post_authors")
      .update({ 
        nome, 
        bio, 
        foto_url: fotoUrl, 
        redes_social_json: redes 
      })
      .eq("id", id);

    if (error) {
      setErro("Erro ao atualizar autor.");
      setSalvando(false);
    } else {
      setSucesso(true);
      setTimeout(() => router.push("/admin/posts/autores"), 1500);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-ipa-verde animate-pulse">CARREGANDO DADOS...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto font-sans">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase text-[10px] tracking-widest transition-colors">
        <ArrowLeft size={14} /> Voltar para lista
      </button>

      <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-4">
             <div className="w-28 h-28 mx-auto rounded-full bg-gray-50 border-4 border-white shadow-xl overflow-hidden relative">
                <img src={fotoUrl || `https://ui-avatars.com/api/?name=${nome}`} className="w-full h-full object-cover" alt="Preview" />
             </div>
             <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Camera size={12}/> URL da Foto</label>
                <input type="url" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none font-medium" />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
            <p className="text-[10px] font-black uppercase text-ipa-dourado tracking-widest">Links Sociais</p>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
              <Instagram size={18} className="text-pink-500" />
              <input type="text" placeholder="URL Instagram" value={redes.instagram} onChange={e => setRedes({...redes, instagram: e.target.value})} className="bg-transparent text-xs outline-none w-full font-bold" />
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
              <Globe size={18} className="text-blue-400" />
              <input type="text" placeholder="URL Website" value={redes.site} onChange={e => setRedes({...redes, site: e.target.value})} className="bg-transparent text-xs outline-none w-full font-bold" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h1 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
              <User size={28} /> Editar Perfil
            </h1>

            {erro && <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold"><AlertCircle size={18}/> {erro}</div>}
            {sucesso && <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={18}/> Atualizado! Redirecionando...</div>}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome do Autor</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-bold text-ipa-escuro" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Biografia Profissional</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm min-h-[150px] resize-none" />
              </div>
            </div>

            <button type="submit" disabled={salvando} className="w-full bg-ipa-verde text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all shadow-xl shadow-ipa-verde/20">
              {salvando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {salvando ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}