import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DiaryService {
    private apiUrl = 'http://localhost:3000';

    constructor(private auth: AuthService) {}

  // Buscar todas as anotações do usuário
  async getNotes(): Promise<{ id: number; content: string; created_at: string }[]> {
    const userId = await this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado.');

    try {
      const resp = await axios.get(`${this.apiUrl}/get-diary/${userId}`);
      return resp.data;
    } catch (err) {
      console.error('Erro ao buscar anotações:', err);
      return [];
    }
  }

  // Salvar nova anotação
  async saveNote(content: string): Promise<void> {
    const userId = await this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado.');

    try {
      await axios.post(`${this.apiUrl}/save-diary`, { userId, content });
    } catch (err) {
      console.error('Erro ao salvar anotação:', err);
      throw new Error('Falha ao salvar anotação.');
    }
  }

  // Excluir anotação
  async deleteNote(noteId: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/delete-diary/${noteId}`);
    } catch (err) {
      console.error('Erro ao excluir anotação:', err);
      throw new Error('Falha ao excluir anotação.');
    }
  }
  
}
