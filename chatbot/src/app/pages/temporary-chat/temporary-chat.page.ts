import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-temporary-chat',
  templateUrl: './temporary-chat.page.html',
  styleUrls: ['./temporary-chat.page.scss'],
  standalone: false,
})
export class TemporaryChatPage implements OnInit {
  @ViewChild('myChart', { static: false }) myChart!: ElementRef;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  chart: Chart | null = null;

  constructor(private chatService: ChatService) { }

  sessionId = 'sessao_temp'; // pode ser gerado aleatoriamente
  chatType = 'general';
  userMessage = '';
  // messages: { text: string; sender: 'user' | 'bot' }[] = [];

  messages: { text: string; sender: 'user' | 'bot'; chart?: boolean }[] = [];
  isTyping: boolean = false;

  ngOnInit() {
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

  createChart(labels: string[] = [], data: number[] = []) {
    const ctx = this.myChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // Se já existir um gráfico, destrói antes
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar', // gráfico de barras
      data: {
        labels: labels.length ? labels : ['Sem dados'],
        datasets: [
          {
            label: 'Passos por dia',
            data: data.length ? data : [0],
            backgroundColor: '#3880ff',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  updateChart(labels: string[], data: number[]) {
    if (!this.chart) return;
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.messages.push({ text: `Arquivo selecionado: ${file.name}`, sender: 'user' });
    this.scrollToBottom();

    try {
      const response = await this.chatService.uploadCSV(file);

      // exibe explicação
      this.messages.push({ text: response.explanation, sender: 'bot' });

      // atualiza gráfico
      if (response.labels && response.data) {
        this.updateChart(response.labels, response.data);
      }

      this.scrollToBottom();
    } catch (err) {
      this.messages.push({ text: 'Erro ao processar o CSV 😕', sender: 'bot' });
      this.scrollToBottom();
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
      const reply = await await this.chatService.sendTempMessage(this.sessionId, text, this.chatType);

      // salva no banco de dados
      await this.chatService.saveTempMessage(this.sessionId, text, reply, this.chatType);
      this.isTyping = false;

      this.messages.push({ text: reply, sender: 'bot' });
      this.scrollToBottom();

      // tenta atualizar gráfico
      try {
        const parsed = JSON.parse(reply);
        if (parsed.labels && parsed.data) {
          this.updateChart(parsed.labels, parsed.data);
        }
        this.scrollToBottom();
      } catch { }
    } catch (err) {
      this.isTyping = false;
      this.messages.push({ text: 'Erro: não foi possível obter resposta', sender: 'bot' });
      this.scrollToBottom();
    }
  }

}
