// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Ajusta a URL do backend conforme a plataforma.
  // No emulador Android padrão (Android Studio) o host "localhost" refere-se ao próprio emulador,
  // por isso devemos usar 10.0.2.2 para alcançar o servidor que roda na máquina host.
  private apiUrl = (() => {
    try {
      const platform = Capacitor.getPlatform?.() || (window as any)?.Capacitor?.platform || '';
      if (typeof platform === 'string' && platform.toLowerCase().includes('android')) {
        return 'http://localhost:3000';
      }
    } catch (e) {
      // se Capacitor não estiver disponível, continua com localhost
    }
    return 'http://localhost:3000';
  })(); // ajuste conforme seu backend
  private currentUser: any = null;

  // Observable para que componentes (como o menu) possam reagir a login/logout
  private _loginStatusChange = new BehaviorSubject<boolean>(false);
  loginStatusChange = this._loginStatusChange.asObservable();

  constructor() {
    // 🔹 Restaura o login ao carregar o app
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this._loginStatusChange.next(true);
    }
  }

  // 🔹 Faz login
  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await axios.post(`${this.apiUrl}/login`, { username, password });

      if (res.data?.success) {
        this.saveUser(res.data);
        this._loginStatusChange.next(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro no login:', err);
      return false;
    }
  }

  // 🔹 Faz registro
  async register(username: string, password: string): Promise<boolean> {
    try {
      const res = await axios.post(`${this.apiUrl}/register`, { username, password });

      if (res.data?.success) {
        this.login(username, password)
        this._loginStatusChange.next(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro no cadastro:', err);
      return false;
    }
  }

  // 🔹 Salva usuário na sessionStorage e na memória
  private saveUser(data: any) {
    this.currentUser = data;
    sessionStorage.setItem('userData', JSON.stringify(data));
  }

  // 🔹 Retorna se o usuário está logado
  isLoggedIn(): boolean {
    const user = this.getUser();
    return !!user; // true se houver user, false caso contrário
  }

  // 🔹 Retorna o usuário atual
  getUser(): any {
    if (!this.currentUser) {
      const stored = sessionStorage.getItem('userData');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  // 🔹 Retorna o token se existir
  getToken(): string | null {
    return this.getUser()?.token || null;
  }

  // 🔹 Retorna o ID do usuário se existir
  getUserId(): string | null {
    return this.getUser()?.user_id || null;
  }

  // 🔹 Faz logout completo
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
    this._loginStatusChange.next(false);
  }
}
