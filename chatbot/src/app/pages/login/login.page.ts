import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {
  username = '';
  password = '';
  private _formListener: any = null;
  
  constructor(private auth: AuthService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // Attach to the existing HTML form (no HTML changes required)
    // The form uses inputs with ids 'email' and 'senha' as present in the static HTML.
    const form = document.querySelector('form');
    if (!form) return;

    this._formListener = async (ev: Event) => {
      ev.preventDefault();
      const emailEl = document.getElementById('email') as HTMLInputElement | null;
      const passEl = document.getElementById('senha') as HTMLInputElement | null;
      const email = emailEl?.value?.trim() || '';
      const password = passEl?.value || '';
      this.router.navigate(['/chat']);
      // if (!email || !password) {
      //   const alert = await this.alertCtrl.create({
      //     header: 'Erro',
      //     message: 'Por favor, informe email e senha.',
      //     buttons: ['OK']
      //   });
      //   await alert.present();
      //   return;
      // }

      // try {
      //   const success = await this.auth.login(email, password);
      //   if (success) {
      //     this.router.navigate(['/chat']);
      //   } else {
      //     const alert = await this.alertCtrl.create({
      //       header: 'Erro',
      //       message: 'Usuário ou senha inválidos.',
      //       buttons: ['OK']
      //     });
      //     await alert.present();
      //   }
      // } catch (err) {
      //   console.error('Erro ao tentar logar:', err);
      // }
    };

    form.addEventListener('submit', this._formListener as EventListener);
  }

  ngOnDestroy(): void {
    const form = document.querySelector('form');
    if (form && this._formListener) {
      form.removeEventListener('submit', this._formListener as EventListener);
      this._formListener = null;
    }
  }

  // async login() {
  //   const success = await this.auth.login(this.username, this.password);
  //   if (success) {
  //     console.log("username no login: ", this.username)
  //     this.router.navigate(['/chat']);
  //   } else {
  //     const alert = await this.alertCtrl.create({
  //       header: 'Erro',
  //       message: 'Usuário ou senha inválidos.',
  //       buttons: ['OK']
  //     });
  //     await alert.present();
  //   }
  // }
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