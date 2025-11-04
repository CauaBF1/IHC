import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalDiaryPage } from './personal-diary.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalDiaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalDiaryPageRoutingModule {}
