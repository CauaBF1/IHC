import { Component, NgModule, AfterViewInit, OnDestroy } from '@angular/core';
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
export class RegisterPage implements AfterViewInit, OnDestroy {
  form: FormGroup;
  loading = false;
  private _formListener: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngAfterViewInit(): void {
    // Intercepta o submit do formulário estático e navega para a nova página
    const form = document.querySelector('form');
    if (!form) return;
    this._formListener = (ev: Event) => {
      ev.preventDefault();
      this.router.navigate(['/register-step2']);
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

  async onRegister() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

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
