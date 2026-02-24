import { saveVisitorData, savePrayerRequest, saveContactMessage } from "@/services/dbservice";
import { sendNotificationEmail } from "@/services/mailservice";

export const handleFormSubmit = async (event: any, type: string, extraData?: any) => {
  const formData = new FormData(event.target);
  const rawData = Object.fromEntries(formData);

  try {
    let dbPayload: any;

    if (type === "visita") {
      dbPayload = {
        data_visita: rawData.data_visita as string,
        observacoes: rawData.observacoes as string,
        visitantes: extraData
      };
      await saveVisitorData(dbPayload); // Grava no Banco primeiro
    } 
    else if (type === "oracao") {
      dbPayload = {
        nome: rawData.nome as string,
        sigilo: event.target.sigilo?.checked || false,
        bairro: rawData.bairro as string,
        motivo: rawData.motivo as string,
        atendimento: rawData.atendimento as string,
        descricao: rawData.descricao as string
      };
      await savePrayerRequest(dbPayload);
    }

    // Tenta enviar o e-mail, mas não trava se falhar
    try {
      await sendNotificationEmail(type, dbPayload);
    } catch (mailError) {
      console.warn("Aviso: O e-mail não pôde ser enviado, mas os dados foram gravados no banco.", mailError);
    }

    alert("Sucesso! Sua solicitação foi gravada.");
    
    if (type === "visita") {
      window.open(`https://wa.me/5585999805907?text=Olá! Acabei de programar uma visita pelo site.`);
    }

    return true;
  } catch (error) {
    console.error("Erro crítico no banco de dados:", error);
    alert("Erro ao gravar dados. Por favor, tente pelo WhatsApp.");
    return false;
  }
};