import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule,
    BaseChartDirective],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
