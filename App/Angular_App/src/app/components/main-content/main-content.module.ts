import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { RegisterModule } from "../register/register.module";
import { LoginModule } from '../login/login.module';



@NgModule({
  declarations: [
    MainContentComponent,
    TimeAgoPipe,

  ],
  imports: [
    CommonModule,
    RegisterModule,
    LoginModule
  ],
  exports: [MainContentComponent]
})
export class MainContentModule { }
