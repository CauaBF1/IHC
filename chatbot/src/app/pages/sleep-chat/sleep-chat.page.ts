import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Route } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sleep-chat',
  templateUrl: './sleep-chat.page.html',
  styleUrls: ['./sleep-chat.page.scss'],
  standalone: false
})
export class SleepChatPage implements AfterViewInit {
  // @ViewChild('myChart', { static: false }) myChart!: ElementRef;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  chart: Chart | null = null;

  userMessage = '';

  messages: { text: string; sender: 'user' | 'bot'; chart?: boolean }[] = [];
  chatType = 'sleep';
  isTyping: boolean = false;
  newChat: boolean = false;


  constructor(private chat: ChatService, private route: ActivatedRoute, private router:Router) {
    // this.route.queryParams.subscribe(params => {
    //   this.newChat = params['newChat'] === 'true'; //Garante que seja um valor booleano
    // });
  }

  ngOnInit() {
      // 🔹 Observa mudanças nos parâmetros da rota
  this.route.queryParams.subscribe(async (params) => {
    const newChat = params['newChat'] === 'true';
    if (newChat) {
      await this.sendNewMessage();
    } else {
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
  });
  }

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

  async sendNewMessage() {
    this.newChat = false;
    this.userMessage = "Eu gostaria de conversar sobre meu sono."
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
