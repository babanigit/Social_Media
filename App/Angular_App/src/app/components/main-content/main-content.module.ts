import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { RegisterModule } from "../register/register.module";
import { LoginModule } from '../login/login.module';
import { CreateTweetModule } from "../create-tweet/create-tweet.module";
import { LoggedInUserModule } from '../logged-in-user/logged-in-user.module';



@NgModule({
  declarations: [
    MainContentComponent,
    TimeAgoPipe,

  ],
  imports: [
    CommonModule,
    RegisterModule,
    LoginModule,
    CreateTweetModule,
    LoggedInUserModule
  ],
  exports: [MainContentComponent]
})
export class MainContentModule { }
