import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SleepChatPage } from './sleep-chat.page';

const routes: Routes = [
  {
    path: '',
    component: SleepChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SleepChatPageRoutingModule {}
