import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa o Resend com a chave do seu .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // CORREÇÃO 1: Lemos o JSON apenas uma vez
    const body = await req.json();
    const { type, data } = body;
    console.log("Dados recebidos na API:", body);

    let subject = "";
    let htmlContent = "";

    // 1. Formatação para Programação de Visitas
    if (type === "visita") {
      subject = "📌 Nova Visita Programada - IP Aquiraz";
      htmlContent = `
        <div style="font-family: sans-serif; color: #1a3a32;">
          <h1 style="color: #1a3a32; border-bottom: 2px solid #c5a87f; padding-bottom: 10px;">Nova Visita no Site</h1>
          <p><strong>Data Prevista:</strong> ${data.data_visita}</p>
          <p><strong>Observações:</strong> ${data.observacoes || "Nenhuma"}</p>
          
          <h3 style="margin-top: 20px; color: #c5a87f;">Lista de Visitantes:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f5f0; text-align: left;">
                <th style="padding: 10px; border: 1px solid #ddd;">Nome</th>
                <th style="padding: 10px; border: 1px solid #ddd;">WhatsApp</th>
                <th style="padding: 10px; border: 1px solid #ddd;">E-mail</th>
              </tr>
            </thead>
            <tbody>
              ${data.visitantes.map((v: any) => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${v.nome}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${v.whatsapp}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${v.email}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Este é um e-mail automático enviado pelo Portal IP Aquiraz.</p>
        </div>
      `;
    } 
    
    // 2. Formatação para Pedidos de Oração
    else if (type === "oracao") {
      subject = "🙏 Novo Pedido de Oração - IP Aquiraz";
      htmlContent = `
        <div style="font-family: sans-serif; color: #1a3a32;">
          <h1 style="color: #1a3a32; border-bottom: 2px solid #c5a87f; padding-bottom: 10px;">Pedido de Oração</h1>
          <p><strong>Solicitante:</strong> ${data.nome} ${data.sigilo ? '<span style="color: red;">(SIGILO SOLICITADO)</span>' : ''}</p>
          <p><strong>Bairro/Distrito:</strong> ${data.bairro}</p>
          <p><strong>Motivo:</strong> ${data.motivo}</p>
          <p><strong>Deseja Atendimento:</strong> ${data.atendimento}</p>
          <div style="background-color: #f8f5f0; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p><strong>Descrição da Causa:</strong></p>
            <p>${data.descricao || "Não informada."}</p>
          </div>
        </div>
      `;
    }

    // 3. Disparo do E-mail para a Igreja
    const { error } = await resend.emails.send({
      // CORREÇÃO 2: Usando o seu domínio verificado
      from: 'Portal IP Aquiraz <nao-responda@ipaquiraz.com.br>', 
      to: ['ytaloribeiro@gmail.com'], // Mantenha o seu para testar, depois mudamos para o da igreja
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Erro do Resend:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: "Notificação enviada com sucesso" });

  } catch (error) {
    console.error("Erro na API de e-mail:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}