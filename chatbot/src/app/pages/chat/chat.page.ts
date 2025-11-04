import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { ChatService } from '../../services/chat.service';
// Registra os controllers que o Chart.js precisa
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);


@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements AfterViewInit {
  // @ViewChild('myChart', { static: false }) myChart!: ElementRef;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  chart: Chart | null = null;

  userMessage = '';

  messages: { text: string; sender: 'user' | 'bot'; chart?: boolean }[] = [];
  chatType = 'general';
  isTyping: boolean = false;
  

  constructor(private chat: ChatService) { }

  async ngAfterViewInit() {
    // Carrega histórico do usuário
    try {
      const history = await this.chat.getChatHistory(this.chatType);
      this.messages = history.flatMap(h => [
        { sender: 'user', text: h.message },
        { sender: 'bot', text: h.response }
      ]);

    } catch (err) {
      console.warn('Não foi possível carregar histórico', err);
    }

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTo({
      top: this.chatContainer.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
    } catch (err) {
      console.warn('Erro ao rolar chat:', err);
    }
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;
    const text = this.userMessage.trim();
    this.messages.push({ text, sender: 'user' });
    this.userMessage = '';
    this.scrollToBottom();
    this.isTyping = true;

    try {
      const reply = await this.chat.sendMessage(text, this.chatType);

      // salva no banco de dados
      await this.chat.saveMessage(text, reply, this.chatType);
      this.isTyping = false;
      this.messages.push({ text: reply, sender: 'bot' });
      this.scrollToBottom();

    } catch (err) {
      this.isTyping = false;
      this.messages.push({ text: 'Erro: não foi possível obter resposta', sender: 'bot' });
      this.scrollToBottom();

    }

  }

}
