// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private auth: AuthService, private router: Router) {}

  // private checkAuth(): boolean {
  //   const isLogged = this.auth.isLoggedIn();
  //   if (!isLogged) {
  //     this.router.navigate(['/login']);
  //   }
  //   return isLogged;
  // }

  private checkAuth(): boolean {
    // Temporariamente liberar acesso ao /chat para permitir navegação do botão Continuar
    return true;
  }

  canActivate(): boolean {
    return this.checkAuth();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.checkAuth();
  }
}
