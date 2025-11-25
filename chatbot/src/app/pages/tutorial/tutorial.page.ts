import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  standalone: false,
})
export class TutorialPage {
  constructor(private router: Router) {}

  steps = [
    { title: 'Bem-vindo!', text: 'Esta tela apresenta um breve tutorial sobre como usar o aplicativo.' },
    { title: 'Chat Inteligente', text: 'Envie mensagens e receba respostas contextuais.' },
    { title: 'CSV e Gráficos', text: 'Carregue dados para receber análises e visualizar gráficos.' },
    { title: 'Sono e Diário', text: 'Use páginas especiais para acompanhar seu sono e anotações pessoais.' }
  ];

  start() {
    this.router.navigate(['/daily-checkin']);
  }
}
