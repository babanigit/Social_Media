import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MainWelcomeComponent } from '../../components/main-welcome/main-welcome.component';
import { MainContentComponent } from '../../components/main-content/main-content.component';
import { MainContentModule } from '../../components/main-content/main-content.module';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MainWelcomeComponent,
    MainContentModule,
  ]
})
export class HomeModule { }
