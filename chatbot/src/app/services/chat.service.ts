import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl: string;

  constructor(private auth: AuthService) { 
    // Detecta plataforma para usar URL correta
    this.apiUrl = this.getApiUrl();
    console.log('[ChatService] Construído com URL:', this.apiUrl);
  }

  // Método para testar conectividade
  async testConnection(): Promise<boolean> {
    try {
      console.log('[ChatService] Testando conectividade com:', `${this.apiUrl}/health`);
      const resp = await axios.get(`${this.apiUrl}/health`);
      console.log('[ChatService] Conectividade OK:', resp.data);
      return true;
    } catch (err: any) {
      console.error('[ChatService] Falha na conectividade:', err);
      return false;
    }
  }

  private getApiUrl(): string {
    try {
      // Detecta se está rodando no Capacitor (app nativo)
      const isCapacitor = !!(window as any)?.Capacitor;
      const platform = (window as any)?.Capacitor?.getPlatform?.();
      
      console.log('[ChatService] Detecção de plataforma:', {
        href: window.location.href,
        isCapacitor,
        platform,
        userAgent: navigator.userAgent
      });
      
      // Se for Capacitor (app nativo), sempre usar localhost com adb reverse
      if (isCapacitor) {
        console.log('[ChatService] Capacitor detectado - usando localhost:3000 (adb reverse)');
        return 'http://localhost:3000';
      }
      
      // Se for Android mas sem Capacitor (navegador no emulador)
      if (window.location.href.includes('android') || navigator.userAgent.includes('Android')) {
        console.log('[ChatService] Android detectado - usando 10.0.2.2:3000');
        return 'http://10.0.2.2:3000';
      }
    } catch (e) {
      console.warn('Erro ao detectar plataforma, usando localhost:', e);
    }
    console.log('[ChatService] Usando URL padrão: http://localhost:3000');
    return 'http://localhost:3000';
  }

  // Enviar mensagem para o Gemini
  async sendMessage(message: string, chatType: string): Promise<string> {
    // Remove validação de autenticação - usa ID genérico para usuários anônimos
    const userId = (await this.auth.getUserId()) || 'anonymous-user';
    
    try {
      console.log(`[ChatService] Enviando para ${this.apiUrl}/chat:`, { userId, message, chatType });
      const resp = await axios.post(`${this.apiUrl}/chat`, { userId, message, chatType });
      console.log('[ChatService] Resposta recebida:', resp.data);
      return resp.data.reply;
    } catch (err: any) {
      console.error('Erro chat service completo:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        code: err.code,
        config: {
          url: err.config?.url,
          method: err.config?.method
        }
      });
      
      // Extrai detalhes do erro do backend se disponível
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Falha ao se comunicar com o backend';
      const errorDetail = err.response?.data?.detail || '';
      throw new Error(`${errorMsg}${errorDetail ? ': ' + errorDetail : ''}`);
    }
  }

  // Upload de CSV
  async uploadCSV(file: File): Promise<{ labels: string[]; data: number[]; explanation: string }> {
    // Remove validação de autenticação - usa ID genérico
    const user_id = (await this.auth.getUserId()) || 'anonymous-user';
    
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
    // Remove validação de autenticação - usa ID genérico
    const userId = (await this.auth.getUserId()) || 'anonymous-user';
    
    try {
      await axios.post(`${this.apiUrl}/save-message`, { userId, message, response, chatType });
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
    }
  }

  // Recuperar histórico de conversa
  async getChatHistory(chatType: string): Promise<{ message: string; response: string; timestamp: string }[]> {
    // Remove validação de autenticação - usa ID genérico
    const userId = (await this.auth.getUserId()) || 'anonymous-user';
    
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

