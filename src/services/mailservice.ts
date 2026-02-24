/**
 * Serviço de E-mail (MVC - Model/Service)
 * Responsável por formatar e disparar notificações.
 */

export const sendNotificationEmail = async (type: string, data: any) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) throw new Error('Falha ao disparar e-mail institucional');
    
    return await response.json();
  } catch (error) {
    console.error("Erro no mailservice:", error);
    throw error;
  }
};