import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemporaryChatPage } from './temporary-chat.page';

const routes: Routes = [
  {
    path: '',
    component: TemporaryChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemporaryChatPageRoutingModule {}
