import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-breathing',
  templateUrl: './breathing.page.html',
  styleUrls: ['./breathing.page.scss'],
  standalone: false
})
export class BreathingPage implements OnInit {

  isAnimating = true;
  
  constructor() { }

  ngOnInit() {
  }

  toggleAnimation() {
    this.isAnimating = !this.isAnimating;
  }

}
