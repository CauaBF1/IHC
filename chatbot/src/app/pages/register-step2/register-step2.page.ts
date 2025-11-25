import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register-step2',
  templateUrl: './register-step2.page.html',
  styleUrls: ['./register-step2.page.scss'],
  standalone: false,
})
export class RegisterStep2Page {
  constructor(private router: Router, private alertCtrl: AlertController) {}

  async onBack() {
    this.router.navigate(['/register']);
  }

  async onFinish() {
    // Opcional: poderíamos validar campos aqui antes de prosseguir
    // Navega para a página de tutorial após "Cadastrar"
    this.router.navigate(['/tutorial']);
  }
}
