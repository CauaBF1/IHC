import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'temporary-chat',
    loadChildren: () => import('./pages/temporary-chat/temporary-chat.module').then( m => m.TemporaryChatPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'esqueci-senha',
    loadChildren: () => import('./pages/esqueci-senha/esqueci-senha.module').then( m => m.EsqueciSenhaPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'register-step2',
    loadChildren: () => import('./pages/register-step2/register-step2.module').then( m => m.RegisterStep2PageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialPageModule)
  },
  {
    path: 'daily-checkin',
    loadChildren: () => import('./pages/daily-checkin/daily-checkin.module').then(m => m.DailyCheckinPageModule)
  },
  {
    path: 'breathing',
    loadChildren: () => import('./pages/breathing/breathing.module').then( m => m.BreathingPageModule)
  },
  {
    path: 'sleep-chat',
    loadChildren: () => import('./pages/sleep-chat/sleep-chat.module').then( m => m.SleepChatPageModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'personal-diary',
    loadChildren: () => import('./pages/personal-diary/personal-diary.module').then( m => m.PersonalDiaryPageModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
