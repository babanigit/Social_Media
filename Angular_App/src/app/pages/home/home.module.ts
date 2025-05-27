import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MainWelcomeComponent } from '../../components/main-welcome/main-welcome.component';
import { FooterModule } from '../../components/footer/footer.module';
import { CreateTweetModule } from '../../components/create-tweet/create-tweet.module';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MainWelcomeComponent,
    FooterModule,
    CreateTweetModule,
    TimeAgoPipe,
  ],
})
export class HomeModule {}
