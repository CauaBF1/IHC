import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:3000';

  constructor(private auth: AuthService) { } // ✅ injeta o AuthService aqui

  // Enviar mensagem para o Gemini
  async sendMessage(message: string, chatType: string): Promise<string> {
    const userId = await this.auth.getUserId()

    if (!userId) {
      console.error('Usuário não autenticado.');
      throw new Error('Usuário não autenticado');
    }
    try {

      const resp = await axios.post(`${this.apiUrl}/chat`, { userId, message, chatType });
      return resp.data.reply;
    } catch (err) {
      console.error('Erro chat service', err);
      throw new Error('Falha ao se comunicar com o backend');
    }
  }

  // Upload de CSV
  async uploadCSV(file: File): Promise<{ labels: string[]; data: number[]; explanation: string }> {

    const user_id = await this.auth.getUserId()

    if (!user_id) {
      console.error('Usuário não autenticado.');
      throw new Error('Usuário não autenticado');
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await axios.post(`${this.apiUrl}/upload-csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return resp.data;

    } catch (err: any) {
      // 🧩 Trata erro de limite de requisições (status 429)
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        console.warn('⚠️ Limite de requisições atingido. Aguardando 6 segundos antes de tentar novamente...');
        await new Promise(resolve => setTimeout(resolve, 6000)); // espera 6 segundos
        return this.uploadCSV(file); // tenta novamente
      }

      console.error('Erro ao enviar CSV', err);
      throw new Error('Falha ao enviar arquivo CSV');
    }
  }

  // Salvar mensagem e resposta no banco local
  async saveMessage(message: string, response: string, chatType: string): Promise<void> {

    const userId = await this.auth.getUserId()

    if (!userId) {
      console.error('Usuário não autenticado.');
      throw new Error('Usuário não autenticado');
    }
    try {
      await axios.post(`${this.apiUrl}/save-message`, { userId, message, response, chatType });
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
    }
  }

  // Recuperar histórico de conversa
  async getChatHistory(chatType: string): Promise<{ message: string; response: string; timestamp: string }[]> {
    const userId = await this.auth.getUserId()

    if (!userId) {
      console.error('Usuário não autenticado.');
      throw new Error('Usuário não autenticado');
    }
    try {
      const resp = await axios.get(`${this.apiUrl}/get-history/${userId}/${chatType}`);
      return resp.data;
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      return [];
    }
  }

  // Enviar mensagens temporárias
  async sendTempMessage(sessionId: string, message: string, chatType: string): Promise<string> {
    try {
      const resp = await axios.post(`${this.apiUrl}/chat-temp`, { sessionId, message, chatType });
      return resp.data.reply;
    } catch (err) {
      console.error('Erro ao enviar mensagem temporária', err);
      throw new Error('Falha ao enviar mensagem temporária');
    }
  }

  // Salvar mensagens temporárias
  async saveTempMessage(userId: string, message: string, response: string, chatType: string): Promise<void> {

    try {
      await axios.post(`${this.apiUrl}/save-message`, { userId, message, response, chatType });
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
    }
  }

}

