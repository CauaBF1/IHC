import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private loginStatusSub!: Subscription;

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔹 Define status inicial
    this.isLoggedIn = this.auth.isLoggedIn();

    // 🔹 Observa mudanças no login/logout
    this.loginStatusSub = this.auth.loginStatusChange.subscribe(status => {
      console.log('Login status mudou:', status);
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy() {
    if (this.loginStatusSub) this.loginStatusSub.unsubscribe();
  }

  closeMenu() {
    this.menuCtrl.close('main');
  }

  logout() {
    this.auth.logout();
    this.menuCtrl.close('main');
    this.router.navigate(['/login']);
  }
}
