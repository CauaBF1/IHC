import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements AfterViewInit {

  userMessage = '';

  constructor(private router: Router, private auth: AuthService) { }

  ngAfterViewInit() {
  }

  goToChat(chatType: string) {
    if (chatType == 'chat') {
      this.router.navigate(['/chat']);
    }
    if (chatType == 'sleep-chat') {
      this.router.navigate(['/sleep-chat'], {
        queryParams: {
          newChat: true
        }
      }
      );
    }

  }

}
