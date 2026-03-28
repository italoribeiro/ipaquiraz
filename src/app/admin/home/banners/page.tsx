import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, ImageIcon, MousePointerClick, Pencil, CalendarClock, CheckCircle2, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BannersAdminPage() {
  // Busca os banners ordenados pela "ordem" que definiremos depois
  const { data: banners } = await supabase
    .from("site_banners")
    .select("*")
    .order("ordem", { ascending: true })
    .order("criado_em", { ascending: false });

  // Função simples para saber se o banner está ativo e dentro do prazo
  const verificarStatus = (banner: any) => {
    if (!banner.ativo) return { texto: "Inativo", cor: "bg-red-100 text-red-700", icone: <XCircle size={14} /> };
    
    const agora = new Date();
    if (banner.data_inicio && new Date(banner.data_inicio) > agora) {
      return { texto: "Agendado", cor: "bg-yellow-100 text-yellow-700", icone: <CalendarClock size={14} /> };
    }
    if (banner.data_fim && new Date(banner.data_fim) < agora) {
      return { texto: "Expirado", cor: "bg-gray-100 text-gray-600", icone: <XCircle size={14} /> };
    }
    
    return { texto: "No Ar", cor: "bg-green-100 text-green-700", icone: <CheckCircle2 size={14} /> };
  };

  return (
    <div className="p-10 pb-24">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Banners da Home</h1>
          <p className="text-gray-500 font-medium mt-2">Gerencie as imagens, links e métricas do carrossel principal.</p>
        </div>
        <Link 
          href="/admin/home/banners/novo" 
          className="bg-ipa-dourado hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} /> Novo Banner
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold w-32 text-center">Imagem</th>
              <th className="p-4 font-bold">Conteúdo</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Desempenho</th>
              <th className="p-4 font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners?.map((banner) => {
              const status = verificarStatus(banner);
              
              return (
                <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  
                  {/* COLUNA: Miniatura da Imagem */}
                  <td className="p-4">
                    <div className="w-28 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
                      {banner.imagem_desktop_url ? (
                        <img 
                          src={banner.imagem_desktop_url} 
                          alt={banner.titulo} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-gray-300" />
                      )}
                    </div>
                  </td>

                  {/* COLUNA: Textos */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-ipa-escuro">{banner.titulo}</span>
                      <span className="text-sm text-gray-400 font-medium truncate max-w-xs">
                        {banner.subtitulo || "Sem subtítulo"}
                      </span>
                    </div>
                  </td>
                  
                  {/* COLUNA: Status (Piloto Automático) */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.cor}`}>
                      {status.icone} {status.texto}
                    </span>
                  </td>
                  
                  {/* COLUNA: Cliques (Métricas) */}
                  <td className="p-4 text-center">
                    <div className="inline-flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-1.5 min-w-[80px]">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <MousePointerClick size={12} /> Cliques
                      </span>
                      <span className="text-lg font-black text-ipa-verde">
                        {banner.cliques || 0}
                      </span>
                    </div>
                  </td>

                  {/* COLUNA: Ações */}
                  <td className="p-4 text-center">
                    <Link 
                      href={`/admin/home/banners/editar/${banner.id}`}
                      className="inline-flex p-2 bg-gray-100 text-gray-500 hover:bg-ipa-dourado hover:text-white rounded-lg transition-colors"
                      title="Editar Banner"
                    >
                      <Pencil size={16} />
                    </Link>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        
        {(!banners || banners.length === 0) && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <ImageIcon size={48} className="text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-400">Nenhum banner encontrado</h3>
            <p className="text-sm text-gray-400 mt-1">Clique em "Novo Banner" para adicionar o primeiro destaque da Home.</p>
          </div>
        )}
      </div>
    </div>
  );
}