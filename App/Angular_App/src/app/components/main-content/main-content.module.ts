import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

import { CreateTweetModule } from '../create-tweet/create-tweet.module';
import { OpenCommentsModule } from '../open-comments/open-comments.module';
import { MainWelcomeComponent } from '../main-welcome/main-welcome.component';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [MainContentComponent],
  imports: [
    CommonModule,

    CreateTweetModule,
    OpenCommentsModule,
    MainWelcomeComponent,
    TimeAgoPipe,

    FooterModule
  ],
  exports: [MainContentComponent],
})
export class MainContentModule {}
