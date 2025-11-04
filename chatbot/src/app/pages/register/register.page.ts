import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import axios from 'axios';
import { AlertController, IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    });
  }

  async onRegister() {
    if (this.form.invalid) return;

    const { username, password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.showAlert('Erro', 'As senhas não coincidem');
      return;
    }

    this.loading = true;
    try {
      const res = await this.auth.register(username, password);

      if (res) {
        this.showAlert('Sucesso', 'Conta criada com sucesso!');
        this.router.navigate(['/home']);
      }
      console.log("Está testando")
    } catch (err: any) {
      console.log("Não deu certo")
      console.error(err);
      this.showAlert(
        'Erro',
        err.response?.data?.message || 'Falha ao criar conta. Tente novamente.'
      );
    } finally {
      this.loading = false;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
