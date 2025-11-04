import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  ionViewWillEnter() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.auth.isLoggedIn();
    // 👇 Opcional: escutar mudanças de login em tempo real
    this.auth.loginStatusChange.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}