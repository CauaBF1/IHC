import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DailyCheckinPageRoutingModule } from './daily-checkin-routing.module';
import { DailyCheckinPage } from './daily-checkin.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, DailyCheckinPageRoutingModule],
  declarations: [DailyCheckinPage]
})
export class DailyCheckinPageModule {}
