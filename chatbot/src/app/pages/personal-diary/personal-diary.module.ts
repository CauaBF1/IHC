import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalDiaryPageRoutingModule } from './personal-diary-routing.module';

import { PersonalDiaryPage } from './personal-diary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalDiaryPageRoutingModule
  ],
  declarations: [PersonalDiaryPage]
})
export class PersonalDiaryPageModule {}
