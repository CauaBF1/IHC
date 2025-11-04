import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  
  constructor(private auth: AuthService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async login() {
    const success = await this.auth.login(this.username, this.password);
    if (success) {
      console.log("username no login: ", this.username)
      this.router.navigate(['/chat']);
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Usuário ou senha inválidos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}