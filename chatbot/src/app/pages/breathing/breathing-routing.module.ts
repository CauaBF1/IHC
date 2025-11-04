import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreathingPage } from './breathing.page';

const routes: Routes = [
  {
    path: '',
    component: BreathingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreathingPageRoutingModule {}
