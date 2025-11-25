import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class EsqueciSenhaPage {
  email: string = '';

  constructor(private alertCtrl: AlertController, private router: Router) {}

  async sendReset() {
    if (!this.email) {
      const alert = await this.alertCtrl.create({
        header: 'Atenção',
        message: 'Informe o e-mail cadastrado.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Aqui você pode integrar com a API de reset de senha.
    const alert = await this.alertCtrl.create({
      header: 'Enviado',
      message: 'Se houver uma conta com este e-mail, você receberá instruções para redefinir a senha.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}
