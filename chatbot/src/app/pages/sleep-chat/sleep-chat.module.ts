import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SleepChatPageRoutingModule } from './sleep-chat-routing.module';

import { SleepChatPage } from './sleep-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SleepChatPageRoutingModule
  ],
  declarations: [SleepChatPage]
})
export class SleepChatPageModule {}
