import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BreathingPageRoutingModule } from './breathing-routing.module';

import { BreathingPage } from './breathing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BreathingPageRoutingModule
  ],
  declarations: [BreathingPage]
})
export class BreathingPageModule {}
