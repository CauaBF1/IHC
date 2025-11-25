import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegisterStep2PageRoutingModule } from './register-step2-routing.module';
import { RegisterStep2Page } from './register-step2.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RegisterStep2PageRoutingModule],
  declarations: [RegisterStep2Page],
})
export class RegisterStep2PageModule {}
