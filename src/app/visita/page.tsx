"use client";
import { useState, useEffect } from "react";
import { Heart, MapPin, Car, Info, Send, Plus, Trash2, Mail, MessageCircle, UserPlus, Clock, ShieldCheck } from "lucide-react";
import { handleFormSubmit } from "@/controllers/formcontroller";

const distritos = ["Aquiraz (Sede)", "Assis Teixeira", "Camará", "Caponga da Bernarda", "Jacaúna", "João de Castro", "Justiniano de Serpa", "Patacas", "Tapera"];
const motivos = ["Enfermidade", "Família", "Problemas Financeiros", "Vida Espiritual", "Desemprego", "Luto", "Gratidão"];

export default function VisiteNos() {
  const [activeTab, setActiveTab] = useState("visita");
  const [captcha, setCaptcha] = useState({ q: "", a: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [visitantes, setVisitantes] = useState([{ nome: "", email: "", whatsapp: "" }]);

  useEffect(() => { 
    generateCaptcha(); 
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    setCaptcha({ q: `${n1} + ${n2}`, a: n1 + n2 });
  };

  // Função essencial para capturar os dados dos visitantes dinâmicos
  const updateVisitante = (index: number, field: string, value: string) => {
    const newVisitantes = [...visitantes];
    newVisitantes[index] = { ...newVisitantes[index], [field]: value };
    setVisitantes(newVisitantes);
  };

  const addVisitante = () => setVisitantes([...visitantes, { nome: "", email: "", whatsapp: "" }]);
  
  const handleDateValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const day = date.getUTCDay(); // 0 = Domingo, 3 = Quarta
    if (day !== 0 && day !== 3) {
      alert("Por favor, selecione um Domingo ou uma Quarta-feira.");
      e.target.value = "";
    }
  };

  const submitWrapper = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    if (parseInt(userCaptcha) !== captcha.a) {
      alert("Captcha incorreto. Tente novamente.");
      generateCaptcha();
      return;
    }
    await handleFormSubmit(e, type, visitantes);
  };

  return (
    <div className="flex flex-col w-full font-sans bg-white">
      {/* 1. Hero: Convite de Honra */}
      <section className="bg-ipa-creme py-24 px-6 border-b border-ipa-bege/20 text-center">
        <Heart size={40} className="mx-auto mb-6 text-ipa-dourado animate-pulse" />
        <h1 className="text-4xl md:text-6xl font-black text-ipa-verde tracking-tighter uppercase mb-6">
          Você é nosso <br /> <span className="text-ipa-dourado text-3xl md:text-5xl">Convidado</span>
        </h1>
        <p className="text-ipa-escuro/70 text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">
          "Alegrei-me quando me disseram: Vamos à casa do Senhor." — Salmo 122:1
        </p>
      </section>

      {/* 2. Mapa e Trajeto */}
      <section className="py-12 px-6 bg-ipa-creme/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Como Chegar</h2>
            <p className="text-ipa-escuro/70 font-medium">R. Açucena, 95 - Parques das Flores, Aquiraz - CE.</p>
            <div className="flex flex-col gap-4">
              <a href="https://maps.google.com/?q=Rua+Acucena+95+Aquiraz" target="_blank" className="inline-flex items-center justify-center gap-3 bg-ipa-verde text-white px-8 py-4 rounded-full font-black text-xs tracking-widest hover:bg-ipa-escuro transition-all shadow-lg uppercase">
                Abrir no Google Maps
              </a>
              <a href="https://wa.me/5585999805907" className="inline-flex items-center justify-center gap-3 border-2 border-ipa-verde text-ipa-verde px-8 py-4 rounded-full font-black text-xs tracking-widest hover:bg-ipa-verde hover:text-white transition-all uppercase font-bold">
                <MessageCircle size={18} /> Dúvidas no WhatsApp
              </a>
            </div>
          </div>
          <div className="h-[400px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-white">
             <iframe width="100%" height="100%" frameBorder="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-38.3973%2C-3.9038%2C-38.3883%2C-3.8968&layer=mapnik&marker=-3.9003%2C-38.3928" className="grayscale contrast-125 opacity-90"></iframe>
          </div>
        </div>
      </section>

      {/* 3. Seção de Formulários em Abas */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-ipa-creme pb-8">
            {[
              { id: "visita", label: "Programar Visita", icon: <UserPlus size={16} /> },
              { id: "oracao", label: "Pedido de Oração", icon: <MessageCircle size={16} /> },
              { id: "fale", label: "Fale Conosco", icon: <Mail size={16} /> }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all ${activeTab === tab.id ? "bg-ipa-verde text-white shadow-xl scale-105" : "bg-ipa-creme text-ipa-verde hover:bg-ipa-bege/30"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-ipa-creme/30 p-8 md:p-12 rounded-[40px] border border-ipa-creme shadow-sm">
            <form onSubmit={(e) => submitWrapper(e, activeTab)} className="space-y-8">
              
              {/* ABA: VISITA */}
              {activeTab === "visita" && (
                <>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-ipa-dourado uppercase tracking-widest block">Data da Visita</label>
                      <input name="data_visita" type="date" required onChange={handleDateValidation} className="w-full md:w-1/2 bg-white p-4 rounded-2xl outline-none border-2 border-white focus:border-ipa-dourado text-xs font-bold uppercase" />
                      <p className="text-[9px] text-ipa-verde font-bold uppercase italic">* Cultos apenas aos domingos e quartas</p>
                    </div>
                    
                    {visitantes.map((v, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white rounded-3xl border border-ipa-creme relative group">
                        <input value={v.nome} onChange={(e) => updateVisitante(i, "nome", e.target.value.toUpperCase())} placeholder="NOME COMPLETO" required className="bg-ipa-creme/20 p-4 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-ipa-dourado border border-transparent" />
                        <input value={v.email} onChange={(e) => updateVisitante(i, "email", e.target.value)} placeholder="E-MAIL" type="email" required className="bg-ipa-creme/20 p-4 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-ipa-dourado border border-transparent" />
                        <input value={v.whatsapp} onChange={(e) => updateVisitante(i, "whatsapp", e.target.value)} placeholder="WHATSAPP" required className="bg-ipa-creme/20 p-4 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-ipa-dourado border border-transparent" />
                        {i > 0 && (
                          <button type="button" onClick={() => setVisitantes(visitantes.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors">
                            <Trash2 size={12}/>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <textarea name="observacoes" placeholder="OBSERVAÇÕES (EX: TENHO FILHOS, PRECISO DE ACESSIBILIDADE)" rows={3} className="w-full bg-white p-6 rounded-3xl text-[10px] font-bold uppercase outline-none border-2 border-white focus:border-ipa-dourado"></textarea>
                    <button type="button" onClick={addVisitante} className="flex items-center gap-2 bg-ipa-verde text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-ipa-escuro transition-all">
                      <Plus size={14} /> ADICIONAR VISITANTE
                    </button>
                  </div>
                </>
              )}

              {/* ABA: ORAÇÃO */}
              {activeTab === "oracao" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="border-b-2 border-ipa-bege/30 pb-4">
                    <label className="text-[10px] font-black text-ipa-dourado tracking-widest uppercase block mb-2">Nome ou Nome Genérico (para sigilo)</label>
                    <input name="nome" type="text" placeholder="EX: JOÃO, MARIA OU 'UM IRMÃO'" className="w-full bg-transparent outline-none text-sm font-bold uppercase" />
                    
                    <div className="mt-4 flex items-center gap-2 mb-4">
                      <input name="sigilo" type="checkbox" id="sigilo" className="accent-ipa-verde w-4 h-4" />
                      <label htmlFor="sigilo" className="text-[10px] font-bold text-ipa-escuro/60 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Manter nome sob sigilo absoluto</label>
                    </div>

                    {/* NOVOS CAMPOS: E-mail Obrigatório e WhatsApp Opcional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                      <div>
                        <input name="email" type="email" placeholder="SEU E-MAIL (OBRIGATÓRIO)" required className="w-full bg-transparent outline-none text-sm font-bold uppercase border-b-2 border-ipa-bege/30 pb-2" />
                      </div>
                      <div>
                        <input name="whatsapp" type="text" placeholder="SEU WHATSAPP (OPCIONAL)" className="w-full bg-transparent outline-none text-sm font-bold uppercase border-b-2 border-ipa-bege/30 pb-2" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border-b-2 border-ipa-bege/30 pb-2">
                      <label className="text-[10px] font-black text-ipa-dourado tracking-widest uppercase block mb-2">Seu Bairro / Distrito</label>
                      <select name="bairro" className="w-full bg-transparent outline-none text-sm font-bold text-ipa-verde uppercase">
                        {distritos.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="border-b-2 border-ipa-bege/30 pb-2">
                      <label className="text-[10px] font-black text-ipa-dourado tracking-widest uppercase block mb-2">Motivo da Oração</label>
                      <select name="motivo" className="w-full bg-transparent outline-none text-sm font-bold text-ipa-verde uppercase">
                        {motivos.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-8 py-2">
                     <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="atendimento" value="Apenas Oração" className="accent-ipa-verde" /><span className="text-[11px] font-black text-ipa-escuro/70 uppercase">Apenas Oração</span></label>
                     <label className="flex items-center gap-3 cursor-pointer"><input type="radio" name="atendimento" value="Oração e Visita" className="accent-ipa-verde" /><span className="text-[11px] font-black text-ipa-escuro/70 uppercase">Oração e Visita</span></label>
                  </div>
                  <textarea name="descricao" rows={3} placeholder="DESCREVA SUA CAUSA (OPCIONAL)" className="w-full bg-transparent border-b-2 border-ipa-bege/30 outline-none text-sm font-bold uppercase"></textarea>
                </div>
              )}

              {/* ABA: FALE CONOSCO */}
              {activeTab === "fale" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <input name="nome" placeholder="SEU NOME" required className="w-full bg-white p-5 rounded-2xl text-[10px] font-bold uppercase outline-none border-2 border-white focus:border-ipa-dourado" />
                  
                  {/* NOVO CAMPO: E-mail Obrigatório */}
                  <input name="email" type="email" placeholder="SEU E-MAIL (OBRIGATÓRIO)" required className="w-full bg-white p-5 rounded-2xl text-[10px] font-bold uppercase outline-none border-2 border-white focus:border-ipa-dourado" />
                  
                  <input name="assunto" placeholder="ASSUNTO" required className="w-full bg-white p-5 rounded-2xl text-[10px] font-bold uppercase outline-none border-2 border-white focus:border-ipa-dourado" />
                  <textarea name="mensagem" placeholder="SUA MENSAGEM" rows={5} required className="w-full bg-white p-5 rounded-2xl text-[10px] font-bold uppercase outline-none border-2 border-white focus:border-ipa-dourado"></textarea>
                </div>
              )}

              {/* Mecanismo Anti-Robô (Captcha) */}
              <div className="bg-white p-6 rounded-3xl w-fit flex items-center gap-4 border border-ipa-creme shadow-sm">
                <span className="text-xs font-black text-ipa-verde uppercase tracking-tighter leading-none">QUANTO É {captcha.q}?</span>
                <input type="number" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} required className="w-20 bg-ipa-creme p-3 rounded-xl outline-none text-center font-bold text-ipa-verde" />
              </div>

              <button type="submit" className="w-full bg-ipa-verde text-white py-6 rounded-2xl font-black text-xs tracking-[0.4em] uppercase hover:bg-ipa-escuro shadow-2xl flex items-center justify-center gap-3 transition-all">
                <Send size={16} /> 
                {activeTab === "visita" ? "GRAVAR E ENVIAR VISITA" : activeTab === "oracao" ? "ENVIAR AO TRONO DA GRAÇA" : "ENVIAR MENSAGEM"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}