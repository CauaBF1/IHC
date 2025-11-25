import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterStep2Page } from './register-step2.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterStep2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterStep2PageRoutingModule {}
